import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/manage/login',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/manage/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/manage/logout',
    method: 'get'
  })
}

export function getImageCode() {
  return request({
    url: '/manage/auth/captcha.jpg',
    method: 'get'
  })
}

