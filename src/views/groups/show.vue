<template>
  <div class="app-container">
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="query.value" class="input-with-select">
            <el-select v-model="query.label" slot="prepend" placeholder="请选择" style="width: 80px">
              <el-option label="名称" value="name"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="success" icon="el-icon-plus" @click="createGroup" circle></el-button>
        </el-col>
      </el-row>
    </div>
    
    <el-table :data="tableData" border style="width: 100%" @sort-change="handleSortChange">
      <el-table-column
        label="班级名称"
        prop="name">
      </el-table-column>
      <el-table-column
        prop="users_count"
        label="班级人数">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="importUsers(scope.row)" icon="el-icon-upload" size="small">导入</el-button>
          <el-button @click="showCreateUserComponent(scope.row)" icon="el-icon-plus" size="small">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[25, 50, 75, 100]"
        :page-size="perPage"
        layout="sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    
    <!--UserCreateModal-->
    <el-dialog title="提示" :visible.sync="createUserStatus" width="50%">
      <UserCreate :group="createUserBindGroup" @created="newUser" :key="Date.now()"></UserCreate>
    </el-dialog>
  </div>
</template>

<script>
  import UserCreate from '@/views/users/create'
  import { getGroups, storeGroup } from '@/api/groups'
  
  export default {
    name: 'groups',
    components: {
      UserCreate
    },
    created() {
      getGroups().then(response => {
        this.tableData = response.data
      }).finally(() => {
        this.loading = false
      })
    },
    data() {
      return {
        tableData: [],
        page: 1,
        perPage: 25,
        total: 0,
        sort: {
          prop: 'created_at',
          order: 'desc'
        },
        query: {
          label: 'name',
          value: null
        },
        loading: false,
        createUserStatus: false,
        createUserBindGroup: null
      }
    },
    methods: {
      handleSizeChange(pageNumber) {
        this.perPage = pageNumber
      },
      handleCurrentChange(currentPage) {
        this.page = currentPage
      },
      handleSortChange({ column, prop, order }) {
        this.sort = { prop, order }
      },
      createGroup() {
        this.$prompt('请输入班级名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          return storeGroup({ name: value })
        }).then(response => {
          this.$message.success('添加成功')
          this.tableData.push(response)
        })
      },
      importUsers(group) {},
      showCreateUserComponent(group) {
        this.createUserBindGroup = group
        this.createUserStatus = !this.createUserStatus
      },
      newUser() {
        this.createUserStatus = false
        this.createUserBindGroup.users_count++
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
