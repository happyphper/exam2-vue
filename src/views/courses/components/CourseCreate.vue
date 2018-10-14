<template>
  <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="课程名称" prop="title">
          <el-input v-model="form.title"></el-input>
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
  import { storeCourse } from '@/api/courses'
  
  export default {
    name: 'CourseCreate',
    created() {},
    data() {
      return {
        form: {
          title: ''
        },
        loading: false
      }
    },
    methods: {
      onSubmit() {
        this.loading = true
        storeCourse(this.form).then(response => {
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
  
  .el-select {
    width: 20rem
  }
</style>
