<template>
  <div class="app-container">
    <el-row :gutter="50">
      <el-col :span="12">
        <el-card>
          <ErrorQuestion></ErrorQuestion>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <GradeDistribution></GradeDistribution>
        </el-card>
      </el-col>
    </el-row>
  
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import GradeDistribution from './components/GradeDistribution'
  import ErrorQuestion from './components/ErrorQuestion'
  
  export default {
    name: 'statistics',
    components: {
      GradeDistribution,
      ErrorQuestion
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
