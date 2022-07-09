/* 用户相关请求模块 */
import request from '@/utils/request'
/* 请求联想列表数据 */
export const getSearchSuggestions = q => {
  return request({
    method: 'get',
    url: '/v1_0/suggestion',
    params: { q }
  })
}
// 请求结果列表数据
export const getSearchResult = params => {
  return request({
    method: 'get',
    url: '/v1_0/search',
    params
  })
}
