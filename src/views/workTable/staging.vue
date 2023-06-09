<template>
    <div class="container">
        <div class="create-now">
            <el-space size="large">
                <span><img src="@/assets/images/video-split.png" @click="videoSplit()" /></span>
                <span><img src="@/assets/images/video-cut.png" /></span>
            </el-space>
        </div>
        <div class="create-last">最近创作</div>
    </div>
</template>
<script>
//const appBaseUrl = import.meta.env.VITE_APP_BASE_URL;
export default{
    data(){
        return{

        };
    },
    methods: {
        videoSplit(){
            //this.$message.success("videoSplit")
            this.$router.push('/videoSplit')
        }
    }
};
</script>
<style scoped lang="less">
.container{
    // background-color: #f3f4f8;
    // border-top-left-radius: 50px;
    .create-now{
        background-color: #fff;
        margin: 24px 28px;
        border-radius: 25px;
        padding: 14px;
        height: 100%;
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