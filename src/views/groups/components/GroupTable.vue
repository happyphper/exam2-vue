<template>
  <div>
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input placeholder="请输入班级关键字" v-model="query.name"></el-input>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-button icon="el-icon-search" circle @click="handleSearch"></el-button>
          <el-button type="success" icon="el-icon-plus" @click="showGroupCreateComponent" circle></el-button>
        </el-col>
      </el-row>
    </div>
    
    <el-table :data="tableData" border style="width: 100%" @sort-change="handleSortChange" v-loading="loading">
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
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button @click="showGroupEditComponent(scope.row, scope.$index)" icon="el-icon-edit" size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button @click="handleDeleteGroup(scope.row, scope.$index)" icon="el-icon-delete" size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="成员" placement="top">
            <el-button @click="showUserTableComponent(scope.row)" icon="el-icon-more" size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="导入" placement="top">
            <el-button @click="showUploadExcelComponent(scope.row)" icon="el-icon-upload" size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="添加" placement="top">
            <el-button @click="showUserCreateComponent(scope.row)" icon="el-icon-plus" size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看附属考试" placement="top">
            <router-link :to="{ name: 'testIndex', query: { groupName: scope.row.name }}">
              <el-button size="small">
                <svg-icon icon-class="test" />
              </el-button>
            </router-link>
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
    <!--Modal-->
    <el-dialog title="提示" :visible.sync="groupCreateStatus" width="50%">
      <GroupCreate @created="groupCreated" :key="Date.now()"></GroupCreate>
    </el-dialog>
    <!--Modal-->
    <el-dialog title="提示" :visible.sync="groupEditStatus" width="50%">
      <GroupEdit :group="groupEditBindGroup" @updated="groupUpdated" :key="Date.now()"></GroupEdit>
    </el-dialog>
    <!--Modal-->
    <el-dialog title="提示" :visible.sync="userCreateStatus" width="50%">
      <UserCreate :group="userCreateBindGroup" @created="userCreated" :key="Date.now()"></UserCreate>
    </el-dialog>
    <!--Modal-->
    <el-dialog title="提示" :visible.sync="userTableStatus" width="90%">
      <UserTable :group="userTableBindGroup" @deleted="userDeleted" :key="Date.now()"></UserTable>
    </el-dialog>
    <!--Modal-->
    <el-dialog title="导入示例" :visible.sync="uploadExcelStatus" width="90%">
      <UploadExcel :onSuccess="excelUploaded" :exampleHeaders="groupImportExampleHeaders" :exampleData="groupImportExampleData"></UploadExcel>
    </el-dialog>
    <!--Modal-->
    <el-dialog title="提示" :visible.sync="groupImportStatus" width="90%">
      <GroupImport :group="groupImportBindGroup" @created="importCreated" :data="groupImportBindData" :headers="groupImportBindHeaders"></GroupImport>
    </el-dialog>
  </div>
</template>

<script>
  import { getGroups, deleteGroup } from '@/api/groups'
  
  import UserCreate from '../../users/components/UserCreate'
  import UserTable from '../../users/components/UserTable'
  import GroupCreate from './GroupCreate'
  import GroupEdit from './GroupEdit'
  import UploadExcel from '@/components/UploadExcel'
  import GroupImport from './UserImport'
  
  export default {
    name: 'GroupTable',
    components: {
      UserCreate,
      UserTable,
      GroupCreate,
      GroupEdit,
      UploadExcel,
      GroupImport
    },
    created() {
      this.fetchGroups()
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
          name: ''
        },
        loading: false,
        userCreateStatus: false,
        userCreateBindGroup: null,
        userTableStatus: false,
        userTableBindGroup: null,
        groupCreateStatus: false,
        groupEditStatus: false,
        groupEditBindGroup: null,
        groupEditIndex: null,
        uploadExcelStatus: false,
        groupImportBindGroup: null,
        groupImportBindHeaders: [],
        groupImportBindData: [],
        groupImportStatus: false,
        groupImportExampleHeaders: ['name', 'email', 'student_id', 'phone', 'password'],
        groupImportExampleData: [{ name: '姓名（必填）', student_id: '学号（必填）', email: '邮箱（选填）', phone: '手机（选填）', password: '密码（选填）' }]
      }
    },
    methods: {
      fetchGroups() {
        const queryString = {}
        this.query.name && (queryString['name'] = `%${this.query.name}%`)
        queryString.sort = `${this.sort.prop},${this.order}`
        queryString.page = this.currentPage
        queryString.per_page = this.perPage
        this.loading = true
        getGroups(queryString).then(response => {
          this.tableData = response.data
          this.currentPage = response.meta.pagination.current_page
          this.perPage = response.meta.pagination.per_page
          this.total = response.meta.pagination.total
        }).finally(() => {
          this.loading = false
        })
      },
      handleSearch() {
        this.fetchGroups()
      },
      handleSizeChange(pageNumber) {
        this.perPage = pageNumber
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
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
      showGroupEditComponent(group, index) {
        this.groupEditBindGroup = group
        this.groupEditIndex = index
        this.groupEditStatus = true
      },
      groupUpdated(response) {
        this.tableData.splice(this.groupEditIndex, 1, response)
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
      showUploadExcelComponent(group) {
        this.groupImportBindGroup = group
        this.uploadExcelStatus = true
      },
      excelUploaded(excelData) {
        this.groupImportBindHeaders = excelData.header
        this.groupImportBindData = excelData.results
        this.uploadExcelStatus = false
        this.groupImportStatus = true
      },
      importCreated(count) {
        this.groupImportStatus = false
        this.groupImportBindGroup.users_count += count
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
