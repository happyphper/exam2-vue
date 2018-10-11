<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="附属课程">
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
          </el-col>
        </el-form-item>
      </el-row>
      
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即更新</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { updateQuestion } from '@/api/questions'
  import { getCourses } from '@/api/courses'
  
  export default {
    name: 'questionEdit',
    created() {
      this.courseSelectList.push(this.question.course)
      this.form.title = this.question.title
      this.form.type = this.question.type
      this.form.course_id = this.question.course_id
      this.form.options = this.question.options
      this.form.answer = this.question.answer
      this.form.answer.forEach(ans => {
        this.form.options.find(item => item.id === ans).right = true
      })
      this.form.explain = this.question.explain
    },
    props: ['question'],
    data() {
      return {
        activeTab: 'text',
        form: {
          title: '',
          course_id: null,
          type: 'single',
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
        courseSelectListLoading: false
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
        updateQuestion(this.question.id, this.form, { include: 'course' }).then(response => {
          this.$message.success('更新成功')
          this.$emit('updated', response)
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
