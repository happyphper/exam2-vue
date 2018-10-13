<template>
  <div class="app-container">
    <AdminUserTable></AdminUserTable>
  </div>
</template>

<script>
  import AdminUserTable from '@/views/adminUsers/table'
  
  export default {
    name: 'adminUsers',
    components: {
      AdminUserTable
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
