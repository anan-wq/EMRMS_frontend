<template>
    <el-card shadow="hover">
        <el-dialog title="Choose Location" :visible.sync="showLoc" width="70%">
            <BaiDuSelect :keyword="newEvent.address" @cancel="cancel" @map-confirm="confirm"></BaiDuSelect>
        </el-dialog>
        <h1 class="title">New Home Service Request：</h1>
        <el-divider></el-divider>
        <el-form  label-width="120px" :model="newEvent" ref="newEventForm" class="form">
            <el-form-item label="Title" :rules="{required: true, message:'Must enter title', trigger: 'blur'}">
                <el-input v-model="newEvent.title" placeholder="Please enter title"></el-input>
            </el-form-item>
            <el-form-item label="Location" :rules="{required: true, message:'Must enter Title', trigger: 'blur'}">
                <el-input v-model="newEvent.address"></el-input>
            </el-form-item>
            <el-form-item label="Coordinate" :rules="{required:true, message:'Must enter Coordinate', trigger:'blur'}">
                <el-input v-model="newEvent.loc" readonly style="width: 30%"></el-input>
                <el-divider direction="vertical"></el-divider>
                <el-button @click="cancel" round>Cancel</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button @click="showLoc=true" type="primary" round>Choose Coordinate</el-button>
            </el-form-item>
            <el-form-item label="Detail" :rules="{required: true, message:'Must enter Detail', trigger: 'blur'}">
                <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 12 }" v-model="newEvent.detail"></el-input>
            </el-form-item>
            <el-form-item label="Expected Priority">
                <el-radio-group v-model="newEvent.level">
                    <el-radio-button label="General"></el-radio-button>
                    <el-radio-button label="Severe"></el-radio-button>
                    <el-radio-button label="Urgent"></el-radio-button>
                    <el-radio-button label="Super Urgent"></el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="Photo">
                <el-image style="max-height: 200px; width: 200px; overflow: auto; border-radius: 5px;" v-show="!isNull(newEvent.picture)" :src="newEvent.picture" fir="contain" :preview-src-list="[newEvent.picture]"></el-image>
                <el-button @click="showUpload=true" type="success" round v-show="isNull(newEvent.picture)">Upload</el-button>
            </el-form-item>
            <el-form-item class="btn">
                <el-button type="primary" @click="submitForm('newEventForm', requestSubmitEvent)" size="medium">Submit</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button @click="resetForm('newEventForm')" size="medium">Reset</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="上传文件" :visible.sync="showUpload" width="30%" >
            <UploadFile @success="getPath"></UploadFile>
        </el-dialog>
    </el-card>
</template>

<script>
    import {resetForm, submitForm} from "@/base/ele-base";
    import BaiDuSelect from "@/components/BaiDuSelect";
    import UploadFile from "@/components/UploadFile";
    import { eventApi } from '@/axios/api'
    import {isNull} from "@/base/utils";
    export default {
        name: "NewEvent",
        components:{
            BaiDuSelect,
            UploadFile
        },
        data(){
            return{
                showLoc: false,
                showUpload: false,
                newEvent: {
                    loc:'',
                    title: '',
                    address: ' ',
                    detail:'',
                    level: 'General',
                    createUserId: '',
                    picture:"",
                }
            }
        },
        mounted(){
           this.newEvent.createUserId = this.$user.id;
        },
        methods:{
            resetForm, submitForm,isNull,
            getPath(path) {
                this.showUpload = false;
                this.newEvent.picture = path;
                console.log("接收到路径：" + path);
            },
            confirm(loc){
                console.log("Location Confirmed："+loc);
                this.newEvent.loc = loc;
                this.showLoc = false;
            },
            cancel(){
               this.$set(this.newEvent, 'loc', "");
               this.showLoc =false;
            },
            async requestSubmitEvent(){
                let res = await eventApi.newEvent(this.newEvent);
                if(res.status){
                    this.$message({message: 'Home Service Request Submitted', type: 'success', duration: 4000});
                }
            }
        }
    }
</script>

<style scoped>
    .title{
        text-align: left;
        padding: 3px 5px;
        border-left: rgba(44, 62, 80, 0.87) 5px solid;
    }
    .form{
        text-align: left;
    }
    .btn{
        text-align: left;
    }
</style>