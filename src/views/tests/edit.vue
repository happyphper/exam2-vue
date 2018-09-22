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
        <el-form-item label="考试班级" prop="groups">
          <el-select
            v-model="form.group_ids"
            multiple
            collapse-tags
            filterable
            remote
            reserve-keyword
            :remote-method="fetchGroups"
            :loading="selectLoading"
            placeholder="请输入关键字">
            <el-option
              v-for="group in groupSelectList"
              :key="group.id"
              :label="group.name"
              :value="group.id">
            </el-option>
          </el-select>
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
      <el-button type="primary" @click="onSubmit">立即更新</el-button>
      <el-button @click="resetForm('form')">重置表单</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { updateTest } from '@/api/tests'
  import { getGroups } from '@/api/groups'
  
  export default {
    name: 'testEdit',
    created() {
      this.groupSelectList = this.test.groups.data
      this.form.title = this.test.title
      this.form.type = this.test.type
      this.form.started_at = this.test.started_at
      this.form.ended_at = this.test.ended_at
      this.test.groups.data.forEach(item => this.form.group_ids.push(item.id))
    },
    props: ['test'],
    data() {
      return {
        form: {
          title: '',
          type: 'daily',
          started_at: '',
          ended_at: '',
          group_ids: []
        },
        loading: false,
        groupSelectList: [],
        selectLoading: false
      }
    },
    methods: {
      fetchGroups(query) {
        this.selectLoading = true
        getGroups({ name: `%${query}%`, per_page: 100 }).then(response => {
          this.groupSelectList = response.data
        }).finally(() => {
          this.selectLoading = false
        })
      },
      onSubmit() {
        this.loading = true
        updateTest(this.test.id, this.form).then(response => {
          this.$emit('updated', response)
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
