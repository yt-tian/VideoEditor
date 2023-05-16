<template>
  <div class="tabs">

    <el-menu
        default-active="2"
        class="el-menu-vertical-demo el-boder"
        @open="handleOpen"
        @close="handleClose"
      >
      <el-menu-item index="1">
          <el-icon><DataAnalysis/></el-icon>
          <span>工作台</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><location /></el-icon>
            <span>创意中心</span>
          </template>
            <el-menu-item index="1-1">创意工程</el-menu-item>
            <el-menu-item index="1-2"  @click="()=>materialChange()">视频素材</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="3" @click="()=>videoChange()">
          <el-icon><Mic /></el-icon>
          <span>音频库</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><setting /></el-icon>
          <span>AI文案</span>
        </el-menu-item>
      </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    materialChange() {
      this.$router.push('/workTable/material')
    },
    videoChange(){
      this.$router.push('/home/video')
    }
  },
}
</script>
<style scoped lang="less">
.tabs {
  width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  :deep(.el-boder) {
    margin: 0 20px;
    width: 150px;
    border-right: none;
  }
}

.el-menu-item.is-active {
  color: #2254F4;
  ;
}

.el-submenu .el-menu-item {
  min-width: 0;
}
</style>
  