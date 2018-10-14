<template>
  <div class="app-container">
    <CourseTable></CourseTable>
  </div>
</template>

<script>
  import CourseTable from './components/CourseTable'
  
  export default {
    name: 'courses',
    components: {
      CourseTable
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
