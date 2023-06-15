<template>
    <div class="material-page">
        <div>
            <div class="all-file-left">
                <i class="file-img"></i> <span>全部文件夹</span>
            </div>
            <div class="all-file-right">
                <div class="upload" @click="() => uploadFild()">
                    <div>
                        <span class="file-load"></span>
                        <span class="add-file">上传素材</span>
                    </div>
                </div>
                <div class="upload">
                    <div>
                        <span class="add img"></span> <span class="add" @click="addFolder()">添加</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="subfolder">
            <div>
                <div>子文件夹 <span style="color: #999;">({{ num}})</span> 
                    <el-icon>
                        <CaretRight class="careRight" color="#999" />
                    </el-icon> 
                </div>
            </div>
            <div class="sub-right">
                <div>全部尺寸 <el-icon>
                        <ArrowDown color="#999" class="arrow-down" />
                    </el-icon></div>
                <div>创建时间 </div>
                <div> <el-switch size="small" v-model="value1" />显示行业分类内容 </div>
                <div>排列方式 <el-icon>
                        <Menu class="menu" />
                    </el-icon></div>
            </div>
        </div>

        <div class="all-industry">
            <ul class="industry-wrap">
                <li v-for="(item, index) in fileList " :key="index" @click="fileDirClick(item)">
                    <img src="@/assets/images/file-img.png" alt="" :class="{selected:item.key===folderNameSelect?true:false}">
                    <div class="folder-mask" :class="{selected:item.key===folderNameSelect?true:false}">
                        <el-checkbox v-if="item.key===folderNameSelect?true:false" 
                                    :v-model="item.key===folderNameSelect?true:false" 
                                    :checked="item.key===folderNameSelect?true:false" label="" size="large" class="folder-checkbox" />
                        <div class="del-icon" @click="delFolder(item)"><el-icon><DeleteFilled /></el-icon></div>
                    </div>
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
                    <li v-for="(item, index) in mediaList " :key="index" >
                        <video class="video" controls muted :src="`${viewUrl}${item.Path}`" @play="videoPlay">
                            <!-- <source :src="`${appBaseUrl}${item.Path}`" /> -->
                        </video>
                        <!-- <div class=""> -->
                        <el-checkbox v-model="item.checked" :checked="item.checked" label="" size="large" class="checkbox" @change="checkChange($event,item,index)" />
                            <!-- <span class="mixed-shear">混剪</span> -->
                        <!-- </div> -->
                        <div class="videoName">{{ item.FileName }}</div>
                        <div class="mask-item" :class="{selected:item.checked,unselected:!item.checked}" @click="playPreview(item)">
                            
                            <div class="edit-wrap">
                                <button class="edit">编辑</button>
                                <div class="more-edit"><span class="more"></span>
                                    <ul class="more-list">
                                        <li>重命名</li>
                                        <li>创建副本</li>
                                        <li>复制到...</li>
                                        <li>移动到...</li>
                                        <li>下载</li>
                                        <li @click="() => deleteMediaChange(item)">删除</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="empty-file" v-if="isEmpty">
            <div><img src="@/assets/images/empty-floder.png" alt=""></div>
            <div>上传你的第一个文件吧</div>
            <div class="upload" @click="() => uploadFild()">
                <div>
                    <span class="file-load"></span>
                    <span class="add-file">上传素材库</span>
                </div>
            </div>
        </div>
        <div class="check-all" v-if="isCheck">
            <div class="check-left">
                <el-checkbox v-model="isSelectAll" :checked="isSelectAll" label="全选" @change="selectAllHandle($event)" />
                <span style="font-size: 14px;color: #999;">已选择 {{ selectedList.length }}</span> <span class="line"></span>
                <button class="button">创建副本</button>
                <button class="button">移动到...</button>
                <button class="button">复制到...</button>
                <button class="button" @click="downSelected">下载</button>
                <button class="button" @click="deleteSelectedMedia">删除</button>
            </div>
            <div class="check-right" @click="closeCheckRight">
                <el-icon><CloseBold /></el-icon>
            </div>
        </div>
        <el-dialog v-model="dialogVisible" :close-on-click-modal="false" title="导入素材" width="30%" :before-close="handleCloseFile">
            <!-- action="/api/v1/import_media_byfile" -->
            <!-- :on-change="fileListHander" -->
            <div v-if="importPart1Flag">
                <el-form :model="form">
                    <el-form-item label="*导入位置" ></el-form-item>
                    <el-select v-model="importFolderName" placeholder="全部来源">
                        <el-option :label="item.key" v-for="(item, index) in fileList" :value="item.key" :key="index"></el-option>
                    </el-select>
                </el-form>
                <div vlot:="footer" class="dialog-footer">
                    <el-button @click="importMaterialCancel()">取 消</el-button>
                    <el-button type="primary" @click="importMaterialSubmit">确 认</el-button>
                </div>
            </div>
            <!-- :http-request="upLoadRequest" -->
            <div v-else-if="importPart2Flag">
                <el-upload
                    class="upload-demo" 
                    drag 
                    v-model:file-list="importFileList"
                    accept=".mp4"
                    :auto-upload="false"
                    :show-file-list="false"
                    :headers="uploadHeaders"
                    :on-change="fileListHander"
                    :before-upload="beforeUpload"
                    multiple>
                    <el-icon class="el-icon--upload uploadMp4"></el-icon>
                    <div class="el-upload__text">
                        拖拽文件到此处，或者 <br /><em style="color:#2254F4;">选择文件...</em>
                    </div>
                    <template #tip>
                        <div class="el-upload__tip">
                            支持同时上传MP4、MOV、MP3、PMG、JPG、GIF格式的素材，视频时长不得超过60分钟
                        </div>
                    </template>
                </el-upload>
            </div>
            <div v-else-if="importPart3Flag">
                <div class="file-list-div">
                    <div class="file-item" v-for="(item,index) in importFileList" :key="index">
                        <div class="item-img">
                            <img src="@/assets/images/mp4.png"/>
                        </div>
                        <div>{{ item.name }}</div>
                        <div class="item-del" @click="removeFile(item)"><el-icon><DeleteFilled /></el-icon></div>
                    </div>
                    <div class="file-foot">
                        <div>
                            <el-button type="" @click="addFile"><el-icon><Plus /></el-icon>添加文件</el-button>
                        </div>
                        <div class="foot-sumit">
                            <el-button type="" @click="uploadSumit">确定</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog v-model="visibleFile" title="导入素材" width="30%" :before-close="visibleFileClose">
            <ul>
                <li>模拟数据xxxxxxxx.mp4</li>
                <li>xxxxxxxx.mp4</li>
                <li>xxxxxx.mp4</li>
                <li>xxxxx.mp4</li>
            </ul>
            <template #footer>
                <el-button @click="() => addFile1()" class="addFile">+添加文件</el-button>
                <el-button type="primary" @click="() => importFileHander()" class="add-primary">
                    确定
                </el-button>
            </template>
        </el-dialog>
        <DialogView :title="'导入素材库'" v-model:visible.sync="dialogFormVisible" @updateVisible="updateVisible"
            @resetPopupData="resetPopupData" @submitPopupData="submitPopupData" @handleClose="handleClose" :width="'20%'">
        </DialogView>

        <!-- 添加文件夹弹出框 -->
        <el-dialog title="添加文件夹" v-model="addFolderVisible" :destroy-on-close="true" width="30%" top="20%">
            <el-input v-model="folderName" placeholder="输入文件夹名称"></el-input>
            <div vlot:="footer" class="dialog-footer">
                <el-button @click="cancelAddFolder()">取 消</el-button>
                <el-button type="primary" @click="addFolderSubmit">确 认</el-button>
            </div>
        </el-dialog>
        <!-- 视频预览播放器 -->
        <el-dialog v-model="previewVideoVisible" :fullscreen="true" :destroy-on-close="true" :close-on-click-modal="false" width="50%" heigth="100%">
            <div style="height: 90vh;">
                <el-scrollbar>
                    <video id="previewVideo" :src="previewSrc" class="previewVideo" controls muted></video>
                </el-scrollbar>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import DialogView from '../../components/Dialog.vue'
//import {saveAs} from 'file-saver'
import { importMediaFile, getMediaList, deleteMedia,deleteMediaFolder, downloadMedia } from '../../api/index'
const appBaseUrl = import.meta.env.VITE_APP_BASE_URL
import axios from 'axios'
export default {
    components: {
        DialogView
    },
    data() {
        return {
            viewUrl: 'http://119.23.230.233:81/',
            appBaseUrl,
            number: 0,
            checked1: false,
            folderIsSelect: true,
            folderNameSelect: '',
            isSelectAll: false,
            value1: true,
            dialogVisible: false,
            addFolderVisible: false,
            folderName: '',// 添加文件夹的名称
            form: '',
            importFolderName: '',// 上传文件选择的文件夹名称
            visibleFile: false,
            dialogFormVisible: false,
            MediaType: 'MediaType',
            videoType: 'video',
            file: '@/assets/video/video1.mp4',
            isEmpty: false,
            uploadData: {
                MediaType: 'video',
                IndustryId: '1000'
            },
            uploadHeaders: {
                token: sessionStorage.getItem('Authorization'),
                "Content-Type": "multipart/form-data",
            },
            mediaList: [],
            dataTime: '',
            deletelist:[],
            isCheck:false,
            checkVideoValue:false,
            num:0,
            fileList: [],
            IndustryId:null,
            selectedList: [], // 选中列表
            importPart1Flag: true,
            importPart2Flag: false,
            importPart3Flag: false,
            importFileList: [], // 导入素材文件列表
            previewVideoVisible: false,
            previewSrc: 'http://119.23.230.233/video/646742be0806630be781ff1a/视频拆分上传的文件/f79c212d722816f503eba2cc6f3a8686aaa.mp4'
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
        // 获取媒体文件夹
        getMediaFolder(){
            this.$http.get('/get_media_folder')
            .then(res => {
                if(res.data.code !== 200){
                    //console.log("aaa",res);
                    return;
                }
                if(res.data.data && res.data.data.length>0){
                    this.$nextTick(() => {
                        this.fileList = res.data.data;
                    })
                    //console.log("getMediaFolder",this.fileList);
                }
                //console.log("getMediaFolder",res.data);
            })
            .catch(err => {
                this.$message.error("网络或系统异常！")
                console.log(err);
            })
        },
        // 添加文件夹
        addFolder(){
            this.addFolderVisible = true;
        },
        // 关闭添加文件夹弹窗
        cancelAddFolder(){
            this.addFolderVisible = false;
        },
        // 添加文件夹
        addFolderSubmit(){
            if(!this.folderName || this.folderName.length===0){
                this.$message.warning("文件夹名称不能为空");
                return;
            }
            if(this.fileList.length > 0 && this.fileList.indexOf(this.folderName) !== -1){
                this.$message.warning("文件夹名称已存在");
                return;
            }
            this.$http.post('/add_media_folder',{"MediaPath":this.folderName,"MediaType": "video"})
            .then(res => {
                if(res.data.code != 200){
                    console.log(res.data);
                    return;
                }
                this.$message.success("添加成功");
                this.addFolderVisible = false;
                this.getFoldersByMedia();
            })
            .catch(err => {
                this.$message.error("网络或系统异常！")
                console.log(err);
            })
        },
        fileDirClick(item) {
            this.$nextTick(() => {
                this.folderNameSelect = item.key;
            })
            this.isCheck = false;
            this.isSelectAll = false;
            this.selectedList = [];

            // 切换文件夹时，把视频选中状态改成false
            let videoList = item.list;
            if(videoList && videoList.length>0){
                videoList.forEach((video) => {
                    video.checked = false;
                })
            }

            //console.log(JSON.parse(JSON.stringify(item.list)));
            //console.log('fileDirClick',item.list)
            this.mediaList = [];
            //this.mediaList = JSON.parse(JSON.stringify(item.list))
            this.$nextTick(() => {
                this.mediaList = JSON.parse(JSON.stringify(item.list))
                //console.log('fileDirClick1',this.mediaList)
            })
            
        },
        upLoadRequest(option) {
            let formData = new FormData();
            formData.append(`file`, option.file);
            axios({
                url: '/api/v1/import_media_byfile?MediaType=video&MediaPath=' + this.importFolderName,
                method: 'put',
                data: formData,
                headers: {token: sessionStorage.getItem('Authorization'),"Content-Type": "multipart/form-data"}
            }).then(res => {
                if(res.data.code != 200){
                    console.log(res.data);
                    this.$message.error(res.data.msg);
                    return;
                }
                this.$message.success("上传成功");
                this.$nextTick(() => {
                    this.importFileList.forEach((item) => {
                        if(item.uid === option.file.uid){
                            item.percentage = 100;
                            item.Path = res.data.data.FilePath;
                            item.MediaPath = res.data.data.MediaPath;
                        }
                    });
                })

            }).catch(err => {
                this.$message.error("网络或系统异常！")
                console.log(err);
            })
        },
        uploadFild() {
            this.dialogVisible = true;
        },
        handleCloseFile() {

            this.importFolderName = '';
            this.importFileList = [];
            this.importPart1Flag = true;
            this.importPart2Flag = false;
            this.importPart3Flag = false;

            this.dialogVisible = !this.dialogVisible
        },
        visibleFileClose() {
            this.visibleFile = !this.visibleFile
        },
        addFile1() {
            this.visibleFile = !this.visibleFile
            this.dialogVisible = !this.dialogVisible
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
        async submitPopupData(industryId) {
            console.log(this.MediaID, this.MediaType, industryId);
            importMediaFile(this.MediaType, industryId, this.file).then(res => {
                console.log("导入素材库返回：", res);
                this.$message({
                    message: '本地素材导入成功！',
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
        // 删除单个媒体视频
        deleteMediaChange(item) {
            this.$messagebox.confirm(
                '确定删除[' + item.FileName + ']吗？',
                '删除确定',
                {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'Warning'
                }
            ).then(() =>{
                console.log('deleteMediaChange',item)
                let MediaID = [];
                MediaID.push(item.Id)
                deleteMedia(MediaID).then(res => {
                    if(res.data.code != 200){
                        console.log(res.data);
                        this.$message.error(res.data.msg);
                        return;
                    }
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    // 获取媒体文件
                    this.getFoldersByMedia();
                })
            }).catch(() => {
                this.$message.info('取消删除')
            })
        },
        // 删除选中的媒体视频
        deleteSelectedMedia(){
            if(this.selectedList.length <= 0){
                this.$message.warning('至少选中一个文件');
            }
            this.$messagebox.confirm(
                '确定删除选中的文件吗？',
                '删除确定',
                {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'Warning'
                }
            ).then(() =>{
                let MediaID = [];
                this.selectedList.forEach((video) => {
                    MediaID.push(video.Id)
                })
                deleteMedia(MediaID).then(res => {
                    if(res.data.code != 200){
                        console.log(res.data);
                        this.$message.error(res.data.msg);
                        return;
                    }
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    // 清除选文件夹的选中状态
                    this.folderNameSelect = '';
                    // 获取媒体文件
                    this.getFoldersByMedia();
                })
            }).catch(() => {
                this.$message.info('取消删除')
            })
        },
        // 下载选中
        async downSelected(){
            //event.preventDefault();
            if(this.selectedList.length <= 0){
                this.$message.warning('至少选中一个文件');
                return;
            }

            let count = 0; // 已下载的文件数
            for(var i=0;i<this.selectedList.length;i++){
                let file = this.selectedList[i];
                console.log('downSelected',file)
                let url = this.viewUrl + file.Path + '?download=1';
                downloadMedia(url)
                if(++count >= 10){
                    // await this.pause(1000);
                    count = 0;
                }
            }
        },
        downFile(item){
            // let url = this.viewUrl + item.Path + '?download=1';
            // const link = document.createElement('a');
            // link.href = url;
            // let name = item.FileName;
            // // link.download = name;
            // link.setAttribute('download',name)
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);

            let url = this.viewUrl + item.Path + '?download=1';
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.height = 0;
            iframe.src = url;
            iframe.setAttribute("name", item.FileName);
            // let name = item.FileName;
            // link.download = name;
            //link.setAttribute('download',name)
            document.body.appendChild(iframe);
            console.log('iframe',iframe)
            // setTimeout(() => { 
            //     iframe.remove() //无奈之举，iframe 没有onload事件，只能放在setTimeout里清除了，时间稍微大一点，免得文件太大还没有下载完
            // }, 500000)
            // link.click();
            // document.body.removeChild(link);
        },
        pause(msec) { // 异步暂停函数
            return new Promise(
                (resolve) => {
                    setTimeout(resolve, msec || 1000);
                }
            );
        },
        // 选择改变事件
        checkChange(isSelect,video,index){
            this.isCheck = true
            console.log('checkChange',isSelect,video,index)
            // 如果勾选
            if(isSelect){
                this.selectedList.push(video);
                if(this.mediaList.length === this.selectedList.length){
                    this.isSelectAll = true
                }
                if(this.mediaList.length !== this.selectedList.length){
                    this.isSelectAll = false;
                }
            }
            // 如果不勾选
            if(!isSelect){
                this.selectedList = this.selectedList.filter((item) => {
                    return item.Id != video.Id
                })
                if(this.mediaList.length === this.selectedList.length){
                    this.isSelectAll = true
                }
                if(this.mediaList.length !== this.selectedList.length){
                    this.isSelectAll = false;
                }
            }
            if(this.selectedList.length === 0){
                this.isCheck = false;
            }
        },
        // 全选事件
        selectAllHandle(isSelect){
            if(isSelect){
                this.mediaList.forEach((item) => {
                    item.checked = true;
                })
                this.selectedList = this.mediaList;
            }
            if(!isSelect){
                this.mediaList.forEach((item) => {
                    item.checked = false;
                })
                this.selectedList = [];
            }
        },
        // 关闭全选操作栏
        closeCheckRight(){
            this.isCheck = false;
        },
        // 删除文件夹
        delFolder(folder){
            console.log('delFolder',folder)
            this.$messagebox.confirm(
                '确定删除[' + folder.key + ']吗？',
                '删除确定',
                {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'Warning'
                }
            ).then(() =>{
                // 删除逻辑
                deleteMediaFolder(folder.key, this.videoType).then(res => {
                    if(res.data.code != 200){
                        console.log(res.data);
                        this.$message.error(res.data.msg);
                        return;
                    }
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    // 获取媒体文件
                    this.getFoldersByMedia();
                }).catch(err => {
                    this.$message.error("网络或系统异常！")
                    console.log(err);
                })
            }).catch(() => {
                // 取消逻辑
                this.$message.info('取消删除')
            })
        },
        // 导入素材取消事件
        importMaterialCancel(){
            this.dialogVisible = false;
        },
        // 导入素材确定事件
        importMaterialSubmit(){
            if(!this.importFolderName){
                this.$message.warning('请选择导入存放的文件夹');
                return;
            }
            this.$nextTick(() => {
                
                this.importPart1Flag = false;
                this.importPart2Flag = true;
            })
        },
        // 预览视频
        playPreview(video){
            this.previewSrc = this.viewUrl + video.Path;
            this.previewVideoVisible = true;
            this.$nextTick(() => {
                let player = document.getElementById("previewVideo");
                console.log('player',player)
                if(!player.iffullscreen){
                    player.iffullscreen = true;
                }
                player.play();
            })
        },
        videoPlay(){
            console.log('videoPlay');
        },
        fileListHander(file) {
            // this.visibleFile = true
            this.importFileList.push(file);
            console.log('importFileList',this.importFileList);
            this.$nextTick(()=>{
                this.importPart2Flag = false;
                this.importPart3Flag = true;
            })
           
        },
        importFileHander() {
            this.visibleFile = false
            this.dialogFormVisible = true;
        },
        // 上传前处理
        beforeUpload(file){
            console.log('beforeUpload',file);
            let reg = new RegExp("[/\\\\*:：?？\"“”<《>》|()（） ]")
            if(reg.test(file.name)){
                this.$message.warning('文件名不能包含 /\\*:?"<>|() 空格等特殊字符，请修改后重新上传');
                return false;
            }
            
        },
        // 移除文件
        removeFile(video){
            this.importFileList = this.importFileList.filter((item) => {
                return item.uid != video.uid
            })
        },
        addFile(){
            this.$nextTick(() => {
                this.importPart3Flag = false;
                this.importPart2Flag = true;
            })
            
        },
        // 上传
        uploadSumit(){
            if(!this.importFileList && this.importFileList.length<=0){
                this.$message.warning('上传的文件列表不能为空');
                return;
            }
            this.importFileList.forEach((video) => {
                this.$message.info(video.name + "，开始上传");
                let formData = new FormData();
                formData.append(`file`, video.raw);
                axios({
                    url: '/api/v1/import_media_byfile?MediaType=video&MediaPath=' + this.importFolderName,
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
                    this.$message.success(video.name + "，上传成功");
                    this.getFoldersByMedia();
                })
                .catch(err => {
                    this.$message.error("网络或系统异常！")
                    console.log(err);
                })
            })

            this.importFolderName = '';
            this.importFileList = [];
            this.importPart1Flag = true;
            this.importPart2Flag = false;
            this.importPart3Flag = false;

            this.dialogVisible = false;
        }
    },
}
</script>
<style scoped lang="less">
.material-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: calc(100% - 60px);
    margin: 24px;
    padding: 10px;
    border-top-left-radius: 20px;
    background-color: #fff;

    >div {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 52px;
    }

    .all-file-left {
        height: 32px;
        padding: 10px;

        >span {
            padding-bottom: 6px;
            border-bottom: 2px solid #000;
        }

        .file-img {
            position: relative;
            top: 9px;
            right: 4px;
            display: inline-block;
            cursor: pointer;
            width: 30px;
            height: 30px;
            background: url(../../assets/images/file.png) center center no-repeat;
        }
    }

    .file-load {
        // position: relative;
        // top: 9px;
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url(../../assets/images/file-load.png) center center no-repeat;
    }

    .upload {
        display: flex;
        flex-direction: column;
        padding: 8px 12px;
        margin-right: 36px;
        cursor: pointer;
        border-radius: 5px;
        color: #fff;
        text-align: center;
        background: linear-gradient(106deg, #2CC8F7 0%, #8262F4 47%, #F0397C 99%);

        >div> {
            .img {
                display: inline-block;
                width: 20px;
                height: 20px;
                background: url(../../assets/images/add.png) center center no-repeat;
            }

            .add {
                display: inline-block;
                width: 28px;
                vertical-align: middle;
            }

            .add-file {
                display: inline-block;
                height: 27px;
                vertical-align: middle;
            }
        }

    }

    .all-file-right {
        display: flex;
        height: 32px;
        padding: 10px;
        font-size: 14px;
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

    .menu {
        position: absolute;
        top: 2px;
        left: 0px;
        cursor: pointer;
    }

    .empty-file {
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        >div {
            margin: 10px 0;
            font-size: 12px;
        }

        >.upload {
            display: flex;
            height: 20px;
            // padding: 10px;
            margin-right: 0;
        }
    }

    .previewVideo{
        width: 100%;
        height: 90vh;
    }

    .file-list-div{
        .file-item{
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            height: 60px;
            background: #F6F7F9;
            line-height: 60px;
            margin-bottom: 2px;

            .item-img{
                margin-right: 9px;
                display: flex;
                
                >img{
                    // height: 100%;
                    // width: 29px;
                    // height: 35px;
                    // justify-content: center;
                    align-items: center;
                }
            }

            .item-del{
                margin-left: auto;//元素靠右
            }
        }

        .file-foot{
            display: flex;
            flex-wrap: wrap;
            margin-top: 50px;

            .foot-sumit{
                margin-left: auto;//元素靠右
            }
        }
    }
}

.uploadMp4 {
    width: 150px;
    height: 110px;
    background: url(../../assets/images/uploadMp4.png) center center no-repeat;
    background-size: cover;
}

.addFile {
    border: none;
    color: #2254F4;
}

:deep(.el-dialog__footer) {
    justify-content: space-between;
    display: flex;
}

.add-primary {
    width: 78px;
    height: 32px;
    border-radius: 5px;
    border: none;
    background: linear-gradient(111deg, #2CC8F7 0%, #8262F4 47%, #F0397C 100%);
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
            position: relative;

            >img{
                width: 78px;
                height: 60px;
                box-sizing: border-box;

                &.selected{
                    border: 1px solid #2254F4;
                }
                &.unselected{
                    //display: none;
                }
            }

            >div {
                font-family: PingFangSCMedium-Medium;
                font-size: 12px;
                font-weight: normal;
                text-align: center;
                //margin-top: 10px;
                color: #999;
            }
        }
    }
    .industry-wrap>li:hover .folder-mask{
        display: block;
    }
    .folder-mask{
        width: 78px;
        height: 60px;
        //margin: 0 22px;
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));

        &.selected{
            display: block;
        }
        &.unselected{
            display: none;
        }

        .folder-checkbox{
            width: 25%;
            height: 25%;
            position: absolute;
            top: 10px;
            left: 0px;
        }
        .del-icon{
            width: 25%;
            height: 25%;
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #FFF;
        }
    }

    .get-content {
        display: flex;
        height: 520px;
        width: 100%;
        flex-wrap: wrap;
        overflow-y: scroll;

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

            .videoName{
                width: 100%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            .checkbox{
                position: absolute;
                left: 22px;
                top: 17px
            }

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

            margin-top: 110%;
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
  