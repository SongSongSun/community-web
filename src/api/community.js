import request from '@/utils/request'

/** ****************************** 公告模块   **************************************/
// 分页获取公告
export function pageNoticeList(params) {
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

/** ****************************** 楼栋模块   **************************************/
// 分页获取楼栋
export function pageBuildingList(params) {
  return request({
    url: '/manage/building',
    method: 'get',
    params
  })
}
// 新增楼栋
export function addBuilding(data) {
  return request({
    url: '/manage/building',
    method: 'post',
    data
  })
}
/** ****************************** 社区用户模块   **************************************/
// 分页获取社区用户
export function pageCommunityUserList(params) {
  return request({
    url: '/manage/community-user',
    method: 'get',
    params
  })
}

// 新增社区用户
export function addCommunityUser(data) {
  return request({
    url: '/manage/community-user',
    method: 'post',
    data
  })
}
// 重置社区用户用户名密码
export function resetAccount(params) {
  return request({
    url: '/manage/community-user/reset',
    method: 'get',
    params
  })
}

// 迁出社区用户
export function deleteCommunityUser(data) {
  return request({
    url: '/manage/community-user',
    method: 'delete',
    data
  })
}
