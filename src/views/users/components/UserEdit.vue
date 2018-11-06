<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="班级" prop="classroom_id">
            <el-tag :key="user.classroom.id" style="margin-right: 0.5rem;">{{ user.classroom.title }}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="学号" prop="student_id">
            <el-input v-model="form.student_id"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即更新</el-button>
        <el-button @click="resetForm('form')">重置表单</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { updateUser } from '@/api/users'
  
  export default {
    name: 'UserEdit',
    created() {
      this.form.name = this.user.name
      this.form.email = this.user.email
      this.form.student_id = this.user.student_id
      this.form.phone = this.user.phone
    },
    props: ['user'],
    data() {
      return {
        form: {
          name: null,
          email: null,
          student_id: null,
          phone: null
        },
        loading: false
      }
    },
    methods: {
      onSubmit() {
        this.loading = true
        updateUser(this.user.id, this.form).then(response => {
          this.$message.success('更新成功')
          this.$emit('updated', response)
          this.resetForm('form')
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
