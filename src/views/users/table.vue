<template>
  <div>
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入查询内容" v-model="query.value" class="input-with-select">
            <el-select v-model="query.label" slot="prepend" placeholder="请选择" style="width: 80px">
              <el-option label="姓名" value="name"></el-option>
              <el-option label="手机" value="phone"></el-option>
              <el-option label="邮箱" value="email"></el-option>
              <el-option label="学号" value="student_id"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入群组名称" v-model="groupName">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    
    <el-table :data="tableData" border style="width: 100%" @sort-change="handleSortChange" v-loading="loading">
      <el-table-column
        label="头像"
        width="66">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="头像" width="40">
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机">
      </el-table-column>
      <el-table-column
        prop="student_id"
        label="学号">
      </el-table-column>
      <el-table-column
        prop="group.name"
        label="群组">
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="注册时间"
        sortable="custom">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="showUserEditComponent(scope.row, scope.$index)" icon="el-icon-edit" size="small">编辑</el-button>
          <el-button @click="handleRemove(scope.row, scope.$index)" icon="el-icon-trash" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[25, 50, 75, 100]"
        :page-size="perPage"
        layout="sizes, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <!--UserCreate-->
    <el-dialog title="提示" :visible.sync="userCreateStatus" width="50%">
      <UserCreate :group="userCreateBindGroup" @created="createUser" :key="Date.now()"></UserCreate>
    </el-dialog>
    <!--UserEdit-->
    <el-dialog title="提示" :visible.sync="userEditStatus" width="50%">
      <UserEdit :user="userEditBindUser" @updated="updateUser" :key="Date.now()"></UserEdit>
    </el-dialog>
  </div>
</template>

<script>
  import { getUsers, deleteUser } from '@/api/users'
  
  import UserEdit from '@/views/users/edit'
  import UserCreate from '@/views/users/create'
  
  export default {
    name: 'usersTable',
    created() {
      this.fetchUsers()
    },
    components: {
      UserCreate,
      UserEdit
    },
    data() {
      return {
        tableData: [],
        currentPage: 1,
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
        include: 'group',
        groupName: null,
        loading: false,
        userCreateStatus: false,
        userCreateBindGroup: null,
        userEditStatus: false,
        userEditBindUser: null,
        userEditIndex: null
      }
    },
    methods: {
      fetchUsers() {
        const queryString = {}
        this.query.value && (queryString[this.query.label] = `%${this.query.value}%`)
        this.groupName && (queryString['group:name'] = `%${this.groupName}%`)
        queryString.include = this.include
        queryString[this.sort.prop] = this.order
        queryString.page = this.page
        queryString.per_page = this.perPage
        this.loading = true
        getUsers(queryString).then(response => {
          this.tableData = response.data
          this.currentPage = response.meta.pagination.current_page
          this.perPage = response.meta.pagination.per_page
          this.total = response.meta.pagination.total
        }).finally(() => {
          this.loading = false
        })
      },
      handleSearch() {
        this.fetchUsers()
      },
      handleSizeChange(pageNumber) {
        this.perPage = pageNumber
        this.fetchUsers()
      },
      handleCurrentChange(currentPage) {
        this.page = currentPage
        this.fetchUsers()
      },
      handleSortChange({ column, prop, order }) {
        this.sort = { prop, order }
        this.fetchUsers()
      },
      handleRemove(user, index) {
        this.$confirm(`此操作将永久删除 ${user.name} 用户, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return deleteUser(user.id)
        }).then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
      },
      showUserCreateComponent() {
        this.userCreateStatus = true
      },
      createUser(newUser) {
        this.tableData.push(newUser)
      },
      showUserEditComponent(user, index) {
        this.userEditIndex = index
        this.userEditBindUser = user
        this.userEditStatus = true
      },
      updateUser(newUser) {
        this.userEditStatus = false
        this.tableData.splice(this.userEditIndex, 1, newUser)
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
