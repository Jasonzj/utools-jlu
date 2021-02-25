import { CallbackListItem } from './utools'

type FeaturesType = {
  [propName: string]: () => Promise<CallbackListItem[]>
}

export { FeaturesType }
