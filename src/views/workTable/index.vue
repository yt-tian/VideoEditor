<template>
    <div class="workTable">
      <div class="header-wrap">
        <Headers></Headers>
      </div>
      <div class="content">
        <div class="left">
         <AsideWork></AsideWork>
        </div>
        <div class="right">
          <router-view />
        </div>
      </div>
    </div>
  </template>
  <script>  
import Headers from './header.vue';
import AsideWork from './word-aside.vue';
  export default {
    data() {
      return {
  
      }
    },
    components:{
        Headers,
        AsideWork
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
  .workTable {
    height: 100%;
  }
    .header-wrap{
      height: var(--head-height);
    }
    .content {
      height: calc(100% - var(--head-height) - 1px);
      display: flex;
    }
    .content .left {
      padding:0 20px ;
      width: 150px;
      height: 100%;
    }
    .content .right {
      border-top-left-radius:50px ;
      background-color: #f3f4f8;
      width: calc(100% - var(--side-width));
    }
  </style>
  