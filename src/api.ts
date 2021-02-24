import got from 'got'

const api = {
  login: 'https://authserver.jluzh.edu.cn/cas/login',
  mobileLogin: 'https://mucp.jluzh.edu.cn/_ids_mobile/login18_9',
  serialNoLogin: 'https://mucp.jluzh.edu.cn/_ids_mobile/serialNoLogin18_9',
  electricity: 'https://diankong.jluzh.edu.cn/App/index.aspx',
  getElectricityData: 'https://diankong.jluzh.edu.cn/App/DBGetPost.ashx',
}

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'User-Agent':
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 iPhone 11 Pro Max iPortal/26',
}

const customGot = got.extend({
  headers,
})

export { api, customGot }
