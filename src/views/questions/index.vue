<template>
  <div class="app-container">
    <QuestionTable></QuestionTable>
  </div>
</template>

<script>
  import QuestionTable from '@/views/questions/components/QuestionTable'
  
  export default {
    name: 'questions',
    components: {
      QuestionTable
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
