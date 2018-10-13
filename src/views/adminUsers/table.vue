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
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="success" icon="el-icon-plus" @click="showAdminUserCreateComponent" circle></el-button>
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
        prop="created_at"
        label="注册时间"
        sortable="custom">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button @click="showAdminUserEditComponent(scope.row, scope.$index)" icon="el-icon-edit"
                       size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button @click="handleDelete(scope.row, scope.$index)" icon="el-icon-delete" size="small"></el-button>
          </el-tooltip>
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
    <el-dialog title="提示" :visible.sync="adminUserCreateStatus" width="50%">
      <AdminUserCreate @created="adminUserCreated" :key="Date.now()"></AdminUserCreate>
    </el-dialog>
    <!--UserEdit-->
    <el-dialog title="提示" :visible.sync="adminUserEditStatus" width="50%">
      <AdminUserEdit :adminUser="adminUserEditBindAdminUser" @updated="adminUserUpdated"
                     :key="Date.now()"></AdminUserEdit>
    </el-dialog>
  </div>
</template>

<script>
  import { getAdminUsers, deleteAdminUser } from '@/api/adminUsers'
  import AdminUserEdit from '@/views/adminUsers/edit'
  import AdminUserCreate from '@/views/adminUsers/create'
  
  export default {
    name: 'adminUsersTable',
    created() {
      this.fetchAdminUsers()
    },
    components: {
      AdminUserCreate,
      AdminUserEdit
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
        include: null,
        loading: false,
        adminUserCreateStatus: false,
        adminUserCreateBindGroup: null,
        adminUserEditStatus: false,
        adminUserEditBindAdminUser: null,
        adminUserEditIndex: null
      }
    },
    methods: {
      fetchAdminUsers() {
        const queryString = {}
        this.query.value && (queryString[this.query.label] = `%${this.query.value}%`)
        queryString.include = this.include
        queryString.sort = `${this.sort.prop},${this.order}`
        queryString.page = this.currentPage
        queryString.per_page = this.perPage
        this.loading = true
        getAdminUsers(queryString).then(response => {
          this.tableData = response.data
          this.currentPage = response.meta.pagination.current_page
          this.perPage = response.meta.pagination.per_page
          this.total = response.meta.pagination.total
        }).finally(() => {
          this.loading = false
        })
      },
      handleSearch() {
        this.fetchAdminUsers()
      },
      handleSizeChange(pageNumber) {
        this.perPage = pageNumber
        this.fetchAdminUsers()
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.fetchAdminUsers()
      },
      handleSortChange({ column, prop, order }) {
        this.sort = { prop, order }
        this.fetchAdminUsers()
      },
      handleDelete(adminUser, index) {
        this.$confirm(`此操作将永久删除 ${adminUser.name} 用户, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return deleteAdminUser(adminUser.id)
        }).then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
      },
      showAdminUserCreateComponent() {
        this.adminUserCreateStatus = true
      },
      adminUserCreated(adminUser) {
        this.adminUserCreateStatus = false
        this.tableData.push(adminUser)
      },
      showAdminUserEditComponent(adminUser, index) {
        this.adminUserEditBindAdminUser = adminUser
        this.adminUserEditIndex = index
        this.adminUserEditStatus = true
      },
      adminUserUpdated(newAdminUser) {
        this.tableData.splice(this.adminUserEditIndex, 1, newAdminUser)
        this.adminUserEditStatus = false
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
