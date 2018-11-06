<template>
  <div class="app-container">
    <el-row :gutter="50">
      <el-col :span="12">
        <el-card>
          <ErrorQuestion :classroomId="classroomId" :examId="examId"></ErrorQuestion>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <GradeDistribution :classroomId="classroomId" :examId="examId"></GradeDistribution>
        </el-card>
      </el-col>
    </el-row>
    
    <ExamResultTable :classroomId="classroomId" :examId="examId"></ExamResultTable>
  </div>
</template>

<script>
  import GradeDistribution from './components/GradeDistribution'
  import ErrorQuestion from './components/ErrorQuestion'
  
  import ExamResultTable from './components/ResultTable'
  
  export default {
    name: 'examResults',
    components: {
      GradeDistribution,
      ErrorQuestion,
      ExamResultTable
    },
    computed: {
      classroomId() {
        return this.$route.query.classroomId
      },
      examId() {
        return this.$route.query.examId
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
