<template>
  <div>
    <el-table :data="data" border style="width: 100%" v-loading="loading">
      <el-table-column v-for="(head, index) in headers"
                       :key="index"
                       :label="head"
                       :prop="head">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary"
                     @click="handleRemove(scope.$index)">移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-button style="margin-left:16px;" size="mini" type="primary" @click="onSubmit">确定导入</el-button>
    </div>
  </div>
</template>

<script>
  import { bulk } from '@/api/users'
  
  export default {
    name: 'UserImport',
    props: ['group', 'headers', 'data'],
    created() {
    },
    data() {
      return {
        loading: false
      }
    },
    methods: {
      handleRemove(index) {
        this.data.splice(index, 1)
      },
      onSubmit() {
        this.loading = true
        bulk(this.group.id, this.data).then(() => {
          this.$message.success('添加成功')
          this.$emit('created', this.data.length)
        }).finally(() => {
          this.loading = false
        })
        console.log(this.data)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
