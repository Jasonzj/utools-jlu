import { CallbackListItem } from './utools'

type FeaturesType = {
  [propName: string]: () => Promise<CallbackListItem[]>
}
type SubFeaturesType = {
  [propName: string]: ({}: Record<string, unknown>) => Promise<CallbackListItem[]>
}

export { FeaturesType, SubFeaturesType }
