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
]

const isNoFeatures = (feature: string): boolean =>
  !featuresList.some(({ title }) => title === feature)

export { featuresFun, featuresList, isNoFeatures }
