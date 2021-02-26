import getElectricityList from './electricity'
import getWaterList from './water'
import { FeaturesType } from '../types/features'
import { CallbackListItem } from '../types/utools'

const featuresFun: FeaturesType = {
  electricity: getElectricityList,
  water: getWaterList,
}

const featuresList: CallbackListItem[] = [
  { title: 'electricity', description: '查询电费', icon: 'assets/electricity.png' },
  { title: 'water', description: '查询水费', icon: 'assets/water.png' },
  {
    title: 'healthCard',
    description: '健康卡填报',
    url: 'https://work.jluzh.edu.cn/default/work/jlzh/jkxxtb/jkxxcj.jsp',
  },
  {
    title: 'repair',
    description: '维修服务',
    url: 'https://work.jluzh.edu.cn/default/work/jzbx/jzbxsq.jsp',
  },
  {
    title: 'studentCard',
    description: '校园卡补办',
    url:
      'https://work.jluzh.edu.cn/default/base/workflow/start.jsp?process=com.sudytech.work.mfhd.xsbbxyksq.xsbbxyksqcopy',
  },
  {
    title: 'bankCard',
    description: '银行卡变更',
    url:
      'https://work.jluzh.edu.cn/default/base/workflow/start.jsp?process=com.sudytech.work.mfhd.xsyhkbgdj.xsyhkbgdj',
  },
]

const isNoFeatures = (feature: string): boolean =>
  !featuresList.some(({ title }) => title === feature)

export { featuresFun, featuresList, isNoFeatures }
