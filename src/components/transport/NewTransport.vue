<template>
    <div>
        <el-row :gutter="11">
            <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
                <el-col :span="24">
                    <el-form-item label-width="180px" label="Requester ID" prop="createUserId">
                        <el-input v-model="formData.createUserId" readonly placeholder="Please Enter Requester ID" clearable
                                  :style="{width: '100%'}"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label-width="180px" label="Related Order Title" prop="approvalId">
                        <el-select v-model="formData.approvalId" placeholder="Please Choose Related Order" clearable @change="loadDataFromApproval" :style="{width: '100%'}">
                      <!---->
                          <el-option v-for="(item, index) in approvalList" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                        </el-select>


                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label-width="180px" label="Receiving User ID" prop="receiverUserId">

                      <el-select v-model="formData.receiverUserId" placeholder="Please Choose Admin in Charge " clearable :style="{width: '100%'}">
                        <el-option v-for="(item, index) in userList" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                      </el-select>

                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label-width="180px" label="Medical Resource Shipping Date" prop="createTime">
                        <el-date-picker v-model="formData.createTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"
                                        :style="{width: '100%'}" placeholder="Medical Resource Shipping Date" clearable></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="13">
                    <el-form-item label-width="180px" label="Expected Delivery Time" prop="expectTime">
                        <el-date-picker v-model="formData.expectTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"
                                        :style="{width: '100%'}" placeholder="Expected Delivery Time" clearable></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label-width="180px" label="Level" prop="transportType">
                        <el-radio-group v-model="formData.transportType" size="medium">
                            <el-radio-button v-for="(item, index) in transportTypeOptions" :key="index" :label="item.value"
                                             :disabled="item.disabled">{{item.label}}</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label-width="180px" label="Medical Resource  List">
                        <div v-for="(i , index) in materialApplyList" :key="index + Date.now()">
                            <el-tag style="display: inline-block; margin: 5px;">
                                Medical Resources Name：
                                <b>{{i.name}}</b>
                                <el-divider direction="vertical"></el-divider>
                                Amount：<b>{{i.num}}</b>
                            </el-tag>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item size="large">
                        <el-button type="primary" @click="submitForm('elForm', newTransport)">Submit</el-button>
                        <el-button @click="resetForm('elForm')">Reset</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
    </div>
</template>
<script>
    import {resetForm, submitForm} from "@/base/ele-base";
    import {transportApi, approvalApi, eventApi,userApi} from '@/axios/api'
    import entity from '@/base/entity'
    import {mergeBean} from '@/base/utils'
    export default {
        components: {},
        props: [],
        data() {
            return {
                entity,
                approvalList:[],
                approvalMaterialList:[],
                userList:[],
                materialApplyList:[],
                formData: {
                    createUserId: undefined,
                    approvalId: undefined,
                    receiverUserId: undefined,
                    createTime: null,
                    expectTime: null,
                    transportType: "一级",
                    materialRecord: ""
                },
                rules: {
                    createUserId: [{
                        required: true,
                        message: 'Please Enter Requester ID',
                        trigger: 'blur'
                    }],
                    approvalId: [{
                        required: true,
                        message: 'Related Order Title',
                        trigger: 'change'
                    }],
                    receiverUserId: [{
                        required: true,
                        message: 'Receiving User ID',
                        trigger: 'blur'
                    }],
                    createTime: [{
                        required: true,
                        message: 'Medical Resource Shipping Date',
                        trigger: 'change'
                    }],
                    expectTime: [{
                        required: true,
                        message: 'Expected Delivery Time',
                        trigger: 'change'
                    }],
                    transportType: [{
                        required: true,
                        message: 'Level can not be void',
                        trigger: 'change'
                    }],
                },
                transportTypeOptions: [{
                    "label": "Low",
                    "value": "一级"
                }, {
                    "label": "Medium",
                    "value": "二级"
                }, {
                    "label": "High",
                    "value": "三级"
                }, {
                    "label": "Urgent",
                    "value": "四级"
                }],
            }
        },
        methods: {
            resetForm,submitForm,mergeBean,
            async newTransport(){
                this.formData.status = "Delivering";
                //this.formData.materialRecord=this.findApprovalRecord("1778390940844908545");
              this.setApprovalRecord(this.formData.approvalId);
                let res = await transportApi.newTransport(this.formData);
                if(res.status){
                    this.$message({message:'New Medical Resource Delivery Done', type:'success'});
                    this.updateApproval(this.formData.approvalId);
                }
            },
            async loadApproval(){
              let res = await approvalApi.listApproval({currentPage:1, pageSize:100});
              if (res.status) {
                const list = res.data.list;
                this.$message({message:"Order  Loaded, Amount："+list.length , type: 'success'});
                list.forEach((v)=>{
                  this.approvalList.push({
                    'label': v.title,
                    'value': v.id
                  });
                });
              }
            },
          async loadApprovalMaterialList(){
            let res = await approvalApi.listApproval({currentPage:1, pageSize:100});
            if (res.status) {
              const list = res.data.list;
              this.$message({message:"Order  Loaded, Amount："+list.length , type: 'success'});
              list.forEach((v)=>{
                this.approvalMaterialList.push({
                  'label': v.id,
                  'value': v.materialApply
                });
              });
            }
          },
            async loadUser(){
              let res = await userApi.listUser({currentPage: 1, pageSize: 100, identityName:'Admin in Charge'});
              if(res.status){
                const list = res.data.list;
                this.$message({message:"Admin Staff Loaded, Amount："+list.length , type: 'success'});

                list.forEach((v)=>{
                  this.userList.push({
                    'label': v.nickName,
                    'value': v.id
                  });
                });
              }
            },
            updateApproval(id){
                console.log("Delivering Status, ID = " + id);
                approvalApi.updateApproval({id: id, status:'Delivering'}).then(res=>{
                    this.$message({message: 'Order' + id + 'has been in Delivering Status!', type:'success'});
                });
            },
            loadList(){
                approvalApi.listApproval({pageSize:1000,currentPage:1, status:"To be Deliver"}).then(res=>{
                    this.approvalList = res.data.list;
                });
            },
            setApprovalRecord(id){
              //this.$message({message:id.toString()});

              for (const index in this.approvalMaterialList) {
                const a = this.approvalMaterialList[index];
                console.log("approvalId："+a.label+" id.string:"+id.toString()+" id.bigint"+id);
                if(a.label===id.toString()){

                  //this.$message({message:'22222222222'});
                  //return a.materialRecord;
                  this.formData.materialRecord=a.value;
                  //console.log("a's material record:"+a.value);
                  //console.log("this.formData.materialRecord:"+this.formData.materialRecord);
                  //this.$message({message:a.materialRecord});
                }
              }
            },
            loadDataFromApproval(nV){
                for (const index in this.approvalList) {
                    if(this.approvalList[index].id===nV){
                        this.formData.receiverUserId = this.approvalList[index].createUserId;
                        this.formData.materialRecord = this.approvalList[index].materialApply;
                        const detail = this.formData.materialRecord;
                        this.materialApplyList = [];
                        const arr = detail.split("@");
                        for(const a in arr){
                            if (arr[a] !== undefined && arr[a] !== "") {
                                const aa = arr[a].split("#");
                                this.materialApplyList.push({
                                    name: aa[0],
                                    num: aa[1]
                                });

                            }
                        }
                    }
                }

            }
        },
        mounted(){
            this.formData.createUserId = this.$user.id;
            //this.formData.materialRecord=this.approvalId.materialRecord;
            this.loadList();
            this.loadApproval();
            this.loadApprovalMaterialList();
            this.loadUser();

            //this.loadDataFromApproval(this.formData.approvalId);
            console.log("Load New Medical Resource Delivery...")
        }
    }

</script>
<style>
</style>
