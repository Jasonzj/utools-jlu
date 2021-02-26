import qs from 'qs'
import { CookieJar } from 'tough-cookie'
import { api, customGot } from '../api'
import { getCookieJar } from '../login'
import { Electricity, ElectricityQueryData, ElectricityUsingData } from '../types/response'
import { CallbackListItem } from '../types/utools'
import { extractInputValueByStr } from '../utils'

const getElectricityData = async <T>(
  cookieJar: CookieJar,
  roomdm: string,
  request_type: string,
): Promise<T> => {
  const {
    body: { data },
  } = await customGot<Electricity<T>>(api.getElectricityData, {
    cookieJar,
    method: 'POST',
    responseType: 'json',
    body: qs.stringify({
      request_type,
      roomdm,
      roomid: '',
      start_date: '',
      end_date: '',
    }),
  })

  return data
}

const getElectricityList = async (): Promise<CallbackListItem[]> => {
  const cookieJar = getCookieJar()
  const pageResponse = await customGot(api.electricity, { cookieJar })
  const roomdm = extractInputValueByStr(pageResponse.body, 'roomdm')

  const [[{ SYL: charge }], usingList] = await Promise.all([
    getElectricityData<ElectricityQueryData[]>(cookieJar, roomdm, 'query_type'),
    getElectricityData<ElectricityUsingData[]>(cookieJar, roomdm, 'query_using'),
  ])

  const list = [
    {
      title: `剩余: ${charge}度`,
      description: `剩余: ${charge}度`,
    },
  ].concat(
    usingList.map((item) => ({
      title: ` 用电量: ${item.zyl} ----- 剩余电量: ${item.zye}`,
      description: `时间: ${item.accounttime}`,
    })),
  )

  return list
}

export default getElectricityList
