module.exports = {
    getCookie: (name, cookie) => {
        try {
            return JSON.parse(decodeURIComponent(((cookie.split(';') || []).filter((e, i) => e.toString().split('=')[0].trim() == name)[0] || '=').split('=')[1].trim()) || { '': '' })
        } catch (e) { return null }
    }
}