<template>
    <div class="container">
        <div class="video-split">
            <el-container>
                <el-header>
                    <div class="header">
                        <div class="back"><el-button type="" @click="goBack()"><el-icon><ArrowLeft /></el-icon>返回</el-button></div>
                        <div class="title">AI视频素材拆分</div>
                    </div>
                </el-header>
                <el-main class="container-main">
                    <div class="main">
                        <el-container>
                            <el-aside class="middle-aside" width="30%">
                                <div class="preview-block">
                                    <video class="video" controls muted v-if="videoVisible">
                                        <source :src="splitVideoSrc" />
                                    </video>
                                </div>
                            </el-aside>
                            <el-main class="middle-main">
                                <div class="videos-block">
                                    <div class="cover" v-for="(item,index) in pageParms.pageDate" :key="index" @click="playSplitVideos(item)">
                                        <video class="video" :src="`${viewUrl}${item.Path}`">
                                            <!-- <source :src="`${appBaseUrl}${item.Path}`"/> -->
                                        </video>
                                        <!-- <img v-else src="@/assets/images/split-cover.png"/> -->
                                        <div class="videoName">{{item.FileName}}</div>
                                        <!-- <div v-show="!item.FileNum">未进行拆分</div>
                                        <div v-show="item.FileNum===-1">拆分失败</div> -->
                                        <!-- <div v-show="item.FileNum">已拆分{{ item.FileNum }}镜头</div> -->
                                        <!-- <div>已拆分{{ item.FileNum }}镜头</div> -->
                                        <!-- <div class="cover-mask">
                                            <div class="del-icon" @click="removeVideo(item)"><el-icon><DeleteFilled /></el-icon></div>
                                        </div> -->
                                        <div class="mask-item" :class="{selected:item.checked,unselected:!item.checked}">
                                            
                                        </div>
                                        <el-checkbox ref="lazeCheckbox" label="" size="large" class="checkbox" v-model="item.checked" :checked="item.checked"  @change="selectHandle($event,item,index)"/>
                                    </div>
                                    <!-- <div class="cover">
                                        <img src="@/assets/images/split-cover.png"/>
                                        <div class="videoName">aaa</div>
                                        <div>已拆分50镜头</div>
                                    </div> -->
                                </div>
                            </el-main>
                        </el-container>
                    </div>
                </el-main>
                <el-footer class="footer">
                    <div class="foot">
                        <div class="operate-block">
                            <el-checkbox label="全选" v-model="isSelectAll" :checked="isSelectAll" @change="selectAllHandle($event)"/>
                            <!-- <el-checkbox label=""/> -->
                            <div class="selected">
                                <span style="font-size: 14px;color: #999;">已选择 {{ splitFragments.length }}</span>
                            </div>
                            <div class="import-button">
                                <el-button type="" @click="saveToMaterialDialog">导入素材库</el-button>
                            </div>
                            <div class="total">共{{ pageParms.total }}条</div>
                            <div class="pagination">
                                <el-pagination layout="prev, pager, next" 
                                    :default-page-size="pageParms.pageSize"
                                    :total="pageParms.total"
                                    @current-change="currentPageHandle"
                                    @prev-click="prevPageHandle" 
                                    @next-click="nextPageHandle"
                                />
                            </div>
                        </div>
                    </div>
                </el-footer>
            </el-container>
            <!-- 保存到素材库 -->
            <el-dialog title="保存素材" v-model="saveToMaterialVisible" :destroy-on-close="true" width="30%">
                <el-form :model="form">
                    <el-form-item label="保存位置" ></el-form-item>
                    <el-select v-model="folderName" placeholder="全部来源">
                        <el-option :label="item" v-for="(item, index) in folderList" :value="item" :key="index"></el-option>
                    </el-select>
                </el-form>
                <div vlot:="footer" class="dialog-footer">
                    <el-button @click="saveToMaterialCancel()">取 消</el-button>
                    <el-button type="primary" @click="saveToMaterialSubmit">确 认</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
// import {useRoute} from "vue-router";
import axios from 'axios'
const appBaseUrl = import.meta.env.VITE_APP_BASE_URL
export default{
    setup(){
        // const route = useRoute();
        // const data1 = route.params.data1;
        // console.log('data1',data1)
        // const data1 = history.state.data1;
        // console.log('data1',data1)
    },
    data(){
        return{
            appBaseUrl,
            viewUrl: 'http://119.23.230.233:81/',
            videoVisible: true,
            isSelectAll: false,
            fileListCopy: [],
            videoSplitObjs:[],
            splitFragments: [],
            pageParms:{
                total:0,
                pageSize: 15,
                currentPage: 1,
                pageDate: []
            },
            splitVideoSrc: '',
            mediaID: [],
            saveToMaterialVisible: false,
            folderName: '',
            folderList: [],
            form:'',
        }
    },
    created(){
        this.fetchData();
        this.getMediaFolder();
    },
    methods: {
        fetchData(){
            //this.fileListCopy = JSON.parse(this.$route.query.data1);
            this.videoSplitObjs = JSON.parse(this.$route.query.data2);
            // const data1 = history.state.data1;
            console.log('fileListCopy',this.fileListCopy)
            console.log('videoSplitObjs',this.videoSplitObjs)
            this.videoSplitObjs.forEach((item) => {
                //this.fileListCopy.push(item.splitVideos);
                let videos = item.splitVideos;
                videos.forEach((video) => {
                    this.fileListCopy.push(video);
                })
            })
            console.log('fileListCopy',this.fileListCopy)
            this.pageParms.total = this.fileListCopy.length;
            this.pageHandle(1,this.pageParms.pageSize);
        },
        // 获取媒体文件夹
        getMediaFolder(){
            this.$http.get('/get_media_folder')
            .then(res => {
                if(res.data.code !== 200){
                    //console.log("aaa",res);
                    return;
                }
                if(res.data.data && res.data.data.length>0){
                    this.folderList = res.data.data;
                    //console.log("getMediaFolder",this.fileList);
                }
                //console.log("getMediaFolder",res.data);
            })
            .catch(err => {
                this.$message.error("网络或系统异常！")
                console.log(err);
            })
        },
        // 当前页
        currentPageHandle(val){
            console.log('当前页',val)
            this.pageParms.currentPage = val;
            this.pageHandle(val,this.pageParms.pageSize)
        },
        // 上一页
        prevPageHandle(val){
            console.log('上一页',val)
            // this.pageParms.currentPage = val+1;
            this.pageHandle(val,this.pageParms.pageSize)
        },
        // 下一页
        nextPageHandle(val){
            console.log('下一页',val)
            // this.pageParms.currentPage = val-1;
            this.pageHandle(val,this.pageParms.pageSize)
        },
        // 分页处理
        pageHandle(page,pageSize){
            let start = (page-1)*pageSize;
            let end = start + pageSize;
            this.pageParms.pageDate = [];
            this.$nextTick(() => {
                this.pageParms.pageDate = this.fileListCopy.slice(start,end)
                console.log('pageHandle',this.pageParms.pageDate)
            })
        },
        // 播放拆分视频
        playSplitVideos(videoObj){
            this.videoVisible = false;
            this.splitVideoSrc = this.viewUrl+videoObj.Path;
            this.$nextTick(()=>{
                this.videoVisible = true;
            })
        },
        // 选择事件
        selectHandle(isSelect,video,index){
            console.log('selectHandle',isSelect,video,index);
            // 如果勾选
            if(isSelect){
                this.splitFragments.push(video);

                if(this.fileListCopy.length === this.splitFragments.length){
                    this.$nextTick(() => {
                        this.isSelectAll = true
                    })
                }
                if(this.fileListCopy.length !== this.splitFragments.length){
                    this.$nextTick(() => {
                        this.isSelectAll = false
                    })
                }
            }
            if(!isSelect){
                this.splitFragments = this.splitFragments.filter((item) => {
                    return item.Id != video.Id
                })
                
                if(this.fileListCopy.length === this.splitFragments.length){
                    this.$nextTick(() => {
                        this.isSelectAll = true
                    })
                }
                if(this.fileListCopy.length !== this.splitFragments.length){
                    this.$nextTick(() => {
                        this.isSelectAll = false
                    })
                }
            }
            console.log('selectedList',this.splitFragments)
        },
        // 拆分视频全选事件
        selectAllHandle(isSelect){
            // let vm = this;
            console.log('selectAllHandle',isSelect)
            //this.checked1 = true;

            //this.$nextTick(() => {
                if(isSelect){
                    this.$nextTick(() => {
                        
                        //this.isChecked = true;
                        this.fileListCopy.forEach((item) => {
                            item.checked = true;
                        })
                        this.pageParms.pageDate.forEach((item) => {
                            item.checked = true;
                        })
                        this.splitFragments = this.fileListCopy;
                        console.log('fileListCopy',this.fileListCopy)
                        console.log('lazeCheckbox',this.$refs.lazeCheckbox)
                    })
                    
                    
                }
                if(!isSelect){
                    this.$nextTick(() => {
                        //this.isChecked = false;
                        this.fileListCopy.forEach((item) => {
                            item.checked = false;
                        })
                        this.pageParms.pageDate.forEach((item) => {
                            item.checked = false;
                        })
                         this.splitFragments = [];
                         console.log('fileListCopy',this.fileListCopy)
                         console.log('lazeCheckbox',this.$refs.lazeCheckbox)
                    })
                    
                }
                
            // //})
            let mediaID = [];
            this.splitFragments.forEach((item) => {
                mediaID.push(item.Id);
            });
        },
        // 保存到素材库弹窗
        saveToMaterialDialog(){
            this.saveToMaterialVisible = true;
        },
        // 保存到素材库取消事件
        saveToMaterialCancel(){
            this.saveToMaterialVisible = false;
        },
        // 保存到素材库
        saveToMaterial(mediaID,folderName){
            console.log('保存到素材库',mediaID,folderName);
            if(!folderName){
                this.$message.warning("请选择要保存到的文件夹");
                return;
            }
            if(mediaID.length<1){
                this.$message.warning("请选择要保存的拆分视频");
                this.saveToMaterialVisible = false;
                return;
            }
            let formData = new FormData();
            formData.append(`MediaID`, mediaID);
            formData.append(`MediaPath`, folderName);
            formData.append(`MediaType`, "video");
            axios({
                url: '/api/v1/import_media_bysplit',
                method: 'post',
                data: {'MediaID':mediaID,'MediaPath':folderName,'MediaType':'video'},
                headers: {token: sessionStorage.getItem('Authorization'),"Content-Type": "application/json"}
            })
            //this.$http.post('/split_video',{'FilePath':filePath})
            .then(res => {
                if(res.data.code != 200){
                    console.log(res.data);
                    this.$message.error(res.data.msg);
                    return;
                }
                this.$message.success("保存成功");
            })
            .catch(err => {
                this.$message.error("网络或系统异常！")
                console.log(err);
            })
            this.saveToMaterialVisible = false;
        },
        // 保存到素材库确定事件
        saveToMaterialSubmit(){
            let mediaID = [];
            this.splitFragments.forEach((item) => {
                mediaID.push(item.Id);
            });
            this.saveToMaterial(mediaID,this.folderName);
        },
    }
}
</script>
<style scoped lang="less">
.container{
    .video-split{
        .header{
            display: flex;
            .back{
                margin: 17px 0px;
            }
            .title{
                margin: 17px;
                
                // div内文字垂直居中
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
        }

        .container-main{
            // box-sizing: border-box;
            padding-top: 0px;
            padding-bottom: 10px;

            height: 88vh;
        }

        .main{
            height: 50%;

            .main-aside{
                display: flex;
                flex-direction: column;
                background-color: #FFFFFF;
            }

            .middle-aside{
                //height: 620px;
                //border: 1px solid #2254F4;
                background-color: #FFF;
                height: 88vh;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow-x: hidden;

                .preview-block{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #FFFFFF;
                    .video {
                        width: 405px;
                        height: 610px;
                        border-top-left-radius: 5px;
                        border-top-right-radius: 5px;
                        //height: 100%;
                        padding: 17px;
                    }
                }
            }

            .middle-main{
                padding: 0;
                margin-left: 10px;
                //height: 620px;
                //border: 1px solid #2254F4;
                background-color: #FFF;
                height: 88vh;

                .videos-block{
                    margin-top: 12px;
                    display: flex;
                    flex-wrap: wrap;
                    width: 100%;
                    height: 505px;

                    .cover{
                        width: 140px;
                        margin: 15px;
                        position: relative;

                        >img{
                            width: 100%;
                            height: 208px;
                            margin-bottom: 10px;
                            cursor: pointer;
                        }
                        >div{
                            text-align: center;
                            margin-bottom: 10px;
                        }

                        .video{
                            width: 100%;
                            height: 208px;
                        }
                        .videoName{
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }

                        .checkbox{
                            position: absolute;
                            top: 10px;
                            left: 15px;
                       }
                    }

                    .cover:hover .mask-item{
                        display: block;
                        //padding: 10px 0;
                        box-sizing: border-box;
                    }

                    .mask-item {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 208px;
                        border-radius: 10px;
                        display: none;
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

                    // .cover:hover .cover-mask{
                    //     display: block;
                    // }
                    // .cover-mask{
                    //     width: 120px;
                    //     height: 150px;
                    //     display: none;
                    //     position: absolute;
                    //     top: 0;
                    //     left: 0;
                    //     background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));

                    //     .del-icon{
                    //         width: 20%;
                    //         height: 13%;
                    //         position: absolute;
                    //         top: 10px;
                    //         right: 10px;
                    //         background-color: #FFF;
                    //     }
                    // }
                }
            }

        }

        .footer{
            display: flex;
            align-items: center;

            .foot{
                .operate-block{
                    display: flex;
                    //flex-wrap: wrap;

                    .selected{
                        // div内文字垂直居中
                        display: flex;
                        flex-direction: column;
                        justify-content: center;

                        margin-left: 14px;
                    }
                    .import-button{
                        margin-left: 14px;
                    }
                    .total{
                        margin-left: 14px;
                        // div内文字垂直居中
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    .pagination{
                        margin-left: auto;
                    }
                }
            }
        }

        .dialog-footer{
            display: flex;
            justify-content: right;
            padding: 15px 20px 15px;
            font-size: 16px;
            font-weight: bold;
        }
    }
}
</style>