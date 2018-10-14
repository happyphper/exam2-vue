<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="班级名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="resetForm('form')">重置表单</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { storeGroup } from '@/api/groups'
  
  export default {
    name: 'GroupCreate',
    data() {
      return {
        form: {
          name: ''
        },
        loading: false
      }
    },
    methods: {
      onSubmit() {
        this.loading = true
        storeGroup(this.form).then(response => {
          this.$message.success('创建成功')
          this.$emit('created', response)
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

</style>
