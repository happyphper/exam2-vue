<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" type="card" @tab-click="switchTab">
      <el-tab-pane label="文字题" name="text">
        <el-form ref="form" :model="form" label-width="80px">
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
            <el-form-item :label="`选项 ${index + 1}`">
              <el-input class="hidden" type="hidden" v-model="form.options[index].id" :value="index + 1"></el-input>
              <el-col :span="12">
                <el-input placeholder="内容" v-model="form.options[index].title"></el-input>
              </el-col>
              <el-col :span="3">
                <el-button @click.prevent="addAnswers(index)" icon="el-icon-check" type="success" circle></el-button>
                <el-button @click.prevent="removeOption(index)" icon="el-icon-close" type="danger" circle></el-button>
              </el-col>
            </el-form-item>
          </el-row>
    
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button type="success" @click="addOption">添加选项</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="图片题" name="second">
      
      </el-tab-pane>
      
    </el-tabs>
    
  </div>
</template>

<script>
  import { storeQuestion } from '@/api/questions'
  
  export default {
    name: 'users',
    created() {},
    data() {
      return {
        activeTab: 'text',
        form: {
          title: '',
          type: 'single',
          options: [{ id: 1, content: '', type: false }],
          answers: [],
          category_id: '',
          explain: ''
        },
        loading: false
      }
    },
    methods: {
      addOption() {
        const index = this.form.options.length + 1
        this.form.options.push({
          id: index,
          title: '',
          type: false
        })
      },
      removeOption(index) {
        this.form.options.splice(index, 1)
      },
      onSubmit() {
        storeQuestion(this.form).then(response => {
          console.log(response)
        }).catch(err => {
          console.log(err)
        })
      },
      switchTab() {},
      addAnswers(index) {
        let arr = this.form.answers
        if (this.form.answers.includes(index + 1)) {
          this.form.answers.forEach((item, index) => {
            item === index + 1 && this.form.answers.splice(index, 1)
          })
        } else {
          this.form.answers.push(index + 1)
          arr = this.form.answers.sort((v1, v2) => v1 - v2)
        }
        this.form.answers = arr
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
