<template>
  <div class="container">
    <div class="video-list" ref="videListRef">
      <div class="search">
        <el-icon class="search-icon">
          <Search />
        </el-icon>
        <input type="text" name="" id="" v-model="keyword" @keyup.enter="searchVideo()" placeholder="搜索关键词">
      </div>
      <div class="screening-item">
        <ul>
          <li>
            <i>媒体分类</i>
            <span v-for="(item, index) in mediaClassification" :class="item.isActive ? 'all' : ''"
              @click="() => tabClick(index)" :key="index">
              <img :src="getAssetsImgs(`${item.img}.png`)" v-if="index != 0" style="vertical-align: middle;"> {{
                item.title }}</span>
          </li>
          <li>
            <i>版式</i>
            <span v-for="(item, index) in layoutList" :class="item.isActive ? 'all' : ''"
              @click="() => tabLayoutClick(index)" :key="index">
              {{ item.title }}</span>
          </li>
          <li>
            <i>时长</i>
            <span v-for="(item, index) in durationList" :class="item.isActive ? 'all' : ''"
              @click="() => tabDurationClick(index)" :key="index">{{ item.title }} </span>
          </li>
        </ul>
      </div>
      <div class="upvote-wrap">
        <div class="upvote-left">
          <span v-for="(item, index) in classifyList" @click="() => tabClassifyList(index)"
            :class="item.isActive ? 'fonColor' : ''" :key="index">
            {{ item.title }} <i class="classify-bg bg-default" :class="item.isActive ? 'bg-active' : 'bg-default'"></i>
          </span>
        </div>
        <div class="upvote-right">
          <el-checkbox v-model="checked1" @change="isHighHandle" label="只看高清素材" class="look-High" />
          <button @click="getVideosByDateLimit(0)">不限</button>
          <button @click="getVideosByDateLimit(7)" class="boder-none">一周</button>
          <button @click="getVideosByDateLimit(182)">半年</button>
        </div>
      </div>
      <ul class="wrap" id="VideoWrap" ref="VideoWrap" @scroll="orderScroll($event)" v-if="!Isloading">
        <li v-for="(item, index) in list" :key="index" @click="()=>playVideoChange(item,index)">
          <video class="video" controls muted>
            <source :src="`${appBaseUrl}${item.Path}`" />
          </video>
          
          <img :src="item.ImgUrl" />
          <div class="title-content">
            <p>{{ item.Title }}</p>
            <p>@{{ item.NickName }}</p>
            <div>
              <p><span class="icon heart"></span> {{ item.DianZan }}</p>
              <p> <span class="icon time"></span> {{ item.Created }}</p>
              <!-- <p> <span class="icon time"></span> {{ converDate(item.Created) }}</p> -->
              <p><span class="icon video-num"> </span>{{ item.Bofang }}</p>
            </div>
          </div>
          <div class="trade"><img style="width: 15px; vertical-align: middle;margin-right: 5px;" :src="`${appBaseUrl}${item.Logo}`" alt=""><i>{{ item.VideoType }}</i> </div>
          <button class="importMaterial" @click.stop="materialHander(item, index)">导入素材库</button>
        </li>
      </ul>


    </div>
    <DialogView :title="'导入素材库'" v-model:visible.sync="dialogFormVisible" @updateVisible="updateVisible"
      @resetPopupData="resetPopupData" @submitPopupData="submitPopupData" @handleClose="handleClose" :width="'20%'">
    </DialogView>
    <div class="crawl-more">
      <button class="more" @click="moreChange" v-if="crawlBarFixed">爬取更多</button>
    </div>
    <div v-if="Isloading" class="loading">
      <el-icon>
        <Loading />
      </el-icon>loading...
    </div>
    <div class="videoDialog-wrap">
      <el-dialog v-model="dialogVideoVisible" width="50%" top="3%" id="videoDialog"  :before-close="handleVideoClose">
           <video v-if="dialogVideoVisible" class="video" controls muted autoplay style="height:800px;width: 100%;">
             <source :src="`${appBaseUrl}${videoPath}`" />
           </video>
      </el-dialog>
    </div>
     
  </div>
</template>
<script>
import DialogView from '../../components/Dialog.vue';
import { importMedia } from '../../api/index';
import { getVideos } from "@/api/index";
import WaterFall from '@/utils/WaterFall'
import { sleep } from '@/utils/index';
import { ElMessage } from 'element-plus';
import { getAssetsImgs } from '@/utils';
const appBaseUrl = import.meta.env.VITE_APP_BASE_URL;

export default {
  components: {
    DialogView,
  },
  data() {
    return {
      playVideoPath:'',
      dialogVideoVisible: false,
      getAssetsImgs,
      appBaseUrl,
      tabsK: false,
      num: 20,
      pageNum: 1,
      crawlBarFixed: false, //爬取更多显隐
      dialogFormVisible: false, //导入素材库弹窗显隐
      MediaID: [],
      mediaClassification: [
        { title: '全部', isActive: true, },
        { title: '抖音', img: 'douyin', isActive: false, },
        { title: '快手', img: 'kuaishou', isActive: false, },
        { title: '小红书', img: 'xiaohongshu', isActive: false, },
        { title: '今日头条', img: 'toutiao', isActive: false, },
      ],
      layoutList: [
        { title: '全部', isActive: true, SizeType: 0, },
        { title: '横板', isActive: false, SizeType: 1, },
        { title: '竖版', isActive: false, SizeType: 2, },
      ],
      durationList: [
        { title: '全部', isActive: true, },
        { title: '0-15秒', isActive: false, },
        { title: '15-30秒', isActive: false, },
        { title: '30-60秒', isActive: false, },
        { title: '60秒以上', isActive: false, },
      ],
      classifyList: [
        { title: '点赞量', isActive: true, SortType: 1, },
        { title: '最新发布', isActive: false, SortType: 2, },
      ],
      MediaType: 'video',
      keyword: '冰丝裤',
      list: [
        // {
        //   "Created": "2023-05-17T22:11:09.949+08:00",
        //   "Duration": 0,
        //   "FileName": "89Eq9HEDWCIZOHejjCV1bxzrk3yJLglj.mp4",
        //   "Heigth": 0,
        //   "Keyword": "汽车",
        //   "Path": "reptile_video/douyin/汽车/89Eq9HEDWCIZOHejjCV1bxzrk3yJLglj.mp4",
        //   "Size": 0,
        //   "Status": 0,
        //   "Title": "太多人看新车了，我只能努力往里凑！ #抖音车王争霸赛    @抖音汽车",
        //   "VideoType": "抖音",
        //   "Width": 0,
        //   "_id": "6464e07ddd8dc552879598ec",
        //   "updated": "2023-05-17T22:11:09.949+08:00"
        // },
        // {
        //   "Created": "2023-05-17T22:11:27.162+08:00",
        //   "Duration": 0,
        //   "FileName": "54CbeLmxaVWZFhv548oSqP8EarEoRo3J.mp4",
        //   "Heigth": 0,
        //   "Keyword": "汽车",
        //   "Path": "reptile_video/douyin/汽车/54CbeLmxaVWZFhv548oSqP8EarEoRo3J.mp4",
        //   "Size": 0,
        //   "Status": 0,
        //   "Title": "看我虚晃一招 #2020广州国际车展  #2020抖音汽车影响力创作者 @抖音汽车",
        //   "VideoType": "抖音",
        //   "Width": 0,
        //   "_id": "6464e08fdd8dc552879598ed",
        //   "updated": "2023-05-17T22:11:27.162+08:00"
        // },
        // {
        //   "Created": "2023-05-17T22:11:30.627+08:00",
        //   "Duration": 0,
        //   "FileName": "owoEa4EvZdR9Lya3M3CdQq4AEjziyqRf.mp4",
        //   "Heigth": 0,
        //   "Keyword": "汽车",
        //   "Path": "reptile_video/douyin/汽车/owoEa4EvZdR9Lya3M3CdQq4AEjziyqRf.mp4",
        //   "Size": 0,
        //   "Status": 0,
        //   "Title": "顺便美个甲 #2021上海国际车展 #评车打卡挑战#我的花样车生活 @抖音汽车  #首发新车攻略",
        //   "VideoType": "抖音",
        //   "Width": 0,
        //   "_id": "6464e092dd8dc552879598ee",
        //   "updated": "2023-05-17T22:11:30.627+08:00"
        // },
        // {
        //   "Created": "2023-05-17T22:11:32.002+08:00",
        //   "Duration": 0,
        //   "FileName": "l81vU8cQgwkYfmWL0lnJxNkAM9rU1GjX.mp4",
        //   "Heigth": 0,
        //   "Keyword": "汽车",
        //   "Path": "reptile_video/douyin/汽车/l81vU8cQgwkYfmWL0lnJxNkAM9rU1GjX.mp4",
        //   "Size": 0,
        //   "Status": 0,
        //   "Title": "为女性设计的汽车应该是什么样的？遇鉴欧拉闪电猫\u0026朋克猫设计美学 @欧拉ORA   @抖音汽车",
        //   "VideoType": "抖音",
        //   "Width": 0,
        //   "_id": "6464e094dd8dc552879598ef",
        //   "updated": "2023-05-17T22:11:32.002+08:00"
        // },
        // {
        //   "Created": "2023-05-17T22:11:33.764+08:00",
        //   "Duration": 0,
        //   "FileName": "256nBmGipKucoizMQWVVqqNYrw4ddR1Z.mp4",
        //   "Heigth": 0,
        //   "Keyword": "汽车",
        //   "Path": "reptile_video/douyin/汽车/256nBmGipKucoizMQWVVqqNYrw4ddR1Z.mp4",
        //   "Size": 0,
        //   "Status": 0,
        //   "Title": "今年村口的车展你准备好了吗？#风行t5evo#型色先锋潮出不一样 #2020抖音汽车影响力创作者@抖音汽车",
        //   "VideoType": "抖音",
        //   "Width": 0,
        //   "_id": "6464e095dd8dc552879598f0",
        //   "updated": "2023-05-17T22:11:33.764+08:00"
        // },
        // {
        //   "Created": "2023-05-17T22:11:37.717+08:00",
        //   "Duration": 0,
        //   "FileName": "pbg1N4vwfCqSiS21tR6vf9cfUEiHCeIn.mp4",
        //   "Heigth": 0,
        //   "Keyword": "汽车",
        //   "Path": "reptile_video/douyin/汽车/pbg1N4vwfCqSiS21tR6vf9cfUEiHCeIn.mp4",
        //   "Size": 0,
        //   "Status": 0,
        //   "Title": "车后排还能干嘛？#星巢计划 #汽车人共创计划 #星巢玩车人 ",
        //   "VideoType": "抖音",
        //   "Width": 0,
        //   "_id": "6464e099dd8dc552879598f1",
        //   "updated": "2023-05-17T22:11:37.717+08:00"
        // },
        // {
        //   "Created": "2023-05-17T22:11:38.084+08:00",
        //   "Duration": 0,
        //   "FileName": "O9s1Y3tMCHEsesqgxyX6Mr4hj1EQAv6U.mp4",
        //   "Heigth": 0,
        //   "Keyword": "汽车",
        //   "Path": "reptile_video/douyin/汽车/O9s1Y3tMCHEsesqgxyX6Mr4hj1EQAv6U.mp4",
        //   "Size": 0,
        //   "Status": 0,
        //   "Title": "BMW i7 M70 终于发布了！中国是BMW 7系 全球第一市场，BMW真的在未来要全面纯电化了吗？ BMW汽车设计与数字化结合的引领者，时代在变迁 科技在发展 未来已来，电影里的即将实现！#宝马 #bmw #全新bmw7系 #宝马中国 #BMWi7M70",
        //   "VideoType": "抖音",
        //   "Width": 0,
        //   "_id": "6464e09add8dc552879598f2",
        //   "updated": "2023-05-17T22:11:38.084+08:00"
        // }
      ],
      checked1: 0,
      IsHighVideo: false,
      DateLimit: 0,
      SizeType: 0,
      SortType: 1,
      Isloading: false,
      videoPath:'',
      VideoType:['抖音'],
    };
  },
  computed: {
    // converDate:function(date){
    //   console.log("converDate",date);
    //   return date;
    // }
  },
  mounted() {
    //window.addEventListener('resize', this.videoLayout.bind(this))
  },
  methods: {
    videoLayout() {
      new WaterFall({
        dom: document.getElementById('VideoWrap'),
        gap: 20,
      });
    },
    moreChange() {
      this.$emit("climbMore");
      this.crawlBarFixed = false;
    },
    // 监听滚动条的位置
    orderScroll() {
      var scrollTop = this.$refs.videListRef.scrollTop;
      const videListHeight = this.$refs.videListRef.getBoundingClientRect().height;
      const videListWrap = this.$refs.VideoWrap.getBoundingClientRect().height;
      // console.log("scrollTop:", scrollTop);
      // console.log("ul height:", this.$refs.VideoWrap.getBoundingClientRect().height);
      if (videListWrap - (scrollTop + videListHeight) < 1) {
        // this.crawlBarFixed = true;
        // getVideos([this.checkBoxList[0]],this.keyword,20).then(res=>{
        //   console.log(res);
        //   this.list.push(...res.data.data);
        // })
      } else {
        this.crawlBarFixed = false;
      }
    },
    materialHander(e) {
      this.MediaID = [e._id];
      this.dialogFormVisible = true;
    },
    // 修改是否让页面显示与隐藏的事件
    updateVisible(val) {
      this.dialogFormVisible = val
    },
    // 点击取消的事件
    async resetPopupData() {
      //  这里可重置数据
      this.dialogFormVisible = false
    },
    // 点击确定的按钮
    async submitPopupData(folderName) {
      console.log(this.MediaID, this.MediaType, folderName);
      importMedia(this.MediaID, folderName, this.MediaType).then(res => {
        console.log("导入素材库返回：", res);
        this.$message({
          message: '导入成功！',
          type: 'success'
        });
        this.$router.push('/workTable')
      }).catch(err => {
        console.log("导入素材库报错：", err);
      })
      this.dialogFormVisible = false
    },
    // 关闭弹框（头部的X）
    handleClose() {
      this.dialogFormVisible = false
    },
    handleVideoClose(){
      this.dialogVideoVisible = false

    },
    async getVideoList(IsHighVideo, SizeType, SortType, checkList, keyword, DateLimit, sindex = 0) {
      // 校验时间上是否超过5分钟, 超过五分钟结束调用
      if (new Date().getTime() - this.startTime > 5 * 60 * 1000) {
        ElMessage.info('请求超时!');
        return;
      }
      
      let res = null;
      for(let i=0;i<24;i++){
        res = await getVideos(IsHighVideo, SizeType, SortType, checkList, keyword, DateLimit, sindex).catch((err) => {
          console.log(err);
          ElMessage.info('网络或系统异常!');
          return;
        });
        if (res.data.data !== '{}') {
          this.Isloading = false;
          break;
          // this.list.push(...res.data.data);
        } else {
          this.Isloading = true;
          await sleep(5000);
        }
      }
      
      // if (res.status !== 200) {
      //   console.log("httpCode");
      //   this.moreRequest = false;
      //   return;
      // }
      // console.log("爬取数据", list);

      if (Array.isArray(res.data.data) && res.data.data.length) {
        this.list = res.data.data;
        //this.$nextTick(this.list = res.data.data);
      } else {
        //if (new Date().getTime() - this.startTime > 1 * 60 * 1000) {
          this.list = [];
          ElMessage.info('没有该资源了哦!');
          this.Isloading = false
          return;
        //}
        //await sleep(5000);
      }
      //this.$nextTick(this.videoLayout.bind(this));
      //await sleep(1000);
      console.log(this.list);
      if (this.list.length < 20) {
        console.log("this.list.length:", this.list.length);
        // this.getVideoList(this.IsHighVideo, this.SizeType, this.SortType, this.VideoType, this.keyword, this.list.length);
      }
    },
    searchVideo() {
      this.VideoType[0] = '抖音';
      this.VideoType[1] = '快手';
      if (this.list.length > 1) {
        this.list = [];
      }
      this.getVideoList(this.IsHighVideo, this.SizeType, this.SortType, this.VideoType, this.keyword, this.DateLimit, this.list.length);
    },
    tabClick(i) {
      this.mediaClassification.forEach((item, index) => {
        item.isActive = i === index;
        if(i == 1) this.VideoType[0] = "抖音";
        if(i == 2) this.VideoType[0] = "快手";
        if (i === index && i !== 0) {
          if (this.list.length > 1) {
            this.list = [];
          }
          this.getVideoList(this.IsHighVideo, this.SizeType, this.SortType, this.VideoType, this.keyword, this.DateLimit, 0);

        }
      });
    },
    tabLayoutClick(i) {
      this.layoutList.forEach((item, index) => {
        item.isActive = i === index;
        this.SizeType = i
        if (this.list.length > 1) {
          this.list = [];
        }
        this.getVideoList(this.IsHighVideo, i, this.SortType, this.VideoType, this.keyword, this.DateLimit, this.num);
      })
    },
    tabDurationClick(i) {
      this.durationList.forEach((item, index) => {
        item.isActive = i === index;
        if (this.list.length > 1) {
          this.list = [];
        }
        // this.getVideoList(this.IsHighVideo,i,this.SortType,[item.title], this.keyword, this.list.length);
      })
    },
    tabClassifyList(i) {
      console.log("tabClassifyList:", i);
      this.classifyList.forEach((item, index) => {
        item.isActive = i === index;
        if (i == 0) this.SortType = 1;
        if (i == 1) this.SortType = 2;
        if (this.list.length > 1) {
          this.list = [];
        }
        this.getVideoList(this.IsHighVideo, this.SizeType, this.SortType, [this.mediaClassification[1].title], this.keyword, this.DateLimit, this.num);
      })
    },
    async getVideosByDateLimit(val) {
      this.DateLimit = val;
      console.log("DateLimit",this.DateLimit);
      this.VideoType[0] = '抖音';
      this.VideoType[1] = '快手';
      // if (this.list.length > 1) {
      //   this.list = [];
      // }
      //this.getVideoList(this.IsHighVideo, this.SizeType, this.SortType, this.VideoType, this.keyword, this.DateLimit, 0);

      let res = null;
      for(let i=0;i<24;i++){
        res = await getVideos(this.IsHighVideo, this.SizeType, this.SortType,this.VideoType, this.keyword, this.DateLimit, 0).catch(() => {});
        if (res.data.data !== '{}') {
          this.Isloading = false;
          break;
          // this.list.push(...res.data.data);
        } else {
          this.Isloading = true;
          await sleep(5000);
        }
      }
      
      // if (res.status !== 200) {
      //   console.log("httpCode");
      //   this.moreRequest = false;
      //   return;
      // }
      // console.log("爬取数据", list);

      if (Array.isArray(res.data.data) && res.data.data.length) {
        this.list = res.data.data;
        //this.$nextTick(this.list = res.data.data);
      } else {
        //if (new Date().getTime() - this.startTime > 1 * 60 * 1000) {
          this.list = [];
          ElMessage.info('没有该资源了哦!');
          this.Isloading = false
          return;
        //}
        //await sleep(5000);
      }
      this.$nextTick(this.videoLayout.bind(this));
    },
    playVideoChange(item,i){
      console.log("item:::::", item,"index*******:",i);
      // this.$nextTick(()=>{
        this.videoPath = item.Path;
      // })
      this.dialogVideoVisible = true;
    },
    isHighHandle(val){
      console.log("isHighHandle",val)
      this.IsHighVideo = val?true:false;
    }
  }
};
</script>
<style scoped lang="less">
.more {
  width: 254px;
  height: 50px;
  border-radius: 100px;
  border: 1px solid #333;
  background-color: #fff;
  cursor: pointer;
}

.crawl-more {
  position: fixed;
  bottom: 0;
  left: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: var(--reduction-height);
}

.importMaterial {
  position: absolute;
  left: 36%;
  top: 50%;
  font-size: 12px;
  border: none;
  border-radius: 15px;
  width: 76px;
  cursor: pointer;
  display: none;
  height: 20px;
  background-color: #fff;
}

.wrap>li:hover .importMaterial {
  display: block;
}

.container {
  height: 100%;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-around;
  background-color: #f3f4f8;
  border-top-left-radius: 50px;

  .wrap>li:last-child {
    // margin:10px calc((100%- 240px * 6 )/ 6 / 2 );
    // margin-right:auto ;
    // margin-right:10px;

  }

  // .wrap::after{
  //   flex: 1;
  // }
  .video-list {
    flex: 1;
    width: 96%;
    background-color: #fff;
    // overflow-y: scroll;
    margin: 24px 28px;
    /* direction: right; */
    border-top-left-radius: 25px;
    padding: 14px;
    height: 100%;

    .upvote-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 18px;
      font-size: 14px;

      .upvote-left {
        >span {
          display: inline-block;
          // width: 70px;
          height: 30px;
          cursor: pointer;

          .classify-bg {
            display: inline-block;
            width: 8px;
            height: 12px;
            margin-right: 4px;
          }

          .bg-default {
            background: url(../../assets/images/up-icon.png) center center no-repeat;
          }

          .bg-active {
            background: url(../../assets/images/up-icon-active.png) center center no-repeat;
          }
        }

        .fonColor {
          color: #1157FC;
        }
      }

      .upvote-right {
        .look-High {
          margin: 0 10px;
        }

        >button {
          background: none;
          outline: none;
          border: none;
          color: #3D3D3D;
          border: 1px solid #ccc;
          padding: 6px 15px;
          border-radius: 2px 0px 0px 2px;
        }

        >.boder-none {
          border-right: none;
          border-left: none;
        }
      }
    }

    >.screening-item {
      border-bottom: 1px solid #cfcfcf;

      ul {
        font-size: 14px;

        li {
          color: #3D3D3D;
          font-size: 14px;
          margin: 8px 0;

          >.all {
            display: inline-block;
            // padding: 5px 10px;
            border-radius: 5px;
            background-color: #dce6ff;
            color: #1157FC;
          }

          >i {
            display: inline-block;
            width: 80px;
          }

          >span {
            padding: 5px 10px;
            cursor: pointer;

            >i {
              position: relative;
              top: 4px;
              margin-right: 4px;
              display: inline-block;
              width: 20px;
              height: 20px;
            }

            >.picture-douyin {
              background: url(../../assets/images/douyin.png) center center no-repeat;
            }

            >.picture-kuaishou {
              background: url(../../assets/images/kuaishou.png) center center no-repeat;
            }

            >.picture-xiaohongshu {
              background: url(../../assets/images/xiaohongshu.png) center center no-repeat;
            }

            >.picture-toutiao {
              background: url(../../assets/images/toutiao.png) center center no-repeat;
            }
          }
        }
      }
    }

    .search {
      height: 34px;
      width: 282px;
      margin: 10px 12px;
      border-radius: 4px;
      box-sizing: border-box;
      border: 1px solid #999;
      padding-left: 10px;

      >.search-icon {
        position: relative;
        top: 4px;
        padding-right: 10px;
        color: #999;
        margin-top: 4px;
      }

      >input {
        border: none;
        outline: none;
      }
    }

    .wrap {
      display: flex;
      flex-wrap: wrap;
      // /* border: 1px solid pink; */
      justify-content: flex-start;
      width: 100%;
      height: calc(100% - 300px);
      overflow-y: scroll;
      // gap: 16px;
      padding-bottom: var(--reduction-height);
      //position: relative;

      >li {

        display: flex;
        flex-wrap: wrap;
        //justify-content: center;
        align-items: center;
        //position: absolute;
        left: 0;
        right: 0;
        width: 240px;
        cursor: pointer;
        margin-right: 24px;

        img {
          width: 100%;
        }

        // margin: 8px;
        //height: 100%;
        // margin-bottom: 30px;
        // border: 1px solid rgba(0, 0, 0, 0.08);

        // background: url(../../assets/images/transpant.png);
        .video {
          width: 240px;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          //height: 100%;
        }

        .trade {
          width: 100%;
          font-size: 14px;
          text-align: left;

          >span {
            display: inline-block;
            width: 30px;
            height: 30px;
            vertical-align: middle;
            background: url(../../assets/images/douyin.png) center center no-repeat;
          }
        }

        .title-content {
          font-size: 14px;
          background-color: #f3f4f8;
          color: #3D3D3D;
          border: 1px solid #eee;
          border-radius: 5px;
          // box-sizing: border-box;

          >p {
            padding: 8px 6px;
          }

          >div {
            display: flex;
            flex-wrap: wrap;

            >p {
              padding: 8px 6px;

              .icon {
                display: inline-block;
                width: 13px;
                height: 12px;
                vertical-align: middle;
              }

              .heart {
                background: url(../../assets/images/heart-icon.png) center center no-repeat;
              }

              .time {
                background: url(../../assets/images/time-icon.png) center center no-repeat;
              }

              .video-num {
                background: url(../../assets/images/video-icon.png) center center no-repeat;
              }
            }
          }

        }
      }

      .seat {
        height: 0;
        background-image: none;
        border: none;
        margin-top: 0;
        margin-bottom: 0;
        visibility: hidden;
      }
    }
  }

}

.loading {
  position: absolute;
  left: 50%;
}
.videoDialog-wrap>.el-overlay>.el-overlay-dialog>#videoDialog{
  --el-dialog-bg-color: none;
}
</style>
