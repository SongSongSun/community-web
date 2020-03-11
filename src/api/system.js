import request from '@/utils/request'
/** ************定时任务模块********************/
// 分页获取定时任务
export function pageJobList(params) {
  return request({
    url: '/manage/job',
    method: 'get',
    params
  })
}

// 删除定时任务
export function deleteJob(data) {
  return request({
    url: '/manage/job',
    method: 'delete',
    data
  })
}

// 暂停定时任务
export function pauseJob(data) {
  return request({
    url: '/manage/job?pause',
    method: 'put',
    data
  })
}

// 恢复定时任务
export function resumeJob(data) {
  return request({
    url: '/manage/job?resume',
    method: 'put',
    data
  })
}

// 恢复定时任务
export function updateJob(data) {
  return request({
    url: '/manage/job?cron',
    method: 'put',
    data
  })
}
