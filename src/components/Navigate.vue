<template>
    <div class="navigate">
        <el-image id="logo" :src=pic fit="cover"></el-image>
        <el-menu default-active="100-100" :unique-opened=true>
            <el-submenu index="1">
                <template slot="title">
                    <span class="title">Healthcare Requests</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="1-1">
                        <router-link :to="{name: 'event-list'}" tag="li" >Home Service Request History</router-link>
                    </el-menu-item>
                    <el-menu-item index="1-2" v-if="isIdentity(1)">
                        <router-link :to="{name: 'event-new'}" tag="li" >New Home Service Request</router-link>
                    </el-menu-item>
                    <el-menu-item index="1-3" v-if="isIdentity(1)">
                        <router-link :to="{name: 'approval-new'}" tag="li" >New Medical Resource Order </router-link>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <span class="title">Medical Resource Management</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="2-1" v-if="isIdentity(2)">
                        <router-link :to="{name:'material-category-new'}" tag="li">New Medical Resource Category</router-link>
                    </el-menu-item>
                    <el-menu-item index="2-2" v-if="isIdentity(2)">
                        <router-link :to="{name: 'material-new'}" tag="li">New Medical Resource </router-link>
                    </el-menu-item>
                    <el-menu-item index="2-3">
                        <router-link :to="{name: 'material-category-list'}" tag="li">Medical Resource Category List</router-link>
                    </el-menu-item>
                    <el-menu-item index="2-4">
                        <router-link :to="{name: 'material-list'}" tag="li">Medical Resource  List</router-link>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <span class="title">Order Management</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="3-1" v-if="isIdentity(4)">
                        <router-link :to="{name:'wait-approval'}" tag="li">To be Confirmed List</router-link>
                    </el-menu-item>
                    <el-menu-item index="3-2">
                        <router-link :to="{name: 'approval-list'}" tag="li" >All Orders  </router-link>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                    <span class="title">Home Healthcare Service Management</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="4-1" v-if="isIdentity(3)">
                        <router-link :to="{name:'wait-transport'}" tag="li">To be Deliver</router-link>
                    </el-menu-item>
                    <el-menu-item index="4-2" v-if="isIdentity(3)">
                        <router-link :to="{name:'new-transport'}" tag="li">New Home Healthcare Service</router-link>
                    </el-menu-item>
                    <el-menu-item index="4-3">
                        <router-link :to="{name:'transport-list'}" tag="li">Home Healthcare Service List</router-link>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">
                    <span class="title">Messages</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="5-1">
                        <router-link :to="{name:'chat'}" tag="li">Messages</router-link>
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
<!--            <el-submenu index="5">-->
<!--                <template slot="title">-->
<!--                    <span class="title">个人中心</span>-->
<!--                </template>-->
<!--                <el-menu-item-group>-->
<!--                    <el-menu-item index="5-1">选项1</el-menu-item>-->
<!--                    <el-menu-item index="5-2">选项2</el-menu-item>-->
<!--                </el-menu-item-group>-->
<!--            </el-submenu>-->
        </el-menu>
    </div>
</template>

<script>
    import {isIdentity} from "@/base/utils";
    export default {
        name: "Navigate",
        data(){
            return{
                pic: require('@/assets/logo-no-background.png'), // 使用 require 来加载图片
                //pic: "http://oss.bestbigkk.com/halo/bestbigkk_1579275103355.svg",
                identityName:"",
                identityCode:-1,
            }
        },
        methods:{
            isIdentity
        },
        mounted() {
            //this.pic = this.$user.picture;
            this.identityName = this.$user.identityName;
            this.identityCode = this.$user.identityCode;
        }
    }
</script>

<style scoped>
    .navigate{
        height: 100%;
        width: 100% !important; /* 设置侧边栏的宽度为 250px，可以根据需求调整 */
        border-right: rgba(116, 116, 116, 0.57) 1px solid;
    }
    .el-image{
        /*border-radius: 50%;*/
        /*border: deepskyblue 5px double;*/
        overflow: hidden;
        display: block;
        margin: 20px;
    }
    .el-menu {
      width: 350px !important; /* 使 el-menu 填满侧边栏 */
      height: 100%;
    }
    #logo{
        width: 100%;
        height: 100%;
    }
    .title{
        font-weight: bold;
    }
</style>