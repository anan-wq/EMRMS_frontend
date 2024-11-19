<template>
    <div id="loginPage" >
        <el-card shadow="always">
          <el-image id="logo" :src="pic" fit="cover" class="logo"></el-image>
          <h1 class="slogan bc">Home-based Medical Service System</h1>
            <el-form :model="login" status-icon ref="loginForm" label-width="100px">
                <el-form-item label="Username" prop="account"  :rules="{ required: true, message: 'Please Enter Username', trigger: 'blur' }">
                    <el-input placeholder="Please Enter Username" v-model="login.account"></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password" :rules="{ required: true, message: 'Please Enter Password', trigger: 'blur' }">
                    <el-input type="password" v-model="login.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input placeholder="Please Enter verifyCode" v-model="login.verifycode" width="80px" ></el-input>
                    <img :src="verifypicture" alt="please wait" width="100px">
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm', requestLogin)" size="medium">提交</el-button>
                    <el-button @click="resetForm('loginForm')" size="medium">Reset</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>


<script>
    import {resetForm, submitForm} from "@/base/ele-base";
    import {toLogin} from '@/axios/api.js'
    import axios from "axios";
    import { onBeforeMount, onMounted, Mounted } from "vue";
    export default {
        name: "Login",
        data(){
            return{
               login:{
                verifycode:"",
                account: "",
                password:""
                },
                pic: require('@/assets/logo-no-background.png'),
                
                verifyCode:"",
                verifypicture:""
            }
        },
        methods: {
            resetForm, submitForm,
            async requestLogin(){
                let res = await toLogin(this.login);
                if(res.status){
                    console.log("登录反馈..");
                    if(this.login.verifycode==this.verifyCode)
                    {
                    console.log("验证通过")
                    window.localStorage.setItem("token", res.data.token);
                    window.localStorage.setItem("user_json", res.data.userJson);
                    // await this.$router.push("/dashboard");
                }
            else{
                alert('验证码输入错误')
            }}
            }
        },
    
   mounted(){
    axios.get('https://www.mxnzp.com/api/verifycode/code?len=5&type=0&app_id=mnqnuvjinm0fsasg&app_secret=deNisto6qLaakgRE5uqcpvIxB0BMx7zJ')
                 .then((response)=> {
                    console.log(response.data.data);
                    
                    this.verifyCode=response.data.data.verifyCode
                    this.verifypicture=response.data.data.verifyCodeImgUrl
                    
                }).catch((error)=> {
                    console.log(error);
                });
           
    }
    }
</script>

<style scoped>
    .slogan{
        margin-bottom: 20px;
        text-align: center;
    }
    .el-card {
        width: auto;
        height: auto;
        position: absolute;
        transform: translate(-50%, -50%);
        left: 50%;
        top: 30%;

    }
    .logo {
      display: block;
      margin: 0 auto 20px auto;
      width: 100px; /* 调整 logo 的宽度 */
      height: auto;
    }
        /* 添加背景图的样式 */
    #loginPage {
      min-height: 100vh; /* 使用视口高度作为最小高度 */
      background-image: url('../assets/logo.png');
      background-size: cover; /* 覆盖整个页面 */
      background-position: center; /* 图片居中显示 */
    }

</style>