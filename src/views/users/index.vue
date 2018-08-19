<template>
  <div class="app-container">
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="query.value" class="input-with-select">
            <el-select v-model="query.label" slot="prepend" placeholder="请选择" style="width: 80px">
              <el-option label="姓名" value="name"></el-option>
              <el-option label="手机" value="phone"></el-option>
              <el-option label="邮箱" value="email"></el-option>
              <el-option label="学号" value="student_id"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @sort-change="handleSortChange">
      <el-table-column
        label="头像"
        width="66">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="头像" width="40">
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机">
      </el-table-column>
      <el-table-column
        prop="student_id"
        label="学号">
      </el-table-column>
      <el-table-column
        prop="group_id"
        label="群组">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="注册时间"
        sortable="custom">
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[25, 50, 75, 100]"
        :page-size="perPage"
        layout="sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getUsers } from '@/api/users'
  
  export default {
    name: 'users',
    created() {
      getUsers().then(response => {
        this.tableData = response.data
      }).finally(() => {
        this.loading = false
      })
    },
    data() {
      return {
        tableData: [],
        page: 1,
        perPage: 25,
        total: 0,
        sort: {
          prop: 'created_at',
          order: 'desc'
        },
        query: {
          label: 'name',
          value: null
        },
        loading: false
      }
    },
    methods: {
      handleSizeChange(pageNumber) {
        this.perPage = pageNumber
      },
      handleCurrentChange(currentPage) {
        this.page = currentPage
      },
      handleSortChange({ column, prop, order }) {
        this.sort = { prop, order }
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
