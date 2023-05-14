<template>
    <div class="loginComp">
        <template v-if="!register && !forget">
            <div class="login-page">
                <input 
                    type="text" 
                    placeholder="请输入账号" 
                    v-model="userName">
                <input 
                    :type="isShowPwd ? 'text' : 'password'"
                    placeholder="请输入密码" 
                    v-model="passWord" >
                <i class="eyes" @click="() => this.isShowPwd = ! this.isShowPwd"></i>
            </div>
            <div class="forget">
                <span @click="registerChange()">注册用户</span>
                <span @click="forgetChangge()">忘记密码？</span>
            </div>
            <div class="loginBtn">
                <button @click="() => loginHander()">登录</button>
            </div>
        </template>
        <template v-if="register">
            <div class="login-page">
                <input type="text" placeholder="请输入手机号" v-model="telPhone">
                <input :type="isShowPwd ? 'text' : 'password'" placeholder="请输入密码" v-model="userPsd">
                <i class="eyes" @click="() => this.isShowPwd = ! this.isShowPwd"></i>
            </div>
            <div class="forget">
                <input type="text" placeholder="验证码" style="width: 64%;">
                <button>获取验证码</button>
            </div>
            <div class="loginBtn">
                <button @click="() => registerHander()">注册</button>
            </div>
        </template>
        <template v-if="forget">
            <div class="login-page">
                <input type="text" placeholder="请输入手机号">
                <input type="password" placeholder="请输入新密码"><i class="eyes"></i>
            </div>
            <div class="forget">
                <input type="text" placeholder="验证码" style="width: 66%;">
                <button>获取验证码</button>
            </div>
            <div class="loginBtn">
                <button @click="() => loginHander()">登录</button>
            </div>
        </template>
        <p>登录及同意 <a href="">用户协议</a> 与 <a href="">隐私政策</a></p>
    </div>
</template>
<script>
import { getLogin, register } from '../../api/auth'
export default {
    data() {
        return {
            isShowPwd: false,
            userName: '',
            passWord: '',
            telPhone: '',
            userPsd: '',
            register: false,
            forget: false,
        }
    },
    computed: {

    },
    mounted() {

    },
    methods: {
        //2、用户名校验
        // userName() {
        //     const regName = /[\u4E00-\u9FA5]/;
        //     if (this.userName != "" &&!regName.test(this.userName)) {
        //         this.userName = "";
        //     }
        // },
        loginHander() {
            getLogin(this.userName, this.passWord).then(res => {
                console.log("登录：", res.data);
                const token = res.data.data.token;
                sessionStorage.setItem('Authorization', token);
                // router.beforeEach((to, from, next) => {
                //     if (to.path === '/registerPage') return next()
                //     const tokenStr = window.sessionStorage.getItem('Token')
                //     if (!tokenStr) return next('/registerPage')
                //     next()
                // })
                if (res.data.code == 200) {
                    console.log(200);
                    this.$router.push('./video');
                    this.$message({
                        message: '登录成功！',
                        type: 'success'
                    });
                }
            }).catch(err => {
                console.log(err);
            })
        },
        registerHander() {
            register(this.telPhone, this.userPsd).then(res => {
                console.log("注册：", res);
                this.register = false
                if (res.code == 200) {
                    this.$message({
                        message: '注册成功！',
                        type: 'success'
                    });
                }
            })
        },
        registerChange() {
            this.register = true
        },
        forgetChangge() {
            this.forget = true
        }
    },
}
</script>
<style scoped lang="less">
.loginComp {
    height: 55px;
    padding: 20px;

    >p {
        height: 100px;
        line-height: 100px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        margin: 10px 0;

        a {
            color: #2254f4;
        }
    }

    .forget {
        display: flex;
        justify-content: space-between;
        height: 50px;
        margin: 10px 0;
        font-size: 14px;
        line-height: 50px;
        color: #fff;

        >button {
            width: 30%;
            color: #fff;
            border: none;
            height: 40px;
            margin-top: 12px;
            border-radius: 5px;
            cursor: pointer;
            background-color: #2254f4;
        }

        span {
            cursor: pointer;
        }

        span:hover {
            color: #3354f4;
        }
    }

    .loginBtn {
        width: 100%;
        height: 48px;

        >button {
            width: 100%;
            color: #fff;
            height: 40px;
            border: none;
            margin: 24px 0;
            cursor: pointer;
            background-color: #2254f4;
        }
    }

    input {
        height: 55px;
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        color: #fff;
        font-size: 12px;
        border-bottom: 0.5px solid #646464;
    }

    input::-webkit-input-placeholder {
        color: #fff;
        font-size: 14px;
        // text-indent: 10px;
        padding-left: 10px;
        // border: 1px solid #CECECE;
    }

    .login-page {
        position: relative;

        .eyes {
            position: absolute;
            right: 24px;
            top: 76px;
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url(../../assets/images/eyes.png) center center no-repeat;
            cursor: pointer;
        }
    }

}
</style>
    