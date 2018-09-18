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
          <el-button  type="success" icon="el-icon-plus"  @click="showCreateModal" circle></el-button>
        </el-col>
      </el-row>
      
    </div>
    
    <el-table :data="tableData" border style="width: 100%" @sort-change="handleSortChange">
      <el-table-column
        label="考试名称"
        prop="title">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="started_at"
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="ended_at"
        label="结束时间"
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
    
    <!--CreateModal-->
    <el-dialog title="创建测试" :visible.sync="createModal" width="50%" :before-close="hideCreateModal">
      <TestCreate @created="newTest"></TestCreate>
    </el-dialog>
  </div>
</template>

<script>
  import { getTests } from '@/api/tests'
  
  import TestCreate from './create'
  
  export default {
    name: 'tests',
    components: {
      TestCreate
    },
    created() {
      getTests().then(response => {
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
        loading: false,
        createModal: false
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
      },
      showCreateModal() {
        this.createModal = true
      },
      hideCreateModal() {
        this.createModal = false
      },
      newTest(response) {
        this.createModal = false
        this.tableData.push(response)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
