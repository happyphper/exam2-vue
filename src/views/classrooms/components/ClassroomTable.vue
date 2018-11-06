<template>
  <div>
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入班级关键字" v-model="query.name"></el-input>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-button icon="el-icon-search" circle @click="handleSearch"></el-button>
          <el-button type="success" icon="el-icon-plus" @click="showClassroomCreateComponent" circle></el-button>
        </el-col>
      </el-row>
    </div>
    
    <el-table :data="tableData" border style="width: 100%" @sort-change="handleSortChange" v-loading="loading">
      <el-table-column
        label="班级名称"
        prop="title">
      </el-table-column>
      <el-table-column
        prop="users_count"
        label="班级人数">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button @click="showClassroomEditComponent(scope.row, scope.$index)" icon="el-icon-edit" size="small"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button @click="handleDeleteClassroom(scope.row, scope.$index)" icon="el-icon-delete" size="small"></el-button>
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
            <router-link :to="{ name: 'examIndex', query: { classroomName: scope.row.name }}">
              <el-button size="small">
                <svg-icon icon-class="exam" />
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
    <el-dialog title="提示" :visible.sync="classroomCreateStatus" width="50%">
      <ClassroomCreate @created="classroomCreated" :key="Date.now()"></ClassroomCreate>
    </el-dialog>
    <!--Modal-->
    <el-dialog title="提示" :visible.sync="classroomEditStatus" width="50%">
      <ClassroomEdit :classroom="classroomEditBindClassroom" @updated="classroomUpdated" :key="Date.now()"></ClassroomEdit>
    </el-dialog>
    <!--Modal-->
    <el-dialog title="提示" :visible.sync="userCreateStatus" width="50%">
      <UserCreate :classroom="userCreateBindClassroom" @created="userCreated" :key="Date.now()"></UserCreate>
    </el-dialog>
    <!--Modal-->
    <el-dialog title="提示" :visible.sync="userTableStatus" width="90%">
      <UserTable :classroom="userTableBindClassroom" @deleted="userDeleted" :key="Date.now()"></UserTable>
    </el-dialog>
    <!--Modal-->
    <el-dialog title="导入示例" :visible.sync="uploadExcelStatus" width="90%">
      <UploadExcel :onSuccess="excelUploaded" :exampleHeaders="classroomImportExampleHeaders" :exampleData="classroomImportExampleData"></UploadExcel>
    </el-dialog>
    <!--Modal-->
    <el-dialog title="提示" :visible.sync="classroomImportStatus" width="90%">
      <ClassroomImport :classroom="classroomImportBindClassroom" @created="importCreated" :data="classroomImportBindData" :headers="classroomImportBindHeaders"></ClassroomImport>
    </el-dialog>
  </div>
</template>

<script>
  import { getClassrooms, deleteClassroom } from '@/api/classrooms'
  
  import UserCreate from '../../users/components/UserCreate'
  import UserTable from '../../users/components/UserTable'
  import ClassroomCreate from './ClassroomCreate'
  import ClassroomEdit from './ClassroomEdit'
  import UploadExcel from '@/components/UploadExcel'
  import ClassroomImport from './UserImport'
  
  export default {
    name: 'ClassroomTable',
    components: {
      UserCreate,
      UserTable,
      ClassroomCreate,
      ClassroomEdit,
      UploadExcel,
      ClassroomImport
    },
    created() {
      this.fetchClassrooms()
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
          title: ''
        },
        loading: false,
        userCreateStatus: false,
        userCreateBindClassroom: null,
        userTableStatus: false,
        userTableBindClassroom: null,
        classroomCreateStatus: false,
        classroomEditStatus: false,
        classroomEditBindClassroom: null,
        classroomEditIndex: null,
        uploadExcelStatus: false,
        classroomImportBindClassroom: null,
        classroomImportBindHeaders: [],
        classroomImportBindData: [],
        classroomImportStatus: false,
        classroomImportExampleHeaders: ['name', 'email', 'student_id', 'phone', 'password'],
        classroomImportExampleData: [{ name: '姓名（必填）', student_id: '学号（必填）', email: '邮箱（选填）', phone: '手机（选填）', password: '密码（选填）' }]
      }
    },
    methods: {
      fetchClassrooms() {
        const queryString = {}
        this.query.name && (queryString['name'] = `%${this.query.name}%`)
        queryString.sort = `${this.sort.prop},${this.order}`
        queryString.page = this.currentPage
        queryString.per_page = this.perPage
        this.loading = true
        getClassrooms(queryString).then(response => {
          this.tableData = response.data
          this.currentPage = response.meta.pagination.current_page
          this.perPage = response.meta.pagination.per_page
          this.total = response.meta.pagination.total
        }).finally(() => {
          this.loading = false
        })
      },
      handleSearch() {
        this.fetchClassrooms()
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
      showClassroomCreateComponent() {
        this.classroomCreateStatus = true
      },
      classroomCreated(classroom) {
        this.classroomCreateStatus = false
        this.tableData.push(classroom)
      },
      showClassroomEditComponent(classroom, index) {
        this.classroomEditBindClassroom = classroom
        this.classroomEditIndex = index
        this.classroomEditStatus = true
      },
      classroomUpdated(response) {
        this.tableData.splice(this.classroomEditIndex, 1, response)
        this.classroomEditStatus = false
      },
      handleDeleteClassroom(classroom, index) {
        this.$confirm('将永久删除该群组，并删除该群组下所有学员，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          return deleteClassroom(classroom.id)
        }).then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
      },
      showUserCreateComponent(classroom) {
        this.userCreateBindClassroom = classroom
        this.userCreateStatus = !this.userCreateStatus
      },
      userCreated() {
        this.userCreateStatus = false
        this.userCreateBindClassroom.users_count++
      },
      showUserTableComponent(classroom) {
        this.userTableStatus = true
        this.userTableBindClassroom = classroom
      },
      userDeleted() {},
      showUploadExcelComponent(classroom) {
        this.classroomImportBindClassroom = classroom
        this.uploadExcelStatus = true
      },
      excelUploaded(excelData) {
        this.classroomImportBindHeaders = excelData.header
        this.classroomImportBindData = excelData.results
        this.uploadExcelStatus = false
        this.classroomImportStatus = true
      },
      importCreated(count) {
        this.classroomImportStatus = false
        this.classroomImportBindClassroom.users_count += count
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
