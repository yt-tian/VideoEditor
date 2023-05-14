<template>
  <div class="rightBox">
    <div class="getVideo">
      <p>视频获取</p>
      <span class="getChannel">获取渠道</span>
      <div class="getChannelCheckout">
        <el-checkbox-group v-model="checkList">
          <el-checkbox border
            v-for="(item, index) of checkBoxList" 
            @change="handleCheckChange(index)"
            size="small" 
            :key="index" 
            min="1"
            :label="item"
            ></el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- <span class="getChannel">点赞量</span> -->
      <div style="text-align: start;margin-top: 10px;">
        <!-- <input class="mum" v-model="minimum"> 一 <input class="mum" v-model="maximum"> -->
        <span class="getChannel">主标题</span>
        <input type="text" class="inputTitle" v-model="keyword">
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
  name: 'video-search',
  data() {
    return {
      minimum: 0,
      maximum: 99999,
      keyword: "新能源",
      checkList: ['抖音'],
      checkBoxList: ['抖音', '快手', '腾讯视频号', '拼多多', '淘宝', '天猫', '京东', '1688'],
      videoList: [],
    }
  },
  computed:{

  },
  mounted(){

  },
  methods:{
     handleCheckChange(idx){
      console.log("index",idx);
      // if(idx == 0){
      //   request({
      //     method: 'POST',
      //     url: '/get_video_douyin',
      //     data: {
      //       "num": 20,
      //       "sindex": 0
      //     }
      //   }).then(res => {
      //     console.log(res.data);
      //     this.videoList = res.data
      //   })
      // }
    },
    submit() {
      console.log(this.checkList);
      this.$emit('searchHandler', this.checkList, this.keyword)
    }
  }
}
</script>
<style scoped>
.crawl {
  width: 254px;
  height: 50px;
  border-radius: 100px;
  border: none;
  color: #fff;
  cursor: pointer;
  background-image: linear-gradient(to right, #2357f5, #2b72f7, #3daafd);
}
.getVideoFooter {
  border-top: 1px solid #D8D8D8;
  height: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.inputTitle {
  width: 96%;
  height: 30px;
  border-radius: 5px;
  outline: none;
  border: none;
  border: 1px solid #333;
}
.mum {
  width: 40px;
  height: 22px;
  border-radius: 5px;
  padding: 5px 8px;
  text-align: center;
  border: none;
  outline: none;
  background: #F6F7F9;
}
 .getChannelCheckout {
  display: flex;
  justify-content: space-around;
  }
  .getChannelCheckout .el-checkbox{
    margin-right: 12px;
    margin-bottom:10px ;
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

.getVideo {
  height: calc(100% - 136px);
  padding: 30px 20px 0 20px;
}

.getVideo p {
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
