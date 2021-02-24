import DBHelper from './Helper/DBHelper'
import { getLatestCookies } from './login'
import { TemplatePlugin } from './types/utools'
import { featuresFun, featuresList, isNoFeatures } from './features/index'
import { settingsNameList, generateSettingList, isSettingsNoComplete } from './userInfo'

utools.onPluginReady(() => {
  if (isSettingsNoComplete()) return
  getLatestCookies()
})

const getList = async (feature: string) => {
  try {
    await getLatestCookies()
    const list = await featuresFun[feature]()
    return list
  } catch (error) {
    utools.showNotification(`获取${feature}失败: ${error.message}`)
  }
}

const preload: TemplatePlugin = {
  jlu: {
    mode: 'list',
    args: {
      enter: (action, callbackSetList) => {
        callbackSetList(featuresList)
      },
      search: (action, searchWord, callbackSetList) => {
        callbackSetList(featuresList.filter(({ title }) => title.includes(searchWord)))
      },
      select: async (action, { title }, callbackSetList) => {
        if (isSettingsNoComplete()) {
          utools.showNotification('设置不全，请填写所有设置项')
          return
        }
        if (isNoFeatures(title)) return

        const list = await getList(title)
        list && callbackSetList(list)
      },
      placeholder: 'search',
    },
  },
  jluSetting: {
    mode: 'list',
    args: {
      enter: (action, callbackSetList) => {
        callbackSetList([...generateSettingList(settingsNameList)])
      },
      search: (action, searchWord, callbackSetList) => {
        callbackSetList([...generateSettingList(settingsNameList, searchWord)])
      },
      select: async (action, { title, data }) => {
        if (settingsNameList.includes(title)) {
          DBHelper.set({ id: title, value: data })
          utools.showNotification(`设置${title}成功`)
        }
      },
      placeholder: 'search',
    },
  },
}

window.exports = preload
