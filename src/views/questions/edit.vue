<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
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
            <span>{{ form.answers }}</span>
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
            <el-input placeholder="内容" v-model="form.options[index].title"></el-input>
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
  
  export default {
    name: 'questionEdit',
    created() {
      this.form.title = this.question.title
      this.form.type = this.question.type
      this.form.options = this.question.options
      this.form.answers = this.question.answers
      this.form.explain = this.question.explain
    },
    props: ['question'],
    data() {
      return {
        activeTab: 'text',
        form: {
          title: '',
          type: 'single',
          options: [
            { id: 1, content: '', type: 'text', right: false },
            { id: 2, content: '', type: 'text', right: false },
            { id: 3, content: '', type: 'text', right: false },
            { id: 4, content: '', type: 'text', right: false }
          ],
          answers: [],
          explain: ''
        },
        loading: false
      }
    },
    methods: {
      onSubmit() {
        this.loading = true
        updateQuestion(this.question.id, this.form).then(() => {
          this.$message.success('更新成功')
          this.question.title = this.form.title
          this.question.type = this.form.type
          this.question.options = this.form.options
          this.question.answers = this.form.answers
          this.question.explain = this.form.explain
          this.$emit('updated')
        }).finally(() => {
          this.loading = false
        })
      },
      toggleAnswer(option) {
        // 单选
        if (this.form.type === 'single') {
          if (this.form.answers.includes(option.id)) {
            this.form.answers.splice(this.form.answers.indexOf(option.id), 1)
            option.right = false
          } else {
            this.form.answers.length < 1 && this.form.answers.push(option.id) && (option.right = true)
          }
        }
        // 多选
        if (this.form.type === 'multiple') {
          if (this.form.answers.includes(option.id)) {
            this.form.answers.splice(this.form.answers.indexOf(option.id), 1)
            option.right = false
          } else {
            this.form.answers.push(option.id)
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
