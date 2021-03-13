import qs from 'qs'
import { ScroeData } from '../types/response'
import { CallbackListItem } from '../types/utools'
import { api, customGot } from '../utils/api'
import { getCookieJar } from '../utils/login'

const getScoreList = async (): Promise<CallbackListItem[]> => {
  const cookieJar = getCookieJar()
  const { items } = await customGot(api.getScoreData, {
    cookieJar,
    method: 'POST',
    body: qs.stringify({
      xnm: '',
      xqm: '',
      'queryModel.showCount': 50,
    }),
  }).json<ScroeData>()

  const jdInfo = items
    .filter((item) => +item.jd)
    .map(({ xf, jd }) => ({
      xf: +xf,
      jd: +jd * +xf,
    }))
    .reduce(
      (prev, next) => ({
        xf: prev.xf + next.xf,
        jd: prev.jd + next.jd,
      }),
      { xf: 0, jd: 0 },
    )

  const gpa = jdInfo.jd / jdInfo.xf

  return [
    {
      title: `GPA: ${gpa.toFixed(2)} ------- 课程总数: ${items.length}`,
      description: '平均绩点',
      icon: 'assets/scroe.png',
    },
  ].concat(
    items.map(({ kcmc, bfzcj, kcxzmc, xf, tjrxm, jd }) => ({
      title: `${(+bfzcj).toFixed(1)}分 ------ 绩点: ${jd} ------ ${kcmc}`,
      description: `${kcxzmc} · ${xf}学分 · ${tjrxm}`,
      icon: 'assets/scroe.png',
    })),
  )
}

export default getScoreList
