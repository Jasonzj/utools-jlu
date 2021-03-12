/**
 * @type { import ('./src/types/utools').PluginConfig }
 */
const PluginConfig = {
  pluginName: 'jlu',
  description: '提供我的吉珠信息查询',
  preload: 'preload.js',
  author: 'jasonzj',
  version: '0.0.1',
  logo: 'assets/logo.png',
  features: [
    {
      code: 'jlu',
      explain: 'jlu features',
      cmds: ['jlu'],
    },
    {
      code: 'jluSetting',
      explain: 'jlu设置',
      cmds: ['jluSetting'],
    },
  ],
}

export default PluginConfig
