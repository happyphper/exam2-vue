<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="班级" prop="group">
            <el-select
              v-model="form.group_id"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="fetchGroups"
              :loading="loading">
              <el-option
                v-for="group in groups"
                :key="group.id"
                :label="group.name"
                :value="group.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即添加</el-button>
        <el-button @click="resetForm('form')">重置表单</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getGroups } from '@/api/groups'
  import { storeUserGroup } from '@/api/userGroups'
  
  export default {
    name: 'userGroupCreate',
    props: ['user'],
    data() {
      return {
        form: {
          group_id: null
        },
        loading: false,
        groups: []
      }
    },
    methods: {
      fetchGroups(query = null) {
        this.loading = true
        getGroups({ name: `%${query}%`, per_page: 100 }).then(response => {
          this.groups = response.data
        }).finally(() => {
          this.loading = false
        })
      },
      onSubmit() {
        this.loading = true
        const group = this.groups.find(item => {
          return item.id === this.form.group_id
        })
        storeUserGroup(this.user.id, this.form.group_id).then(() => {
          this.$message.success('创建成功')
          this.$emit('created', group)
          this.resetForm('form')
        }).finally(() => {
          this.loading = false
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
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
