<template>
    <div id="list">
        <el-dialog title="Choose Location" :visible.sync="locVisible" width="70%">
            <BaiDuMapTrace :keyword="keywords" :markers="loc"></BaiDuMapTrace>
        </el-dialog>
        <h1 class="title">Home Service Request History：</h1>
        <el-divider></el-divider>
        <el-card class="filter-bar" shadow="never">
            <el-form :inline="true" :model="filterCondition"  ref="eventFilter">
                <el-form-item label="Home Service Request Expected Priority">
                    <el-select v-model="filterCondition.level" placeholder="Choose Request Expected Priority">
                        <el-option label="General" value="General"></el-option>
                        <el-option label="Severe" value="Severe"></el-option>
                        <el-option label="Urgent" value="Urgent"></el-option>
                        <el-option label="Super Urgent" value="Super Urgent"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Location">
                    <el-select v-model="filterCondition.address" placeholder="Choose Location">
                        <el-option label="河南" value="河南"></el-option>
                        <el-option label="广东" value="广东"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" size="medium" @click="resetForm('eventFilter', resetFilter)">Clear</el-button>
                    <el-button type="primary" size="medium" @click="submitForm('eventFilter', loadList)">Select</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-table :data="list" border style="width: 100%" :highlight-current-row="true" :stripe="true">
            <el-table-column fixed prop="id" label="ID" width="180" align="center"></el-table-column>
            <el-table-column  prop="title" label="Title" width="180" align="center"></el-table-column>
            <el-table-column  prop="address" label="Location" width="180" align="center"></el-table-column>
            <el-table-column  prop="loc" label="Coordinate" width="180" align="center"></el-table-column>
            <el-table-column  prop="createTime" label="Time" width="180" align="center"></el-table-column>
            <el-table-column  prop="level" label="Expected Priority" width="180" align="center"></el-table-column>
            <el-table-column  prop="createUserId" label="Requester ID" width="180" align="center"></el-table-column>
            <el-table-column  prop="detail" label="Detail" align="center"></el-table-column>
            <el-table-column fixed="right" label="Options" width="280" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" round size="mini" @click="showPic(scope.row.picture)">Photo</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="primary" round size="mini" @click="showLoc(scope.row)">Location</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-popconfirm confirmButtonText='Confirm' cancelButtonText='Cancel' icon="el-icon-info" iconColor="red" title="Are you sure to delete?" @confirm="deleteEvent(scope.row.id)">
                        <el-button type="danger" round size="mini" slot="reference" :disabled="isNotIdentity(1)">Delete</el-button>
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
        <el-dialog title="Photo" width="30%" :visible.sync="isShowPic">
            <div style="margin: 0 auto; text-align: center">
                <el-image :src="pic"></el-image>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {resetForm, submitForm} from "@/base/ele-base";
    import { eventApi as API } from '@/axios/api'
    import entity from '@/base/entity'
    import {mergeBean, isNotIdentity, isNull} from '@/base/utils'
    import BaiDuMapTrace from "@/components/BaiDuMapTrace";
    export default {
        name: "ListEvent",
        components:{
            BaiDuMapTrace
        },
        data(){
            return{
                entity,
                locVisible:false,
                isShowPic: false,
                pic: undefined,
                loc:[],
                keywords:"",
                //筛选条件
                list: [],
                filterCondition:{}
            }
        },
        methods:{
            mergeBean, resetForm,submitForm,isNotIdentity,
            showLoc(record){
                console.log("Show Detail");
                console.log(record);
                const l = record.loc.split("&");
                this.loc.push({
                    lng: l[0],
                    lat: l[1]
                });
                console.log(this.loc);
                this.keywords = record.address;
                this.locVisible = true;
            },
            showPic(pic) {
                console.log("加载图片：" + pic);
                if (isNull(pic)) {
                    this.$message({message:'该事件建立时未上传图片！', type: 'info'});
                    return;
                }
                this.isShowPic = true;
                this.pic = pic;
            },
            deleteEvent(id){
                console.log("删除事件, ID = " + id);
                API.deleteEvent(id).then(res=>{
                    this.$message({message:'Deleted Successfully', type:'success'});
                });
            },
            loadList(){
                API.listEvent(this.filterCondition).then(res=>{
                    this.list = res.data.list;
                    this.filterCondition = this.mergeBean(res.data.pagination, this.filterCondition);
                });
            },
            resetFilter(){
                this.filterCondition.address = undefined;
                this.filterCondition.level = undefined;
                this.loadList();
            }
        },
        mounted(){
            console.log("Load 突发事件List");
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
</style>