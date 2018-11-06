<template>
  <div id="UserGradeCurve" :style="{ width: '400px', height: '400px' }" v-loading="loading"></div>
</template>

<script>
  import echarts from 'echarts'
  
  import { getUserGradeCurve } from '@/api/statistics'
  
  export default {
    name: 'UserGradeCurve',
    props: ['user'],
    mounted() {
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
        getUserGradeCurve(this.user.id).then(response => {
          this.data = response.data
          this.headers = response.meta.headers
          this.values = response.meta.values
          this.draw()
        }).finally(() => {
          this.loading = false
        })
      },
      draw() {
        const chart = echarts.init(document.getElementById('UserGradeCurve'))
        const option = {
          title: { text: '个人成绩曲线图', x: 'center' },
          xAxis: {
            type: 'category',
            data: this.headers
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.values,
            type: 'line'
          }]
        }
        chart.setOption(option)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
