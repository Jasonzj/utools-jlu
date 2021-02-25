import * as qs from 'qs'
import { api, customGot } from '../api'
import { getCookieJar } from '../login'
import { ElectricityQuery } from '../types/response'
import { CallbackListItem } from '../types/utools'

const getElectricityCharge = async (): Promise<CallbackListItem[]> => {
  const cookieJar = getCookieJar()
  await customGot(api.electricity, { cookieJar })

  const {
    body: {
      data: [{ SYL: charge }],
    },
  } = await customGot<ElectricityQuery>(api.getElectricityData, {
    cookieJar,
    method: 'POST',
    responseType: 'json',
    body: qs.stringify({
      request_type: 'query_type',
      roomdm: 180235,
    }),
  })

  return [
    {
      title: `剩余: ${charge}度电`,
      description: `剩余: ${charge}度电`,
    },
  ]
}

export default getElectricityCharge
