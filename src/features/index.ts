import getElectricityList from './electricity'
import { FeaturesType } from '../types/features'
import { CallbackListItem } from '../types/utools'

const featuresFun: FeaturesType = {
  electricity: getElectricityList,
}

const featuresList: CallbackListItem[] = [
  { title: 'electricity', description: '查询电费', icon: 'assets/electricity.png' },
]

const isNoFeatures = (feature: string): boolean =>
  !featuresList.some(({ title }) => title === feature)

export { featuresFun, featuresList, isNoFeatures }
