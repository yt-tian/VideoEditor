<template>
  <div class="tabs">
    <div 
      class="tabs-item  "
      v-for="(item, i) of tabList"
      :key="i"
      :class="item.isActive ? 'active' : ''"
      @click="tabClick(i)"
    >
      <img class="icon" :src="require(`@/assets/images/${item.icon}.png`)" alt="">
      <div class="txt">{{ item.txt }}</div>
    </div>
    <!-- <div class="tabs-item">
      <img class="icon" src="../../assets/text.png" alt="">
      <div class="txt">文案</div>
    </div> -->
  </div>
</template>
<script>
import { require } from '@/utils/require'
export default {
  data() {
    return {
      require,
      tabList: [
        { icon: 'video', txt: '视频', path: '/home/video', isActive: true },
        { icon: 'text', txt: '文案', path: '/home/official', isActive: false }
      ]
    }
  },
  computed:{

  },
  mounted(){

  },
  methods:{
    tabClick(i) {
      this.tabList.forEach((item, index) => {
        item.isActive = i === index;
        if (i === index) {
          this.$router.push(item.path);
        }
      });
    }
  },
}
</script>
<style scoped>
.tabs {
  width: var(--side-width);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.active {
  background-color: #eaebec;
  border-radius: 5px;
}
.tabs-item {
  width: 44px;
  height: 50px;
  font-size: 12px;
  line-height: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px 0px;
  cursor: pointer;
}
.icon{
  padding-top: 6px;
}
</style>
