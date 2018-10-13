<template>
  <div>
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input placeholder="考试名称" v-model="query.testTitle"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="班级名称" v-model="query.groupName"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="用户姓名" v-model="query.userName"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button icon="el-icon-search" @click="handleSearch"></el-button>
        </el-col>
      </el-row>
    </div>
    
    <el-table :data="tableData" border style="width: 100%" @sort-change="handleSortChange" v-loading="loading">
      <el-table-column
        label="考试"
        prop="test.title">
      </el-table-column>
      <el-table-column
        label="班级"
        prop="group.name">
      </el-table-column>
      ¬
      <el-table-column
        label="学生"
        prop="user.name">
      </el-table-column>
      <el-table-column
        prop="wrong_count"
        label="错题">
      </el-table-column>
      <el-table-column
        prop="right_count"
        label="正确">
      </el-table-column>
      <el-table-column
        prop="questions_count"
        label="题目总数">
      </el-table-column>
      <el-table-column
        prop="score"
        label="成绩">
      </el-table-column>
      <el-table-column
        prop="score"
        label="总分">
      </el-table-column>
      <el-table-column
        label="是否答完">
        <template slot-scope="scope">
          <el-tag :type="scope.row.is_finished ? 'success' : 'warning'">{{ scope.row.is_finished ? '已交卷' : '答题中' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="结束时间">
      </el-table-column>
      <el-table-column
        prop="updated_at"
        label="结束时间">
      </el-table-column>
    </el-table>
    
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[25, 50, 75, 100]"
        :page-size="perPage"
        layout="sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getTestResults } from '@/api/testResults'
  
  export default {
    name: 'testResultTable',
    created() {
      this.fetchTestResults()
    },
    data() {
      return {
        tableData: [],
        currentPage: 1,
        perPage: 25,
        total: 0,
        sort: {
          prop: 'created_at',
          order: 'desc'
        },
        query: {
          testTitle: '',
          groupName: '',
          userName: ''
        },
        include: 'test,group,user',
        loading: false
      }
    },
    methods: {
      fetchTestResults() {
        const queryString = {}
        this.query.testTitle && (queryString['test:title'] = `%${this.query.testTitle}%`)
        this.query.groupName && (queryString['group:name'] = `%${this.query.groupName}%`)
        this.query.userName && (queryString['user:name'] = `%${this.query.userName}%`)
        queryString.include = this.include
        queryString.sort = `${this.sort.prop},${this.sort.order}`
        queryString.page = this.currentPage
        queryString.per_page = this.perPage
        this.loading = true
        getTestResults(queryString).then(response => {
          this.tableData = response.data
          this.currentPage = response.meta.pagination.current_page
          this.perPage = response.meta.pagination.per_page
          this.total = response.meta.pagination.total
        }).finally(() => {
          this.loading = false
        })
      },
      handleSearch() {
        this.fetchTestResults()
      },
      handleSizeChange(pageNumber) {
        this.perPage = pageNumber
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
      },
      handleSortChange({ column, prop, order }) {
        this.sort = { prop, order }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
