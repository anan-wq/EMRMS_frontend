<template>
  <div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="180px">
      <el-form-item label-width="180px" label="Requester ID" prop="createUserId">
        <el-input v-model="formData.createUserId" readonly :disabled='true' clearable
          :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label-width="180px" label="Medical Resource Category Code" prop="categoryCode">
        <el-input v-model="formData.categoryCode" placeholder="Please Enter Medical Resource Category Code" :maxlength="50" show-word-limit
          clearable prefix-icon='el-icon-menu' :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label-width="180px" label="Medical Resource Category Name" prop="categoryName">
        <el-input v-model="formData.categoryName" placeholder="Please Enter Medical Resource Category Name" clearable
          prefix-icon='el-icon-takeaway-box' :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label-width="180px" label="Delivery Scheme" prop="enable" required>
        <el-switch v-model="formData.enable" active-text="Delivery Allowed" inactive-text="Delivery Banned"></el-switch>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm('elForm', newCategory)">Submit</el-button>
        <el-button @click="resetForm('elForm')">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {resetForm, submitForm} from "@/base/ele-base";
import {materialApi as API} from "@/axios/api";
export default {
  components: {},
  name:'NewMaterialCategory',
  props: [],
  data() {
    return {
      formData: {
        createUserId: undefined,
        categoryCode: undefined,
        categoryName: undefined,
        enable: false,
      },
      rules: {
        createUserId: [{
          required: true,
          message: '',
          trigger: 'blur'
        }],
        categoryCode: [{
          required: true,
          message: 'Please Enter Medical Resource Category Code',
          trigger: 'blur'
        }],
        category_name: [{
          required: true,
          message: 'Please Enter Medical Resource Category Name',
          trigger: 'blur'
        }],
      },
    }
  },
  mounted() {
    this.formData.createUserId = this.$user.id;
  },
  methods: {
    resetForm,submitForm,
    async newCategory(){
      let res = await API.newMaterialCategory(this.formData);
      if (res.status) {
        this.$message({message:"New Medical Resource Category Done", type: 'success'});
      }
    }
  }
}

</script>
<style>
</style>
