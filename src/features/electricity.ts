import * as qs from 'qs'
import { api, customGot } from '../api'
import { getCookieJar } from '../login'
import { CallbackListItem } from '../types/utools'

const getElectricityCharge = async (): Promise<CallbackListItem[]> => {
  const cookieJar = getCookieJar()
  await customGot(api.electricity, { cookieJar })

  const {
    body: { data },
  } = await customGot(api.getElectricityData, {
    cookieJar,
    method: 'POST',
    responseType: 'json',
    body: qs.stringify({
      request_type: 'query_type',
      roomdm: 180235,
    }),
  })

  const charge = data[0].SYL
  return [
    {
      title: `剩余: ${charge}度电`,
      description: `剩余: ${charge}度电`,
    },
  ]
}

export default getElectricityCharge
