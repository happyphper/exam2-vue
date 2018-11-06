<template>
  <div class="app-container">
    <el-row :gutter="50">
      <el-col :span="12">
        <el-card>
          <ErrorQuestion :classroomId="classroomId" :testId="testId"></ErrorQuestion>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <GradeDistribution :classroomId="classroomId" :testId="testId"></GradeDistribution>
        </el-card>
      </el-col>
    </el-row>
    
    <TestResultTable :classroomId="classroomId" :testId="testId"></TestResultTable>
  </div>
</template>

<script>
  import GradeDistribution from './components/GradeDistribution'
  import ErrorQuestion from './components/ErrorQuestion'
  
  import TestResultTable from './components/ResultTable'
  
  export default {
    name: 'testResults',
    components: {
      GradeDistribution,
      ErrorQuestion,
      TestResultTable
    },
    computed: {
      classroomId() {
        return this.$route.query.classroomId
      },
      testId() {
        return this.$route.query.testId
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
