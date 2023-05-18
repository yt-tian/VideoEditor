<template>
  <div class="video-page">
    <div class="video-search">
      <VideoSearch @searchHandler="searchHandler" />
    </div>
    <div class="video-list">
      <div v-if="list.length" style="height: 100%;">
        <VideoTabs :tabs="videoTabs" @tabChange="tabChange" />
        <VideoList :list="list" @climbMore="climbMore" />
      </div>
      <div style="height: 100%;" v-else>
        <emptyVideo v-if="!isLoading"/>
        <div class="loading-img" v-if="isLoading">
          <!-- <img  src="../../assets/images/loading.gif" alt=""> -->
          <div><el-icon><Loading /></el-icon></div>
          Loading...
          <Loading/>
        </div>
      </div>
      <!-- <img src="../../assets/images/loading" alt=""> -->
    </div>
  </div>
</template>
<script>
import VideoSearch from "./video-search.vue";
import VideoList from "./video-list.vue";
import emptyVideo from "./empty-video.vue";
import VideoTabs from "./video-tabs.vue";
import Loading from "../../components/loading.vue";

// 数量达到请求点  终止请求
// error的情况下  终止请求
// 20条，请求超过5分钟，请求超时，终止请求
// 爬取更多怎么传,sindex最多只能请求20条

// 接口返回的参数里面需要有:
/**
 * {
 *  msg: '',
 *  code: '',
 *  data: {}
 * }
 * 
 */
import {
  getVideos,
  // getVideoList,
  // generateVideoList,
  // getKuaishouVideoList,
} from "@/api/index";
import { sleep } from '@/utils/index'
import { ElMessage  } from 'element-plus';
// 模拟视频列表数据
// const mokeList = [
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
//   { Path: "../../assets/video/video1.mp4", importMaterial: "title" },
// ];

export default {
  components: {
    VideoSearch,
    VideoList,
    emptyVideo,
    VideoTabs,
    Loading,
  },
  data() {
    return {
      list: [],
      num: 20,
      startTime: 0,
      videoTabs: [{ name: "抖音", active: true }],
      checkVal: '',
      keyword: '',
      pageSize: 20,
      pageNum: 1,
      moreRequest: false, // 点击爬取更多的时候， 防止暴力点击
      isLoading:false,
      IsHighVideo:true,
      SizeType:0,
      SortType:1
    };
  },
  computed: {},
  mounted() { 
    console.log('import.meta.env的内容',import.meta.env)
  },
  methods: {
    async searchHandler(checkList, keyword) {
      this.isLoading = true;
      this.list = [];
      this.keyword = keyword;
      this.videoTabs = checkList.map(v => ({ name: v, active: false }));
      this.videoTabs[0].active = true;
      this.startTime = new Date().getTime();
      this.checkVal = checkList[0]
      this.getVideoList([this.checkVal], keyword);
      console.log("checkList: " + checkList, "keyword: " + keyword);
      // this.list = mokeList
      // const [douyinlist, kuaishoulist] = await Promise.all([getVideoList(keyword), getVideoList(keyword)]);
    },
    tabChange(tabData) {
      this.startTime = new Date().getTime();
      this.list = [];
      this.isLoading = true;
      this.checkVal = tabData.name
      this.videoTabs.forEach((item) => {
        item.active = tabData.name === item.name;
      });
      this.getVideoList([tabData.name], this.keyword);
    },
    climbMore() {
      this.startTime = new Date().getTime();
      console.log("climbMore");
      if (!this.moreRequest) {
        this.pageNum++;
        this.getVideoList(this.IsHighVideo,this.SizeType,this.SortType,[this.checkVal], this.keyword, this.list.length);
        this.moreRequest = true;
      }
    },
    async getVideoList(IsHighVideo,SizeType,SortType,checkList, keyword, sindex = 0) {
      // 校验时间上是否超过5分钟, 超过五分钟结束调用
      if (new Date().getTime() - this.startTime > 5 * 60 * 1000) {
        ElMessage.info('请求超时!');
        return;
      }
      const res = await getVideos(IsHighVideo,SizeType,SortType,checkList, keyword, sindex).catch(() => {
        this.moreRequest = false;
      });
      console.log("res:",res);
      // if (res.status !== 200) {
      //   console.log("httpCode");
      //   this.moreRequest = false;
      //   return;
      // }
      // console.log("爬取数据", list);
      if (Array.isArray(res.data.data) && res.data.data.length) {
        this.list.push(...res.data.data);
      } else {
        if (new Date().getTime() - this.startTime > 1 * 60 * 1000) {
          ElMessage.info('没有该资源了哦!');
          this.isLoading = false
          return;
        }
        await sleep(5000);
      }
      console.log("爬取数据this.list:", this.list);
      if (this.list.length < this.num * this.pageNum) {
        this.getVideoList(checkList, keyword, this.list.length);
      } else {
        this.moreRequest = false;
      }
    },

  },
};
</script>
<style scoped lang="less">
.video-page {
  flex: 1;
  display: flex;
  height: 100%;
}

.video-search {
  width: 300px;
  border-right: 1px solid #e3e4e5;
}

.video-list {
  flex: 1;
}
.loading-img{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  .el-icon-loading{
  // width: 100px;
  font-size:30px;
  color: #3798fb;
  // height: 100px;
}
}

</style>
