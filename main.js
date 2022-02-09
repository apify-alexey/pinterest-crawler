const Apify = require('apify')
const { baseDomain, profileUrlByName, handleStart, handlePins } = require('./src/routes')

const { utils: { log } } = Apify

Apify.main(async () => {
  const {
    proxyConfig = { useApifyProxy: true },
    startUrls = [],
    maxPinsCnt = 100,
    minConcurrency = 1,
    maxConcurrency = 10,
    maxRequestRetries = 3,
    requestTimeoutSecs = 30

  } = await Apify.getInput()

  if (!startUrls?.length) {
    log.error('No startUrls data', { startUrls })
    return
  }

  const startNames = startUrls.map(x => {
    const url = new URL(x && x?.url ? x?.url : x, baseDomain)
    const userName = url?.pathname?.split('/')?.filter(x => x)?.pop()
    const userData = { url: url.href, userName, maxPinsCnt }
    return { url: profileUrlByName(userName), userData }
  })

  const requestList = await Apify.openRequestList('start-urls', startNames)
  const requestQueue = await Apify.openRequestQueue()
  const proxyConfiguration = await Apify.createProxyConfiguration(proxyConfig)

  const crawler = new Apify.CheerioCrawler({
    requestList,
    requestQueue,
    proxyConfiguration,
    minConcurrency,
    maxConcurrency,
    maxRequestRetries,
    requestTimeoutSecs,
    handlePageFunction: async (context) => {
      const {
        json,
        request: { url, userData }
      } = context

      if (json && !userData?.dataType) {
        return handleStart(context)
      } else if (json && userData?.dataType === 'pins') {
        return handlePins(context)
      } else {
        log.error('UnhandledPage', { url })
      }
    }
  })

  log.info('Starting the crawl.')
  await crawler.run()
  log.info('Crawl finished.')
})
