<template>
  <div>
    <div class="search-bar">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select
            v-model="query.course_id"
            filterable
            remote
            reserve-keyword
            placeholder="请输入课程关键词"
            :remote-method="fetchCourses"
            :loading="selectCourseLoading">
            <el-option v-for="item in selectCourseList" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="query.group_id"
            filterable
            remote
            reserve-keyword
            placeholder="请输入班级关键词"
            :remote-method="fetchGroups"
            :loading="selectGroupLoading">
            <el-option
              v-for="item in selectGroupList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="query.created_at"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button icon="el-icon-search" @click="handleSearch" circle></el-button>
          <el-button type="success" icon="el-icon-download" @click="handleDownload" circle></el-button>
        </el-col>
      </el-row>
    </div>
    
    <el-table :data="tableData" border style="width: 100%" v-loading="loading" :row-key="handleCurrentRow">
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="班级" prop="group"></el-table-column>
      <el-table-column label="课程" prop="course"></el-table-column>
      <el-table-column v-for="test in currentRow.tests" :key="test.id" :label="test.title">
        <template slot-scope="scope">{{ test.score }}</template>
      </el-table-column>
      <el-table-column label="平均成绩" prop="average"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getUserGradeData } from '@/api/statistics'
  import { getCourses } from '@/api/courses'
  import { getGroups } from '@/api/groups'
  
  export default {
    name: 'UserGradeTable',
    props: ['courseId', 'groupId', 'createdAt'],
    data() {
      return {
        tableData: [],
        loading: false,
        selectGroupList: [],
        selectGroupLoading: false,
        selectCourseList: [],
        selectCourseLoading: false,
        query: {
          course_id: null,
          group_id: null,
          created_at: []
        },
        currentRow: 0,
        downloadLoading: false
      }
    },
    methods: {
      fetchUserGrade() {
        const queryString = {}
        this.courseId && (queryString['course_id'] = this.courseId)
        this.groupId && (queryString['course_id'] = this.courseId)
        this.createdAt && (queryString['created_at'] = this.createdAt)
        this.loading = true
        getUserGradeData(queryString).then(response => {
          this.tableData = response.data
        }).finally(() => {
          this.loading = false
        })
      },
      fetchCourses(query) {
        this.selectCourseLoading = true
        getCourses({ title: `%${query}%` }).then(response => {
          this.selectCourseList = response.data
        }).finally(() => {
          this.selectCourseLoading = false
        })
      },
      fetchGroups(query) {
        this.selectGroupLoading = true
        getGroups({ title: `%${query}%` }).then(response => {
          this.selectGroupList = response.data
        }).finally(() => {
          this.selectGroupLoading = false
        })
      },
      handleSearch() {
        this.fetchUserGrade()
      },
      handleDownload() {
        const headers = this.formatHeaders(this.tableData)
        const fields = this.formatFiedls(this.tableData)
        const data = this.formatJson(fields, this.tableData)
        this.$prompt('请输入文件名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.*/,
          inputErrorMessage: '只能是数值'
        }).then(({ value }) => {
          this.downloadLoading = true
          import('@/vendor/ExportToExcel').then(excel => {
            excel.export_json_to_excel({
              header: headers,
              data,
              filename: value || '学员成绩数据',
              autoWidth: true
            })
            this.downloadLoading = false
          })
        }).finally(() => {
          this.downloadLoading = false
        })
      },
      formatHeaders(data) {
        const headers = ['姓名', '课程', '班级']
        data.map(item => {
          item.tests.forEach(test => {
            headers.push(test.title)
          })
        })
        headers.push('平均分')
        return headers
      },
      formatFiedls(data) {
        const fields = ['name', 'course', 'group']
        data.map(item => {
          item.tests.forEach(test => {
            fields.push(test.id)
          })
        })
        fields.push('average')
        return fields
      },
      formatJson(fileds, data) {
        return data.map(item => fileds.map(field => {
          if (item[field]) {
            return item[field]
          }
          const row = item.tests.find(test => test.id === field)
          if (row && row.score) {
            return row.score
          }
          return 0
        }))
      },
      handleCurrentRow(row) {
        this.currentRow = row
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>