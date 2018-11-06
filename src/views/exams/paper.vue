<template>
  <div class="app-container">
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-button  type="success" icon="el-icon-plus"  @click="showQuestionTableComponent" circle></el-button>
        </el-col>
      </el-row>
    </div>
    
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row v-for="option in props.row.options" :key="option.id">
            <el-col :span="24">
              <el-form label-position="left" inline>
                <el-form-item :label="`选项 ${option.id}`">
                  <span>{{ option.content }}</span>
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
        prop="score"
        label="分值">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button @click="handleDeleteQuestionToExam(scope.row, scope.$index)" type="danger" icon="el-icon-delete"
                       size="small"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    
    <!--Modal-->
    <!--CreateModal-->
    <el-dialog title="提示" :visible.sync="questionTableStatus" width="90%">
      <QuestionTable :examId="$route.params.exam" @created="questionCreated"></QuestionTable>
    </el-dialog>
  </div>
</template>

<script>
  import { getExamQuestions, deleteExamQuestion } from '@/api/examQuestions'
  
  import QuestionTable from '../questions/components/QuestionTable'
  
  export default {
    name: 'paper',
    components: {
      QuestionTable
    },
    created() {
      this.fetchQuestions()
    },
    data() {
      return {
        tableData: [],
        loading: false,
        questionTableStatus: false,
        questionTableBindExam: null
      }
    },
    methods: {
      fetchQuestions() {
        this.loading = true
        getExamQuestions(this.$route.params.exam).then(response => {
          this.tableData = response.data
        }).finally(() => {
          this.loading = false
        })
      },
      handleDeleteQuestionToExam(question, index) {
        this.loading = true
        deleteExamQuestion(this.$route.params.exam, question.id).then(() => {
          this.tableData.splice(index, 1)
          this.$message.success('移除成功')
        }).finally(() => {
          this.loading = false
        })
      },
      showQuestionTableComponent() {
        this.questionTableStatus = true
      },
      questionCreated(question) {
        this.tableData.push(question)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
