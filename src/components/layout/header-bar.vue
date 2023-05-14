<template>
   <div class="header">
      <div class="logo-box">
        <img src="../../assets/images/logo.png" alt="">
        <img src="../../assets/images/admin.png" alt="" @click="()=> register()">
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'header-bar',
    data() {
      return {
      }
    },
    mounted() {

    },
    methods: {
      register(){
        this.$router.push('./auth')
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped="less">
  .header {
  width: 100%;
  margin: 0 auto;
  height: 46px;
  line-height: 23px;
  border-bottom: 1px solid #e3e4e5;
}
.logo-box {
  display: flex;
  justify-content: space-between;
  padding: 13px 15px;
}</style>
  