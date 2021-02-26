import { api, customGot } from '../api'
import { getCookieJar } from '../login'
import { WaterData } from '../types/response'
import { CallbackListItem } from '../types/utools'

const waterType = ['assets/water_hot.png', 'assets/water.png']

const getWaterList = async (): Promise<CallbackListItem[]> => {
  const cookieJar = getCookieJar()
  await customGot(api.water, { cookieJar })
  const {
    result: { data },
  } = await customGot(api.getWaterData, { cookieJar }).json<WaterData>()

  return data.map((water) => ({
    title: `用水量: ${(+water.usage1).toFixed(1)} ----- ¥ ${water.rjfy}`,
    description: `${water.fjbh} ${water.startTime.slice(0, 10)}-${water.endTime.slice(0, 10)}
    ----- 合计:¥ ${water.price}`,
    icon: `${waterType[+water.type]}`,
  }))
}

export default getWaterList
