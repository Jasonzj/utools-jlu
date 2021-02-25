export type Electricity<T> = {
  code: number
  msg: number
  data: T
}

export type ElectricityQuery = Electricity<ElectricityQueryData[]>

export type ElectricityUsing = Electricity<ElectricityUsingData[]>

export type ElectricityUsingData = {
  zyl: string
  zye: string
  accounttime: string
}

export type ElectricityQueryData = {
  ['SYL']: string
  ['SYLJE']: string
}

export type ElectricityStatus = Electricity<
  {
    datetime: string
    status: string
  }[]
>
