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
        prop="score"
        label="分值">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button @click="handleDeleteQuestionToTest(scope.row, scope.$index)" type="danger" icon="el-icon-delete"
                       size="small"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    
    <!--Modal-->
    <!--CreateModal-->
    <el-dialog title="提示" :visible.sync="questionTableStatus" width="90%">
      <QuestionTable :testId="$route.params.test" @created="questionCreated"></QuestionTable>
    </el-dialog>
  </div>
</template>

<script>
  import { getTestQuestions, deleteTestQuestion } from '@/api/testQuestions'
  
  import QuestionTable from '@/views/questions/table'
  
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
        questionTableBindTest: null
      }
    },
    methods: {
      fetchQuestions() {
        this.loading = true
        getTestQuestions(this.$route.params.test).then(response => {
          this.tableData = response.data
        }).finally(() => {
          this.loading = false
        })
      },
      handleDeleteQuestionToTest(question, index) {
        this.loading = true
        deleteTestQuestion(this.$route.params.test, question.id).then(() => {
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
