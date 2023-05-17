<template>
  <div class="container">
    <div class="video-list"  ref="videListRef">
      <div class="search">
        <el-icon class="search-icon"><Search /></el-icon>
        <input type="text" name="" id="" v-model="keyword" @keyup.enter="searchVideo()" placeholder="搜索关键词">
      </div>
      <div class="screening-item">
        <ul>
          <li>
            <i>媒体分类</i>
            <span class="all">全部</span>
            <span><i class="picture-douyin"></i>{{ checkBoxList[0] }}</span>
            <span><i class="picture-kuaishou"></i>{{ checkBoxList[1] }}</span>
            <span><i class="picture-xiaohongshu"></i>{{ checkBoxList[2] }}</span>
            <span><i class="picture-toutiao"></i>{{ checkBoxList[3] }}</span>
          </li>
          <li>
            <i>版式</i>
            <span class="all">全部</span>
            <span>横板</span>
            <span>竖版</span>
          </li>
          <li>
            <i>时长</i>
            <span class="all">全部</span>
            <span>0-15秒</span>
            <span>15-30秒</span>
            <span>30-60秒</span>
            <span>60秒以上</span>
          </li>
        </ul>
      </div>
      <div class="upvote-wrap">
        <div class="upvote-left">
          <span>点赞量<i class="up-icon"></i></span>
        <span>浏览量<i class="up-icon"></i></span>
        </div>
        <div class="upvote-right">
          <el-checkbox v-model="checked1" label="只看高清素材" class="look-High"/>
          <button>3日</button>
          <button class="boder-none">7日</button>
          <button>30日</button>
        </div>
      </div>
      <ul class="wrap" ref="wrap" @scroll="orderScroll($event)" >
        <li id="crawlBar" v-for="(item, index) in list" :key="index">
          <video class="video" controls muted>
            <source :src="`${appBaseUrl}${item.Path}`" />
          </video>
          <!-- <button class="importMaterial" @click="materialHander(item, index)">导入素材库</button> -->
        </li>
        <li class="seat" v-for="(item, i) of 10" :key="i"> </li>
      </ul>
    </div>
    <DialogView 
     :title="'导入素材库'"
     v-model:visible.sync="dialogFormVisible" 
     @updateVisible="updateVisible"
     @resetPopupData="resetPopupData" 
     @submitPopupData="submitPopupData" 
     @handleClose="handleClose"
     :width="'20%'"></DialogView>
    <div class="crawl-more">
      <button class="more" @click="moreChange" v-if="crawlBarFixed">爬取更多</button>
    </div>
  </div>
</template>
<script>
import DialogView from '../../components/Dialog.vue'
import {importMedia} from '../../api/index'
import {getVideos} from "@/api/index";
const appBaseUrl = import.meta.env.VITE_APP_BASE_URL
export default {
  props: {
    // list: {
    //   type: Array,
    //   default: () => [],
    // },
  },
  components: {
    DialogView,
  },
  data() {
    return {
      appBaseUrl,
      tabsK: false,
      crawlBarFixed: false, //爬取更多显隐
      dialogFormVisible: false, //导入素材库弹窗显隐
        MediaID:[],
        checkBoxList: ['抖音', '快手', '小红书', '今日头条'],
        MediaType :'video',
        keyword:'',
        list:[],
        checked1:'11'
    };
  },
  computed: {},
  mounted() {
    console.log('import.meta.env的内容',import.meta.env)
  },
  methods: {
    moreChange() {
      this.$emit("climbMore");
      this.crawlBarFixed = false;
    },
    // 监听滚动条的位置
    orderScroll() {
      var scrollTop = this.$refs.videListRef.scrollTop;
      const videListHeight = this.$refs.videListRef.getBoundingClientRect().height;
      const videListWrap = this.$refs.wrap.getBoundingClientRect().height;
      console.log("scrollTop:",scrollTop);
      console.log("ul height:", this.$refs.wrap.getBoundingClientRect().height);
      if (videListWrap - (scrollTop + videListHeight) < 1) {
        // this.crawlBarFixed = true;
        getVideos([this.checkBoxList[0]],this.keyword,20).then(res=>{
          console.log(res);
          this.list.push(...res.data.data);
        })
      } else {
        this.crawlBarFixed = false;
      }
    },
    materialHander(e) {
      this.MediaID = [e._id];
      this.dialogFormVisible = true;
    },
    // 修改是否让页面显示与隐藏的事件
	 updateVisible (val) {
      this.dialogFormVisible = val
    },
    // 点击取消的事件
    async resetPopupData () {
      //  这里可重置数据
      this.dialogFormVisible = false
    },
    // 点击确定的按钮
    async submitPopupData (industryId) {
      console.log(this.MediaID,this.MediaType,industryId);
      importMedia(this.MediaID,this.MediaType,industryId).then(res=>{
        console.log("导入素材库返回：",res);
        this.$message({
          message: '导入成功！',
          type: 'success'
        });
        this.$router.push('/workTable')
      }).catch(err=>{
        console.log("导入素材库报错：",err);
      })
      this.dialogFormVisible = false
    },
    // 关闭弹框（头部的X）
    handleClose () {
      this.dialogFormVisible = false
    },
    searchVideo(){
        getVideos([this.checkBoxList[0]],this.keyword,20).then(res=>{
          console.log(res);
          this.list.push(...res.data.data);
        })
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
  background-color: #dadcdd;
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
  .wrap>li:last-child{
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
    .upvote-wrap{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 18px;
      font-size: 14px;
      .upvote-left{
        >span{
        display: inline-block;
        width: 60px;
        height: 30px;
        >.up-icon{
          display: inline-block;
          width: 12px;
          height: 12px;
          background: url(../../assets/images/up-icon.png) center center no-repeat;
        }
        
      }
      .isActive{
          color: #1157FC;
          background: url(../../assets/images/up-icon-active.png) center center no-repeat;
        
      }
      }
      .upvote-right{
        .look-High{
          margin: 0 10px;
        }
        >button{
          background: none;
          outline: none;
          border: none;
          color: #3D3D3D;
          border: 1px solid #ccc;
          padding: 6px 15px;
          border-radius: 2px 0px 0px 2px;
        }
        >.boder-none{
            border-right: none;
            border-left: none;
          }
      }
    }
    >.screening-item{
      border-bottom: 1px solid #cfcfcf;
      ul{
        li{
          color: #3D3D3D;
          font-size: 14px;
          margin: 20px 0;
          >.all{
            display:inline-block;
            padding: 5px 10px;
            border-radius: 5px;
            background-color: #dce6ff;
            color: #1157FC;
          }
          >i{
            display: inline-block;
            width: 80px;
          }
          >span{
            padding: 0 14px;
            >i{
              position: relative;
              top: 4px;
              display: inline-block;
              width: 20px;
              height: 20px;
            }
            >.picture-douyin{
              background: url(../../assets/images/douyin.png) center center no-repeat;
            }
            >.picture-kuaishou{
              background: url(../../assets/images/kuaishou.png) center center no-repeat;
            }
            >.picture-xiaohongshu{
              background: url(../../assets/images/xiaohongshu.png) center center no-repeat;
            }
            >.picture-toutiao{
              background: url(../../assets/images/toutiao.png) center center no-repeat;
            }
          }
        }
      }
    }
    .search{
      height: 34px;
      width: 282px;
      margin: 24px 12px;
      border-radius: 4px;
      box-sizing: border-box;
      border: 1px solid #999;
      padding-left: 10px;
      >.search-icon{
        position: relative;
        top: 4px;
       padding-right: 10px;
       color: #999;
       margin-top: 4px;
      }

      >input{
        border: none;
        outline: none;
      }
    }

    .wrap {
      display: flex;
      flex-wrap: wrap;
      /* border: 1px solid pink; */
      justify-content: center;
      width: 100%;
      height: 500px;
      overflow-y: scroll;
      // gap: 16px;
      padding-bottom: var(--reduction-height);
      >li {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 240px;
        margin: 8px;
        // height: 320px;
        // margin-bottom: 30px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: url(../../assets/images/transpant.png);
        .video {
          width: 240px;
          height: 320px;
        }
      }
      .seat{
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
</style>
