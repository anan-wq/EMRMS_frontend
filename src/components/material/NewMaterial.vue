<template>
  <div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label-width="180px" label="Requester ID" prop="createUserId">
        <el-input v-model="formData.createUserId" readonly :disabled='true' clearable
          :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label-width="180px" label="Medical Resource Batch" prop="materialBatchNo">
        <el-input v-model="formData.materialBatchNo" placeholder="Please Enter Medical Resource Batch" :maxlength="50" show-word-limit
          clearable prefix-icon='el-icon-menu' :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label-width="180px" label="Medical Resources Name" prop="materialName">
        <el-input v-model="formData.materialName" placeholder="Please Enter Medical Resource  Name" clearable
          prefix-icon='el-icon-takeaway-box' :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label-width="180px" label="Medical Resource Amount" prop="materialNum">
        <el-input-number v-model="formData.materialNum" :step='1'></el-input-number>
      </el-form-item>
      <el-form-item label-width="180px" label="Category" prop="materialCategoryCode">
        <el-select v-model="formData.materialCategoryCode" placeholder="Please Choose Category" clearable
          :style="{width: '100%'}">
          <el-option v-for="(item, index) in materialCategoryCodeOptions" :key="index" :label="item.label"
            :value="item.value" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="180px" label="Source" prop="materialFrom">
        <el-input v-model="formData.materialFrom" placeholder="Please Enter Source" clearable :style="{width: '100%'}">
        </el-input>
      </el-form-item>
      <el-form-item label-width="180px" label="Contact" prop="materialContactName">
        <el-input v-model="formData.materialContactName" placeholder="Please Enter Contact" clearable
          :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label-width="180px" label="Contact No." prop="materialContactNo">
        <el-input v-model="formData.materialContactNo" placeholder="Please Enter Contact No." clearable
          :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label-width="180px" label="Contract No." prop="materialContractNo">
        <el-input v-model="formData.materialContractNo" placeholder="Please Enter Contract No." clearable
          :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label-width="180px" label="Delivery Scheme" prop="enable" required>
        <el-switch v-model="formData.enable" active-text="Delivery Allowed" inactive-text="Delivery Banned"></el-switch>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm('elForm', newMaterial)">Submit</el-button>
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
  name:"NewMaterial",
  props: [],
  data() {
    return {
      formData: {
        createUserId: undefined,
        materialBatchNo: undefined,
        materialName: undefined,
        materialNum: 0,
        materialCategoryCode: undefined,
        materialFrom: undefined,
        materialContactName: undefined,
        materialContactNo: undefined,
        materialContractNo: undefined,
        enable: false,
      },
      rules: {
        createUserId: [{
          required: true,
          message: '',
          trigger: 'blur'
        }],
        materialBatchNo: [{
          required: true,
          message: 'Please Enter Medical Resource Batch',
          trigger: 'blur'
        }],
        materialName: [{
          required: true,
          message: 'Please Enter Medical Resource  Name',
          trigger: 'blur'
        }],
        materialNum: [{
          required: true,
          message: '',
          trigger: 'blur'
        }],
        materialCategoryCode: [{
          required: true,
          message: 'Please Choose Category',
          trigger: 'change'
        }],
        materialFrom: [{
          required: true,
          message: 'Please Enter Source',
          trigger: 'blur'
        }],
        materialContactName: [{
          required: true,
          message: 'Please Enter Contact',
          trigger: 'blur'
        }],
        materialContactNo: [{
          required: true,
          message: 'Please Enter Contact No.',
          trigger: 'blur'
        }],
        materialContractNo: [{
          required: true,
          message: 'Please Enter Contract No.',
          trigger: 'blur'
        }],
      },
      materialCategoryCodeOptions: [],
    }
  },
  mounted() {
    this.formData.createUserId = this.$user.id;
    this.loadCategory();
  },
  methods: {
    resetForm,submitForm,
    async newMaterial(){
      let res = await API.newMaterial(this.formData);
      if (res.status) {
        this.$message({message:"New Medical Resource Done", type: 'success'});
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
    },
  }
}

</script>
<style>
</style>
