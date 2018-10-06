<template>
  <div>
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="query.value" class="input-with-select">
            <el-select v-model="query.label" slot="prepend" placeholder="请选择" style="width: 120px">
              <el-option label="考试名称" value="title"></el-option>
              <el-option label="班级名称" value="groups:name"></el-option>
              <el-option label="课程名称" value="course:title"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    
    <el-table :data="tableData" border style="width: 100%" @sort-change="handleSortChange" v-loading="loading">
      <el-table-column
        label="考试名称"
        prop="test.title">
      </el-table-column>
      <el-table-column
        label="关联班级"
        prop="group.name">
      </el-table-column>
      <el-table-column
        label="成绩"
        prop="score">
      </el-table-column>
      <el-table-column
        label="试卷分"
        prop="total_score">
      </el-table-column>
      <el-table-column
        label="题目个数"
        prop="questions_count">
      </el-table-column>
      <el-table-column
        label="错误个数"
        prop="wrong_count">
      </el-table-column>
      <el-table-column
        label="正确个数"
        prop="right_count">
      </el-table-column>
      <el-table-column
        label="已答题目"
        prop="finished_count">
      </el-table-column>
      <el-table-column
        label="是否答完">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_finished" type="success">完成</el-tag>
          <el-tag v-else type="warning">正在答题</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="updated_at"
        label="结束时间"
        sortable="custom">
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
    name: 'testResultIndex',
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
          label: 'title',
          value: null
        },
        include: 'test,group',
        loading: false,
        testCreateStatus: false,
        testEditStatus: false,
        testEditBindTest: null,
        testEditIndex: 0
      }
    },
    methods: {
      fetchTestResults() {
        const queryString = {}
        this.query.value && (queryString[this.query.label] = `%${this.query.value}%`)
        queryString.include = this.include
        queryString.sort = `${this.sort.prop},${this.sort.order}`
        queryString.page = this.currentPage
        queryString.per_page = this.perPage
        this.loading = true
        getTestResults(this.$route.params.testId, this.$route.params.groupId, queryString).then(response => {
          this.tableData = response.data
          this.currentPage = response.meta.pagination.current_page
          this.perPage = response.meta.pagination.per_page
          this.total = response.meta.pagination.total
        }).finally(() => {
          this.loading = false
        })
      },
      handleSearch() {
        this.fetchTests()
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
