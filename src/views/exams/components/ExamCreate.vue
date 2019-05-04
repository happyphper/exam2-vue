<template>
  <el-form :model="form" :rules="rules" label-width="80px" ref="form" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="考试名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="附属课程" prop="course_id">
          <el-select
            :loading="courseSelectListLoading"
            :remote-method="fetchCourses"
            filterable
            placeholder="请输入关键字"
            remote
            reserve-keyword
            v-model="form.course_id"
          >
            <el-option
              :key="course.id"
              :label="course.title"
              :value="course.id"
              v-for="course in courseSelectList"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="考试班级" prop="classroom_ids">
          <el-select
            :loading="classroomSelectListLoading"
            :remote-method="fetchClassrooms"
            collapse-tags
            filterable
            multiple
            placeholder="请输入关键字"
            remote
            reserve-keyword
            v-model="form.classroom_ids"
          >
            <el-option
              :key="classroom.id"
              :label="classroom.title"
              :value="classroom.id"
              v-for="classroom in classroomSelectList"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="开始时间" prop="started_at">
          <el-date-picker placeholder="选择日期时间" type="datetime" v-model="form.started_at"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="结束时间" prop="ended_at">
          <el-date-picker placeholder="选择日期时间" type="datetime" v-model="form.ended_at"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item>
      <el-button @click="onSubmit" type="primary">立即创建</el-button>
      <el-button @click="resetForm('form')">重置表单</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { storeExam } from '@/api/exams'
import { getCourses } from '@/api/courses'
import { getClassrooms } from '@/api/classrooms'

export default {
  name: 'ExamCreate',
  created() {},
  data() {
    return {
      form: {
        title: '',
        started_at: '',
        ended_at: '',
        classroom_ids: [],
        course_id: null
      },
      rules: {
        title: [{ required: true, message: '必填' }],
        started_at: [{ required: true, message: '必填' }],
        ended_at: [{ required: true, message: '必填' }],
        classroom_ids: [{ required: true, message: '必填' }],
        course_id: [{ required: true, message: '必填' }]
      },
      loading: false,
      classroomSelectListLoading: false,
      classroomSelectList: [],
      courseSelectListLoading: false,
      courseSelectList: []
    }
  },
  methods: {
    fetchClassrooms(query) {
      this.classroomSelectListLoading = true
      getClassrooms({ name: `%${query}%`, per_page: 100 })
        .then(response => {
          this.classroomSelectList = response.data
        })
        .finally(() => {
          this.classroomSelectListLoading = false
        })
    },
    fetchCourses(query) {
      this.courseSelectListLoading = true
      getCourses({ title: `%${query}%`, per_page: 100 })
        .then(response => {
          this.courseSelectList = response.data
        })
        .finally(() => {
          this.courseSelectListLoading = false
        })
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        this.loading = true
        storeExam(this.form)
          .then(response => {
            this.$emit('created', response)
          })
          .finally(() => {
            this.loading = false
          })
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
  width: 20rem;
}
</style>
