<template>
    <div id="list">
        <h1 class="title">All Medical Resource Categories：</h1>
        <el-divider></el-divider>
        <el-card class="filter-bar" shadow="never">
            <el-form :inline="true" :model="filterCondition"  ref="materialCategoryFilter">
                <el-form-item label="Medical Resource Category Code">
                    <el-input v-model="filterCondition.categoryCode" placeholder="Enter Medical Resource Category Code"></el-input>
                </el-form-item>
                <el-form-item label="Medical Resource Category Name">
                    <el-input v-model="filterCondition.categoryName" placeholder="Enter Medical Resource Category Name"></el-input>
                </el-form-item>
                <el-form-item label="Medical Resource Allocation Scheme">
                    <el-switch v-model="filterCondition.enable" inactive-text="Allocation Banned" active-text="Allocation Allowed"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" size="medium" @click="resetForm('materialCategoryFilter', resetFilter)">Clear</el-button>
                    <el-button type="primary" size="medium" @click="submitForm('materialCategoryFilter', loadList)">Select</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-table :data="list" border style="width: 100%" :highlight-current-row="true" :stripe="true">
            <el-table-column fixed prop="id" label="ID" width="280" align="center"></el-table-column>
            <el-table-column fixed prop="categoryName" label="Medical Resource Category Name" align="center"></el-table-column>
            <el-table-column fixed prop="categoryCode" label="Medical Resource Category Code" width="250" align="center"></el-table-column>
            <el-table-column fixed prop="createTime" label="Time" width="180" align="center"></el-table-column>
            <el-table-column fixed prop="enable" label="Allocation Scheme" width="180" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.enable" type="success">Allocation Allowed</el-tag>
                    <el-tag v-else type="danger">Allocation Banned</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed prop="createUserId" label="Requester ID" width="180" align="center"></el-table-column>
            <el-table-column fixed="right" label="Options" align="center" width="120">
                <template slot-scope="scope">
<!--                    <el-button type="primary" round size="mini" @click="showDetail(scope.row.id)">详 情</el-button>-->
<!--                    <el-divider direction="vertical"></el-divider>-->
                    <el-popconfirm confirmButtonText='Confirm' cancelButtonText='Cancel' icon="el-icon-info" iconColor="red" title="Are you sure to delete Medical Resource Category?" @confirm="deleteMaterialCategory(scope.row.id)">
                        <el-button type="danger" round size="mini" slot="reference" :disabled="isNotIdentity(2)">Delete</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination  @current-change="loadList" background
                       :current-page.sync="filterCondition.currentPage"
                       :page-size="filterCondition.pageSize"
                       layout="total, prev, pager, next"
                       :total="filterCondition.total">
        </el-pagination>
    </div>
</template>

<script>
    import {materialApi as API } from "@/axios/api";
    import {resetForm, submitForm} from "@/base/ele-base";
    import entity from '@/base/entity'
    import {mergeBean, isNotIdentity} from '@/base/utils'
    export default {
        name: "MaterialCategoryList",
        data(){
            return{
                entity,
                filterCondition:{},
                list:[]
            }
        },
        methods:{
            mergeBean,resetForm,submitForm,isNotIdentity,
            resetFilter(){
                this.filterCondition.categotyName = undefined;
                this.filterCondition.categoryCode = undefined;
                this.filterCondition.enable = false;
            },
            async loadList(){
                let res = await API.listMaterialCategory(this.filterCondition);
                if(res.status){
                    this.list = res.data.list;
                    this.filterCondition = this.mergeBean(res.data.pagination, this.filterCondition);
                }
            },
            showDetail(id){

            },
            async deleteMaterialCategory(id){
              console.log(id)
                let res = await API.deleteMaterialCategory(id);
                if(res.status){
                    this.$message({message:'Deleted Successfully', type:'success'});
                }
            }
        },
        mounted(){
            console.log("Load Medical Resource CategoryList");
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
        display: block;
        margin: 10px auto;
    }
    .filter-bar{
        margin: 10px auto;
        text-align: left;
    }
</style>