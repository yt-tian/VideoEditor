<template>
  <div class="rightBox">
    <div class="get-official">
      <p>文案生成</p>
      <span class="getChannel">内容需求</span>
      <input type="text" class="inputTitle" v-model="keyword">
    </div>
    <div class="get-official-footer">
      <!-- <button class="stop">停止</button> -->
      <button class="crawl" @click="submit">点击生成</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'video-search',
  data() {
    return {
      keyword: "新能源",
    }
  },
  computed:{

  },
  mounted(){

  },
  methods:{
    submit() {
      console.log("AI文案：",this.keyword);
      this.$emit('searchOfficialHander', this.keyword)
    }
  }
}
</script>
<style scoped>
.inputTitle {
  width: 96%;
  height: 197px;
  border-radius: 5px;
  outline: none;
  border: none;
  background-color: #f6f7f9;
}
.crawl {
  width: 254px;
  height: 50px;
  border-radius: 100px;
  border: none;
  color: #fff;
  cursor: pointer;
  background-image: linear-gradient(to right, #2357f5, #2b72f7, #3daafd);
}
.get-official-footer {
  border-top: 1px solid #D8D8D8;
  height: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.getChannel {
  display: flex;
  text-align: center;
  margin: 15px 0;
  font-size: 12px;
}

.getChannel::before {
  content: '*';
  color: red;
}
.rightBox {
  position: relative;
  width: 100%;
  height: 100%;
  /* border-right: 1px solid #e3e4e5; */
  /* border-bottom: 1px solid #e3e4e5; */
}

.get-official {
  height: calc(100% - 136px);
  padding: 30px 20px 0 20px;
}

.get-official p {
  font-family: Source Han Sans CN;
  font-size: 20px;
  color: #333333;
  text-align: left;
  font-weight: 500;
  margin-bottom: 15px
}

.container {
  height: 740px;
  display: flex;
  flex-wrap: wrap;
  /* border: 1px solid pink; */
  justify-content: space-around;
  overflow-y: scroll;
  direction: right;
  /* align-items: center; */

}

.container>li {
  position: relative;
  /* width: 240px; */
  height: 320px;
  margin-right: 20px;
  margin-bottom: 30px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  /* width: calc((75% - 20px) / 4); */
  background: url(../../assets/images/transpant.png);
  /* opacity: .8; */
}

.container>li:nth-of-type(4n+0) {
  /* margin-right: 0; */
}

.container>li .video {
  width: 240px;
  height: 320px;
  z-index: 99;
}
.importMaterial {
  position: absolute;
  bottom: 50%;
  left: 28%;
  font-size: 12px;
  margin: 0 auto;
  border: none;
  border-radius: 50px;
  background-color: #ffffff;
}
</style>
