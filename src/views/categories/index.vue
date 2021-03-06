<template>
  <div class="app-container">
    <div class="search-bar">
      <!--搜索框-->
      <el-row :gutter="20">
        <el-col :span="2">
          <el-tooltip class="item" effect="dark" content="添加分类" placement="top">
            <el-button type="primary" icon="el-icon-plus" circle @click="append(false)"></el-button>
          </el-tooltip>
        </el-col>
      </el-row>
    </div>
    <!--标签页-->
    <el-tabs v-model="type" type="card" @tab-click="toggleTab" v-loading="loading">
      <el-tab-pane v-for="(cnName, name) in types" :key="name" :label="cnName" :name="name">
        <el-tree :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.data.name }}</span>
            <span>
              <el-button type="text" size="mini" @click="append(data)" class="primary">添加</el-button>
              <el-button type="text" size="mini" @click="update(node, data)" class="primary">编辑</el-button>
              <el-button type="text" size="mini" @click="remove(node, data)" class="danger">删除</el-button>
            </span>
          </span>
        </el-tree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { getCategories, storeCategory, updateCategory, deleteCategory } from '@/api/categories'
  import Cookies from 'js-cookie'
  
  export default {
    name: 'categories',
    created() {
      this.type = this.categoryTab
      this.fetchCategories()
    },
    data() {
      return {
        type: 'classroom',
        treeData: [],
        loading: true,
        types: { classroom: '班级分类', question: '题目分类' }
      }
    },
    computed: {
      categoryTab() {
        return Cookies.get('categoryTab') || this.type
      }
    },
    methods: {
      fetchCategories() {
        this.loading = true
        getCategories(this.type).then(response => {
          this.treeData = response.data
        }).finally(() => {
          this.loading = false
        })
      },
      // 切换卡片
      toggleTab() {
        Cookies.set('categoryTab', this.type)
        this.fetchCategories()
      },
      // 添加
      append(data = false) {
        const type = this.types[this.type]
        const message = data ? `『${type}』您正在向 ${data.name} 中添加子类，请输入名称` : `『${type}』您正在添加顶级分类，请输入名称`
        this.$prompt(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(.{1,30})$/,
          inputErrorMessage: '字符限制 1~30 个'
        }).then(({ value }) => {
          this.loading = true
          return storeCategory(this.type, { name: value, parent_id: data ? data.id : 0 })
        }).then(response => {
          if (!data) {
            this.treeData.push(response)
          } else {
            !data.children && this.$set(data, 'children', [])
            data.children.push(response)
          }
          this.$message.success('添加成功')
          this.fetchCategories()
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.loading = false
        })
      },
      // 移除
      remove(node, data) {
        this.$confirm('此操作将是删除该分类，以及其包含的所有子分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => deleteCategory(this.type, data.id)).then(() => {
          this.$message.success('删除成功')
          this.fetchCategories()
        })
      },
      // 编辑
      update(node, data) {
        const message = `请输入新名字`
        this.$prompt(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(.{1,30})$/,
          inputErrorMessage: '字符限制 1~30 个'
        }).then(({ value }) => {
          this.loading = true
          return updateCategory(this.type, data.id, { name: value })
        }).then(response => {
          this.$message.success('更新成功')
          this.fetchCategories()
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .custom-tree-node {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-weight: 400;
    font-size: 14px;
  }
</style>
