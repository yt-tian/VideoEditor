<template>
    <div class="material-page">
        <div>
            <div class="all-file-left">
                <i class="file-img"></i> <span>全部行业</span>
            </div>
            <div class="all-file-right">
                <div class="upload">
                    <div>
                        <span class="file-load"></span>
                        <span class="add-file" @click="() => uploadFild()">上传素材库</span>
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
                <div>行业分类 <span>({{ number }})</span> <el-icon>
                        <CaretRight class="careRight" color="#999" />
                    </el-icon> </div>
            </div>
            <div class="sub-right">
                <div>全部尺寸 <el-icon>
                        <ArrowDown color="#999" class="arrow-down" />
                    </el-icon></div>
                <div>创建时间 </div>
                <div> <el-switch size="small" v-model="value1" />显示子文件夹内容 </div>
                <div>排列方式 <el-icon>
                        <Menu class="menu" />
                    </el-icon></div>
            </div>
        </div>

        <div class="all-industry">
            <ul class="industry-wrap">
                <li>
                    <img src="@/assets/images/file-img.png" alt="">
                    <div>金融行业</div>
                </li>
            </ul>
            <div style="position: relative;"> 内容({{ number }})<el-icon>
                    <CaretRight class="careRight" color="#999" />
                </el-icon></div>

            <div style="height:calc(100% - 120px)">
                <ul class="get-content">
                    <li>
                        <div>新建视频 2022-23-55</div>
                    </li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>

        </div>

        <div class="empty-file" v-if="isEmpty">
            <div><img src="@/assets/images/empty-floder.png" alt=""></div>
            <div>上传你的第一个文件吧</div>
            <div class="upload">
                <div>
                    <span class="file-load"></span>
                    <span class="add-file" @click="() => uploadFild()">上传素材库</span>
                </div>
            </div>
        </div>

        <el-dialog v-model="dialogVisible" title="导入素材" width="30%" :before-close="handleCloseFile">
            <!-- action="/api/v1/import_media_byfile" -->
            <el-upload class="upload-demo" 
                drag 
                :headers="uploadHeaders"
                action="api/v1/import_media_byfile"
                :data="uploadData"
                :on-change="fileListHander" multiple>
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
import { importMediaFile } from '../../api/index'
export default {
    components: {
        DialogView
    },
    data() {
        return {
            number: 0,
            value1: true,
            dialogVisible: false,
            visibleFile: false,
            dialogFormVisible: false,
            MediaType: 'MediaType',
            file: '@/assets/video/video1.mp4',
            isEmpty: false,
            uploadData: {
                MediaType: '',
                IndustryId : ''
            },
            uploadHeaders: {
                toke: sessionStorage.getItem('Authorization')
            }
        }
    },
    computed: {

    },
    mounted() {

    },
    methods: {
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
            this.visibleFile = true
            this.dialogVisible = false
        },
        importFileHander() {
            this.visibleFile = false
            this.dialogFormVisible = true;
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
        margin-bottom: 18px;

        >li {
            width: 80px;

            >div {
                font-family: PingFangSCMedium-Medium;
                font-size: 12px;
                font-weight: normal;
                text-align: center;
                margin-top: 10px;
            }
        }

    }

    .get-content {
        display: flex;
        height: 400px;
        width: 100%;
        flex-wrap: wrap;
        overflow-y: scroll;

        >li {
            display: flex;
            align-items: end;
            justify-content: center;
            width: 220px;
            height: 312px;
            border-radius: 10px;
            margin: 10px 18px;
            opacity: 1;
            background: #F8F9F9;
            border: 1px solid #EBEBEB;
            >div{

            }
        }
    }
}</style>
  