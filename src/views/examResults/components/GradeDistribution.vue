<template>
  <div id="GradeDistribution" :style="{ width: '400px', height: '400px' }" v-loading="loading"></div>
</template>

<script>
  import echarts from 'echarts'
  
  import { getGradeDistribution } from '@/api/statistics'
  
  export default {
    name: 'GradeDistribution',
    props: ['examId', 'classroomId'],
    created() {
      this.fetchData()
    },
    data() {
      return {
        loading: false,
        data: [],
        headers: [],
        values: []
      }
    },
    methods: {
      fetchData() {
        this.loading = true
        getGradeDistribution(this.examId, this.classroomId).then(response => {
          this.data = response.data
          this.headers = response.meta.headers
          this.values = response.meta.values
          this.draw()
        }).finally(() => {
          this.loading = false
        })
      },
      draw() {
        const chart = echarts.init(document.getElementById('GradeDistribution'))
        const option = {
          title: { text: '成绩分布', x: 'center' },
          tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: this.headers
          },
          series: [
            {
              name: '成绩分布',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        chart.setOption(option)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
