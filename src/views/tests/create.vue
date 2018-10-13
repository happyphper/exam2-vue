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
        <el-form-item label="附属课程" prop="type">
          <el-select
            v-model="form.course_id"
            filterable
            remote
            reserve-keyword
            :remote-method="fetchCourses"
            :loading="courseSelectListLoading"
            placeholder="请输入关键字">
            <el-option
              v-for="course in courseSelectList"
              :key="course.id"
              :label="course.title"
              :value="course.id">
            </el-option>
          </el-select>
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
            :loading="groupSelectListLoading"
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
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="resetForm('form')">重置表单</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { storeTest } from '@/api/tests'
  import { getCourses } from '@/api/courses'
  import { getGroups } from '@/api/groups'
  
  export default {
    name: 'createTest',
    created() {},
    data() {
      return {
        form: {
          title: '',
          started_at: '',
          ended_at: '',
          group_ids: [],
          course_id: null
        },
        loading: false,
        groupSelectListLoading: false,
        groupSelectList: [],
        courseSelectListLoading: false,
        courseSelectList: []
      }
    },
    methods: {
      fetchGroups(query) {
        this.groupSelectListLoading = true
        getGroups({ name: `%${query}%`, per_page: 100 }).then(response => {
          this.groupSelectList = response.data
        }).finally(() => {
          this.groupSelectListLoading = false
        })
      },
      fetchCourses(query) {
        this.courseSelectListLoading = true
        getCourses({ title: `%${query}%`, per_page: 100 }).then(response => {
          this.courseSelectList = response.data
        }).finally(() => {
          this.courseSelectListLoading = false
        })
      },
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
  
  .el-select {
    width: 20rem
  }
</style>
