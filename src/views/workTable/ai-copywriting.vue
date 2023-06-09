<template>
    <div class="container">
        <div class="create-now">
            <div>AI文案生成</div>
            <el-divider />
            <div>
                <el-container>
                    <el-aside class="aside">
                        <div class="div-block">
                            <el-form :model="form" :rules="rules" ref="form" label-width="">
                                <el-form-item label="">
                                    <div>行业类型</div>
                                    <el-input v-model="form.industry" placeholder="请输入行业类型，如：美妆，数码"></el-input>
                                </el-form-item>
                                <el-form-item label="" prop="name">
                                    <div>*产品名</div>
                                    <el-input v-model="form.name" placeholder="请输入推广的产品名，如：洗发水"></el-input>
                                </el-form-item>
                                <el-form-item label="" prop="point">
                                    <div>*产品卖点</div>
                                    <el-input v-model="form.point" placeholder="请输入产品卖点，如：滋养头发"></el-input>
                                </el-form-item>
                                <el-form-item label="">
                                    <div>关键词</div>
                                    <el-input v-model="form.keyword" placeholder="请输入关键词，如：脱发"></el-input>
                                </el-form-item>
                                <el-form-item label="">
                                    <el-button type="primary" @click="createCopywriting">立即生成</el-button>
                                </el-form-item>

                            </el-form>
                        </div>
                    </el-aside>
                    <el-main class="main">
                        <div class="main-text">
                            <el-text class="mx-1" size="large" v-loading="loading">
                                <p style="display: block;text-indent: 30px;line-height: 30px;margin-bottom: 20px;" v-for="(item,index) in copywriting" :key="index">{{ index+1 }}、{{ item }}</p>
                            </el-text>
                        </div>
                    </el-main>
                </el-container>
            </div>
        </div>
        <!-- <div class="create-last">最近创作</div> -->
    </div>
</template>
<script>
//const appBaseUrl = import.meta.env.VITE_APP_BASE_URL;
import axios from 'axios'
export default{
    data(){
        return{
            form:{
                industry:'',
                name:'冰丝裤',
                point:'性价比高',
                keyword:''
            },
            copywriting:[],
            loading: false,
            rules:{
                name:[
                    {required:true,message:'产品名不能为空',trigger: 'blur'}
                ],
                point:[
                    {required:true,message:'产品卖点不能为空',trigger: 'blur'}
                ]
            }
        };
    },
    methods: {
        videoSplit(){
            //this.$message.success("videoSplit")
            this.$router.push('/videoSplit')
        },
        // 生成文案
        createCopywriting(){
            this.$refs.form.validate(pass => {
                if(!pass){
                    //this.$message.warning('aaa')
                    return;
                }
                this.loading = true;
                axios({
                    url: '/ai_api/v1/idea',
                    method: 'post',
                    params: this.form,
                    headers: {"Content-Type": "application/json"}
                })
                //this.$http.post('/split_video',{'FilePath':filePath})
                .then(res => {
                    if(res.data.code != 200){
                        console.log(res.data);
                        this.$message.error(res.data.msg);
                        this.loading = false;
                        return;
                    }
                    this.$message.success("生成成功");
                    this.loading = false;
                    this.copywriting = res.data.data;
                })
                .catch(err => {
                    this.$message.error("网络或系统异常！")
                    this.loading = false;
                    console.log(err);
                })
            })
        }
    }
};
</script>
<style scoped lang="less">
.container{
    // background-color: #f3f4f8;
    // border-top-left-radius: 50px;
    //height: 100vh;
    //overflow-y: hidden;
    .create-now{
        background-color: #fff;
        margin: 24px 28px;
        border-radius: 25px;
        padding: 14px;
        height: 100%;

        .aside{
            width: 30%;
            height: 100%;

            .div-block{
                padding: 20px;
            }
        }
        .main{
            height: 100%;
        }

        .main-text{
            margin: 20px;
            padding: 40px;
            background-color: #fff;
            height: 60vh;
            overflow-y: auto;
        }
    }
    .create-last{
        background-color: #fff;
        margin: 24px 28px;
        border-radius: 25px;
        padding: 14px;
        height: 100%;
    }
}
</style>