import qs from 'qs'
import { CookieJar } from 'tough-cookie'
import { customGot, api } from './api'
import DBHelper from './DBHelper'
import { extractInputValueByStr } from '.'

// const mobileLoginDataTmp = {
//   appName: 'teach',
//   deviceName: 'iPad7,5',
//   name: 'iPad',
//   code: '2',
// }

const loginDataTmp = {
  _eventId: 'submit',
  loginType: '1',
  submit: '登  录',
  rememberMe: true,
}

// const login = async (isSerialNo = false): Promise<void> => {
//   try {
//     const username = DBHelper.getValue('username')
//     const password = DBHelper.getValue(`${isSerialNo ? 'secret' : 'password'}`)
//     const serialNo = DBHelper.getValue('serialNo')
//     const cookieJar = new CookieJar()
//     const loginUrl = isSerialNo ? api.serialNoLogin : api.mobileLogin
//     const loginResponse = await customGot(loginUrl, {
//       cookieJar,
//       method: 'POST',
//       body: qs.stringify({
//         username,
//         password,
//         serialNo,
//         ...mobileLoginDataTmp,
//       }),
//     })

//     const ssocookie = JSON.parse(loginResponse.headers.ssocookie as string)[0]
//     cookieJar.setCookie(
//       `${ssocookie.cookieName}=${ssocookie.cookieValue}; Path=${ssocookie.cookiePath}`,
//       `https://${ssocookie.cookieDomain}`,
//     )

//     DBHelper.set({ id: 'cookieJar', value: cookieJar.toJSON() })

//     if (!isSerialNo) {
//       DBHelper.set({ id: 'secret', value: loginResponse.headers.userpwd })
//       utools.showNotification('登入成功')
//     }
//   } catch (error) {
//     !isSerialNo && utools.showNotification('登入失败')
//     throw error
//   }
// }

// const serialNoLogin = login.bind(null, true)

const login = async (): Promise<void> => {
  const cookieJar = new CookieJar()
  const username = DBHelper.getValue('username')
  const password = DBHelper.getValue('password')

  const loginPageResponse = await customGot(api.login)

  const execution = extractInputValueByStr(loginPageResponse.body, 'execution')

  const loginResponse = await customGot(api.login, {
    cookieJar,
    method: 'POST',
    body: qs.stringify({ ...loginDataTmp, username, password, execution }),
  })

  if (loginResponse.body.includes('认证信息无效')) {
    throw new Error('账号或密码错误')
  }

  const date = new Date()
  date.setHours(date.getHours() + 4)
  const cookieJarValue = cookieJar.toJSON()
  cookieJarValue.cookies.filter(({ key }) => key === 'CASTGC')[0].expires = date
  DBHelper.set({ id: 'cookieJar', value: JSON.stringify(cookieJarValue) })
}

const checkCookieExpired = async (): Promise<boolean> => {
  if (!DBHelper.get('cookieJar')) return true

  const cookieJar = getCookieJar()
  const casCookies = await cookieJar.getCookies(api.authServer)
  const CASTGC = casCookies.filter((cookie) => cookie.key === 'CASTGC')[0]

  if (!CASTGC) return true

  const expires = new Date(CASTGC.expires)
  console.log(CASTGC)

  return Date.now() >= expires.getTime()
}

const getLatestCookies = async (): Promise<void> => {
  try {
    if (DBHelper.getValue('getCookieFlag')) return

    DBHelper.set<boolean>({ id: 'getCookieFlag', value: true })

    const isExpired = await checkCookieExpired()

    if (isExpired) await login()

    DBHelper.set<boolean>({ id: 'getCookieFlag', value: false })
  } catch (error) {
    utools.showNotification(`获取cookie失败: ${error.message}`)
    DBHelper.set<boolean>({ id: 'getCookieFlag', value: false })
    throw error
  }
}

const getCookieJar = (): CookieJar => CookieJar.fromJSON(DBHelper.getValue<string>('cookieJar'))

export { login, getCookieJar, checkCookieExpired, getLatestCookies }
