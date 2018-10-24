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
            <el-upload
              :action="uploadDomain"
              :on-success="handleUploadSuccess"
              :before-upload="handleBeforeUpload"
              :before-remove="handleBeforeRemove"
              :file-list="uploadedList"
              :data="uploadData"
              :on-preview="handlePreview"
              :disabled="uploading"
            >
              <el-button size="small" type="primary" @click="handleClick(index)" :loading="uploading">点击上传</el-button>
            </el-upload>
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
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    
    <el-dialog title="预览" :visible.sync="previewStatus" append-to-body>
      <img :src="previewUrl" alt="预览图片" width="300">
    </el-dialog>
  </div>
</template>

<script>
  import { storeQuestion } from '@/api/questions'
  import { getCourses } from '@/api/courses'
  import { getToken, deleteImage } from '@/api/cloudStorage'
  
  export default {
    name: 'QuestionImage',
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
          chapter: null,
          section: null,
          options: [
            { id: 1, content: '', type: 'image', right: false },
            { id: 2, content: '', type: 'image', right: false },
            { id: 3, content: '', type: 'image', right: false },
            { id: 4, content: '', type: 'image', right: false }
          ],
          answer: [],
          explain: ''
        },
        loading: false,
        courseSelectList: [],
        courseSelectListLoading: false,
        courseSelectListDisabled: false,
        uploadDomain: 'http://upload.qiniu.com/',
        uploadData: {
          token: '',
          key: ''
        },
        uploadedList: [],
        uploading: false,
        optionIndex: 0,
        previewStatus: false,
        previewUrl: ''
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
          this.$emit('imageCreated', response)
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
      handleUploadSuccess(res) {
        this.uploading = false
        this.form.options[this.optionIndex].content = res.key
      },
      handleClick(index) {
        this.optionIndex = index
      },
      handleBeforeUpload() {
        this.uploading = true
        return getToken().then(response => {
          this.uploadData.token = response.token
          this.uploadData.key = response.name
        }).catch(err => {
          console.log(err)
          return false
        })
      },
      handleBeforeRemove(file, fileList) {
        this.form.options.forEach(item => {
          if (item.content === file.response.key) {
            item.content = null
          }
        })
        deleteImage(file.response.key)
        return true
      },
      handlePreview(file) {
        this.previewUrl = file.url
        this.previewStatus = true
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
