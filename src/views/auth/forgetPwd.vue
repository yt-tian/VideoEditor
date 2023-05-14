<template>
  <div>
    <div class="login-page">
      <div class="input-wrap">
        <input type="text" v-model="username" placeholder="请输入手机号" />
      </div>
      <div class="input-wrap">
        <input :type="isShowPwd ? 'text' : 'password'" v-model="password" placeholder="请输入新密码" />
        <i class="eyes" @click="() => (this.isShowPwd = !this.isShowPwd)"></i>
      </div>
    </div>
    <div class="forget">
      <input type="text" placeholder="验证码" style="width: 66%" />
      <button>获取验证码</button>
    </div>
    <div class="loginBtn">
      <button @click="() => loginHandler()">登录</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  computed: {},
  mounted() {
   
  },
  methods: {
    loginHandler() {

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
