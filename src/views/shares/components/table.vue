<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane value="classroom" label="共享班级者">
        <Classroom :key="Date.now()"></Classroom>
      </el-tab-pane>
      <el-tab-pane value="question" label="共享题库者">
        <Question :key="Date.now()"></Question>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Classroom from './classroom'
  import Question from './question'
  
  export default {
    name: 'sharesTable',
    components: {
      Classroom,
      Question
    },
    data() {
      return {
        activeTab: 'classroom'
      }
    },
    methods: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
