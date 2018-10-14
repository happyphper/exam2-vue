<template>
  <div class="app-container">
    <UserGradeTable></UserGradeTable>
  </div>
</template>

<script>
  import UserGradeTable from './components/UserGradeTable'
  
  export default {
    name: 'statistics',
    components: { UserGradeTable },
    computed: {},
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
