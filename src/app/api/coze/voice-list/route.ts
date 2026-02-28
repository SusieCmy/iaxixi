import { CozeAPI } from '@coze/api'

const _client = new CozeAPI({
  token: process.env.COZE_PAT || '', // 替换为你的 PAT
  baseURL: 'https://api.coze.cn', // 国内环境使用该地址
})
