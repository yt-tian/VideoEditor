<template>
    <div>
      <div class="spinners__box">
            <div class="dot-loader"></div>
            <div class="dot-loader"></div>
            <div class="dot-loader"></div>     
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            list: []
        }
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
.spinners__box {
    width: 25%;
    flex: 0 0 25%;
}

.spinners__box {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(255,255,255,0.1);
    width: 20%;
    height: 250px;
    box-sizing: border-box;
    flex: 0 0 20%;
    background-color: inherit;
    position: relative;
}
.dot-loader {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: #03A9F4;
    position: relative;
    -webkit-animation: 1.2s scaleDown ease-in-out infinite;
    animation: 1.2s scaleDown ease-in-out infinite;
}
div {
    display: block;
}
.dot-loader:nth-child(2) {
    -webkit-animation: 1.2s scaleDown ease-in-out infinite .15555s;
    animation: 1.2s scaleDown ease-in-out infinite .15555s;
    margin: 0 15px;
}
.dot-loader:nth-child(3) {
    -webkit-animation: 1.2s scaleDown ease-in-out infinite .300000s;
    animation: 1.2s scaleDown ease-in-out infinite .300000s;
}
</style>
  