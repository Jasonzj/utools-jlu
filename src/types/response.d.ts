export type Electricity<T> = {
  code: number
  msg: number
  data: T
}

export type ElectricityUsingData = {
  zyl: string
  zye: string
  accounttime: string
}

export type ElectricityQueryData = {
  ['SYL']: string
  ['SYLJE']: string
}

export type ElectricityQuery = Electricity<ElectricityQueryData[]>

export type ElectricityUsing = Electricity<ElectricityUsingData[]>

export type WaterData = {
  errorMsg: string
  result: WaterResult
  resultCode: number
}

export interface WaterResult {
  data: {
    currentUsage: string
    endTime: string
    fjbh: string
    fjh: string
    id: number
    lastUsage: string
    price: string
    qymc: string
    rjfy: string
    ssbh: string
    sslbh: string
    startTime: string
    type: string
    unitPrice: string
    usage1: string
    xh: string
  }[]
  total: number
}
