<template>
    <div id="list">
        <h1 class="title">Medical Resources Request List：</h1>
        <el-divider></el-divider>
        <el-card class="filter-bar" shadow="never">
            <el-form :inline="true" :model="filterCondition"  ref="approvalFilter">
                <el-form-item label="Request Priority Level">
                    <el-select v-model="filterCondition.level" placeholder="Request Priority Level">
                        <el-option label="Low" value="Low"></el-option>
                        <el-option label="Medium" value="Medium"></el-option>
                        <el-option label="High" value="High"></el-option>
                        <el-option label="Urgent" value="Urgent"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Order Confirming Admin">
                        <el-select v-model="filterCondition.approvalUserId" placeholder="Order Confirming Admin" clearable :style="{width: '100%'}">
                            <el-option v-for="(item, index) in userList" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" size="medium" @click="resetForm('approvalFilter', resetFilter)">Clear</el-button>
                    <el-button type="primary" size="medium" @click="submitForm('approvalFilter', loadList)">筛选Order  </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-table :data="list" border style="width: 100%" :highlight-current-row="true" :stripe="true">
            <el-table-column fixed prop="id" label="ID" width="180" align="center"></el-table-column>
            <el-table-column  prop="title" label="Order Title" width="180" align="center"></el-table-column>
            <el-table-column  prop="content" label="Detail" width="200" align="center"></el-table-column>
            <el-table-column  prop="createTime" label="Time" width="150" align="center"></el-table-column>
            <el-table-column  prop="lastUpdateTime" label="Last Updated Time" width="150" align="center"></el-table-column>
            <el-table-column  prop="level" label="Request Priority Level" width="100" align="center"></el-table-column>
            <el-table-column prop="status" label="Order Status" width="100" align="center"></el-table-column>
            <el-table-column prop="approvalUserId" label="Admin in Charge ID" width="150" align="center"></el-table-column>
            <el-table-column prop="eventId" label="Related Request ID" width="150" align="center"></el-table-column>
            <el-table-column prop="createUserId" label="Requester ID" width="150" align="center"></el-table-column>
            <el-table-column fixed="right" label="Options" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" round size="mini" @click="showDetail(scope.row)">详 情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="loadList" background
                       :current-page.sync="filterCondition.currentPage"
                       :page-size="filterCondition.pageSize"
                       layout="total, prev, pager, next"
                       :total="filterCondition.total">
        </el-pagination>
        <el-drawer title="Medical Resource Order Detail：" :visible.sync="showMaterialApplyDetail" direction="ltr">
            <div>
                <el-card class="detail detail-form" shadow="never">
                    <p><span>Order  ID：</span>{{detailRecord.id}}</p>
                    <p><span>Order  人：</span>{{detailRecord.createUserId}}</p>
                    <p><span>Time：</span>{{detailRecord.createTime}}</p>
                    <p><span>Related Request ID：</span>{{detailRecord.eventId}}</p>
                    <p><span>Expected Request Level ：</span>{{detailRecord.level}}</p>
                    <p><span>Status：</span>{{detailRecord.status}}</p>
                    <el-divider></el-divider>
                    <p>Order  List：</p>
                    <span v-for="(i , index) in materialApplyList" :key="index + Date.now()">
                        <span style="padding-left: 15px">
                            <b>{{i.name}} * {{i.num}}</b>
                        </span>
                         <el-divider direction="vertical"></el-divider>
                    </span>
                    <el-divider></el-divider>
                    <p>Detail：</p>
                    <el-input v-model="detailRecord.content" readonly type="textarea" :autosize="{minRows: 4, maxRows: 8}"></el-input>
                    <el-divider></el-divider>
                    <div>
                        <el-button type="danger" round @click="rejectApproval">Reject  </el-button>
                        <el-button type="success" round @click="passApproval">Confirm Order</el-button>
                    </div>
                </el-card>
            </div>
        </el-drawer>
    </div>
</template>

<script>
    import {resetForm, submitForm} from "@/base/ele-base";
    import { approvalApi, userApi } from '@/axios/api'
    import entity from '@/base/entity'
    import {mergeBean} from '@/base/utils'
    export default {
        name: "WaitApproval",
        data(){
            return{
                entity,
                showMaterialApplyDetail: false,
                detailRecord:{},
                materialApplyList:[],
                //筛选条件
                list: [],
                filterCondition:{

                },
                userList:[]
            }
        },
        methods:{
            mergeBean, resetForm,submitForm,
            showDetail(approval){
                this.materialApplyList = [];
                console.log("Show Medical Resource Details:");
                console.log(approval);
                this.detailRecord = approval;
                const arr = approval.materialApply.split("@");
                for(const a in arr){
                    if (arr[a] !== undefined && arr[a] !== "") {
                        const aa = arr[a].split("#");
                        this.materialApplyList.push({
                            name: aa[0],
                            num: aa[1]
                        });
                    }
                }
                this.showMaterialApplyDetail = true;
            },
            rejectApproval(){
                console.log("Reject Order, ID = " + this.detailRecord.id);
                approvalApi.updateApproval({id: this.detailRecord.id, status:'Order Unsuccessful'}).then(res=>{
                    this.$message({message:'Order is in Rejected Status!', type:'success'});
                });
            },
            passApproval(){
                console.log("通过审批, ID = " + this.detailRecord.id);
                approvalApi.updateApproval({id: this.detailRecord.id, status:'To be Deliver'}).then(res=>{
                    this.$message({message:'Order is in To be Deliver Status!', type:'success'});
                });
            },
            loadList(){
                this.filterCondition.status = "To be Confirm";
                approvalApi.listApproval(this.filterCondition).then(res=>{
                    this.list = res.data.list;
                    this.filterCondition = this.mergeBean(res.data.pagination, this.filterCondition);
                });
            },
            resetFilter(){
                this.filterCondition.status = undefined;
                this.filterCondition.level = undefined;
                this.filterCondition.approvalUserId = undefined;
                this.loadList();
            },
            async loadUser(){
                let res = await userApi.listUser({currentPage: 1, pageSize: 100, identityName:'Admin in Charge'});
                if(res.status){
                    const list = res.data.list;
                    this.$message({message:"Admin in Charge Loaded, Amount："+list.length , type: 'success'});
                    list.forEach((v)=>{
                        this.userList.push({
                            'label': v.nickName,
                            'value': v.id
                        });
                    });
                }
            }
        },
        mounted(){
            console.log("Load Order To be Confirmed List");
            this.filterCondition = this.mergeBean(this.entity.pagination, this.filterCondition);
            this.loadList();
            this.loadUser();
        }
    }
</script>

<style scoped>
    .title{
        text-align: left;
        padding: 3px 5px;
        border-left: rgba(44, 62, 80, 0.87) 5px solid;
    }
    .el-pagination{
        margin: 10px auto;
    }
    .filter-bar{
        margin: 10px auto;
        text-align: left;
    }
    .detail{
        margin: 10px;
        padding: 0 10px;
    }
    .detail div{
        display: inline-block;
        margin: 10px;
    }
    .detail-form p{
        margin: 10px 0;
        padding-left: 10px;
    }
    .detail-form p span{
        display: inline-block;
        width: 200px;
    }
</style>