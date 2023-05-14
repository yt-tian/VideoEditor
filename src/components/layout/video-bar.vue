<template>
  <div class="c">
    <div class="getVideo">
      <p>视频获取</p>
      <span class="getChannel">获取渠道</span>
      <div class="getChannelCheckout">
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            border
            v-for="(item, index) of checkBoxList"
            @change="handleCheckChange(index)"
            size="small"
            :key="index"
            min="1"
            :label="item"
          ></el-checkbox>
        </el-checkbox-group>
      </div>
      <span class="getChannel">点赞量</span>
      <div style="text-align: start; margin-top: 10px">
        <input class="mum" v-model="minimum" /> 一 <input class="mum" v-model="maximum" />
        <span class="getChannel">主标题</span>
        <input type="text" class="inputTitle" v-model="something" />
      </div>
    </div>
    <div class="getVideoFooter">
      <!-- <button class="stop">停止</button> -->
      <button class="crawl" @click="submit">点击爬取</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>
<style scoped>
.rightBox {
  position: relative;
  width: 300px;
  border-right: 1px solid #e3e4e5;
  border-bottom: 1px solid #e3e4e5;
}

.rightBox p {
  font-family: Source Han Sans CN;
  font-size: 20px;
  color: #333333;
  text-align: left;
  font-weight: 500;
  margin-bottom: 15px;
}

.getChannel {
  display: flex;
  text-align: center;
  margin: 15px 0;
}

.getChannel::before {
  content: '*';
  color: red;
}
</style>
