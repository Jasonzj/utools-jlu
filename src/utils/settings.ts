import DBHelper from './DBHelper'
import { CallbackListItem } from '../types/utools'

const settingsNameList = ['username', 'password']

const isSettingsNoComplete = (): boolean => {
  return !settingsNameList.every((name) => Boolean(DBHelper.get(name)))
}

const generateSettingList = (titleList: string[], searchWord?: string): CallbackListItem[] => {
  return titleList.map((title: string) => {
    const value = DBHelper.get(title)
    return { title, description: `${value ? '重设' : '设置'}${title}`, data: searchWord }
  })
}

export { settingsNameList, generateSettingList, isSettingsNoComplete }
