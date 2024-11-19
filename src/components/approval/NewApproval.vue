<template>
    <div>
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
            <el-form-item label-width="120px" label="Order User ID" prop="createUserId" disabled="">
                <el-input v-model="formData.createUserId" readonly placeholder="Please Enter Order User ID" clearable :style="{width: '100%'}">
                </el-input>
            </el-form-item>
            <el-form-item label-width="120px" label="Related Request" prop="eventId">
                <el-select v-model="formData.eventId" placeholder="Please Choose Related Request" clearable :style="{width: '100%'}">
                    <el-option v-for="(item, index) in eventList" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label-width="120px" label="Admin in Charge " prop="approvalUserId">
                <el-select v-model="formData.approvalUserId" placeholder="Please Choose Admin in Charge " clearable :style="{width: '100%'}">
                    <el-option v-for="(item, index) in userList" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label-width="120px" label="Order Title" prop="title">
                <el-input v-model="formData.title" placeholder="Please Enter Order Title" clearable :style="{width: '100%'}">
                </el-input>
            </el-form-item>
            <el-form-item label-width="120px" label="Order Priority Level" prop="level">
                <el-radio-group v-model="formData.level" size="medium">
                    <el-radio-button v-for="(item, index) in levelOptions" :key="index" :label="item.value"
                                     :disabled="item.disabled">{{item.label}}</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label-width="120px" label="Order Content" prop="content">
                <el-input v-model="formData.content" type="textarea" placeholder="Please Enter Order Content" :maxlength="4096"
                          show-word-limit :autosize="{minRows: 6, maxRows: 11}" :style="{width: '100%'}"></el-input>
            </el-form-item>
            <el-form-item label-width="120px" v-for="(material, index) in materialList" :key="index + Date.now()" :label="'Medical Resource To be Ordered'">
                <el-card shadow="hover">
                    <el-select v-model="material.name" placeholder="Please Choose Medical Resource  " clearable :style="{width: '100%'}" size="mini">
                        <el-option v-for="(item, index) in allMaterialList" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                    <el-input-number v-model="material.num" :min="1" :max="100"  size="mini"></el-input-number>
                    <el-divider direction="vertical"></el-divider>
                    <el-button @click.prevent="removeMaterial(material)" size="mini">Remove</el-button>
                </el-card>
            </el-form-item>
            <el-form-item label="Choose Order Medical Resource  " label-width="120px">
                <el-button @click="addMaterial" type="info" size="mini">New Medical Resource  </el-button>
            </el-form-item>

            <el-form-item size="large">
                <el-button type="primary" @click="submitForm('elForm', addApproval)">Submit</el-button>
                <el-button @click="resetForm('elForm')">Reset</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {resetForm, submitForm} from "@/base/ele-base";
    import {approvalApi, eventApi, userApi, materialApi} from "@/axios/api";
    export default {
        name:'NewApproval',
        components: {},
        props: [],
        data() {
            return {
                formData: {
                    createUserId: undefined,
                    title: undefined,
                    level: 'Medium',
                    content: undefined,
                    approvalUserId: undefined,
                    status: undefined,
                    eventId: undefined,
                    materialApply: ""
                },
                rules: {
                    createUserId: [{
                        required: true,
                        message: 'Please Enter Order User ID',
                        trigger: 'blur'
                    }],
                    eventId: [{
                        required: true,
                        message: '必须设置Related Request ',
                        trigger: 'blur'
                    }],
                    title: [{
                        required: true,
                        message: 'Please Enter Order Title',
                        trigger: 'blur'
                    }],
                    level: [{
                        required: true,
                        message: 'Order Priority Level不能为空',
                        trigger: 'change'
                    }],
                    content: [{
                        required: true,
                        message: 'Please Enter Order Content',
                        trigger: 'blur'
                    }],
                    approvalUserId: [{
                        required: true,
                        message: 'Please Choose Admin in Charge ',
                        trigger: 'change'
                    }],
                },
                levelOptions: [
                    {
                    "label": "Low",
                    "value": "Low"
                }, {
                    "label": "Medium",
                    "value": "Medium"
                }, {
                    "label": "High",
                    "value": "High"
                }, {
                    "label": "Urgent",
                    "value": "Urgent"
                }],
                approvalUserIdOptions: [
                    {
                    "label": "选项一",
                    "value": 1
                }, {
                    "label": "选项二",
                    "value": 2
                }],
                eventList:[],
                userList:[],
                allMaterialList:[],
                materialList:[]
            }
        },
        methods: {
            submitForm,resetForm,
            removeMaterial(item) {
                let index = this.materialList.indexOf(item)
                if (index !== -1) {
                    this.materialList.splice(index, 1)
                }
            },
            addMaterial() {
                this.materialList.push({
                    name: '',
                    num: 0,
                    flag: Date.now()
                });
            },
            async addApproval(){
                this.formData.status = "To be Confirm";
                this.materialList.forEach(m=>{
                    this.formData.materialApply += m.name + "#" + m.num + "@";
                });
                let res = await approvalApi.newApproval(this.formData);
                if(res.status){
                    this.$message({message:'Submit Order successful', type:'success'});
                }
            },
            async loadEvent(){
                let res = await eventApi.listEvent({currentPage:1, pageSize:100});
                if (res.status) {
                    const list = res.data.list;
                    this.$message({message:"Request Loaded, Amount："+list.length , type: 'success'});
                    list.forEach((v)=>{
                        this.eventList.push({
                            'label': v.title,
                            'value': v.id
                        });
                    });
                }
            },
            async loadMaterial(){
                let res = await materialApi.listMaterial({currentPage: 1, pageSize: 1000, materialEnable: true});
                if(res.status){
                    const list = res.data.list;
                    this.$message({message:"Allocable Medical Resource  Loaded, Amount："+list.length , type: 'success'});
                    list.forEach((v)=>{
                        this.allMaterialList.push({
                            'label': v.materialName,
                            'value': v.materialName
                        });
                    });
                }
            },
            async loadUser(){
                let res = await userApi.listUser({currentPage: 1, pageSize: 100, identityName:'Admin Staff'});
                if(res.status){
                    const list = res.data.list;
                    this.$message({message:"Admin loaded, Amount："+list.length , type: 'success'});
                    list.forEach((v)=>{
                        this.userList.push({
                            'label': v.nickName,
                            'value': v.id
                        });
                    });
                }
            }
        },
        mounted() {
            this.formData.createUserId = this.$user.id;
            this.loadEvent();
            this.loadUser();
            this.loadMaterial();
        }
    }

</script>
<style>
</style>
