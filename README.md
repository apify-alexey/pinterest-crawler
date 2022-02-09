## Features
Our free Pinterest Crawler allows you to get "pins" along with a user's profile.

This unofficial Pinterest API is designed to give you more details than you can see in web interface. It also enables anyone to extract public data from Pinterest without imposing limits.

The Pinterest data crawler supports the following features:

- Scrape profiles - you can get metadata from the profile
- Scrape pins with full details, different kind of pins will be parsed accordingly

Let us know if you need a [custom Social Media scraping solution](https://apify.com/custom-solutions).

## Why scrape Pinterest?
Automatically gather data from this image sharing and social media service designed to enable the saving and discovery of images, animated GIFs, and videos.

So what could you do with that data? Here are some ideas:
- Collect data about your audience. How many subscribers do they have on average? Are they active on Pinterest, what sites do they have?
- To find your best subscribers. Make a short list of your best subscribers and actively pursue them by sending them DMs and offering partnerships!
- Collect data about your competitor's audience.

If you want more ideas, check out our [industries pages](https://apify.com/industries) for ways web scraping is already being used in a wide range of companies.

## Tutorial
You need to provide a list of profile names or Pinterest URLs (can be mixed in any order).

## Cost of usage
There are two main factors to take into account if you want to run Pinterest Crawler on the Apify platform:
- [Compute units](https://apify.com/pricing/actors) - used for running the scraper
- [Proxy traffic](https://apify.com/pricing/proxy) - needed to access Pinterest without login

The usage costs is lowest possible, Crawler will provide you data hundreds of times faster than manual access, you should be able to get 1.000 pins per 0.01CU

### Using proxies
Pinterest now allows access under any type of proxies.

### Custom proxies
You can also use proxies from other providers in the custom proxies fields (`proxyUrls` in the JSON settings).

### Cost of usage for profile scraping
Scraping **1,000 pins** requires about:
- **0.01 compute units**

## Input parameters
The input of this scraper should be JSON containing the list of pages or sources on Pinterest that should be visited. You can specify plain text name as `ohjoy`, relative path to pins as `/ohjoy/illustrations/` or full URL as `https://pinterest.com/ohjoy/tabletop` in any order.

Required fields are:

| Field | Type | Description |
| ----- | ---- | ----------- |
| startUrls | Array | List of Pinterest URLs (profile or user name) |
| proxy | Object | Proxy configuration |
| maxPinsCnt | Integer | Pins per startUrl item |

### Pinterest scraper input example

```jsonc
{
    "startUrls": [
        "https://pinterest.com/ohjoy/tabletop"
    ],
    "maxPinsCnt": 30,
    "proxy": { "useApifyProxy": true }
}
```

## Pinterest output format
The actor stores its results in a dataset. Each item is a separate item in the dataset.

You can manage the results in any language (Python, PHP, Node JS/NPM). See [our API reference](https://docs.apify.com/api/v2) to learn more about getting results from the Pinterest Scraper.

### Scraped Pints and Profiles
The structure of each pin item in dataset looks like this:

```jsonc
{
  "sourceUrl": "https://www.pinterest.com/ohjoy/illustrations/",
  "profile": "ohjoy",
  "image": {
    "width": 750,
    "height": 1061,
    "url": "https://i.pinimg.com/originals/2c/73/69/2c7369ac08da1f0c3cb71f6bca2ebc61.jpg"
  },
  "price_currency": "USD",
  "repin_count": 0,
  "grid_description": " ",
  "is_video": false,
  "promoter": null,
  "is_repin": true,
  "link": "https://www.tinkoutsidethebox.com/portfolio",
  "is_stale_product": false,
  "product_pin_data": null,
  "is_whitelisted_for_tried_it": true,
  "description": " ",
  "story_pin_data_id": null,
  "is_eligible_for_pdp": false,
  "id": "21181060738944016",
  "is_promoted": false,
  "video_status_message": null,
  "story_pin_data": null,
  "video_status": null,
  "grid_title": "My Illustration Portfolio — TINK",
  "is_oos_product": false,
  "created_at": "Wed, 09 Feb 2022 06:09:17 +0000",
  "alt_text": null,
  "shopping_flags": [],
  "view_tags": [],
  "videos": null,
  "embed": null,
  "board": {
    "id": "21181129436430347",
    "name": "Illustrations",
    "is_collaborative": false,
    "url": "/ohjoy/illustrations/",
    "image_thumbnail_url": "https://i.pinimg.com/upload/21181129436430347_board_thumbnail_2022-02-09-06-09-18_88904_60.jpg"
  },
  "is_native": false,
  "reaction_counts": {},
  "carousel_data": null,
  "title": "",
  "description_html": " ",
  "price_value": 0,
  "aggregated_pin_data": {
    "saves": 15111,
    "done": 0
  },
  "is_playable": false,
  "domain": "tinkoutsidethebox.com"
}
```

Profiles saved to KV Store separate from pins and named as profiles in Pinterest itself, at the example above you can see `"profile": "ohjoy"` and in turn `ohjoy.json` at KV Store as follows:

```jsonc
{
  "url": "http://www.ohjoy.com/",
  "is_verified_merchant": false,
  "domain_url": "www.ohjoy.com",
  "website_url": "http://www.ohjoy.com/",
  "has_published_pins": true,
  "video_pin_count": 0,
  "image_xlarge_url": "https://i.pinimg.com/280x280_RS/82/9b/5d/829b5daf85f4adc2e224b0031d5294e0.jpg",
  "pin_count": 32740,
  "location": "Los Angeles",
  "group_board_count": 17,
  "profile_discovered_public": true,
  "has_shopping_showcase": false,
  "interest_following_count": 5,
  "board_count": 71,
  "storefront_management_enabled": true,
  "about": "Founder and Creative Director of Oh Joy!",
  "explicit_user_following_count": 349,
  "id": "21181198155907073",
  "image_medium_url": "https://i.pinimg.com/75x75_RS/82/9b/5d/829b5daf85f4adc2e224b0031d5294e0.jpg",
  "story_pin_count": 23,
  "impressum_url": null,
  "last_pin_save_time": "Wed, 09 Feb 2022 06:09:17 +0000",
  "follower_count": 15217874,
  "image_large_url": "https://i.pinimg.com/140x140_RS/82/9b/5d/829b5daf85f4adc2e224b0031d5294e0.jpg",
  "native_pin_count": 0,
  "profile_views": 2490285,
  "is_inspirational_merchant": false,
  "first_name": "Oh Joy",
  "has_catalog": false,
  "following_count": 381,
  "is_tastemaker": false,
  "image_small_url": "https://i.pinimg.com/30x30_RS/82/9b/5d/829b5daf85f4adc2e224b0031d5294e0.jpg",
  "username": "ohjoy",
  "joined_communities_count": 0,
  "country": "US",
  "full_name": "Oh Joy",
  "last_name": "",
  "repins_from": [
    {
      "id": "77194718521327659",
      "username": "elidise",
      "image_small_url": "https://i.pinimg.com/30x30_RS/18/9f/8b/189f8b1034799f57581870a90d0871a4.jpg",
      "full_name": "Elizabeth Nuñez",
      "repins_from": [],
      "image_medium_url": "https://i.pinimg.com/75x75_RS/18/9f/8b/189f8b1034799f57581870a90d0871a4.jpg"
    }
  ],
  "has_board": true
}
```

## Personal data
You should be aware that your results could contain personal data. Personal data is protected by GDPR in the European Union and by other regulations around the world. You should not scrape personal data unless you have a legitimate reason to do so. If you're unsure whether your reason is legitimate, consult your lawyers. You can also read our blog post on the [legality of web scraping](https://blog.apify.com/is-web-scraping-legal/).
