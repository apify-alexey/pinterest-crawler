const Apify = require('apify')
const _ = require('lodash')
const omitDeep = require('omit-deep-lodash')

const { utils: { log } } = Apify

const baseDomain = exports.baseDomain = 'https://www.pinterest.com'
const apiBaseURL = `${baseDomain}/resource`
const profileApiEndpoint = '/UserResource/get/?source_url='

exports.profileUrlByName = (userName) => {
  // '/bellinthewoods/pins/&data={"options":{"field_set_key":"profile","username":"bellinthewoods"},"context":{}}'
  return `${apiBaseURL}${profileApiEndpoint}%2F${userName}%2Fpins%2F&data=%7B%22options%22%3A%7B%22field_set_key%22%3A%22profile%22%2C%22username%22%3A%22${userName}%22%7D%2C%22context%22%3A%7B%7D%7D`
}

const decodePathForQuery = (path) => {
  return encodeURIComponent(path)
}

const pinsUrlByName = (userName, path) => {
  const param = decodePathForQuery(path)
  // '/poltronafrau/pins/&data={"options":{"username":"poltronafrau"},"context":{}}'
  const pinsApiEndpoint = '/UserPinsResource/get/?source_url=%2F'  + param +
    '%2Fpins%2F&data=%7B%22options%22%3A%7B%22is_own_profile_pins%22%3Afalse%2C%22username%22%3A%22' +
    decodePathForQuery(userName) + '%22%2C%22field_set_key%22%3A%22grid_item%22%2C%22pin_filter%22%3Anull%7D%2C%22context%22%3A%7B%7D%7D&_=' + new Date().getTime()
  
  return `${apiBaseURL}${pinsApiEndpoint}`
}

const pinsUrlByBooksmarks = (userName, path, bookmarks) => {
  const param = decodePathForQuery(path)
  const bookmarksQuery = '/UserPinsResource/get/?source_url=%2F' + param +
    '%2Fpins%2F&data=%7B%22options%22%3A%7B%22bookmarks%22%3A%5B%22' + bookmarks +
    '%22%5D%2C%22is_own_profile_pins%22%3Afalse%2C%22username%22%3A%22' + decodePathForQuery(userName) +
    '%22%2C%22field_set_key%22%3A%22grid_item%22%2C%22pin_filter%22%3Anull%7D%2C%22context%22%3A%7B%7D%7D&_=' + new Date().getTime()

  return `${apiBaseURL}${bookmarksQuery}`
}

exports.handleStart = async (context) => {
  const {
    json,
    crawler: { requestQueue },
    request: { userData }
  } = context

  const profile = json?.resource_response?.data

  if (!profile) {
    throw new Error(`BrokenProfile ${profile}`)
    // log.error(`BrokenProfile ${url}`) // , { json }
    // return
  }

  const { userName, path } = userData

  log.info(`GET profile ${userName}`)

  let csvData = { url: profile?.listed_website_url || profile?.website_url || userName, ...profile }
  csvData = _.omit(csvData, [
    'listed_website_url', 'verified_identity', 'indexed', 'profile_cover', 'show_engagement_tab',
    'pins_done_count', 'domain_verified', 'eligible_profile_tabs', 'type', 'show_impressum',
    'storefront_search_enabled', 'is_primary_website_verified', 'has_showcase', 'profile_reach',
    'partner', 'is_partner', 'pronouns', 'show_discovered_feed', 'has_custom_board_sorting_order',
    'show_creator_profile', 'explicitly_followed_by_me', 'blocked_by_me'
  ])

  await Apify.setValue(userName, csvData)

  await requestQueue.addRequest({
    url: pinsUrlByName(userName, path),
    userData: {
      ...userData,
      dataType: 'pins'
    }
  })

}

exports.handlePins = async (context) => {
  const {
    json,
    crawler: { requestQueue },
    request: { url, userData }
  } = context

  const {
    userName,
    path,
    count = 0,
    maxPinsCnt
  } = userData

  const pins = json?.resource_response?.data

  if (!pins) {
    throw new Error(`BrokenPins ${path}`)
    // log.error(`BrokenPins ${url}`) // , { json }
    // return
  }

  let csvPins = pins.slice(0, maxPinsCnt - count).map(x => {
    // if (x?.comments?.data?.length) console.log(x?.comments?.data?.length)
    let pinRemapped = {
      sourceUrl: userData?.url,
      profile: userName,
      image: _.values(x?.images)?.pop(),
      ...x
    }
    pinRemapped.aggregated_pin_data = pinRemapped?.aggregated_pin_data?.aggregated_stats
    pinRemapped = _.omit(pinRemapped, [
      'image_crop', 'done_by_me', 'image_signature', 'pinner', 'debug_info_html', 'tracking_params',
      'images', 'ad_match_reason', 'dominant_color', 'native_creator', 'method', 'additional_hide_reasons',
      'attribution', 'has_required_attribution_provider', 'manual_interest_tags', 'access',
      'is_quick_promotable', 'rich_summary', 'is_eligible_for_related_products', 'is_eligible_for_web_closeup',
      'is_downstream_promotion', 'sponsorship', 'campaign_id', 'promoted_is_removable', 'is_uploaded'
    ])
    if (!pinRemapped?.comment_count) {
      pinRemapped.comment_count = pinRemapped.comments = undefined
    }
    pinRemapped = omitDeep(pinRemapped, [
      'followed_by_me', 'collaborated_by_me', 'blocked_by_me', 'explicitly_followed_by_me', 'owner',
      'type', 'layout', 'creator_analytics', 'privacy'
    ])
    return pinRemapped
  })

  log.info(`GET ${count} - ${count + csvPins?.length} pins for ${path}`)

  await Apify.pushData(csvPins)

  const bookmarks = json?.resource?.options?.bookmarks?.pop()

  const nextCount = count + pins.length
  if (pins.length > 0 && bookmarks && bookmarks !== '-end-' && nextCount < maxPinsCnt) {
    await requestQueue.addRequest({
      url: pinsUrlByBooksmarks(userName, path, bookmarks),
      userData: {
        ...userData,
        count: nextCount,
        dataType: 'pins'
      }
    })  
  }

}
