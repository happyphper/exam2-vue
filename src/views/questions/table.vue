<template>
  <div>
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input placeholder="请输入题目信息" v-model="query.title"></el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="query.type" placeholder="请选择类型">
            <el-option label="单选" value="single"></el-option>
            <el-option label="多选" value="multiple"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-search" @click="handleSearch"></el-button>
        </el-col>
        <el-col :span="2">
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
        label="答案选项">
      </el-table-column>
      <el-table-column
        prop="explain"
        label="解析">
      </el-table-column>
      <el-table-column
        prop="wrong_count"
        label="错误次数">
      </el-table-column>
      <el-table-column
        prop="right_count"
        label="正确次数">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        sortable="custom">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        sortable="custom">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button @click="showQuestionEditComponent(scope.row)" icon="el-icon-edit" size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button @click="handleDeleteQuestion(scope.row, scope.$index)" icon="el-icon-delete"
                       size="small"></el-button>
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
    <!--QuestionCreateModal-->
    <el-dialog title="提示" :visible.sync="questionCreateStatus" width="80%">
      <QuestionCreate @created="questionCreated" :key="Date.now()"></QuestionCreate>
    </el-dialog>
    <!--QuestionEditModal-->
    <el-dialog title="提示" :visible.sync="questionEditStatus" width="80%">
      <QuestioEdit :question="questionEditBindQuestion" @updated="questionUpdated" :key="Date.now()"></QuestioEdit>
    </el-dialog>
  </div>
</template>

<script>
  import QuestionCreate from '@/views/questions/create'
  import QuestioEdit from '@/views/questions/edit'
  import { getQuestions, deleteQuestion } from '@/api/questions'
  
  export default {
    name: 'questionTable',
    components: {
      QuestionCreate,
      QuestioEdit
    },
    created() {
      this.fetchQuestions()
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
          name: null,
          type: null
        },
        loading: false,
        questionCreateStatus: false,
        questionEditStatus: false,
        questionEditBindQuestion: null
      }
    },
    methods: {
      fetchQuestions() {
        const queryString = {}
        this.query.title && (queryString.title = `%${this.query.title}%`)
        this.query.type && (queryString.type = this.query.type)
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
      },
      handleCurrentChange(currentPage) {
        this.page = currentPage
      },
      handleSortChange({ column, prop, order }) {
        this.sort = { prop, order }
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
      questionUpdated() {
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
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
