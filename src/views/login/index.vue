<template>
  <div class="login-container">
    <div class="login-right">
      <div class="title-container">
        <h3 class="title">
          社区后台管理系统登录
        </h3>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="loginForm">
          <span slot="label"><i slot="prefix" class=""><svg-icon icon-class="user" /></i> 用户名登录</span>
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            label-position="left"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="账号"
                name="username"
                type="text"
                autocomplete="off"
              >
                <i slot="prefix" class="">
                  <svg-icon icon-class="user1" />
                </i>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                placeholder="密码"
                name="password"
                type="password"
              >
                <i slot="prefix" class="">
                  <svg-icon icon-class="密码" />
                </i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-col :span="12" style="overflow:hidden">
                <el-form-item prop="captcha">
                  <el-input
                    v-model="loginForm.code"
                    type="test"
                    auto-complete="off"
                    placeholder="请输入验证码"
                    style="width: 100%;"
                    @keyup.enter.native="handleLogin"
                  />
                </el-form-item>
              </el-col>

              <el-col class="line" :span="1">&nbsp;</el-col>
              <el-col :span="11">
                <el-form-item>
                  <img
                    style="width: 85%;height: 35px;float: right;"
                    class="pointer"
                    :src="src"
                    alt=""
                    @click="refreshCaptcha"
                  >
                </el-form-item>
              </el-col>
            </el-form-item>

            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleLogin"
            >
              登录
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>

    </div>

  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getImageCode } from '@/api/login'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
        key: '',
        token: '',
        code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      activeName: 'loginForm',
      src: '',
      isShow: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.refreshCaptcha()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    refreshCaptcha: function() {
      getImageCode().then(res => {
        console.log('imgcode:' + JSON.stringify(res))
        this.src = res.data.img
        this.loginForm.key = res.data.key
      })
    },
    handleClick(tab, event) {
      this.$refs[tab.paneName].resetFields()
    }
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  /*background-image: url(https://img2018.cnblogs.com/blog/1211637/201908/1211637-20190809112720089-1507550740.png);*/
  background-image: url('../../assets/63048029b07252112f0033e8e3c52865.jpg');
  /*background: red;*/
  background-size: cover;

  .login-right {
    width: 30%;
    padding: 50px;
    border-radius: 6px;
    background: #ffffff;

    .title {
      margin: 0 auto 30px auto;
      text-align: center;
      color: #505458;
    }

    .login-form {
      height: 50%;
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    .other-login {
      margin-top: 3vh;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .other-icon {
      cursor: pointer;
      margin-left: 5px;
      fill: rgba(0, 0, 0, .2);
    }

    .other-icon:hover {
      fill: rebeccapurple;
    }

    .other-login .other-way {
      font-size: 14px;
      color: #515a6e;
      width: calc(100% - 56px)
    }

    .register {
      float: right;
      color: #1ab2ff;
      font-size: 14px;
      cursor: pointer;
      text-align: right;
    }

    .login-select {
      margin-left: 100px;
      margin-bottom: 13px;

      input {
        color: #333;
        font-size: 14px;
        font-weight: 400;
        border: none;
      }
    }
  }

}
</style>
