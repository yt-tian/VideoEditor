<template>
    <div class="empty-warp">
      <div class="empty">
        <img  src="../../assets/images/official-empty.png" style="border:2px #3333331e dashed" alt="">
        <div class="get-font">AI文案</div>
        <div class="font">快去左侧输入你的创意灵感吧</div>
      </div>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
   
      }
    },
    computed:{
  
    },
    mounted(){
  
    },
    methods:{
  
    },
  }
  </script>
  <style scoped lang="less">
  .empty-warp {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .empty{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 774px;
    height: 563px;
    border-radius: 20px;
    border: 2px #000 dashed;
    .get-font{
      padding: 14px 0 6px 0;
      font-weight: bold;
      font-size: 14px;
    }
    .font{
      font-size: 12px;
    }
  }
  
  </style>
  