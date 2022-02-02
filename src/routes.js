const Apify = require('apify')

const { utils: { log } } = Apify

const baseDomain = exports.baseDomain = 'https://www.pinterest.com'
const apiBaseURL = `${baseDomain}/resource`
const profileApiEndpoint = '/UserResource/get/?source_url='
const pinsApiEndpoint = '/UserPinsResource/get/?source_url='

exports.profileUrlByName = (userName) => {
  // '/bellinthewoods/pins/&data={"options":{"field_set_key":"profile","username":"bellinthewoods"},"context":{}}'
  return `${apiBaseURL}${profileApiEndpoint}%2F${userName}%2Fpins%2F&data=%7B%22options%22%3A%7B%22field_set_key%22%3A%22profile%22%2C%22username%22%3A%22${userName}%22%7D%2C%22context%22%3A%7B%7D%7D`
}

const pinsUrlByName = (userName) => {
  // '/poltronafrau/pins/&data={"options":{"username":"poltronafrau"},"context":{}}'
  return `${apiBaseURL}${pinsApiEndpoint}%2F${userName}%2Fpins%2F&data=%7B%22options%22%3A%7B%22username%22%3A%22${userName}%22%7D%2C%22context%22%3A%7B%7D%7D`
}

exports.handleStart = async (context) => {
  const {
    json,
    crawler: { requestQueue },
    request: { url, userData }
  } = context

  const profile = json?.resource_response?.data

  if (!profile) {
    log.error(`BrokenProfile ${url}`, { json })
    return
  }

  const { userName } = userData

  log.info(`GET profile ${userName}`)

  await requestQueue.addRequest({
    url: pinsUrlByName(userName),
    userData: {
      ...userData,
      profile: { ...profile, blocked_by_me: undefined },
      dataType: 'pins'
    }
  })
}

exports.handlePins = async (context) => {
  const {
    json,
    request: { url, userData }
  } = context

  const { profile, userName } = userData

  const pins = json?.resource_response?.data

  if (!pins) {
    log.error(`BrokenPins ${url}`, { json })
    if (profile) {
      await Apify.pushData(profile)
    }
    return
  }

  log.info(`GET pins ${userName}`)
  await Apify.pushData({ ...profile, pins })
}
