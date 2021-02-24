import getElectricityCharge from './electricity'
import { FeaturesType } from '../types/global'

const featuresFun: FeaturesType = {
  electricity: getElectricityCharge,
}

const featuresList = [{ title: 'electricity', description: '查询电费' }]

const isNoFeatures = (feature: string): boolean =>
  !featuresList.some(({ title }) => title === feature)

export { featuresFun, featuresList, isNoFeatures }
