<template>
  <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="考试名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="考试类型" prop="type">
          <el-radio v-model="form.type" label="daily">日常测验</el-radio>
          <el-radio v-model="form.type" label="random">随机练习</el-radio>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="开始时间" prop="started_at">
          <el-date-picker v-model="form.started_at" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="结束时间" prop="ended_at">
          <el-date-picker v-model="form.ended_at" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="resetForm('form')">重置表单</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { storeTest } from '@/api/tests'
  
  export default {
    name: 'createTest',
    created() {},
    data() {
      return {
        activeTab: 'text',
        form: {
          title: '',
          type: 'daily',
          started_at: '',
          ended_at: ''
        },
        loading: false
      }
    },
    methods: {
      onSubmit() {
        this.loading = true
        storeTest(this.form).then(response => {
          this.$emit('created', response)
        }).finally(() => {
          this.loading = false
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .block {
    width: 100%;
    text-align: center;
  }
  
  .search-bar {
    padding: 10px 0 10px 0;
  }
</style>
