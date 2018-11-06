<template>
  <div class="dashboard-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link :to="{ name: 'courseIndex' }">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="course" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">管辖课程</div>
              <count-to :start-val="0" :end-val="courses_count" :duration="2600" class="card-panel-num"/>
            </div>
          </div>
        </router-link>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link :to="{ name: 'classroomIndex' }">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="classroom" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">负责班级</div>
              <count-to :start-val="0" :end-val="classrooms_count" :duration="2600" class="card-panel-num"/>
            </div>
          </div>
        </router-link>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link :to="{ name: 'questionIndex' }">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-money">
              <svg-icon icon-class="question" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">创建题目</div>
              <count-to :start-val="0" :end-val="questions_count" :duration="3200" class="card-panel-num"/>
            </div>
          </div>
        </router-link>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <router-link :to="{ name: 'examIndex' }">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-shopping">
              <svg-icon icon-class="exam" class-name="card-panel-icon"/>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">创建考试</div>
              <count-to :start-val="0" :end-val="exams_count" :duration="3600" class="card-panel-num"/>
            </div>
          </div>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import { getDashboard } from '@/api/dashboard'
  
  export default {
    name: 'dashboard',
    components: {
      CountTo
    },
    created() {
      getDashboard().then(response => {
        this.courses_count = response.courses_count
        this.questions_count = response.questions_count
        this.exams_count = response.exams_count
        this.classrooms_count = response.classrooms_count
      })
    },
    data() {
      return {
        courses_count: 0,
        questions_count: 0,
        exams_count: 0,
        classrooms_count: 0
      }
    },
    methods: {
      goToRoute(routeName) {
        this.$router.push({ name: routeName })
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
