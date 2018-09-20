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
          <el-button type="success" icon="el-icon-plus" @click="showGroupCreateComponent" circle></el-button>
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
          <el-tooltip class="item" effect="dark" content="编编" placement="top">
            <el-button @click="showGroupEditComponent(scope.row)" icon="el-icon-edit" size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button @click="handleDeleteGroup(scope.row, scope.$index)" icon="el-icon-delete" size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="成员" placement="top">
            <el-button @click="showUserTableComponent(scope.row)" icon="el-icon-more" size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="导入" placement="top">
            <el-button @click="importUsers(scope.row)" icon="el-icon-upload" size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="添加" placement="top">
            <el-button @click="showUserCreateComponent(scope.row)" icon="el-icon-plus" size="small"></el-button>
          </el-tooltip>
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
    <!--GroupCreateModal-->
    <el-dialog title="提示" :visible.sync="groupCreateStatus" width="50%">
      <GroupCreate @created="groupCreated" :key="Date.now()"></GroupCreate>
    </el-dialog>
    <!--GroupEditModal-->
    <el-dialog title="提示" :visible.sync="groupEditStatus" width="50%">
      <GroupEdit :group="groupEditBindGroup" @updated="groupUpdated" :key="Date.now()"></GroupEdit>
    </el-dialog>
    <!--UserCreateModal-->
    <el-dialog title="提示" :visible.sync="userCreateStatus" width="50%">
      <UserCreate :group="userCreateBindGroup" @created="userCreated" :key="Date.now()"></UserCreate>
    </el-dialog>
    <!--UserTableModal-->
    <el-dialog title="提示" :visible.sync="userTableStatus" width="90%">
      <UserTable :group="userTableBindGroup" @deleted="userDeleted" :key="Date.now()"></UserTable>
    </el-dialog>
  </div>
</template>

<script>
  import UserCreate from '@/views/users/create'
  import UserTable from '@/views/users/table'
  import GroupCreate from '@/views/groups/create'
  import GroupEdit from '@/views/groups/edit'
  import { getGroups, deleteGroup } from '@/api/groups'
  
  export default {
    name: 'groups',
    components: {
      UserCreate,
      UserTable,
      GroupCreate,
      GroupEdit
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
        userCreateStatus: false,
        userCreateBindGroup: null,
        userTableStatus: false,
        userTableBindGroup: null,
        groupCreateStatus: false,
        groupEditStatus: false,
        groupEditBindGroup: null
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
      showGroupCreateComponent() {
        this.groupCreateStatus = true
      },
      groupCreated(group) {
        this.groupCreateStatus = false
        this.tableData.push(group)
      },
      showGroupEditComponent(group) {
        this.groupEditBindGroup = group
        this.groupEditStatus = true
      },
      groupUpdated() {
        this.groupEditStatus = false
      },
      handleDeleteGroup(group, index) {
        this.$confirm('将永久删除该群组，并删除该群组下所有学员，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          return deleteGroup(group.id)
        }).then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
      },
      showUserCreateComponent(group) {
        this.userCreateBindGroup = group
        this.userCreateStatus = !this.userCreateStatus
      },
      userCreated() {
        this.userCreateStatus = false
        this.userCreateBindGroup.users_count++
      },
      showUserTableComponent(group) {
        this.userTableStatus = true
        this.userTableBindGroup = group
      },
      userDeleted() {},
      importUsers(group) {}
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
