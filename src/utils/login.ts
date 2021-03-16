import qs from 'qs'
import iconv from 'iconv-lite'
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

const loginJw = async (cookieJar: CookieJar, username: string, password: string): Promise<void> => {
  const response = await customGot(api.jwLogin, {
    cookieJar,
    method: 'POST',
    body: qs.stringify({
      yhm: username,
      mm: password,
    }),
  })

  if (response.body.includes('用户名或密码不正确，请重新输入')) {
    throw new Error('jw: 账号或密码错误')
  }
}

const loginWlkc = async (
  cookieJar: CookieJar,
  username: string,
  password: string,
): Promise<void> => {
  const body = await customGot(api.wlkcLogin, {
    cookieJar,
    method: 'POST',
    body: qs.stringify({
      IPT_LOGINUSERNAME: username,
      IPT_LOGINPASSWORD: password,
    }),
  }).buffer()

  const { body: dwrContent } = await customGot(
    'http://wlkc.jluzh.edu.cn/meol/dwr/call/plaincall/__System.generateId.dwr',
    {
      cookieJar,
      method: 'POST',
      body: qs.stringify({
        callCount: 1,
        'c0-scriptName': '__System',
        'c0-methodName': 'generateId',
        'c0-id': 0,
        batchId: 0,
        instanceId: 0,
        page: `%2Fmeol%2Fjpk%2Fcourse%2Flayout%2Fnewpage%2Findex.jsp%3FcourseId%3D`,
        scriptSessionId: '',
        windowName: '',
      }),
    },
  )

  const dwr = dwrContent.match(/(?<="0","0",").*?(?=")/gi)[0]
  cookieJar.setCookie(`DWRSESSIONID=${dwr};`, api.wlkcLogin)

  const content = iconv.decode(body, 'GBK')

  if (content.includes('用户名或密码错误')) {
    throw new Error('wlkc: 账号或密码错误')
  }
}

const loginMyJlu = async (
  cookieJar: CookieJar,
  username: string,
  password: string,
): Promise<void> => {
  const loginPageResponse = await customGot(api.login)

  const execution = extractInputValueByStr(loginPageResponse.body, 'execution')

  const loginResponse = await customGot(api.login, {
    cookieJar,
    method: 'POST',
    body: qs.stringify({ ...loginDataTmp, username, password, execution }),
  })

  if (loginResponse.body.includes('认证信息无效')) {
    throw new Error('myJlu: 账号或密码错误')
  }
}

const login = async (): Promise<void> => {
  const cookieJar = new CookieJar()
  const username = DBHelper.getValue<string>('username')
  const password = DBHelper.getValue<string>('password')
  const wlkcPassword = DBHelper.getValue<string>('wlkcPassword')
  const jwPassword = DBHelper.getValue<string>('jwPassword')

  await Promise.all([
    loginMyJlu(cookieJar, username, password),
    loginWlkc(cookieJar, username, wlkcPassword),
    loginJw(cookieJar, username, jwPassword),
  ])

  const date = new Date()
  date.setHours(date.getHours() + 3)
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
