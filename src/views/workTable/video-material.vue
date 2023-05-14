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
        <div>
             
        </div>
    </div>
</template>
<script>
export default {
    components: {
    },
    data() {
        return {

        }
    },
    components: {

    },
    computed: {

    },
    mounted() {

    },
    methods: {

    },
}
</script>
<style scoped lang="less">
.material-page {
    display: flex;
    flex-direction:column;
    justify-content: space-between;
    height: calc(100% - 60px);
    margin: 24px;
    padding: 10px;
    border-top-left-radius: 20px;
    background-color: #fff;

    >div {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height:52px ;
    }

    .all-file-left {
        height: 32px;
        padding: 10px;
        >span{
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

    .all-file-right {
        display: flex;
        height: 32px;
        padding: 10px;
        font-size: 14px;

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
    }
}</style>
  