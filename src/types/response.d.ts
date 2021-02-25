export type Electricity<T> = {
  code: number
  msg: number
  data: T
}

export type ElectricityQuery = Electricity<
  {
    ['SYL']: string
    ['SYLJE']: string
  }[]
>

export type ElectricityUsing = Electricity<
  {
    zyl: '0.00'
    zye: '29.77'
    accounttime: '2021-02-04'
  }[]
>

export type ElectricityStatus = Electricity<
  {
    datetime: '2021-02-19 18:11:32'
    status: '正常用电'
  }[]
>
