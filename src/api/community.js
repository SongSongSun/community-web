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

/** *******************************物业问题管理******************/
// 分页获取物业问题
export function pagePropertyProblemList(params) {
  return request({
    url: '/manage/property-problem',
    method: 'get',
    params
  })
}

// 根据物业问题ID获取图片
export function getPropertyProblemImgById(params) {
  return request({
    url: '/manage/property-problem/img',
    method: 'get',
    params
  })
}
// 根据物业问题ID获取上报人信息
export function getReportUserInfoById(params) {
  return request({
    url: '/manage/property-problem/user-info',
    method: 'get',
    params
  })
}

// 根据物业问题ID更新问题为处理中
export function updateStatusToHandle(params) {
  return request({
    url: '/manage/property-problem/handle',
    method: 'put',
    params
  })
}

// 根据物业问题ID更新问题为已结束
export function updateStatusToFinished(params) {
  return request({
    url: '/manage/property-problem/finish',
    method: 'put',
    params
  })
}

/** *******************************活动管理******************/
// 分页获取活动
export function pageActivity(params) {
  return request({
    url: '/manage/activity',
    method: 'get',
    params
  })
}

// 审核活动
export function approveActivity(data) {
  return request({
    url: '/manage/activity/approve',
    method: 'put',
    data
  })
}
/** *******************************失物招领******************/
// 分页获取失物招领
export function pageLostFound(params) {
  return request({
    url: '/manage/lost-found',
    method: 'get',
    params
  })
}

// 更改失物招领显示状态
export function updateLostFound(data) {
  return request({
    url: '/manage/lost-found',
    method: 'put',
    data
  })
}

/** *******************************社区新闻******************/
// 分页获取社区新闻
export function pageCommunityNews(params) {
  return request({
    url: '/manage/community-news',
    method: 'get',
    params
  })
}

// 创建社区新闻
export function createCommunityNews(data) {
  return request({
    url: '/manage/community-news',
    method: 'post',
    data
  })
}

// 更改社区新闻显示状态
export function updateCommunityNews(data) {
  return request({
    url: '/manage/community-news',
    method: 'put',
    data
  })
}
