<template>
    <div class="material-page">
        <div>
            <div class="all-file-left">
                <i class="file-img"></i> <span>全部行业</span>
            </div>
            <div class="all-file-right">
                <div class="upload" @click="() => uploadFild()">
                    <div>
                        <span class="file-load"></span>
                        <span class="add-file">上传素材库</span>
                    </div>
                </div>
                <!-- <div class="upload">
                    <div>
                        <span class="add img"></span> <span class="add">添加</span>
                    </div>
                </div> -->
            </div>
        </div>
        <div class="subfolder">
            <div>
                <div>行业分类 <span style="color: #999;">({{ mediaList.length}})</span> <el-icon>
                        <CaretRight class="careRight" color="#999" />
                    </el-icon> </div>
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
                <li v-for="(item, index) in mediaList " :key="index">
                    <img src="@/assets/images/file-img.png" alt="">
                    <div>{{ item.IndustryName }}</div>
                </li>
            </ul>
            <div style="position: relative;font-size: 14px;"> 内容 <span style="color: #999;">({{ mediaList.length}})</span>
                <el-icon>
                    <CaretRight class="careRight" color="#999" />
                </el-icon>
            </div>

            <div style="height:100%">
                <ul class="get-content">
                    <li v-for="(item, index) in mediaList " :key="index">
                        <video class="video" controls muted>
                            <source :src="`${appBaseUrl}${item.Path}`" />
                        </video>
                        <div>新建视频{{ item.Created }}</div>
                        <div class="mask-item">
                            <div>
                                <el-checkbox v-model="checked1" label="" size="large" class="checkbox" />
                                <span class="mixed-shear">混剪</span>
                            </div>
                            <div class="edit-wrap">
                                <button class="edit">编辑</button>
                                <div class="more-edit"><span class="more"></span>
                                    <ul class="more-list">
                                        <li>重命名</li>
                                        <li>创建副本</li>
                                        <li>复制到...</li>
                                        <li>移动到...</li>
                                        <li>下载</li>
                                        <li @click="() => deleteMediaChange(item.Id)">移入回收站</li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </li>
                </ul>
            </div>

        </div>
        <!--  v-if="mediaList.length == 0" -->
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

        <el-dialog v-model="dialogVisible" title="导入素材" width="30%" :before-close="handleCloseFile">
            <!-- action="/api/v1/import_media_byfile" -->
            <!-- :on-change="fileListHander" -->
            <el-upload 
                class="upload-demo" 
                drag 
                :headers="uploadHeaders"
                :http-request="upLoadRequest"
                :on-change="fileListHander"
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
        </el-dialog>
        <el-dialog v-model="visibleFile" title="导入素材" width="30%" :before-close="visibleFileClose">
            <ul>
                <li>模拟数据xxxxxxxx.mp4</li>
                <li>xxxxxxxx.mp4</li>
                <li>xxxxxx.mp4</li>
                <li>xxxxx.mp4</li>
            </ul>
            <template #footer>
                <el-button @click="() => addFile()" class="addFile">+添加文件</el-button>
                <el-button type="primary" @click="() => importFileHander()" class="add-primary">
                    确定
                </el-button>
            </template>
        </el-dialog>
        <DialogView :title="'导入素材库'" v-model:visible.sync="dialogFormVisible" @updateVisible="updateVisible"
            @resetPopupData="resetPopupData" @submitPopupData="submitPopupData" @handleClose="handleClose" :width="'20%'">
        </DialogView>
    </div>
</template>
<script>
import DialogView from '../../components/Dialog.vue'
import { importMediaFile, getMediaList, deleteMedia } from '../../api/index'
const appBaseUrl = import.meta.env.VITE_APP_BASE_URL
import axios from 'axios'

export default {
    components: {
        DialogView
    },
    data() {
        return {
            appBaseUrl,
            number: 0,
            value1: true,
            dialogVisible: false,
            visibleFile: false,
            dialogFormVisible: false,
            MediaType: 'MediaType',
            file: '@/assets/video/video1.mp4',
            isEmpty: false,
            uploadData: {
                MediaType: 'video',
                IndustryId: '1000'
            },
            uploadHeaders: {
                toke: sessionStorage.getItem('Authorization'),
                'Accept': 'application/json'
            },
            mediaList: [],
            dataTime: '',
            deletelist:[],
        }
    },
    computed: {
        uploadUrl() {
            return `/api/v1/import_media_byfile?MediaType=${this.uploadData.MediaType}&IndustryId=${this.uploadData.IndustryId}`
        }
    },
    mounted() {
        getMediaList().then(res => {
            // console.log("获取素材库视频", res.data.data);
            // const dataTime = res.data.data
            this.mediaList = res.data.data;
            if (this.mediaList == '{}') {
                this.mediaList = null;
                this.isEmpty = true;
            }

        })
    },
    methods: {
        upLoadRequest(option) {
            const formData = new FormData()
            console.log(option.filename);
            formData.append(`file`, option.file)
            console.log(formData)
            axios({
                url: this.uploadUrl,
                method: 'put',
                data: formData,
                headers: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjp7IlVzZXJJZCI6IjY0NjJlNjYyZWYwMjMyZTZkZmFkMzFkNiJ9LCJleHAiOjE2ODQyNDYzMjEsImlzcyI6Imh1bWFuIn0.YNtiLE_c5zpvgldpEqbyHp5OTHl1UDeHAuPSjqxKvCo',
                  "Content-Type": "multipart/form-data",
                }
            }).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        },
        uploadFild() {
            this.dialogVisible = true;
        },
        handleCloseFile() {
            this.dialogVisible = !this.dialogVisible
        },
        visibleFileClose() {
            this.visibleFile = !this.visibleFile
        },
        addFile() {
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
        fileListHander() {
            // this.visibleFile = true
            this.dialogVisible = false;
            this.$nextTick(()=>{
                 getMediaList().then(res => {
            // console.log("获取素材库视频", res.data.data);
            // const dataTime = res.data.data
            this.mediaList = res.data.data;
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
        deleteMediaChange(item) {
            this.deletelist[0] = item;
            console.log(  this.deletelist);  
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
        height: 700px;
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
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));

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
        padding: 6px;
        height: 16px;
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
    width: 20px;
    height: 20px;
    margin-left: 10px;
}
</style>
  