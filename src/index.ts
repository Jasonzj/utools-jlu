import DBHelper from './utils/DBHelper'
import { getLatestCookies } from './utils/login'
import { TemplatePlugin } from './types/utools'
import { featuresFunMap, subFeaturesFunMap, featuresList, isNoFeatures } from './features/index'
import { settingsNameList, generateSettingList, isSettingsNoComplete } from './utils/settings'
import { initializeLoadingBar, loadingBar } from './utils/loadingBar'
import openBrowserByUrl from './features/openBrowserByUrl'

utools.onPluginReady(() => {
  initializeLoadingBar()
  // if (isSettingsNoComplete()) return
  // getLatestCookies()
})

const getList = async (feature: string, subArgument: Record<string, unknown> | undefined) => {
  try {
    const funMap = subArgument ? subFeaturesFunMap : featuresFunMap
    loadingBar.go(20)
    if (!subArgument) await getLatestCookies()
    loadingBar.go(60)
    const list = await funMap[feature](subArgument)
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
      select: async (action, { title, url, feature, subArgument, cookieUrl }, callbackSetList) => {
        feature = feature || title
        if (isSettingsNoComplete()) {
          utools.showNotification('设置不全，请填写所有设置项')
          return
        }
        if (url) {
          openBrowserByUrl(url, cookieUrl)
          return
        }
        if (isNoFeatures(feature)) return

        const list = await getList(feature, subArgument)
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
