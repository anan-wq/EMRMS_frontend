<template>
  <div class="chat">
    <el-table :data="userTableData" style="width: 100%">
      <!-- <el-table-column label="日期">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="Name">
        <template slot-scope="scope">
          <div class="an-box">
            <el-avatar
              :src="scope.row.picture"
            ></el-avatar>
            <el-popover trigger="hover" placement="top">
              <p>Name: {{ scope.row.nickName }}</p>
              <p>Address: {{ scope.row.address }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.nickName }}</el-tag>
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Identity">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.identityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sex" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.sex }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Options">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="showSend(scope.$index, scope.row)"
            >Send Messages</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination  @current-change="getUserData" background
                       :current-page.sync="tabInfo.currentPage"
                       :page-size="tabInfo.pageSize"
                       layout="total, prev, pager, next"
                       :total="tabInfo.total">
    </el-pagination>

    <el-dialog title="消息" :visible.sync="chatDiaLogShow">
      <div class="dialog-box">
        <div class="dialog-box-left">
          <el-form ref="chatForm" :model="chatForm" label-width="80px">
            <el-form-item label="Title">
              <el-input v-model="chatForm.title"></el-input>
            </el-form-item>
            <el-form-item label="Content">
              <quill-editor ref="myQuillEditor" v-model="chatForm.content" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="send">Send</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="dialog-box-right">
          <div class="chat-content" v-infinite-scroll="loadChat" v-if="chatList.length>0">
            <div class="chat-content-item" v-for="(item,index) in chatList" :key="index">
              <div class="chat-user-info" :style="{'justify-content':item.sendId==$user.id?'flex-end':'flex-start'}">
                <el-avatar
                  :size="45"
                  :src="chatUser.picture"
                  v-if="item.sendId!=$user.id"
                ></el-avatar>
                <div :class="{'chat-my':item.sendId==$user.id}">
                  <p>{{ item.sendId==$user.id ? $user.nickName:chatUser.nickName }}</p>
                  <p>{{ item.createTime }}</p>
                </div>
                <el-avatar
                  v-if="item.sendId==$user.id"
                  :size="45"
                  :src="chatUser.picture"
                ></el-avatar>
              </div>
              <div :class="{'chat-content-info':true,'chat-content-info-my':item.sendId==$user.id}">
                <h3>{{ item.title }}</h3>
                <div v-html="item.content"></div>
              </div>
            </div>
            <div v-if="isNotMore" style="text-align: center;padding-top: 20px;">
                No more data
              </div>
          </div>
          <div v-if="chatList.length<=0" style="text-align: center;">
            No Date
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { userApi ,chatApi } from "@/axios/api";
export default {
  data() {
    return {
      chatDiaLogShow: false,
      tabInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      userTableData: [],
      chatForm: {
        title: "",
        content: "",
        acceptId: '',
        sendId: this.$user.id,
      },
      chatUser: null,
      chatInfo:{
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      chatList: [],
      isChatLoad: false,
      isNotMore: false
    };
  },
  mounted() {
    this.getUserData()
  },
  methods: {
    loadChat(){
      if(!this.isChatLoad&&!this.isNotMore){
        this.isChatLoad=true
        this.chatInfo.currentPage++
        this.getChatList()
      }
    },
    showSend(index,row) {
      this.chatList=[]
      this.chatUser=row
      this.chatForm.acceptId=this.chatUser.id
      this.chatDiaLogShow = true;
      this.getChatList()
    },
    getChatList(){
      chatApi.getChatList({
        ...this.chatInfo,
        sendId: this.$user.id,
        acceptId: this.chatUser.id
      }).then(res=>{
        this.chatList.push(...res.data.list)
        this.chatInfo=res.data.pagination
        this.isNotMore=this.chatInfo.currentPage*this.chatInfo.pageSize>this.chatInfo.total
        this.isChatLoad=false
      })
    },
    send() {
      chatApi.sendChat(this.chatForm).then(res=>{
        this.chatForm.title=''
        this.chatForm.content=''
        this.chatList.push(res.data)
        this.$message({message:'Sent', type:'success'});
      })
    },
    getUserData() {
      userApi.listUser(this.tabInfo).then((res) => {
        this.tabInfo.total=res.data.pagination.total
        this.userTableData=res.data.list.filter(item=>item.id!=this.$user.id)
      });
    },
  },
};
</script>
<style scoped>
.chat-content{
  padding-right: 30px;
  height: 700px;
  overflow: auto;
}
.chat-content-info-my{
  padding: 20px 60px 0 0 !important;
  text-align: right;
}
.chat-my{
  padding-right: 15px;
  text-align: right;
}
.chat-content-item{
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.chat-content-info{
  padding: 20px 0 0 60px;
}

.chat-user-info{
  display: flex;
}

.chat-user-info>div{
  padding-top: 8px;
  padding-left: 15px;
}
.chat-user-info p {
  font-size: 14px;
  color: #666;
}

:deep(.el-dialog) {
  width: 90%;
}
.el-pagination {
    margin: 10px auto;
}
.dialog-box {
  display: flex;
  justify-content: space-between;
}

.dialog-box-left {
  width: 40%;
}

.dialog-box-right{
  width: 55%;
}
.an-box {
  display: flex;
  align-items: center;
}

.an-box .el-avatar {
  margin-right: 10px;
}

:deep(.ql-editor) {
  height: 350px;
}
</style>