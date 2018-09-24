<template>
  <div>
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="query.value" class="input-with-select">
            <el-select v-model="query.label" slot="prepend" placeholder="请选择" style="width: 120px">
              <el-option label="课程名称" value="title"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="success" icon="el-icon-plus" @click="showCourseCreateComponent" circle></el-button>
        </el-col>
      </el-row>
    
    </div>
    
    <el-table :data="tableData" border style="width: 100%" @sort-change="handleSortChange" v-loading="loading">
      <el-table-column
        label="课程名称"
        prop="title">
      </el-table-column>
      <el-table-column
        label="题目个数"
        prop="questions_count">
      </el-table-column>
      <el-table-column
        label="创建人"
        prop="user.name">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="添加题目" placement="top">
            <el-button @click="showQuestionCreateComponent(scope.row)" icon="el-icon-plus"
                       size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button @click="showCourseEditComponent(scope.row, scope.$index)" icon="el-icon-edit"
                       size="small"></el-button>
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
    <el-dialog title="提示" :visible.sync="courseCreateStatus" width="50%">
      <CourseCreate @created="courseCreated" :key="Date.now()"></CourseCreate>
    </el-dialog>
    <!--EditModal-->
    <el-dialog title="提示" :visible.sync="courseEditStatus" width="50%">
      <CourseEdit :course="courseEditBindCourse" @updated="courseUpdated" :key="Date.now()"></CourseEdit>
    </el-dialog>
    <!--QuestionCreateModal-->
    <el-dialog title="提示" :visible.sync="questionCreateStatus" width="50%">
      <QuestionCreate :course="questionCreateBindCourse" @updated="questionCreated" :key="Date.now()"></QuestionCreate>
    </el-dialog>
  </div>
</template>

<script>
  import { getCourses, deleteCourse } from '@/api/courses'
  import QuestionCreate from '@/views/questions/create'
  import CourseCreate from './create'
  import CourseEdit from './edit'
  
  export default {
    name: 'courseTable',
    components: {
      CourseCreate,
      CourseEdit,
      QuestionCreate
    },
    created() {
      this.fetchCourses()
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
        include: null,
        loading: false,
        courseCreateStatus: false,
        courseEditStatus: false,
        courseEditBindCourse: null,
        courseEditIndex: 0,
        questionCreateStatus: false,
        questionCreateBindCourse: null
      }
    },
    methods: {
      fetchCourses() {
        const queryString = {}
        this.query.value && (queryString[this.query.label] = `%${this.query.value}%`)
        queryString.include = this.include
        queryString.sort = `${this.sort.prop},${this.sort.order}`
        queryString.page = this.currentPage
        queryString.per_page = this.perPage
        this.loading = true
        getCourses(queryString).then(response => {
          this.tableData = response.data
          this.currentPage = response.meta.pagination.current_page
          this.perPage = response.meta.pagination.per_page
          this.total = response.meta.pagination.total
        }).finally(() => {
          this.loading = false
        })
      },
      handleSearch() {
        this.fetchCourses()
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
      showCourseCreateComponent() {
        this.courseCreateStatus = true
      },
      courseCreated(response) {
        this.tableData.push(response)
        this.courseCreateStatus = false
      },
      showCourseEditComponent(course, index) {
        this.courseEditBindCourse = course
        this.courseEditIndex = index
        this.courseEditStatus = true
      },
      courseUpdated(response) {
        this.courseEditStatus = false
        this.tableData.splice(this.courseEditIndex, 1, response)
      },
      showQuestionCreateComponent(course) {
        this.questionCreateBindCourse = course
        this.questionCreateStatus = true
      },
      questionCreated() {
        this.questionCreateBindCourse.questions_count++
        this.questionCreateStatus = false
      },
      handleDelete(course, index) {
        this.$confirm(`此操作将 ${course.title} 课程删除, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return deleteCourse(course.id)
        }).then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
