<template>
  <div class="dashboard-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="course" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">管辖课程</div>
            <count-to :start-val="0" :end-val="courses_count" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="classroom" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">负责班级</div>
            <count-to :start-val="0" :end-val="classrooms_count" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="question" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">题目数量</div>
            <count-to :start-val="0" :end-val="questions_count" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="test" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">考试数量</div>
            <count-to :start-val="0" :end-val="tests_count" :duration="3600" class="card-panel-num"/>
          </div>
        </div>
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
        this.tests_count = response.tests_count
        this.classrooms_count = response.classrooms_count
      })
    },
    data() {
      return {
        courses_count: 0,
        questions_count: 0,
        tests_count: 0,
        classrooms_count: 0
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
