export const extractInputValueByStr = (str: string, name: string): string =>
  str.match(new RegExp(`(?<=\\<input.*name="${name}".*value=\\").*?(?=\\")`, 'gi'))[0]
