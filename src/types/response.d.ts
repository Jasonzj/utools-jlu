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

export type WaterResult = {
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

export type ScroeData = {
  currentPage: number
  currentResult: number
  entityOrField: boolean
  items: ScroeResult[]
  limit: number
  offset: number
  pageNo: number
  pageSize: number
  showCount: number
  totalCount: number
  totalPage: number
  totalResult: number
}

export type ScroeResult = {
  bfzcj: string
  bh: string
  bh_id: string
  bj: string
  cj: string
  cjsfzf: string
  date: string
  dateDigit: string
  dateDigitSeparator: string
  day: string
  jd: string
  jg_id: string
  jgmc: string
  jgpxzd: string
  jsxm: string
  jxb_id: string
  jxbmc: string
  kcbj: string
  kch: string
  kch_id: string
  kclbmc: string
  kcmc: string
  kcxzdm: string
  kcxzmc: string
  key: string
  khfsmc: string
  kkbmmc: string
  ksxz: string
  ksxzdm: string
  listnav: string
  localeKey: string
  month: string
  njdm_id: string
  njmc: string
  pageable: true
  rangeable: true
  row_id: string
  sfxwkc: string
  tjrxm: string
  tjsj: string
  totalResult: string
  xb: string
  xbm: string
  xf: string
  xfjd: string
  xh: string
  xh_id: string
  xm: string
  xnm: string
  xnmmc: string
  xqm: string
  xqmmc: string
  year: string
  zyh_id: string
  zymc: string
}
