const Apify = require('apify');
const crawlee = require('crawlee');

const { profileUrlByName, handleStart, handlePins } = require('./src/routes');

const { Actor, log } = Apify;
const { CheerioCrawler } = crawlee;

Actor.main(async () => {
    const input = await Actor.getInput();
    const {
        proxyConfig = { useApifyProxy: true },
        startUrls = [],
        maxPinsCnt = 50,
    } = input;

    if (!startUrls?.length) {
        log.error('No startUrls data', { startUrls });
        return;
    }

    const startNames = startUrls.map((x) => {
        let url = x?.url || x || '';
        url = url.replace('http://', '').replace('https://', '');
        url = url.includes('/') ? `https://${url}` : url;
        url = new URL(url, 'https://www.pinterest.com');
        const userName = url?.pathname?.split('/')?.filter(Boolean)?.shift();
        const userData = {
            url: url.href,
            userName,
            maxPinsCnt,
            path: url?.pathname,
        };
        return { url: profileUrlByName(userName), userData };
    });

    const proxyConfiguration = await Actor.createProxyConfiguration(proxyConfig);

    const crawler = new CheerioCrawler({
        proxyConfiguration,
        requestHandler: async (context) => {
            const {
                json,
                request: { url, userData },
            } = context;

            if (json && !userData?.dataType) {
                return handleStart(context, input);
            } if (json && userData?.dataType === 'pins') {
                return handlePins(context);
            }
            log.error('UnhandledPage', { url });
        },
    });

    log.info('Starting the crawl.');
    await crawler.run(startNames);
    log.info('Crawl finished.');
});
