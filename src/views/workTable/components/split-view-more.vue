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
                                    <div class="cover">
                                        <img src="@/assets/images/split-cover.png"/>
                                        <div class="videoName">aaa</div>
                                        <div>已拆分50镜头</div>
                                    </div>
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
                                <el-button type="">导入素材库</el-button>
                            </div>
                            <div class="pagination">
                                <el-pagination layout="prev, pager, next" 
                                    :default-page-size="pageParms.pageSize"
                                    :total="pageParms.total"
                                    :current-page="pageParms.currentPage"
                                    @current-change="currentPageHandle"
                                    @prev-click="prevPageHandle" 
                                    @next-click="nextPageHandle"
                                />
                            </div>
                        </div>
                    </div>
                </el-footer>
            </el-container>
        </div>
    </div>
</template>
<script>
import {useRoute} from "vue-router";
export default{
    setup(){
        const route = useRoute();
        const data1 = JSON.parse(route.params.data1);
        console.log('data1',data1)
    },
    data(){
        return{
            videoVisible: true,
            isSelectAll: false,
            splitFragments:[],
            pageParms:{
                total:0,
                pageSize: 10,
                currentPage: 1,
                pageDate: []
            },
        }
    },
    created(){
        this.fetchData();
    },
    methods: {
        fetchData(){
            // const data1 = JSON.parse(this.$route.params.data1);
            // console.log('data1',data1)
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
                this.pageParms.pageDate = this.splitVideos.slice(start,end)
                console.log('pageHandle',this.pageParms.pageDate)
            })
        },
        // 拆分视频全选事件
        selectAllHandle(isSelect){
            // let vm = this;
            console.log('selectAllHandle',isSelect)
            //this.checked1 = true;

            //this.$nextTick(() => {
            //     if(isSelect){
            //         this.$nextTick(() => {
                        
            //             //this.isChecked = true;
            //             this.splitVideos.forEach((item) => {
            //                 item.checked = true;
            //             })
            //             this.pageParms.pageDate.forEach((item) => {
            //                 item.checked = true;
            //             })
            //             this.splitFragments = this.splitVideos;
            //             console.log('splitVideos',this.splitVideos)
            //             console.log('lazeCheckbox',this.$refs.lazeCheckbox)
            //         })
                    
                    
            //     }
            //     if(!isSelect){
            //         this.$nextTick(() => {
            //             //this.isChecked = false;
            //             this.splitVideos.forEach((item) => {
            //                 item.checked = false;
            //             })
            //             this.pageParms.pageDate.forEach((item) => {
            //                 item.checked = false;
            //             })
            //              this.splitFragments = [];
            //              console.log('splitVideos',this.splitVideos)
            //              console.log('lazeCheckbox',this.$refs.lazeCheckbox)
            //         })
                    
            //     }
                
            // //})
            // let mediaID = [];
            // this.splitFragments.forEach((item) => {
            //     mediaID.push(item.Id);
            // });
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
                            height: 150px;
                        }
                        .videoName{
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                    }
                    .cover:hover .cover-mask{
                        display: block;
                    }
                    .cover-mask{
                        width: 120px;
                        height: 150px;
                        display: none;
                        position: absolute;
                        top: 0;
                        left: 0;
                        background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));

                        .del-icon{
                            width: 20%;
                            height: 13%;
                            position: absolute;
                            top: 10px;
                            right: 10px;
                            background-color: #FFF;
                        }
                    }
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
                    .pagination{
                        margin-left: auto;
                    }
                }
            }
        }
    }
}
</style>