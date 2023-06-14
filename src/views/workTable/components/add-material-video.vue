<template>
    <div class="material-page">
        <div class="subfolder">
            <div>
                <div>子文件夹 <span style="color: #999;">({{ num}})</span> 
                    <el-icon>
                        <CaretRight class="careRight" color="#999" />
                    </el-icon> 
                </div>
            </div>
        </div>

        <div class="all-industry">
            <ul class="industry-wrap">
                <li v-for="(item, index) in fileList " :key="index" @click="fileDirClick(item)">
                    <img src="@/assets/images/file-img.png" alt="">
                    <div>{{ item.key }}</div>
                </li>
            </ul>
            <div style="position: relative;font-size: 14px;"> 内容 <span style="color: #999;">({{mediaList.length}})</span>
                <el-icon>
                    <CaretRight class="careRight" color="#999" />
                </el-icon>
            </div>

            <div style="height:100%">
                <ul class="get-content">
                    <li v-for="(item, index) in mediaList " :key="index">
                        <video class="video" controls muted>
                            <source :src="`${viewUrl}${item.Path}`" />
                        </video>
                        <div class="video-name">{{ item.FileName }}</div>
                        <div class="mask-item" :class="{selected:item.checked,unselected:!item.checked}">
                            <div>
                                <el-checkbox label="" size="large" class="checkbox" v-model="item.checked" :checked="item.checked" @change="selectHandle($event,item,index)"/>
                                <!-- <span class="mixed-shear">混剪</span> -->
                            </div>
                            <!-- <div class="edit-wrap">
                                <button class="edit">编辑</button>
                                <div class="more-edit"><span class="more"></span>
                                    <ul class="more-list">
                                        <li>重命名</li>
                                        <li>创建副本</li>
                                        <li>复制到...</li>
                                        <li>移动到...</li>
                                        <li>下载</li>
                                        <li @click="() => deleteMediaChange(item.Industryid,item.Id)">移入回收站</li>
                                    </ul>
                                </div>
                            </div> -->
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        
    </div>
</template>
<script>
import {getMediaList, deleteMedia } from '@/api/index'
const appBaseUrl = import.meta.env.VITE_APP_BASE_URL
//import axios from 'axios'

export default {
    components: {

    },
    props:{
        selectedList: {
            type:Array,
            default(){
                return []
            }
        }
    },
    data() {
        return {
            appBaseUrl,
            viewUrl: 'http://119.23.230.233:81/',
            MediaType: 'MediaType',
            file: '@/assets/video/video1.mp4',
            isEmpty: false,
            mediaList: [],
            dataTime: '',
            isCheck:false,
            num:0,
            fileList: [],
            //selectedList: []
        }
    },
    computed: {
        uploadUrl() {
            return `/api/v1/import_media_byfile?MediaType=${this.uploadData.MediaType}&IndustryId=${this.uploadData.IndustryId}`
        }
    },
    created() {
        //this.getMediaFolder();
    },
    mounted() {
       this.getFoldersByMedia();
    },
    methods: {
        // 通过媒体接口获取文件夹
        getFoldersByMedia(){
            getMediaList().then(res => {
                console.log("获取素材库视频", res.data.data);
                if(res.data.code != 200){
                    console.log(res.data);
                    this.$message.error(res.data.msg);
                    return;
                }
                // const dataTime = res.data.data
                const obj = res.data.data.MVideos;
                const arr = [];
                this.mediaList = [];// 清空上次保留的数据
                for (const key in obj) {
                    // 每个视频增加是否勾选标记
                    let videoList = obj[key];
                    if(videoList && videoList.length>0){
                        videoList.forEach((video) => {
                            video.checked = false;
                        })
                    }

                    arr.push({
                        key: key,
                        list: videoList
                    })
                    this.mediaList.push(...videoList)
                }
                this.fileList = arr;
                this.num = arr.length;
                this.IndustryId 
                
                if (this.mediaList == '{}') {
                    this.mediaList = null;
                    this.num = 0
                    this.isEmpty = true;
                }

            })
        },
        fileDirClick(item) {
            //console.log(JSON.parse(JSON.stringify(item.list)));
            this.mediaList = [];
            //this.mediaList = JSON.parse(JSON.stringify(item.list))
            this.$nextTick(() => {
                this.mediaList = JSON.parse(JSON.stringify(item.list))
            })
            
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
        // 关闭弹框（头部的X）
        handleClose() {
            this.dialogFormVisible = false
        },
        fileListHander() {
            // this.visibleFile = true
            this.dialogVisible = false;
            this.$nextTick(()=>{
                 getMediaList().then(res => {
            // console.log("获取素材库视频", res.data.data);
            // const dataTime = res.data.data
            this.mediaList = res.data.data.MVideos;
            if (this.mediaList == '{}') {
                this.mediaList = null;
                this.isEmpty = true;
            }

        })
            })
           
        },
        importFileHander() {
            this.visibleFile = false
            this.dialogFormVisible = true;
        },
        deleteMediaChange(id,item) {
            this.deletelist = [...item];
            this.IndustryId = id
            console.log(this.IndustryId,this.deletelist);  
            // console.log(this.deletelist);
            deleteMedia(this.deletelist).then(res => {
                if (res.data.code == 200)
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                getMediaList().then(res => {
                    this.mediaList = res.data.data;
                    if (this.mediaList == '{}') {
                        this.mediaList = null;
                    }

                })

            })
        },
        checkChange(){
            this.isCheck = true
        },
        // 选择事件
        selectHandle(isSelect,video,index){
            console.log('selectHandle',isSelect,video,index);
            this.$emit('changeVal',isSelect,video);
            // 如果勾选
            // if(isSelect){
            //     this.selectedList.push(video);
            // }
            // if(!isSelect){
            //     this.selectedList = this.selectedList.filter((item) => {
            //         return item.Id != video.Id
            //     })
            // }
            // console.log('selectedList',this.$selectedList)
        }
    },
}
</script>
<style scoped lang="less">
.material-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    // height: calc(100% - 60px);
    // height: 100%;
    margin: 24px;
    padding: 10px;
    border-top-left-radius: 20px;
    background-color: #fff;
    // overflow-y: auto;
    overflow: hidden;

    >div {
        display: flex;
        justify-content: space-between;
        width: 100%;
        //height: 52px;
    }

    .subfolder {
        position: relative;
        margin: 14px;
        margin-bottom: 0;
        font-size: 14px;
        vertical-align: middle;

        .sub-right {
            display: flex;
            align-items: center;

            >div {
                font-size: 14px;
                padding: 0 10px;
                cursor: pointer;
            }
        }


    }

    .careRight {
        position: absolute;
        top: 2px;
        left: 0px;
        cursor: pointer;
    }

}

:deep(.el-dialog__footer) {
    justify-content: space-between;
    display: flex;
}

.all-industry {
    display: flex;
    flex-direction: column;

    .industry-wrap {
        display: flex;
        margin-bottom: 18px;
        flex-wrap: wrap;

        >li {
            width: 80px;
            margin: 0 22px;
            cursor: pointer;

            >div {
                font-family: PingFangSCMedium-Medium;
                font-size: 12px;
                font-weight: normal;
                text-align: center;
                margin-top: 10px;
                color: #999;
            }

        }

    }

    .get-content {
        display: flex;
        //height: 520px;
        width: 100%;
        flex-wrap: wrap;
        // overflow-y: scroll;

        >li {
            display: flex;
            align-items: center;
            flex-direction: column;
            position: relative;
            // justify-content: center;
            width: 220px;
            height: 312px;
            border-radius: 10px;
            margin: 10px 18px;
            opacity: 1;
            background: #F8F9F9;
            border: 1px solid #EBEBEB;

            .video {
                width: 100%;
                height: 90%;
            }

            div {
                padding: 6px 0;
                text-align: center;
                font-size: 12px;
            }

        }

        .video-name{
            width: 100%;

            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    .get-content>li:hover .mask-item {
        display: block;
        padding: 10px 0;
        box-sizing: border-box;
    }

    .mask-item {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        display: none;
        box-sizing: border-box;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));

        &.selected{
            display: block;
        }
        &.unselected{
            display: none;
        }

        .edit-wrap {

            margin-top: 90%;
            padding: 0 10px;
        }

        >div {
            display: flex;
            justify-content: space-between;
            align-items: center;


        }

    }

    .mixed-shear {
        display: inline-block;
        width: 40px;
        padding: 3px;
        height: 14px;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        background-color: #2254f4;
        color: #fff;
        float: right;
        font-size: 12px;
        text-align: center;
    }

}

.more-edit {
    position: relative;
    display: flex;
    justify-content: center;
    width: 36px;
    border-radius: 5px;
    cursor: pointer;
    background-color: #fff;

    >.more-list {
        position: absolute;
        top: -264px;
        right: -164px;
        width: 200px;
        height: 264px;
        border-radius: 10px;
        display: none;
        box-shadow: 0 0 8px 0 #ccc;
        background-color: #fff;
        z-index: 99;
        >li{
            margin: 2px 10px;
            padding: 14px 10px;
            font-size: 14px;
            color: #3D3D3D;
            box-sizing: border-box;
            border-radius: 5px;
            text-align: left;
        }
        >li:hover{
            background-color: #eeeeee;
        }
    }
}

.more-edit:hover>.more-list {
    display: block;
}

.edit {
    width: 126px;
    height: 36px;
    border: none;
    border-radius: 5px;
    align-items: end;
}

.more {
    display: inline-block;
    width: 24px;
    height: 24px;
    background: url(../../assets/images/more.png) center center no-repeat;
}

:deep(.el-checkbox.el-checkbox--large .el-checkbox__inner) {
    width: 16px;
    height: 18px;
    margin-left: 10px;
}

.material-page >.check-all{
    position: fixed;
    bottom: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 10px;
    width: 90%;
    box-sizing: border-box;
    height: 80px;
    background-color: #fff;
    box-shadow: 0px -3px 5px 0px rgba(0, 0, 0, 0.2);
    .check-right{
        padding-right: 70px;
        cursor: pointer;
    }
    
    >.check-left{
        width: 40%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        >.line{
        display: inline-block;
        width: 1px;
        height: 20px;
        background-color: #d8d8d8;
    }
    >.button{
            display: inline-block;
            padding: 8px 15px;
            height: 32px;
            border: 1px solid #999;
            background:none;
            border-radius: 5px;
            cursor: pointer;
        }
    }

}

:deep(.dialog-footer) {
    display: flex;
    justify-content: right;
    padding: 15px 20px 15px;
    font-size: 16px;
    font-weight: bold;

    .el-button {
        border: none;
        color: #151515;
        height: 44px;

        >span {
            font-size: 14px;
            font-weight: 700;

        }
    }

    :deep(.el-select .el-input__wrapper) {
        padding: 6px 11px;
    }

    .el-button--primary {
        >span {
            color: #fff;
        }

    }
}
</style>
  