import request from '@/utils/request'
// 分页获取公告
export function getList(params) {
  return request({
    url: '/manage/back/notice',
    method: 'get',
    params
  })
}
// 新增公告
export function addNotice(data) {
  return request({
    url: '/manage/back/notice',
    method: 'post',
    data
  })
}
// 批量删除公告
export function batchDeleteNotice(data) {
  return request({
    url: '/manage/back/notice',
    method: 'delete',
    data
  })
}
