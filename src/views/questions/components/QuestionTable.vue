<template>
  <div>
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input placeholder="请输入题目关键字" v-model="query.title"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="请输入课程关键字" v-model="query.courseTitle"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="query.type" placeholder="请选择类型">
            <el-option label="单选" value="single"></el-option>
            <el-option label="多选" value="multiple"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-button icon="el-icon-search" circle @click="handleSearch"></el-button>
          <el-button type="success" icon="el-icon-plus" circle @click="showQuestionCreateComponent"></el-button>
        </el-col>
      </el-row>
    </div>
    
    <el-table :data="tableData" border style="width: 100%" @sort-change="handleSortChange" v-loading="loading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row v-for="option in props.row.options" :key="option.id">
            <el-col :span="24">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item :label="`选项 ${option.id}`">
                  <span v-if="option.type === 'text'">{{ option.content }}</span>
                  <img :src="option.content" width="100" v-else/>
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
        prop="course.title"
        label="课程">
      </el-table-column>
      <el-table-column
        prop="answer"
        label="答案选项">
      </el-table-column>
      <el-table-column
        prop="explain"
        label="解析">
      </el-table-column>
      <el-table-column
        sortable="custom"
        prop="accuracy"
        label="正确率">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark"
                      :content="`${scope.row.right_count}/${scope.row.answered_count}`"
                      placement="right">
            <el-button type="primary" size="mini">{{ scope.row.accuracy }}%</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建"
        sortable="custom">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <template v-if="testId">
            <el-tooltip class="item" effect="dark" content="添加" placement="top">
              <el-button @click="handleAddQuestionToTest(scope.row)" icon="el-icon-plus"
                         size="small"></el-button>
            </el-tooltip>
          </template>
          <template v-else>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button @click="showQuestionEditComponent(scope.row)" icon="el-icon-edit" size="small"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button @click="handleDeleteQuestion(scope.row, scope.$index)" icon="el-icon-delete"
                         size="small"></el-button>
            </el-tooltip>
          </template>
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
    <!--QuestionCreateModal-->
    <el-dialog title="提示" :visible.sync="questionCreateStatus" :fullscreen="true">
      <QuestionCreate @created="questionCreated" :key="Date.now()"></QuestionCreate>
    </el-dialog>
    <!--QuestionEditModal-->
    <el-dialog title="提示" :visible.sync="questionEditStatus" :fullscreen="true">
      <QuestionEdit :question="questionEditBindQuestion" @updated="questionUpdated" :key="Date.now()"></QuestionEdit>
    </el-dialog>
  </div>
</template>

<script>
  import QuestionCreate from './QuestionCreate'
  import QuestionEdit from './QuestionEdit'
  import { getQuestions, deleteQuestion } from '@/api/questions'
  import { storeTestQuestion } from '@/api/testQuestions'
  
  export default {
    name: 'QuestionTable',
    components: { QuestionCreate, QuestionEdit },
    created() {
      this.$route.query.courseTitle && (this.query.courseTitle = this.$route.query.courseTitle)
      this.fetchQuestions()
    },
    props: ['testId'],
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
          courseTitle: '',
          title: null,
          type: null,
          include: 'course'
        },
        loading: false,
        questionCreateStatus: false,
        questionEditStatus: false,
        questionEditBindQuestion: null,
        defaultSortFields: {
          descending: 'desc',
          ascending: 'asc'
        }
      }
    },
    methods: {
      fetchQuestions() {
        const queryString = {}
        this.query.title && (queryString.title = `%${this.query.title}%`)
        this.query.courseTitle && (queryString['course:title'] = `%${this.query.courseTitle}%`)
        this.query.type && (queryString.type = this.query.type)
        this.query.include && (queryString.include = this.query.include)
        queryString.page = this.currentPage
        queryString.per_page = this.perPage
        queryString.sort = `${this.sort.prop},${this.sort.order}`
        this.loading = true
        getQuestions(queryString).then(response => {
          this.tableData = response.data
          this.currentPage = response.meta.pagination.current_page
          this.perPage = response.meta.pagination.per_page
          this.total = response.meta.pagination.total
        }).finally(() => {
          this.loading = false
        })
      },
      handleSizeChange(pageNumber) {
        this.perPage = pageNumber
        this.fetchQuestions()
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.fetchQuestions()
      },
      handleSortChange({ column, prop, order }) {
        this.sort = { prop, order: this.defaultSortFields[order] }
        this.fetchQuestions()
      },
      handleSearch() {
        this.fetchQuestions()
      },
      showQuestionCreateComponent() {
        this.questionCreateStatus = true
      },
      questionCreated(question) {
        this.questionCreateStatus = false
        this.tableData.push(question)
      },
      showQuestionEditComponent(question) {
        this.questionEditBindQuestion = question
        this.questionEditStatus = true
      },
      questionUpdated(question) {
        this.tableData.splice(this.tableData.findIndex(item => item.id === question.id), 1, question)
        this.questionEditStatus = false
      },
      handleDeleteQuestion(question, index) {
        this.$confirm('将永久删除该题目，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          return deleteQuestion(question.id)
        }).then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
      },
      handleAddQuestionToTest(question) {
        let score = 0
        this.$prompt('请输入分值', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\d]/,
          inputErrorMessage: '只能是数值'
        }).then(({ value }) => {
          this.loading = true
          score = value
          return storeTestQuestion(this.testId, question.id, value)
        }).then(() => {
          this.$message.success('添加成功')
          question.score = score
          this.$emit('created', question)
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
