<template>
  <div class="login-page">
    <img src="../../assets/images/logo.png" alt="" class="login-logo">
    <div class="form-wrap">
      <div class="form-box">
        <h2>视频智能创意平台</h2>
        <RouterView />
        <p>登录及同意 <a href="">用户协议</a> 与 <a href="">隐私政策</a></p>
      </div>
    </div>
  </div>
</template>
<script>
import { RouterView } from 'vue-router'
export default {
  components: {
    RouterView,
  },
  data() {
    return {

    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {

  },
}
</script>
<style scoped lang="less">
.login-page {
  width: 100%;
  height: 100%;
  background: url(../../assets/images/login.png)center center no-repeat;
  background-size: cover;

  .login-logo {
    margin: 60px 0 0 60px;
  }

  .form-wrap {
    display: flex;
    justify-content: right;
    align-items: center;
    width: 100%;
    height: calc(100% - 84px);

    .form-box {
      width: 400px;
      height: 450px;
      margin-right: 12%;
      padding: 20px;
      h2 {
        color: #fff;
        font-size: 36px;
        text-align: center;
      }
    }
  }
}

p {
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  margin: 10px 0;

  a {
      color: #2254f4;
  }
}


</style>
  