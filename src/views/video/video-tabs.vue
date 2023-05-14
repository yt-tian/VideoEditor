<template>
  <ul class="video-tabs">
    <li v-for="(item, i) of tabs" :key="i" class="tab-item" :class="item.active ? 'active':''" @click="tabChange(item)">
      <span :class="item.active ? 'activeBG':''"></span>{{ item.name }}
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => []
    }
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
    tabChange(item) {
      this.$emit('tabChange', item)
    }
  },
}
</script>
<style scoped lang="less">
.video-tabs {
  height:var(--tab-height);
  display: flex;
  justify-content: center;
  align-items: center;
  .tab-item {
    padding: 0 12px;
    height: 34px;
    border: none;
    display: flex;
    cursor: pointer;
    border-radius: 40px;
    justify-content: center;
    align-items: center;
  }

  .tab-item + .tab-item {
    margin-left: 20px;
  }

  .active {
    color: #fff;
    background-color: #2254f4;
  }

  .activeBG {
    width: 20px;
    height: 20px;
    background: url(../../assets/images/tabs.png) center center no-repeat;
  }
}

</style>
