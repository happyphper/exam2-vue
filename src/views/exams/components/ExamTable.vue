<template>
  <div>
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入考试关键字" v-model="query.title"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入课程关键字" v-model="query.courseTitle"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入班级关键字" v-model="query.classroomName"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button icon="el-icon-search" circle @click="handleSearch"></el-button>
          <el-button  type="success" icon="el-icon-plus"  @click="showExamCreateComponent" circle></el-button>
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
          <el-button size="small" v-for="classroom in scope.row.classrooms.data" :key="classroom.id">
            <router-link :to="{ name: 'examResultIndex', query: { examId: scope.row.id, classroomId: classroom.id }}">{{ classroom.title }}</router-link>
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
          <el-button type="primary" size="mini" @click="showExamEndComponent(scope.row)">{{ scope.row.status_translate }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="考题">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="考题" placement="top">
            <el-button type="success" size="small">
              <router-link :to="{ name: 'examPaper', params: { exam: scope.row.id }}">考题</router-link>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button @click="showExamEditComponent(scope.row, scope.$index)" icon="el-icon-edit" size="small"></el-button>
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
    <el-dialog title="提示" :visible.sync="examCreateStatus" width="50%">
      <ExamCreate @created="examCreated" :key="Date.now()"></ExamCreate>
    </el-dialog>
    <!--EditModal-->
    <el-dialog title="提示" :visible.sync="examEditStatus" width="50%">
      <ExamEdit :exam="examEditBindExam" @updated="examUpdated" :key="Date.now()"></ExamEdit>
    </el-dialog>
    <!--EditModal-->
    <el-dialog title="提示" :visible.sync="examEndBindStatus" width="50%">
      <ExamEnd :exam="examEndBindExam" @ended="examEnded" :key="Date.now()"></ExamEnd>
    </el-dialog>
  </div>
</template>

<script>
  import { getExams, deleteExam } from '@/api/exams'
  
  import ExamCreate from './ExamCreate'
  import ExamEdit from './ExamEdit'
  import ExamEnd from './ExamEnd'
  import Paper from '../paper'
  
  export default {
    name: 'ExamTable',
    components: {
      Paper,
      ExamCreate,
      ExamEdit,
      ExamEnd
    },
    created() {
      this.$route.query.courseTitle && (this.query.courseTitle = this.$route.query.courseTitle)
      this.$route.query.classroomName && (this.query.classroomName = this.$route.query.classroomName)
      this.fetchExams()
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
          classroomName: null
        },
        include: 'classrooms,course',
        loading: false,
        examCreateStatus: false,
        examEditStatus: false,
        examEditBindExam: null,
        examEditIndex: 0,
        examEndBindStatus: false,
        examEndBindExam: null
      }
    },
    methods: {
      fetchExams() {
        const queryString = {}
        this.query.title && (queryString['title'] = `%${this.query.title}%`)
        this.query.courseTitle && (queryString['course:title'] = `%${this.query.courseTitle}%`)
        this.query.classroomName && (queryString['classrooms:name'] = `%${this.query.classroomName}%`)
        queryString.include = this.include
        queryString.sort = `${this.sort.prop},${this.sort.order}`
        queryString.page = this.currentPage
        queryString.per_page = this.perPage
        this.loading = true
        getExams(queryString).then(response => {
          this.tableData = response.data
          this.currentPage = response.meta.pagination.current_page
          this.perPage = response.meta.pagination.per_page
          this.total = response.meta.pagination.total
        }).finally(() => {
          this.loading = false
        })
      },
      handleSearch() {
        this.fetchExams()
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
      showExamCreateComponent() {
        this.examCreateStatus = true
      },
      examCreated(response) {
        this.tableData.push(response)
        this.examCreateStatus = false
      },
      showExamEditComponent(exam, index) {
        this.examEditBindExam = exam
        this.examEditIndex = index
        this.examEditStatus = true
      },
      examUpdated(response) {
        this.examEditStatus = false
        this.tableData.splice(this.examEditIndex, 1, response)
      },
      handleDelete(exam, index) {
        this.$confirm(`此操作将 ${exam.title} 考试删除, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return deleteExam(exam.id)
        }).then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
      },
      showExamEndComponent(exam) {
        if (exam.status === 'end') {
          return false
        }
        this.examEndBindExam = exam
        this.examEndBindStatus = true
      },
      examEnded() {
        this.examEndBindStatus = false
        this.$notify.success({ title: '成功', message: '班级结考成功，未答题学员将无法参加考试' })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
