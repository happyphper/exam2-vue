<template>
  <div>
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input placeholder="请输入考试关键字" v-model="query.title"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="请输入课程关键字" v-model="query.courseTitle"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="请输入班级关键字" v-model="query.groupName"></el-input>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-button icon="el-icon-search" circle @click="handleSearch"></el-button>
          <el-button  type="success" icon="el-icon-plus"  @click="showTestCreateComponent" circle></el-button>
        </el-col>
      </el-row>
    </div>
    
    <el-table :data="tableData" border style="width: 100%" @sort-change="handleSortChange" v-loading="loading">
      <el-table-column
        label="考试名称"
        prop="title">
      </el-table-column>
      <el-table-column
        label="附属课程"
        prop="course.title">
      </el-table-column>
      <el-table-column label="关联班级">
        <template slot-scope="scope">
          <el-button size="small" v-for="group in scope.row.groups.data" :key="group.id">
            <router-link :to="{ name: 'testResultIndex', query: { testId: scope.row.id, groupId: group.id }}">{{ group.name }}</router-link>
          </el-button>
        </template>
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
      <el-table-column
        width="100"
        prop="status_translate"
        label="状态">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showTestEndComponent(scope.row)">{{ scope.row.status_translate }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="考题">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="考题" placement="top">
            <el-button type="success" size="small">
              <router-link :to="{ name: 'testPaper', params: { test: scope.row.id }}">考题</router-link>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button @click="showTestEditComponent(scope.row, scope.$index)" icon="el-icon-edit" size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button @click="handleDelete(scope.row, scope.$index)" icon="el-icon-delete" size="small"></el-button>
          </el-tooltip>
        </template>
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
    
    <!--CreateModal-->
    <el-dialog title="提示" :visible.sync="testCreateStatus" width="50%">
      <TestCreate @created="testCreated" :key="Date.now()"></TestCreate>
    </el-dialog>
    <!--EditModal-->
    <el-dialog title="提示" :visible.sync="testEditStatus" width="50%">
      <TestEdit :test="testEditBindTest" @updated="testUpdated" :key="Date.now()"></TestEdit>
    </el-dialog>
    <!--EditModal-->
    <el-dialog title="提示" :visible.sync="testEndBindStatus" width="50%">
      <TestEnd :test="testEndBindTest" @ended="testEnded" :key="Date.now()"></TestEnd>
    </el-dialog>
  </div>
</template>

<script>
  import { getTests, deleteTest } from '@/api/tests'
  
  import TestCreate from './TestCreate'
  import TestEdit from './TestEdit'
  import TestEnd from './TestEnd'
  import Paper from '../paper'
  
  export default {
    name: 'TestTable',
    components: {
      Paper,
      TestCreate,
      TestEdit,
      TestEnd
    },
    created() {
      this.$route.query.courseTitle && (this.query.courseTitle = this.$route.query.courseTitle)
      this.$route.query.groupName && (this.query.groupName = this.$route.query.groupName)
      this.fetchTests()
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
          title: null,
          courseTitle: null,
          groupName: null
        },
        include: 'groups,course',
        loading: false,
        testCreateStatus: false,
        testEditStatus: false,
        testEditBindTest: null,
        testEditIndex: 0,
        testEndBindStatus: false,
        testEndBindTest: null
      }
    },
    methods: {
      fetchTests() {
        const queryString = {}
        this.query.title && (queryString['title'] = `%${this.query.title}%`)
        this.query.courseTitle && (queryString['course:title'] = `%${this.query.courseTitle}%`)
        this.query.groupName && (queryString['groups:name'] = `%${this.query.groupName}%`)
        queryString.include = this.include
        queryString.sort = `${this.sort.prop},${this.sort.order}`
        queryString.page = this.currentPage
        queryString.per_page = this.perPage
        this.loading = true
        getTests(queryString).then(response => {
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
      },
      showTestCreateComponent() {
        this.testCreateStatus = true
      },
      testCreated(response) {
        this.tableData.push(response)
        this.testCreateStatus = false
      },
      showTestEditComponent(test, index) {
        this.testEditBindTest = test
        this.testEditIndex = index
        this.testEditStatus = true
      },
      testUpdated(response) {
        this.testEditStatus = false
        this.tableData.splice(this.testEditIndex, 1, response)
      },
      handleDelete(test, index) {
        this.$confirm(`此操作将 ${test.title} 考试删除, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return deleteTest(test.id)
        }).then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
      },
      showTestEndComponent(test) {
        if (test.status === 'end') {
          return false
        }
        this.testEndBindTest = test
        this.testEndBindStatus = true
      },
      testEnded() {
        this.testEndBindStatus = false
        this.$notify.success({ title: '成功', message: '班级结考成功，未答题学员将无法参加考试' })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
