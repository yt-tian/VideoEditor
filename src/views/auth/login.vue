<template>
  <div>
    <div class="login-page">
      <div class="input-wrap">
        <input type="text" placeholder="请输入账号" v-model="userName" />
      </div>
      <div class="input-wrap">
        <input
          :type="isShowPwd ? 'text' : 'password'"
          placeholder="请输入密码"
          v-model="passWord"
        />
        <i class="eyes" @click="() => (this.isShowPwd = !this.isShowPwd)"></i>
      </div>
    </div>
    <div class="forget">
      <span @click="() => $router.push('/auth/register')">注册用户</span>
      <span @click="() => $router.push('/auth/forgetPwd')">忘记密码？</span>
    </div>
    <div class="loginBtn">
      <button @click="() => loginHandler()">登录</button>
    </div>
  </div>
</template>
<script>
import { login } from '@/api/auth';

export default {
  data() {
    return {
      userName: '',
      passWord: '',
      isShowPwd: false
    }
  },
  computed: {},
  mounted() {},
  methods: {
    loginHandler() {
      login(this.userName, this.passWord)
        .then((res) => {
          console.log('登录：', res.data)
          const token = res.data.data.token
          sessionStorage.setItem('Authorization', token)
          if (res.data.code == 200) {
            this.$router.push('/home/video')
            this.$message({
              message: '登录成功！',
              type: 'success'
            })
          }
          if(res.data.code == 403) {
            this.$message({
              message: '登录失败，请先注册用户',
              type: 'error'
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
<style scoped lang="less">
input {
  height: 100%;
  width: calc(100% - 10px);
  text-align: left;
  background: none;
  border: none;
  color: #fff;
  font-size: 12px;
  outline: none;
}

input::-webkit-input-placeholder {
  color: #fff;
  font-size: 14px;
}

.login-page {
  position: relative;
  .input-wrap {
    position: relative;
    height: 55px;
    padding-left: 10px;
    border-bottom: 0.5px solid #646464;
    .eyes {
      position: absolute;
      right: 24px;
      top: 50%;
      display: inline-block;
      width: 30px;
      height: 30px;
      margin-top: -15px;
      background: url(../../assets/images/eyes.png) center center no-repeat;
      cursor: pointer;
    }
  }
}
.forget {
  display: flex;
  justify-content: space-between;
  height: 50px;
  margin: 10px 0;
  font-size: 14px;
  line-height: 50px;
  color: #fff;

  > button {
    width: 30%;
    color: #fff;
    border: none;
    height: 40px;
    margin-top: 12px;
    border-radius: 5px;
    cursor: pointer;
    background-color: #2254f4;
  }

  span {
    cursor: pointer;
  }

  span:hover {
    color: #3354f4;
  }
}

.loginBtn {
  width: 100%;
  height: 48px;

  > button {
    width: 100%;
    color: #fff;
    height: 40px;
    border: none;
    margin: 24px 0;
    cursor: pointer;
    background-color: #2254f4;
  }
}
</style>
