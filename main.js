const Apify = require('apify')
const { baseDomain, profileUrlByName, handleStart, handlePins } = require('./src/routes')

const { utils: { log } } = Apify

Apify.main(async () => {
  const {
    proxyConfig = { useApifyProxy: true },
    startUrls = []
  } = await Apify.getInput()

  if (!startUrls?.length) {
    log.error('No startUrls data', { startUrls })
    return
  }

  const startNames = startUrls.map(x => {
    const url = new URL(x && x?.url ? x?.url : x, baseDomain)
    const userName = url?.pathname?.split('/')?.filter(x => x)?.pop()
    const userData = { userName }
    return { url: profileUrlByName(userName), userData }
  })

  const requestList = await Apify.openRequestList('start-urls', startNames)
  const requestQueue = await Apify.openRequestQueue()
  const proxyConfiguration = await Apify.createProxyConfiguration(proxyConfig)

  const crawler = new Apify.CheerioCrawler({
    requestList,
    requestQueue,
    proxyConfiguration,
    // maxRequestRetries: 0,
    handlePageFunction: async (context) => {
      const {
        json,
        request: { url, userData }
      } = context

      if (json && url.includes('profile')) {
        return handleStart(context)
      } else if (json && userData) {
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
