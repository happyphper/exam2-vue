<template>
  <div class="app-container">
    <UserTable></UserTable>
  </div>
</template>

<script>
  import UserTable from './components/UserTable'
  
  export default {
    name: 'users',
    components: {
      UserTable
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
