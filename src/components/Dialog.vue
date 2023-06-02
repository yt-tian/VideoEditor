<template>
    <div class="dialog">
        <el-dialog :title="title" v-model="dialogFormVisible" :width="popupWidth" top="20%">
            <el-form :model="form">
                <el-form-item label="行业分组" :label-width="formLabelWidth">
                </el-form-item>
                <el-select v-model="folderName" placeholder="选择文件夹">
                    <el-option :label="item" v-for="(item, index) in fileList" :value="item"
                        :key="index"></el-option>
                </el-select>
            </el-form>
            <div vlot:="footer" class="dialog-footer">
                <el-button @click="() => Cancel()">取 消</el-button>
                <el-button type="primary" @click="() => Save()">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
//import { getIndustryLsit,getMediaList } from '../api/index'

export default {
    props: {
        title: {
            type: String,
            default: ""
        },
        popupWidth: {
            type: String,
            default: '20%'
        },
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            form: {
                name: '',
                region: '',
                type: [],
            },
            formLabelWidth: '120px',
            fileList: [],
            folderName: ''
        }
    },
    watch: {
    },
    computed: {
        dialogFormVisible: {
            get() {
                return this.visible
            },
            set(val) {
                console.log(val);
                // 当visible改变的时候，触发父组件的 updateVisible方法，在该方法中更改传入子组件的 centerDialogVisible的值
                this.$emit('updateVisible', val)
            }
        }
    },
    created(){
        this.getMediaFolder();
    },
    mounted() {
        // getIndustryLsit().then(res => {
        //     const list = JSON.stringify(res.data.data);
        //     this.form.type = JSON.parse(list);
        //     console.log("getIndustryLsit:", this.form.type);

        // })

    },
    methods: {
        Cancel() {
            this.form.region = '';
            this.$emit('resetPopupData')
        },
        Save() {
            // console.log("行业",this.form.region);
            this.$emit('submitPopupData', this.folderName)
        },
        handleClose() {
            this.form.region = '';
            this.$emit('handleClose')
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
                    this.fileList = res.data.data;
                    //console.log("getMediaFolder",this.fileList);
                }
                //console.log("getMediaFolder",res.data);
            })
            .catch(err => {
                this.$message.error("网络或系统异常！")
                console.log(err);
            })
        },
    },
}
</script>
<style scoped lang="less">
:deep(.el-form-item__label) {
    justify-content: start !important;
}

:deep(.el-dialog__title) {
    font-weight: bold;
    font-family: PingFang SC;
}

:deep(.el-form-item) {
    margin-bottom: 0 !important;

    .el-form-item__label {
        text-align: left !important;
        width: 0px;
    }
}

:deep(.el-dialog) {
    width: 360px !important;
    border-radius: 10px !important;

    .el-select {
        width: 100%;
    }

}

:deep(.el-dialog>.el-dialog__body) {
    padding: 0 20px;
}

:deep(.el-button--primary) {
    background-color: #2254f4;
    border-radius: 124px;
    padding: 14px 24px;
    // width: 100px;
    height: 44px;
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

:deep(.el-dialog__headerbtn .el-dialog__close) {
    color: #fff;
    background-color: #5a5a5a;
    border-radius: 50%;
}</style>