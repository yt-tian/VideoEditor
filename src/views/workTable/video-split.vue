<template>
    <div class="container">
        <div class="video-split">
            <el-container>
                <el-header>
                    <div class="header">
                        <div class="back"><el-button type="" @click="goBack()"><el-icon><ArrowLeft /></el-icon>返回</el-button></div>
                        <div class="title">AI视频素材拆分</div>
                        <div class="save"><el-button type="" color="#515CD9" @click="saveToMaterialDialog">保存镜头到素材</el-button></div>
                    </div>
                </el-header>
                <el-main class="container-main">
                    <div class="main">
                        <el-container>
                            <el-aside class="middle-aside" width="501px">
                                <div class="main-aside">
                                    <div class="manage">视频素材管理</div>
                                    <el-divider />
                                    <div class="select-material">
                                        <el-upload
                                            v-model:file-list="fileList"
                                            class="upload-demo"
                                            accept=".mp4"
                                            :multiple="true"
                                            :show-file-list="false"
                                            :limit="3"
                                            :on-success="successHandle"
                                            :http-request="uploadFile"
                                            :on-error="errorHandle"
                                            :before-upload="beforeUpload"
                                        >
                                            <el-button type=""><el-icon><UploadFilled /></el-icon>本地上传</el-button>
                                        </el-upload>

                                        <!-- <el-button type="" @click="uploadByLocal"><el-icon><UploadFilled /></el-icon>本地上传</el-button> -->
                                        <el-button type="" @click="openMaterial"><el-icon><UploadFilled /></el-icon>我的素材库</el-button>
                                    </div>
                                    <div class="videos-block">
                                        
                                        <div class="cover" v-for="(item,index) in fileListCopy" :key="index" @click="viewSplitVideos(item)">
                                            <video class="video" v-if="item.percentage === 100" :src="`${appBaseUrl}${item.Path}`">
                                                <!-- <source :src="`${appBaseUrl}${item.Path}`"/> -->
                                            </video>
                                            <img v-else src="@/assets/images/split-cover.png"/>
                                            <div class="videoName">{{item.FileName}}</div>
                                            <!-- <div v-show="!item.FileNum">未进行拆分</div>
                                            <div v-show="item.FileNum===-1">拆分失败</div> -->
                                            <!-- <div v-show="item.FileNum">已拆分{{ item.FileNum }}镜头</div> -->
                                            <div>已拆分{{ item.FileNum }}镜头</div>
                                            <div class="cover-mask">
                                                <div class="del-icon" @click="removeVideo(item)"><el-icon><DeleteFilled /></el-icon></div>
                                            </div>
                                        </div>
                                        <!-- <div class="cover">
                                            <img src="@/assets/images/split-cover.png"/>
                                            <div class="videoName">aaa</div>
                                            <div>已拆分50镜头</div>
                                        </div> -->
                                            
                                        
                                    </div>
                                </div>
                            </el-aside>
                            <el-main class="middle-main">
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
                                <div class="select-div" :class="{selected:item.checked,unselected:!item.checked}"
                                     v-for="(item,index) in pageParms.pageDate" :key="index" @click="playSplitVideos(item)">
                                <!-- <div class="select-div"> -->
                                    <video class="video">
                                        <source :src="`${appBaseUrl}${item.Path}`" />
                                    </video>
                                    <!-- <img src="@/assets/images/select-icon.png"/> -->
                                    <div class="mask-item" :class="{selected:item.checked,unselected:!item.checked}">
                                        <el-checkbox ref="lazeCheckbox" label="" size="large" class="checkbox" v-model="item.checked" :checked="item.checked"  @change="selectHandle($event,item,index)"/>
                                    </div>
                                    
                                </div>
                            </el-space>
                            <div class="viewMore" v-if="pageParms.pageDate.length>1" @click="viewMore">查看更多</div>
                        </div>
                        <div class="operate-block">
                            <el-checkbox label="全选" v-model="isSelectAll" :checked="isSelectAll" @change="selectAllHandle($event)"/>
                            <!-- <el-checkbox label=""/> -->
                            <div class="selected">
                                <span style="font-size: 14px;color: #999;">已选择 {{ splitFragments.length }}</span>
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
            <!-- 上传视频弹框 -->
            <el-dialog title="上传视频" v-model="uploadVisible" :destroy-on-close="true" :close-on-click-modal="false" width="30%" top="20%">
                <ul>
                    <li class="dialog-li" v-for="(item,index) in uploadFileListCopy" :key="index">
                        <div>
                            <div>{{item.FileName}}</div>
                            <div>{{item.size}}</div>
                        </div>
                        <el-progress :percentage="item.percentage"/>
                    </li>
                </ul>
                <div vlot:="footer" class="dialog-footer">
                    <el-button @click="splitCancel()">取 消</el-button>
                    <el-button type="primary" @click="splitSubmit">确 认</el-button>
                </div>
            </el-dialog>
            <!-- 从素材库获取视频 -->
            <el-dialog title="添加视频" v-model="addMaterialVisible" :destroy-on-close="true" :close-on-click-modal="false" width="80%" heigth="100%" custom-class="add-material-dialog">
                <div style="height: 60vh;">
                    <el-scrollbar>
                        <add-material-video v-bind:selectedList="selectedList" @changeVal="changeVal"></add-material-video>
                    </el-scrollbar>
                </div>
                <div vlot:="footer" class="dialog-footer">
                    <el-button @click="splitCancel1()">取 消</el-button>
                    <el-button type="primary" @click="splitSubmit1">确 认</el-button>
                </div>
            </el-dialog>
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
import AddMaterialVideo from './components/add-material-video.vue'
import axios from 'axios'
//import { onMounted,reactive,toRefs,ref,nextTick } from 'vue'
import { nextTick,ref } from 'vue'
//import { importMedia } from '@/api/index';
const appBaseUrl = import.meta.env.VITE_APP_BASE_URL
export default{
    components: {
        AddMaterialVideo
    },
    setup(){
        // const state = reactive<any>({
        //     lazeCheckbox : null,
        // })
        // onMounted(() => {
        //     const lazeCheckbox: any = state.lazeCheckbox;
        // });
        // return{
        //     ...toRefs(state),
        // }
        console.log('setup');
        let isReloadData = ref(true);
        function refresh(){
            isReloadData.value = false;
            nextTick(() => {
                isReloadData.value = true;
            })
        }
        return{
            isReloadData,
            refresh
        }
    },
    data(){
        return{
            appBaseUrl,
            pageParms:{
                total:0,
                pageSize: 10,
                currentPage: 1,
                pageDate: []
            },
            checked1: false,
            isSelectAll: false,
            uploadVisible: false,
            fileList: [],
            fileListCopy: [],//上传或素材视频列表
            uploadFileListCopy: [],//上传的视频列表
            fileObj: {
                uid: 0,
                FileName: '',
                size: 0,
                type: '',
                webkitRelativePath: ''
            },
            videoSplitObjs: [],
            splitVideos: [],//选中视频的拆分后的列表
            splitVideoSrc: '',
            videoVisible: true,
            addMaterialVisible: false,
            selectedList: [],
            splitFragments: [],
            saveToMaterialVisible: false,
            folderName: '',
            folderList: [],
            form:'',
            isChecked: false
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
    created(){
        this.getMediaFolder();
    },
    methods: {
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
        goBack(){
            this.$router.push('/workTable/staging')
        },
        // 本地上传
        uploadByLocal(){
            this.uploadVisible = true
        },
        // 上传前
        beforeUpload(file){

            //console.log('文件名',file.name)
            let reg = new RegExp("[/\\\\*:：?？\"“”<《>》|()（） ]")
            if(reg.test(file.name)){
                this.$message.warning('文件名不能包含 /\\*:?"<>|() 空格等特殊字符，请修改后重新上传');
                return false;
            }
            this.uploadVisible = true
            console.log('上传的文件',file);
            let fileTemp = {
                uid: file.uid,
                FileName: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            };
            fileTemp.percentage = 0;
            //this.fileListCopy = [];
            this.fileListCopy.push(fileTemp);
            this.uploadFileListCopy.push(fileTemp);
            console.log('上传的文件copy',this.fileListCopy);
            //return false;
        },
        // 文件上传
        uploadFile(options){

            // const config = {
            //     handleProgress:event => {
            //         console.log('上传中',event)
            //         if(event.lengthComputable){
            //             console.log('aaa')
            //         }
            //     },
            // }

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
            .then(res => {
                if(res.data.code != 200){
                    console.log(res.data);
                    this.$message.error(res.data.msg);
                    return;
                }
                this.$message.success("上传成功");
                this.$nextTick(() => {
                    this.fileListCopy.forEach((item) => {
                        if(item.uid === options.file.uid){
                            item.percentage = 100;
                            item.Path = res.data.data.FilePath;
                            item.MediaPath = res.data.data.MediaPath;
                        }
                    });
                })
                this.uploadFileListCopy.forEach((item) => {
                    if(item.uid === options.file.uid){
                        item.percentage = 100;
                        item.Path = res.data.data.FilePath;
                        item.MediaPath = res.data.data.MediaPath;
                    }
                })
            })
            .catch(err => {
                this.$message.error("网络或系统异常！")
                console.log(err);
            })
        },
        // 上传中
        
        // 上传成功处理
        successHandle(){
            //this.uploadVisible = true
        },
        // 上传失败处理
        errorHandle(){

        },
        // 上传弹框取消
        splitCancel(){
            this.uploadVisible = false;
        },
        // 上传弹框确定，进行视频切割
        splitSubmit(){
            if(this.uploadFileListCopy && this.uploadFileListCopy.length>0){
                this.uploadFileListCopy.forEach((item) => {
                    if(item.percentage === 100){
                        this.videoSplit(item);
                    }
                })
            }
            this.uploadVisible = false;
        },
        // 进行视频拆分
        videoSplit(video){
            console.log('进行视频拆分',video.Path)
            let formData = new FormData();
            formData.append(`FilePath`, video.Path);
            formData.append(`MediaPath`, video.MediaPath);
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
                    this.fileListCopy.forEach((item) => {
                        if(item.FileName == video.FileName){
                            item.FileNum = -1;//拆分失败标识
                        }
                    })
                    return;
                }
                this.$message.success(video.FileName + ",拆分成功");
                let data = res.data.data;
                // 如果拆分后返回的视频列表为空，把当前视频当作拆分后返回的列表
                if(!data || data.length<=0){
                    data = [];
                    data.push(video);
                }
                console.log('视频拆分成功返回的数据',data);
                if(data && data.length>0){
                    this.fileListCopy.forEach((item) => {
                        if(item.FileName == video.FileName){
                            item.FileNum = data.length;
                        }
                    })
                    this.generateSplitList(data,video.FileName)
                }
                //console.log('拆分后',video)
            })
            .catch(err => {
                this.$message.error("网络或系统异常！")
                this.fileListCopy.forEach((item) => {
                    if(item.FileName == video.FileName){
                        item.FileNum = -1;//拆分失败标识
                    }
                })
                console.log(err);
            })
        },
        // 视频拆分成功后封装拆封列表
        generateSplitList(splitList,fileName){
            // let urls = [];
            // for(let i=1;i<=fileNum;i++){
            //     let fileUrl = 'http://119.23.230.233/' + filePath + '/' + i + '.mp4';
            //     urls.push(fileUrl);
            // }
            splitList.forEach((item) => {
                item.checked = false;
            })
            let splitObj = {fileName:fileName,splitVideos:splitList};
            this.videoSplitObjs.push(splitObj);
            console.log('封装拆封列表',this.videoSplitObjs);
        },
        // 查看拆分的视频
        viewSplitVideos(video){
            let videoName = video.FileName;
            //let splitVideos = [];
            this.splitVideos = [];
            this.splitFragments = [];
            this.videoSplitObjs.forEach((item) => {
                if(item.fileName === videoName){
                    this.splitVideos = item.splitVideos;
                    this.pageParms.total = this.splitVideos.length;
                    this.pageHandle(1,this.pageParms.pageSize);
                }
            });
        },
        // 播放拆分视频
        playSplitVideos(videoObj){
            this.videoVisible = false;
            this.splitVideoSrc = this.appBaseUrl+videoObj.Path;
            this.$nextTick(()=>{
                this.videoVisible = true;
            })
        },
        // 打开素材库
        openMaterial(){
            this.addMaterialVisible = true;
        },
        // 选择素材取消事件
        splitCancel1(){
          this.addMaterialVisible = false;  
        },
        // 选择素材确定事件
        splitSubmit1(){
            this.selectedList.forEach((item) => {
                if (item) {
                    item.percentage = 100;
                    this.fileListCopy.push(item);
                    this.videoSplit(item);
                }
            })
            this.selectedList = [];
            this.addMaterialVisible = false;
        },
        // 子组件数据变化时
        changeVal(isSelect,video){
            if(isSelect){
                this.selectedList.push(video);
            }
            if(!isSelect){
                this.selectedList = this.selectedList.filter((item) => {
                    return item.Id != video.Id
                })
            }
            console.log('selectedList',this.selectedList)
        },
        // 选择事件
        selectHandle(isSelect,video,index){
            console.log('selectHandle',isSelect,video,index);
            // 如果勾选
            if(isSelect){
                this.splitFragments.push(video);

                if(this.splitVideos.length === this.splitFragments.length){
                    this.$nextTick(() => {
                        this.isSelectAll = true
                    })
                }
                if(this.splitVideos.length !== this.splitFragments.length){
                    this.$nextTick(() => {
                        this.isSelectAll = false
                    })
                }
            }
            if(!isSelect){
                this.splitFragments = this.splitFragments.filter((item) => {
                    return item.Id != video.Id
                })
                
                if(this.splitVideos.length === this.splitFragments.length){
                    this.$nextTick(() => {
                        this.isSelectAll = true
                    })
                }
                if(this.splitVideos.length !== this.splitFragments.length){
                    this.$nextTick(() => {
                        this.isSelectAll = false
                    })
                }
            }
            console.log('selectedList',this.splitFragments)
        },
        // 保存到素材库弹窗
        saveToMaterialDialog(){
            this.saveToMaterialVisible = true;
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
        // 拆分视频全选事件
        selectAllHandle(isSelect){
            // let vm = this;
            console.log('selectAllHandle',isSelect)
            //this.checked1 = true;

            //this.$nextTick(() => {
                if(isSelect){
                    this.$nextTick(() => {
                        
                        //this.isChecked = true;
                        this.splitVideos.forEach((item) => {
                            item.checked = true;
                        })
                        this.pageParms.pageDate.forEach((item) => {
                            item.checked = true;
                        })
                        this.splitFragments = this.splitVideos;
                        console.log('splitVideos',this.splitVideos)
                        console.log('lazeCheckbox',this.$refs.lazeCheckbox)
                    })
                    
                    
                }
                if(!isSelect){
                    this.$nextTick(() => {
                        //this.isChecked = false;
                        this.splitVideos.forEach((item) => {
                            item.checked = false;
                        })
                        this.pageParms.pageDate.forEach((item) => {
                            item.checked = false;
                        })
                         this.splitFragments = [];
                         console.log('splitVideos',this.splitVideos)
                         console.log('lazeCheckbox',this.$refs.lazeCheckbox)
                    })
                    
                }
                
            //})
            let mediaID = [];
            this.splitFragments.forEach((item) => {
                mediaID.push(item.Id);
            });
        },
        // 移除拆分的视频
        removeVideo(video){
            console.log('removeVideo',video)
            this.$messagebox.confirm(
                '确定删除[' + video.FileName + ']吗？',
                '删除确定',
                {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'Warning'
                }
            ).then(() => {
                //移除逻辑
                this.$nextTick(() => {
                    this.fileListCopy.forEach((item,index,arr) => {
                        if(item.Id === video.Id){
                            arr.splice(index,1)
                        }
                    })
                    this.splitVideos = [];
                    this.pageParms.pageDate = [];
                    console.log('fileListCopy',this.fileListCopy)
                })
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
            }).catch()
        },
        // 查看更多
        viewMore(){
            let data = this.fileListCopy;
            //let data1 = this.videoSplitObjs;
            let page = this.$router.resolve({
                name: 'splitViewMore',
                params: {
                    data1: JSON.stringify(data)
                }
            })
            window.open(page.href,'_blank');
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

        .container-main{
            padding-top: 5px;
            padding-bottom: 10px;
        }
        .main{
            height: 50%;
            .main-aside{
                display: flex;
                flex-direction: column;
                background-color: #FFFFFF;

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
                    flex-wrap: wrap;
                    width: 100%;
                    height: 505px;

                    .cover{
                        width: 120px;
                        margin-right: 15px;
                        position: relative;

                        >img{
                            width: 100%;
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

            .middle-aside{
                //height: 620px;
            }

            .middle-main{
                padding: 0;
                margin-left: 10px;
                //height: 620px;
            }
            
            .preview-block{
                display: flex;
                justify-content: center;
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
                flex-wrap: wrap;

                .select-div{
                    width: 150px;
                    height: 150px;
                    position: relative;

                    .video{
                        width: 100%;
                        height: 100%;
                    }
                    &.selected{
                        box-sizing: border-box;
                        border: 1px solid #2254F4;
                        border-radius: 10px;
                    }
                    &.unselected{
                        
                    }
                }

                .select-div:hover .mask-item{
                    display: block;
                    //padding: 10px 0;
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
                    background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));

                    &.selected{
                        display: block;
                    }
                    &.unselected{
                        display: none;
                    }
                    .checkbox{
                        left: 15px;
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

                .viewMore{
                    margin-left: auto;
                    margin-right: 15px;
                    margin-top: 15px;
                    color: #2254F4;
                    cursor: pointer;
                }
            
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

        // 弹出层高度
        // ::v-deep .el-dialog.add-material-dialog{
        //     height: 80%;
        //     max-height: 80%;
        //     overflow-y: hidden;
        // }
        // 弹出层里内容高度
        // ::v-deep .el-dialog__body.add-material-dialog{
        //     max-height: 70%!important;
        // }
        .add-material-dialog{
            overflow: hidden;
            .el-dialog{
                height: 80%;
                max-height: 80%;
                overflow: hidden;
            }
            弹出层里内容高度
            .el-dialog__body{
                position: absolute;
                max-height: 70%!important;
                overflow: hidden;
                overflow-y: auto;
            }
        } 
    }
}
</style>