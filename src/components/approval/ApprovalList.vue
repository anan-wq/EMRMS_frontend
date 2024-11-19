<template>
    <div id="list">
        <h1 class="title">Medical Resources Order List：</h1>
        <el-divider></el-divider>
        <el-card class="filter-bar" shadow="never">
            <el-form :inline="true" :model="filterCondition"  ref="approvalFilter">
                <el-form-item label="Order Priority Level">
                    <el-select v-model="filterCondition.level" placeholder="Request Priority Level">
                        <el-option label="Low" value="Low"></el-option>
                        <el-option label="Medium" value="Medium"></el-option>
                        <el-option label="High" value="High"></el-option>
                        <el-option label="Super Urgent" value="Super Urgent"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Order Status">
                    <el-select v-model="filterCondition.status" placeholder="Order Status">
                        <el-option label="To be Confirm" value="To be Confirm"></el-option>
                        <el-option label="To be Deliver" value="To be Deliver"></el-option>
                        <el-option label="Delivering" value="Delivering"></el-option>
                        <el-option label="Delivered" value="Delivered"></el-option>
                        <el-option label="Order Unsuccessful" value="Order Unsuccessful"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" size="medium" @click="resetForm('approvalFilter', resetFilter)">Clear</el-button>
                    <el-button type="primary" size="medium" @click="submitForm('approvalFilter', loadList)">Select</el-button>
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
                    <el-button type="text" round size="mini" @click="showMaterial(scope.row.materialApply)">Check Medical Resources</el-button>
                    <el-divider direction="vertical"></el-divider>
<!--                    <el-button type="text" round size="mini" @click="showDetail(scope.row.id)">Detail</el-button>-->
<!--                    <el-divider direction="vertical"></el-divider>-->
                    <el-popconfirm confirmButtonText='Confirm' cancelButtonText='Cancel' icon="el-icon-info" iconColor="red" title="Are you sure to delete?" @confirm="deleteApproval(scope.row.id)">
                        <el-button type="danger" round size="mini" slot="reference" :disabled="isNotIdentity(4)">Delete</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="loadList" background
                       :current-page.sync="filterCondition.currentPage"
                       :page-size="filterCondition.pageSize"
                       layout="total, prev, pager, next"
                       :total="filterCondition.total">
        </el-pagination>
        <el-drawer title="Medical Resources Request List" :visible.sync="showMaterialApplyList" direction="ltr">
                <el-card id="detail" shadow="never">
                    <div v-for="(i , index) in materialApplyList" :key="index + Date.now()">
                        <el-tag>
                            Medical Resources Name：
                            <b>{{i.name}}</b>
                            <el-divider direction="vertical"></el-divider>
                            Amount：<b>{{i.num}}</b>
                        </el-tag>
                    </div>
                </el-card>
        </el-drawer>
    </div>
</template>

<script>
    import {resetForm, submitForm} from "@/base/ele-base";
    import { approvalApi } from '@/axios/api'
    import entity from '@/base/entity'
    import {mergeBean, isNotIdentity} from '@/base/utils'
    export default {
        name: "ApprovalList",
        data(){
            return{
                entity,
                showMaterialApplyList: false,
                materialApplyList:[],
                //筛选条件
                list: [],
                filterCondition:{

                }
            }
        },
        methods:{
            mergeBean, resetForm,submitForm,isNotIdentity,
            showDetail(id){
                console.log("Show Detail："+id);
            },
            showMaterial(detail){
               this.materialApplyList = [];
               console.log("Show Medical Resource Details:"+detail);
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
               this.showMaterialApplyList = true;
            },
            deleteApproval(id){
                console.log("Delete Order, ID = " + id);
                approvalApi.deleteApproval(id).then(res=>{
                     this.$message({message:'Deleted Successfully', type:'success'});
                });
            },
            loadList(){
                approvalApi.listApproval(this.filterCondition).then(res=>{
                    this.list = res.data.list;
                    this.filterCondition = this.mergeBean(res.data.pagination, this.filterCondition);
                });
            },
            resetFilter(){
                this.filterCondition.status = undefined;
                this.filterCondition.level = undefined;
                this.loadList();
            }
        },
        mounted(){
            console.log("Load Order List");
            this.filterCondition = this.mergeBean(this.entity.pagination, this.filterCondition);
            this.loadList();
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
    #detail{
        margin: 20px;
        padding: 0 20px;
    }
    #detail div{
        display: inline-block;
        margin: 10px;
    }
</style>