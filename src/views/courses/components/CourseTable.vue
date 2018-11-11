<template>
  <div>
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="query.value" class="input-with-select">
            <el-select v-model="query.label" slot="prepend" placeholder="请选择" style="width: 120px">
              <el-option label="课程名称" value="title"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
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
        width="60"
        label="题目"
        prop="questions_count">
      </el-table-column>
      <el-table-column
        width="60"
        label="考试"
        prop="exams_count">
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
          <el-tooltip class="item" effect="dark" content="导入题目" placement="top">
            <el-button @click="showUploadExcelComponent(scope.row)" icon="el-icon-upload" size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button @click="showCourseEditComponent(scope.row, scope.$index)" icon="el-icon-edit"
                       size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button @click="handleDelete(scope.row, scope.$index)" icon="el-icon-delete" size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看附属题目" placement="top">
            <router-link :to="{ name: 'questionIndex', query: { courseTitle: scope.row.title }}">
              <el-button size="small">
                <svg-icon icon-class="question" />
              </el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看附属考试" placement="top">
            <router-link :to="{ name: 'examIndex', query: { courseTitle: scope.row.title }}">
              <el-button size="small">
                <svg-icon icon-class="exam" />
              </el-button>
            </router-link>
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
    <el-dialog title="提示" :visible.sync="questionCreateStatus" :fullscreen="true">
      <QuestionCreate :course="questionCreateBindCourse" @created="questionCreated" :key="Date.now()"></QuestionCreate>
    </el-dialog>
    <!--Modal-->
    <el-dialog title="导入示例" :visible.sync="uploadExcelStatus" width="90%">
      <UploadExcel :onSuccess="excelUploaded" :exampleHeaders="questionImportExampleHeaders"
                   :exampleData="questionImportExampleData"></UploadExcel>
    </el-dialog>
    <!--Modal-->
    <el-dialog title="提示" :visible.sync="questionImportStatus" width="90%">
      <CourseImport :course="questionImportBindCourse" @created="importCreated" :data="questionImportBindData"
                   :headers="questionImportBindHeaders"></CourseImport>
    </el-dialog>
  </div>
</template>

<script>
  import UploadExcel from '@/components/UploadExcel'
  import CourseImport from '../../courses/components/QuestionImport'
  import { getCourses, deleteCourse } from '@/api/courses'
  import QuestionCreate from '../../questions/components/QuestionCreate'
  import CourseCreate from './CourseCreate'
  import CourseEdit from './CourseEdit'
  
  export default {
    name: 'CourseTable',
    components: {
      CourseCreate,
      CourseEdit,
      QuestionCreate,
      UploadExcel,
      CourseImport
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
        include: 'user',
        loading: false,
        courseCreateStatus: false,
        courseEditStatus: false,
        courseEditBindCourse: null,
        courseEditIndex: 0,
        questionCreateStatus: false,
        questionCreateBindCourse: null,
        uploadExcelStatus: false,
        questionImportBindCourse: null,
        questionImportBindHeaders: null,
        questionImportBindData: null,
        questionImportStatus: null,
        questionImportExampleHeaders: ['title', 'type', 'chapter', 'section', 'option1', 'option2', 'option3', 'option4', 'optionN', 'answer', 'explain'],
        questionImportExampleData: [
          {
            title: '题干',
            type: 'single/multiple(单选/多选)',
            chapter: '章（可选）',
            section: '节（可选）',
            option1: '选项1',
            option2: '选项2',
            option3: '选项3',
            option4: '选项4',
            optionN: '选项N',
            answer: '正确答案，如:[1]、[1,2]',
            explain: '答案解析（选填）'
          },
          {
            title: '1+1=?',
            type: 'single',
            chapter: '1',
            section: '1',
            option1: '1',
            option2: '2',
            option3: '3',
            option4: '4',
            optionN: '选项个数：2-10',
            answer: '[2]',
            explain: '1+1=2为正解'
          }
        ]
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
      },
      showUploadExcelComponent(course) {
        this.questionImportBindCourse = course
        this.uploadExcelStatus = true
      },
      excelUploaded(excelData) {
        this.questionImportBindHeaders = excelData.header
        this.questionImportBindData = excelData.results
        this.uploadExcelStatus = false
        this.questionImportStatus = true
      },
      importCreated(count) {
        this.questionImportStatus = false
        this.questionImportBindCourse.questions_count = this.questionImportBindCourse.questions_count + count
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
