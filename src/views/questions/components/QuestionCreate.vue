<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane value="text" label="文字题">
        <TextQuestion :course="course" @textCreated="questionCreated" :key="Date.now()"></TextQuestion>
      </el-tab-pane>
      <el-tab-pane value="image" label="图片题">
        <ImageQuestion :course="course" @imageCreated="questionCreated" :key="Date.now()"></ImageQuestion>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import TextQuestion from './CreateText'
  import ImageQuestion from './CreateImage'
  
  export default {
    name: 'QuestionCreate',
    components: { TextQuestion, ImageQuestion },
    props: ['course'],
    data() {
      return {
        activeTab: 'text'
      }
    },
    methods: {
      questionCreated(response) {
        this.$emit('created', response)
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
