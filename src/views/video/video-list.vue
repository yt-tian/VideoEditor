<template>
  <div class="container">
    <div class="video-list" @scroll="orderScroll($event)" ref="videListRef">
      <ul class="wrap" ref="wrap">
        <li id="crawlBar" v-for="(item, index) in list" :key="index">
          <video class="video" controls muted>
            <source :src="`${appBaseUrl}${item.Path}`" />
            <!-- <source :src="item.Path" /> -->
            <!-- <source src="../../assets/video/video1.mp4" /> -->
          </video>
          <button class="importMaterial" @click="materialHander(item, index)">导入素材库</button>
        </li>
        <!-- 占位符 -->
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

const appBaseUrl = import.meta.env.VITE_APP_BASE_URL
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
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
        MediaType :'video',
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
      var scrollTop = this.$refs.videListRef.scrollTop
      const videListHeight = this.$refs.videListRef.getBoundingClientRect().height;
      const videListWrap = this.$refs.wrap.getBoundingClientRect().height
      // console.log("scrollTop:",scrollTop);
      // console.log("ul height:", this.$refs.wrap.getBoundingClientRect().height);
      if (videListWrap - (scrollTop + videListHeight) < 1) {
        this.crawlBarFixed = true;
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
  height: calc(100% - var(--tab-height));
  /* display: flex; */
  flex-wrap: wrap;
  /* flex-direction: column; */
  justify-content: space-around;
  background-color: #f6f7f9;
  .wrap>li:last-child{
    // margin:10px calc((100%- 240px * 6 )/ 6 / 2 );
    // margin-right:auto ;
    // margin-right:10px;
    
  }
  // .wrap::after{
  //   flex: 1;
  // }
  .video-list {
    overflow-y: scroll;
    /* direction: right; */
    height: calc(100%);

    .wrap {
      display: flex;
      flex-wrap: wrap;
      /* border: 1px solid pink; */
      justify-content: center;
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
        height: 320px;
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
