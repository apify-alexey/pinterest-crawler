## Features
Our free Pinterest Crawler allows you to get "pins" along with a user's profile.

This unofficial Pinterest API is designed to give you more details than you can see in web interface. It also enables anyone to extract public data from Pinterest without imposing limits.

The Pinterest data crawler supports the following features:

- Scrape profiles - you can get metadata from the profile
- Scrape pins - full size HD images
- Raw Data - in addition to dataset output with CSV friendly formatting you can add optional KeyValue records with data "as is" from internal Pinterest API

Let us know if you need a [custom Social Media scraping solution](https://apify.com/custom-solutions).

## Why scrape Pinterest?
Automatically gather data from this image sharing and social media service designed to enable the saving and discovery of images, animated GIFs, and videos.

So what could you do with that data? Here are some ideas:
- Collect data about your audience. How many subscribers do they have on average? Are they active on Pinterest, what sites do they have?
- To find your best subscribers. Make a short list of your best subscribers and actively pursue them by sending them DMs and offering partnerships!
- Collect data about your competitor's audience.

If you want more ideas, check out our [industries pages](https://apify.com/industries) for ways web scraping is already being used in a wide range of companies.

## Tutorial
You need to provide a list of user name or Pinterest URLs (can be mixed in any order). See if you want to get raw data or not, then just run scraper.

## Cost of usage
There are two main factors to take into account if you want to run Pinterest Crawler on the Apify platform:
- [Compute units](https://apify.com/pricing/actors) - used for running the scraper
- [Proxy traffic](https://apify.com/pricing/proxy) - needed to access Pinterest without login

The usage costs is lowest possible, Crawler will provide you data hundreds of times faster than manual access.

### Using proxies
Pinterest now allows access under any type of proxies.

### Custom proxies
You can also use proxies from other providers in the custom proxies fields (`proxyUrls` in the JSON settings).

### Cost of usage for profile scraping
Scraping **1,000 profiles** requires about:
- **less than 1 compute units**
- **less than 200 MB of proxy traffic**

## Input parameters
The input of this scraper should be JSON containing the list of pages or names on Pinterest that should be visited. Required fields are:

| Field | Type | Description |
| ----- | ---- | ----------- |
| startUrls | Array | List of Pinterest URLs (profile or user name) |
| proxy | Object | Proxy configuration |
| rawData | Boolean | (optional) Add full details to KV Store with user name as a key |

### Pinterest scraper input example

```jsonc
{
    "search": "Náměstí míru",
    "searchType": "place",
    "searchLimit": 10,
    "resultsType": "posts",
    "resultsLimit": 100,
    "proxy": { "useApifyProxy": true, "apifyProxyGroups": ["RESIDENTIAL"] }
}
```

## Pinterest output format
The actor stores its results in a dataset. Each item is a separate item in the dataset.

You can manage the results in any language (Python, PHP, Node JS/NPM). See [our API reference](https://docs.apify.com/api/v2) to learn more about getting results from the Pinterest Scraper.

### Scraped Pinterest posts
The structure of each item in Pinterest posts when scrolling looks like this:

```jsonc
{
}
```

## Personal data
You should be aware that your results could contain personal data. Personal data is protected by GDPR in the European Union and by other regulations around the world. You should not scrape personal data unless you have a legitimate reason to do so. If you're unsure whether your reason is legitimate, consult your lawyers. You can also read our blog post on the [legality of web scraping](https://blog.apify.com/is-web-scraping-legal/).
