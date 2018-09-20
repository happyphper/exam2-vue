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
          <el-form-item label="班级" prop="group_id">
            <el-select v-model="form.group_id" filterable default-first-option placeholder="请输入班级" :remote="true" :remote-method="fetchGroups" :loading="selectLoading">
              <el-option v-for="item in selectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
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
  import { getGroups } from '@/api/groups'
  
  export default {
    name: 'userEdit',
    created() {
      this.form.name = this.user.name
      this.form.email = this.user.email
      this.form.student_id = this.user.name
      this.form.phone = this.user.phone
      this.form.group_id = this.user.group_id
      this.user.group && this.selectList.push(this.user.group)
    },
    props: ['user'],
    data() {
      return {
        form: {
          name: null,
          email: null,
          group_id: null,
          student_id: null,
          phone: null
        },
        loading: false,
        selectLoading: false,
        selectList: []
      }
    },
    methods: {
      onSubmit() {
        this.loading = true
        updateUser(this.user.id, this.form).then(() => {
          this.$message.success('更新成功')
          this.user.name = this.form.name
          this.user.email = this.form.email
          this.user.student_id = this.form.student_id
          this.user.phone = this.form.phone
          this.user.group_id = this.form.group_id
          this.$emit('updated')
          this.resetForm('form')
        }).finally(() => {
          this.loading = false
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      fetchGroups(query) {
        if (query !== '') {
          this.selectLoading = true
          getGroups({ name: `%${query}%` }).then(response => {
            this.selectList = response.data
          }).finally(() => {
            this.selectLoading = false
          })
        } else {
          this.selectList = []
        }
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
