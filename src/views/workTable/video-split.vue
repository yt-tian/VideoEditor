<template>
    <div class="container">
        <div class="video-split">
            <el-container>
                <el-header>
                    <div class="header">
                        <div class="back"><el-button type="" @click="goBack()"><el-icon><ArrowLeft /></el-icon>返回</el-button></div>
                        <div class="title">AI视频素材拆分</div>
                        <div class="save"><el-button type="" color="#515CD9">保存镜头到素材</el-button></div>
                    </div>
                </el-header>
                <el-main>
                    <div class="main">
                        <el-container>
                            <el-aside width="501px">
                                <div class="main-aside">
                                    <div class="manage">视频素材管理</div>
                                    <el-divider />
                                    <div class="select-material">
                                        <el-upload
                                            v-model:file-list="fileList"
                                            class="upload-demo"
                                            multiple
                                            :show-file-list="false"
                                            :limit="1"
                                            :on-success="successHandle"
                                            :http-request="uploadFile"
                                            :on-error="errorHandle"
                                            :before-upload="beforeUpload"
                                        >
                                            <el-button type=""><el-icon><UploadFilled /></el-icon>本地上传</el-button>
                                        </el-upload>

                                        <!-- <el-button type="" @click="uploadByLocal"><el-icon><UploadFilled /></el-icon>本地上传</el-button> -->
                                        <el-button type=""><el-icon><UploadFilled /></el-icon>我的素材库</el-button>
                                    </div>
                                    <div class="videos-block">
                                        <div class="cover" v-for="(item,index) in fileListCopy" :key="index" @click="viewSplitVideos(item)">
                                            <img src="@/assets/images/split-cover.png"/>
                                            <div>{{item.name}}</div>
                                        </div>
                                    </div>
                                </div>
                            </el-aside>
                            <el-main>
                                <div class="preview-block">
                                    <video class="video" controls muted v-if="videoVisible">
                                        <source :src="splitVideoSrc" />
                                    </video>
                                </div>
                            </el-main>
                        </el-container>
                    </div>
                </el-main>
                <el-footer>
                    <div class="foot">
                        <div class="select-block">
                            <el-space size="large">
                                <div v-for="(item,index) in splitVideos" :key="index" @click="playSplitVideos(item)">
                                    <img src="@/assets/images/select-icon.png"/>
                                </div>
                            </el-space>
                        </div>
                        <div class="operate-block">
                            <el-checkbox v-model="checked1" label="全选" />
                            <div class="selected">
                                <span style="font-size: 14px;color: #999;">已选择 {{ 0 }}</span>
                            </div>
                            <div class="pagination">
                                <el-pagination layout="prev, pager, next" :total="1000" />
                            </div>
                        </div>
                    </div>
                </el-footer>
            </el-container>
            <!-- 上传视频弹框 -->
            <el-dialog title="上传视频" v-model="uploadVisible" :destroy-on-close="true" width="30%" top="20%">
                <ul>
                    <li class="dialog-li" v-for="(item,index) in fileListCopy" :key="index">
                        <div>
                            <div>{{item.name}}</div>
                            <div>{{item.size}}</div>
                        </div>
                        <el-progress :percentage="item.percentage"/>
                    </li>
                </ul>
                <div vlot:="footer" class="dialog-footer">
                    <el-button @click="cancel()">取 消</el-button>
                    <el-button type="primary" @click="splitSubmit">确 认</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default{
    data(){
        return{
            checked1: '',
            uploadVisible: false,
            fileList: [],
            fileListCopy: [],//上传的视频列表
            fileObj: {
                uid: 0,
                name: '',
                size: 0,
                type: '',
                webkitRelativePath: ''
            },
            videoSplitObjs: [],
            splitVideos: [],
            splitVideoSrc: '',
            videoVisible: true
        }
    },
    watch:{
        fileList(){}
    },
    computed: {
        videoSize(val){
            return val/10;
        }
    },
    methods: {
        goBack(){
            this.$router.push('/workTable/staging')
        },
        // 本地上传
        uploadByLocal(){
            this.uploadVisible = true
        },
        // 上传前
        beforeUpload(file){
            this.uploadVisible = true
            console.log('上传的文件',file);
            let fileTemp = {
                uid: file.uid,
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            };
            fileTemp.percentage = 0;
            this.fileListCopy = [];
            this.fileListCopy.push(fileTemp);
            console.log('上传的文件copy',this.fileListCopy);
            //return false;
        },
        // 文件上传
        uploadFile(options){
            console.log('文件上传',options)
            let formData = new FormData();
            // formData.append(`MediaType`, 'video');
            // formData.append(`MediaPath`, '视频拆分上传的文件');
            formData.append(`file`, options.file);

            axios({
                url: '/api/v1/import_media_byfile?MediaType=video&MediaPath=视频拆分上传的文件',
                method: 'put',
                data: formData,
                headers: {token: sessionStorage.getItem('Authorization'),"Content-Type": "multipart/form-data"}
            })
            // this.$http.put('/import_media_byfile?MediaType=video&MediaPath=视频拆分上传的文件',formData,{'headers':'multipart/form-data'})
            .then(res => {
                if(res.data.code != 200){
                    console.log(res.data);
                    this.$message.error(res.data.msg);
                    return;
                }
                this.$message.success("上传成功");
                this.fileListCopy.forEach((item) => {
                    if(item.uid === options.file.uid){
                        item.percentage = 100;
                        item.filePath = res.data.data;
                        // let data = res.data.data;
                        // if(data){
                        //     let arr = data.split('.mp4');
                        //     item.filePath = arr[0];
                        // }
                    }
                })
            })
            .catch(err => {
                this.$message.error("网络或系统异常！")
                console.log(err);
            })
        },
        // 上传成功处理
        successHandle(){
            //this.uploadVisible = true
        },
        // 上传失败处理
        errorHandle(){

        },
        cancel(){},
        splitSubmit(){
            if(this.fileListCopy && this.fileListCopy.length>0){
                this.fileListCopy.forEach((item) => {
                    if(item.percentage === 100){
                        this.videoSplit(item.filePath,item.name);
                    }
                })
            }
        },
        // 进行视频拆分
        videoSplit(filePath,fileName){
            console.log('进行视频拆分',filePath)
            let formData = new FormData();
            formData.append(`FilePath`, filePath);
            axios({
                url: '/api/v1/split_video',
                method: 'post',
                data: formData,
                headers: {token: sessionStorage.getItem('Authorization'),"Content-Type": "application/json"}
            })
            //this.$http.post('/split_video',{'FilePath':filePath})
            .then(res => {
                if(res.data.code != 200){
                    console.log(res.data);
                    this.$message.error(res.data.msg);
                    return;
                }
                this.$message.success("拆分成功");
                let data = res.data.data;
                console.log('视频拆分成功返回的数据',data);
                this.generateSplitList(data.FilePath,data.FileNum,fileName)
            })
            .catch(err => {
                this.$message.error("网络或系统异常！")
                console.log(err);
            })
        },
        // 视频拆分成功后封装拆封列表
        generateSplitList(filePath,fileNum,fileName){
            let urls = [];
            for(let i=1;i<=fileNum;i++){
                let fileUrl = 'http://119.23.230.233/' + filePath + '/' + i + '.mp4';
                urls.push(fileUrl);
            }
            let splitObj = {fileName:fileName,splitVideos:urls};
            this.videoSplitObjs.push(splitObj);
            console.log('封装拆封列表',this.videoSplitObjs);
        },
        // 查看拆分的视频
        viewSplitVideos(video){
            let videoName = video.name;
            //let splitVideos = [];
            this.splitVideos = [];
            this.videoSplitObjs.forEach((item) => {
                if(item.fileName === videoName){
                    this.splitVideos = item.splitVideos;
                }
            });
        },
        // 播放拆分视频
        playSplitVideos(videoSrc){
            this.videoVisible = false;
            this.splitVideoSrc = videoSrc;
            this.$nextTick(()=>{
                this.videoVisible = true;
            })
        }
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
            .save{
                margin: 17px;
                margin-left: auto;//元素靠右
            }
        }
        .main{
            height: 50%;
            .main-aside{
                display: flex;
                flex-direction: column;

                .manage{
                    margin: 17px 17px 0px 27px;
                }
                .select-material{
                    display: flex;

                    :deep(.el-upload){
                        margin-right: 11px;
                    }
                }
                .videos-block{
                    margin-top: 24px;
                    display: flex;
                    //flex-wrap: wrap;

                    .cover{
                        width: 150px;
                    }
                }
            }
            
            .preview-block{
                display: flex;
                justify-content: center;
                .video {
                    width: 405px;
                    height: 610px;
                    border-top-left-radius: 5px;
                    border-top-right-radius: 5px;
                    //height: 100%;
                }
            }
        }
        .foot{
            //display: flex;
            .operate-block{
                display: flex;

                .selected{
                    // div内文字垂直居中
                    display: flex;
                    flex-direction: column;
                    justify-content: center;

                    margin-left: 14px;
                }
                .pagination{
                    margin-left: auto;
                }
            }
            .select-block{
                display: flex;
            }
        }

        .dialog-li{
            display: flex;
            flex-direction: row;
            margin-bottom: 20px;

            .el-progress{
                width: 400px;
                margin-left: 30px;
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