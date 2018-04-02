const serverConfig = {
    scheme : 'http',
    host : '127.0.0.1',
    port : '5000'
}

const serverAuthority = `${serverConfig.scheme}://${serverConfig.host}:${serverConfig.port}`
const PATH_GETDEBTORDATA = '/getDebtorData'
const PATH_LOGIN = '/login'
const PATH_LOGOUT = '/logout'
const PATH_AUTHORIZE_RECHARGE = '/authorizeRecharge'
const PATH_GET_THIRDPARTY_JWT = '/getThirdPartyJWT'
const PATH_GET_THIRDPARTY_FEED = '/getThirdPartyFeed'
const FEED_URL = 'http://api-id.bms.bz/feed/'

export default {
    serverConfig,
    serverAuthority,
    PATH_GETDEBTORDATA,
    PATH_LOGIN,
    PATH_LOGOUT,
    PATH_AUTHORIZE_RECHARGE,
    RECHARGE_LIST_COLUMN_COUNT : 4,
    PATH_GET_THIRDPARTY_JWT,
    PATH_GET_THIRDPARTY_FEED,
    getThirdPartyJWTURI: consumer => `http://api-id.bms.bz/admin/consumers/${consumer}/jwt`,
    FEED_URL
}