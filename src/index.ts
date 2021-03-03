import DBHelper from './utils/DBHelper'
import { getCookieJar, getLatestCookies } from './utils/login'
import { TemplatePlugin } from './types/utools'
import { featuresFun, featuresList, isNoFeatures } from './features/index'
import { settingsNameList, generateSettingList, isSettingsNoComplete } from './utils/settings'
import { initializeLoadingBar, loadingBar } from './utils/loadingBar'
import { api } from './utils/api'

utools.onPluginReady(() => {
  initializeLoadingBar()
  if (isSettingsNoComplete()) return
  getLatestCookies()
})

const getList = async (feature: string) => {
  try {
    loadingBar.go(20)
    await getLatestCookies()
    loadingBar.go(60)
    const list = await featuresFun[feature]()
    loadingBar.go(100)
    return list
  } catch (error) {
    console.log(error)
    loadingBar.go(0)
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
        const reg = new RegExp(searchWord, 'gi')
        callbackSetList(
          featuresList.filter(
            ({ title, description }) => title.match(reg) || description.match(reg),
          ),
        )
      },
      select: async (action, { title, url }, callbackSetList) => {
        if (isSettingsNoComplete()) {
          utools.showNotification('设置不全，请填写所有设置项')
          return
        }
        if (isNoFeatures(title)) return
        if (url) {
          const cookie = await getCookieJar().getCookieString(api.authServer)
          utools.ubrowser.goto(url, { cookie }).run({ width: 1200, height: 800 })
          return
        }

        const list = await getList(title)
        list && callbackSetList(list)
        utools.subInputBlur()
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
      placeholder: 'Please enter username or password, Press enter to set',
    },
  },
}

window.exports = preload
