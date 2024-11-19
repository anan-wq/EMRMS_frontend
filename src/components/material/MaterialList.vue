<template>
    <div id="list">
        <h1 class="title">Medical Resource ：</h1>
        <el-divider></el-divider>
        <el-card class="filter-bar" shadow="never">
            <el-form :inline="true" :model="filterCondition"  ref="materialFilter">
                <el-form-item label="Medical Resource Batch">
                    <el-input v-model="filterCondition.materialBatchNo" placeholder="Enter Medical Resource Batch"></el-input>
                </el-form-item>
                <el-form-item label="Medical Resource Category Name">
                    <el-select v-model="filterCondition.materialCategoryCode" placeholder="Please Choose Category" clearable :style="{width: '100%'}">
                        <el-option v-for="(item, index) in materialCategoryCodeOptions" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Medical Resource Allocation Scheme">
                    <el-switch v-model="filterCondition.materialEnable" inactive-text="Allocation Banned" active-text="Allocation Allowed"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" size="medium" @click="resetForm('materialFilter', resetFilter)">Clear</el-button>
                    <el-button type="primary" size="medium" @click="submitForm('materialFilter', loadList)">Select</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-table :data="list" border style="width: 100%" :highlight-current-row="true" :stripe="true">
            <el-table-column fixed prop="id" label="ID" width="180" align="center"></el-table-column>
            <el-table-column  prop="materialBatchNo" label="Batch" width="100" align="center"></el-table-column>
            <el-table-column  prop="materialName" label="Name" width="180" align="center"></el-table-column>
            <el-table-column  prop="materialCategoryCode" label="Medical Resource Category Code" width="110" align="center"></el-table-column>
            <el-table-column  prop="materialNum" label="Amount" width="100" align="center"></el-table-column>
            <el-table-column  prop="materialFrom" label="Source" width="100" align="center"></el-table-column>
            <el-table-column  prop="materialContactName" label="Contact" width="100" align="center"></el-table-column>
            <el-table-column  prop="materialContactNo" label="Contact No." width="180" align="center"></el-table-column>
            <el-table-column  prop="materialContractNo" label="Contract No." width="100" align="center"></el-table-column>
            <el-table-column  prop="enable" label="是否Allocation Allowed" width="110" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.enable" type="success">Allocation Banned</el-tag>
                    <el-tag v-else type="danger">Allocation Allowed</el-tag>
                </template>
            </el-table-column>
            <el-table-column  prop="createTime" label="Time" width="150" align="center"></el-table-column>
            <el-table-column  prop="createUserId" label="Requester ID" width="100" align="center"></el-table-column>
            <el-table-column fixed="right" label="Options" align="center" width="200">
                <template slot-scope="scope">
<!--                    <el-button type="primary" round size="mini" @click="showDetail(scope.row.id)">详 情</el-button>-->
<!--                    <el-divider direction="vertical"></el-divider>-->
                    <el-popconfirm confirmButtonText='Confirm' cancelButtonText='Cancel' icon="el-icon-info" iconColor="red" title="确定删除Medical Resource  吗?" @confirm="deleteMaterial(scope.row.id)">
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
        name: "MaterialList",
        data(){
            return{
                entity,
                filterCondition:{

                },
                list:[],
                materialCategoryCodeOptions: [],
            }
        },
        methods:{
            mergeBean,resetForm,submitForm,isNotIdentity,
            resetFilter(){
                this.filterCondition.materialBatchNo = undefined;
                this.filterCondition.materialCategoryCode = undefined;
                this.filterCondition.materialEnable = false;
                this.loadList();
            },
            async loadList(){
                let res = await API.listMaterial(this.filterCondition);
                if(res.status){
                    this.list = res.data.list;
                    this.filterCondition = this.mergeBean(res.data.pagination, this.filterCondition);
                }
            },
            showDetail(id){

            },
            async deleteMaterial(id){
              console.log(id)
                let res = await API.deleteMaterial(id);
                if(res.status){
                    this.$message({message:'Deleted Successfully', type:'success'});
                }

            },
            async loadCategory(){
                let res = await API.listMaterialCategory({currentPage:1, pageSize:100});
                if(res.status){
                    const list = res.data.list;
                    this.$message({message:"Medical Resource Category Loaded, Amount："+list.length , type: 'success'});
                    list.forEach((v)=>{
                        this.materialCategoryCodeOptions.push({
                            'label': v.categoryName,
                            'value': v.categoryCode
                        });
                    });
                }
            }
        },
        mounted(){
            console.log("Load 应急Medical Resource  List");
            this.filterCondition = this.mergeBean(this.entity.pagination, this.filterCondition);
            this.filterCondition.pageSize = 20;
            this.loadList();
            this.loadCategory();

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