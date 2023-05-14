<template>
    <div class="dialog">
        <el-dialog :title="title" :visible.sync="dialogFormVisible"
            :width="popupWidth" top="20%">
            <el-form :model="form">
                <el-form-item label="行业分组" :label-width="formLabelWidth">
                </el-form-item>
                <el-select v-model="form.region" placeholder="农业和食品行业">
                    <el-option :label="item.Industry" v-for="(item, index) in form.type" :value="item.ID"  :key="index"></el-option>
                </el-select>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="() => Cancel()">取 消</el-button>
                <el-button type="primary" @click="() => Save()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import {getIndustryLsit} from '../api/index'
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
                type:[],
            },
            formLabelWidth: '120px'
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
    mounted() {
         getIndustryLsit().then(res=>{
            const list  =JSON.stringify(res.data.data);
            this.form.type = JSON.parse(list);
            console.log("getIndustryLsit:",this.form.type);
            
        })
    },
    methods: {
        Cancel() {
            this.form.region = '';
            this.$emit('resetPopupData')
        },
        Save() {
            // console.log("行业",this.form.region);
            this.$emit('submitPopupData',this.form.region)
        },
        handleClose() {
            this.form.region = '';
            this.$emit('handleClose')
        }
    },
}
</script>
<style scoped lang="less">
/deep/.dialog>.el-form-item__label {
    text-align: left !important;
}

/deep/.el-dialog__title {
    font-weight: bold;
    font-family: PingFang SC;
}

/deep/.el-form-item {
    margin-bottom: 0 !important;

    .el-form-item__label {
        text-align: left !important;
        width: 0px;
    }
}

/deep/.el-dialog {
    width: 360px !important;
    border-radius: 10px !important;

    .el-select {
        width: 100%;
    }

}

/deep/.el-dialog>.el-dialog__body {
    padding: 0 20px;
}

/deep/.el-button--primary {
    background-color: #2254f4;
    border-radius: 124px;
    padding: 14px 24px;
    // width: 100px;
    height: 44px;
}

/deep/.el-dialog__footer {
    padding: 15px 20px 15px;
    font-size: 16px;
    font-weight: bold;

    span {
        font-size: 14px;
        font-weight: bold;
    }

    .el-button--default {
        border: none;

        >span {
            color: #151515;

        }

    }
}

/deep/ .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
    background-color: #5a5a5a;
    border-radius: 50%;
}
</style>