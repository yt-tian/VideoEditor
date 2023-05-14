<template>
  <div class="layout">
    <div class="header-wrap">
      <header-bar></header-bar>
    </div>
    <div class="content">
      <div class="left">
        <aside-bar></aside-bar>
      </div>
      <div class="right">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
import headerBar from './header-bar.vue'
import asideBar from './aside-bar.vue'
export default {
  components:{
    headerBar,
    asideBar
  },
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
<style scoped>
.layout {
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
    width: var(--side-width);
    border-right: 1px solid #e3e4e5;
    height: 100%;
  }
  .content .right {
    width: calc(100% - var(--side-width));
  }
</style>
