<template>
  <div>
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-col :span="2">
            <el-button type="success" icon="el-icon-plus" @click="handleCreate" circle></el-button>
          </el-col>
        </el-col>
      </el-row>
    </div>
    
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column
        prop="share_user.name"
        label="被共享者"
        width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="移除共享关系" placement="top">
            <el-button @click="handleDelete(scope.row, scope.$index)" icon="el-icon-delete" size="small"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getShareQuestions, storeShareQuestion, deleteShareQuestion } from '@/api/shareQuestions'
  
  export default {
    name: 'shareQuestionsTable',
    created() {
      this.fetchShareQuestions()
    },
    props: ['group'],
    data() {
      return {
        tableData: [],
        currentPage: 1,
        perPage: 25,
        total: 0,
        include: 'share_user',
        loading: false
      }
    },
    methods: {
      fetchShareQuestions() {
        const queryString = {}
        queryString.include = this.include
        this.loading = true
        getShareQuestions(queryString).then(response => {
          this.tableData = response.data
        }).finally(() => {
          this.loading = false
        })
      },
      handleCreate() {
        this.$prompt('请输入用户手机', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /1[3-9]\d{9}/,
          inputErrorMessage: '手机格式不正确'
        }).then(({ value }) => {
          return storeShareQuestion(value)
        }).then(response => {
          this.tableData.push(response)
          this.$message.success('添加成功')
        })
      },
      handleDelete(row, index) {
        this.$confirm(`此操作将移除与 ${row.share_user.name} 用户共享关系, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return deleteShareQuestion(row.share_user.id)
        }).then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .block {
    width: 100%;
    text-align: center;
  }
  
  .search-bar {
    padding: 10px 0 10px 0;
  }
</style>
