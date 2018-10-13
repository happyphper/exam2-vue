<template>
  <div class="app-container">
    <TestResultTable></TestResultTable>
  </div>
</template>

<script>
  import TestResultTable from './table'
  
  export default {
    name: 'testResults',
    components: {
      TestResultTable
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
