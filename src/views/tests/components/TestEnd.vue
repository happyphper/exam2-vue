<template>
  <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
    <el-row>
      <el-col :span="24">
        提示：
        <p>1. 你可以指定班级结束考试</p>
        <p>2. 结考后，指定的班级学员将无法参加考试，其他班级依然可以进行考试</p>
        <p>3. 每分钟自动根据考试时间开始时间，将考试状态调整为开考考试，无需手动操作</p>
        <p>4. 每小时自动根据考试时间结束时间，将考试状态调整为结束考试，无需手动操作</p>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="考试班级" prop="groups">
          <el-checkbox-group v-model="form.group_ids">
            <el-checkbox v-for="group in test.groups.data" :label="group.id" :key="group.id">{{group.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">结束考试</el-button>
      <el-button @click="resetForm('form')">重置表单</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { endTest } from '@/api/tests'
  
  export default {
    name: 'TestEnd',
    created() {},
    data() {
      return {
        form: {
          group_ids: []
        },
        loading: false
      }
    },
    props: ['test'],
    methods: {
      onSubmit() {
        this.loading = true
        endTest(this.test.id, this.form).then(response => {
          this.$emit('ended', response)
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
