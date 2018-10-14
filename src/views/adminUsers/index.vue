<template>
  <div class="app-container">
    <AdminUserTable></AdminUserTable>
  </div>
</template>

<script>
  import AdminUserTable from './components/AdminUserTable'
  
  export default {
    name: 'adminUsers',
    components: {
      AdminUserTable
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
