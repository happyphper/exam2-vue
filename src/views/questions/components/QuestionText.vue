<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="课程">
            <el-select
              v-model="form.course_id"
              filterable
              remote
              reserve-keyword
              :remote-method="fetchCourses"
              :loading="courseSelectListLoading"
              placeholder="请输入关键字自动搜索"
              :disabled="courseSelectListDisabled">
              <el-option
                v-for="course in courseSelectList"
                :key="course.id"
                :label="course.title"
                :value="course.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="题干">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="类型">
            <el-radio v-model="form.type" label="single">单选</el-radio>
            <el-radio v-model="form.type" label="multiple">多选</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="章">
            <el-input v-model="form.chapter"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="节">
            <el-input v-model="form.section"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="答案">
            <span>{{ form.answer }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="解析">
            <el-input v-model="form.explain"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20" v-for="(option, index) in form.options" :key="index">
        <el-form-item :label="`选项 ${option.id}`">
          <el-input class="hidden" type="hidden" v-model="form.options[index].id" :value="option.id"></el-input>
          <el-col :span="12">
            <el-input placeholder="内容" v-model="form.options[index].content"></el-input>
          </el-col>
          <el-col :span="3">
            <el-tooltip class="item" effect="dark" :content="option.right ? '取消正确答案' : '设置正确答案'" placement="right">
              <el-button @click.prevent="toggleAnswer(option)" :icon="option.right ? 'el-icon-close' : 'el-icon-check'"
                         :type="option.right ? 'danger' : 'success'" circle></el-button>
            </el-tooltip>
            <el-button @click.prevent="removeOption(option, index)" type="danger">去除选项</el-button>
          </el-col>
        </el-form-item>
      </el-row>
      
      <el-form-item>
        <el-button @click.prevent="addOption()" type="success">新增选项</el-button>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { storeQuestion } from '@/api/questions'
  import { getCourses } from '@/api/courses'
  
  export default {
    name: 'QuestionText',
    created() {
      if (this.course) {
        this.courseSelectList.push(this.course)
        this.form.course_id = this.course.id
        this.courseSelectListDisabled = true
      }
    },
    props: ['course'],
    data() {
      return {
        form: {
          course_id: null,
          title: '',
          type: 'single',
          optionType: 'text',
          chapter: null,
          section: null,
          options: [
            { id: 1, content: '', type: 'text', right: false },
            { id: 2, content: '', type: 'text', right: false },
            { id: 3, content: '', type: 'text', right: false },
            { id: 4, content: '', type: 'text', right: false }
          ],
          answer: [],
          explain: ''
        },
        loading: false,
        courseSelectList: [],
        courseSelectListLoading: false,
        courseSelectListDisabled: false
      }
    },
    methods: {
      fetchCourses(query) {
        this.courseSelectListLoading = true
        getCourses({ title: `%${query}%`, per_page: 100 }).then(response => {
          this.courseSelectList = response.data
        }).finally(() => {
          this.courseSelectListLoading = false
        })
      },
      onSubmit() {
        this.loading = true
        storeQuestion(this.form).then((response) => {
          this.$message.success('添加成功')
          this.$emit('textCreated', response)
        }).finally(() => {
          this.loading = false
        })
      },
      toggleAnswer(option) {
        // 单选
        if (this.form.type === 'single') {
          if (this.form.answer.includes(option.id)) {
            this.form.answer.splice(this.form.answer.indexOf(option.id), 1)
            option.right = false
          } else {
            this.form.answer.length < 1 && this.form.answer.push(option.id) && (option.right = true)
          }
        }
        // 多选
        if (this.form.type === 'multiple') {
          if (this.form.answer.includes(option.id)) {
            this.form.answer.splice(this.form.answer.indexOf(option.id), 1)
            option.right = false
          } else {
            this.form.answer.push(option.id)
            option.right = true
          }
        }
      },
      addOption() {
        if (this.form.options.length >= 10) {
          this.$message.warning('题目选项至多有 10 个')
          return false
        }
        let maxId = 0
        if (this.form.options.length === 0) {
          maxId = 0
        } else {
          const maxItem = this.form.options.reduce((prev, current) => {
            return prev.id > current.id ? prev : current
          })
          console.log(maxItem)
          maxId = maxItem.id
        }
        this.form.options.push({
          id: maxId + 1,
          content: '',
          type: this.optionType,
          right: false
        })
      },
      removeOption(option, index) {
        if (this.form.options.length <= 2) {
          this.$message.warning('题目选项至少有 2 个')
          return false
        }
        const answerIndex = this.form.answer.findIndex(item => item === option.id)
        if (answerIndex >= 0) {
          this.form.answer.splice(answerIndex, 1)
        }
        this.form.options.splice(index, 1)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .block {
    width: 100%;
    text-align: center;
  }
  
  .search-bar {
    padding: 10px 0 10px 0;
  }
</style>
