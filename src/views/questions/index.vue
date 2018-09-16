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
        <el-col :span="2">
          <el-button  type="success" icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
      
    </div>
    
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @sort-change="handleSortChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row v-for="option in props.row.options" :key="option.id">
            <el-col :span="24">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item :label="`选项 ${option.id}`" >
                  <span>{{ option.title }}</span>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        label="题目"
        prop="title">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="answers"
        label="答案">
      </el-table-column>
      <el-table-column
        prop="explain"
        label="解析">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建"
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
  import { getQuestions } from '@/api/questions'
  
  export default {
    name: 'users',
    created() {
      getQuestions().then(response => {
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

</style>
