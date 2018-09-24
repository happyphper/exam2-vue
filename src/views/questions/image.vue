<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
    
    </el-form>
  </div>
</template>

<script>
  import { storeQuestion } from '@/api/questions'
  
  export default {
    name: 'questionCreate',
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
        storeQuestion(this.form).then((response) => {
          this.$message.success('添加成功')
          this.$emit('created', response)
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
