<template>
  <div class="dashboard-container">
    <div class="dashboard-text">负责班级:
      <el-tag v-for="course in courses" :key="course.id">{{ course.title }}</el-tag>
    </div>
    <div class="dashboard-text">负责课程:
      <el-tag v-for="group in groups" :key="group.id">{{ group.name }}</el-tag>
    </div>
  </div>
</template>

<script>
  import { getUserGroups } from '@/api/userGroups'
  import { getUserCourses } from '@/api/userCourses'
  
  export default {
    name: 'dashboard',
    created() {
      getUserGroups().then(response => {
        this.groups = response.data
      })
      getUserCourses().then(response => {
        this.courses = response.data
      })
    },
    data() {
      return {
        courses: [],
        groups: []
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
