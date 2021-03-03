import { DBItem, DBRes } from '../types/utools'

const DB_PRE_FIX = 'jlu_'

type ENT<T = unknown> = {
  id: string
  value: T
}

export default class DBHelper {
  static set<T>(data: ENT<T>): DBRes<ENT<T>> {
    const db: DBItem<ENT<T>> = {
      _id: `${DB_PRE_FIX}${data.id}`,
      data,
    }
    const existDB = DBHelper.get(data.id)
    if (existDB) {
      db._rev = existDB._rev
    }
    return utools.db.put(db)
  }

  static setList<T>(data: ENT<T>[]): DBRes<ENT<T>>[] {
    const existDBList = DBHelper.getAll()
    const dbList = data.map((x) => {
      const db: DBItem<ENT<T>> = {
        _id: `${DB_PRE_FIX}${x.id}`,
        data: x,
      }
      const existDB = existDBList.find((d) => d.data.id === x.id)
      if (existDB) {
        db._rev = existDB._rev
      }
      return db
    })
    return utools.db.bulkDocs(dbList)
  }

  static update<T>(data: DBItem<ENT<T>>): DBRes<ENT<T>> {
    return utools.db.put(data)
  }

  static get<T>(id: string): DBItem<ENT<T>> {
    return utools.db.get<ENT<T>>(`${DB_PRE_FIX}${id}`)
  }

  static getValue<T>(id: string): T {
    return utools.db.get<ENT<T>>(`${DB_PRE_FIX}${id}`)?.data.value
  }

  static getAll(): DBItem<ENT>[] {
    return utools.db.allDocs<ENT>(DB_PRE_FIX)
  }

  static del(id: string): DBRes<ENT> {
    return utools.db.remove(`${DB_PRE_FIX}${id}`)
  }
}
