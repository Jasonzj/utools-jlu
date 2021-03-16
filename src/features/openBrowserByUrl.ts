import { Cookie } from 'tough-cookie'
import { api } from '../utils/api'
import { getCookieJar } from '../utils/login'

const openBrowserByUrl = async (url: string, cookieUrl: string): Promise<void> => {
  if (cookieUrl) {
    const cookies = await getCookieJar().getCookies(cookieUrl)
    const cookiesString = cookies.map((cookie) => {
      cookie.httpOnly = false
      return Cookie.fromJSON(JSON.stringify(cookie)).toString()
    })

    utools.ubrowser
      .goto(url)
      .clearCookies()
      .evaluate((cookiesString: string[]) => {
        cookiesString.forEach((cookie) => (document.cookie = cookie))
      }, cookiesString)
      .goto(url)
      .run({ width: 1200, height: 800 })
  } else {
    const cookie = await getCookieJar().getCookieString(api.authServer)
    utools.ubrowser.goto(url, { cookie }).run({ width: 1200, height: 800 })
  }
}

export default openBrowserByUrl
