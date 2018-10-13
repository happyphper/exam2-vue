<template>
  <div id="ErrorQuestion" :style="{ width: '400px', height: '400px' }" v-loading="loading"></div>
</template>

<script>
  import echarts from 'echarts'
  
  import { getErrorQuestion } from '@/api/statistics'
  
  export default {
    name: 'ErrorQuestion',
    props: ['testId', 'groupId'],
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
        getErrorQuestion(this.testId, this.groupId).then(response => {
          this.data = response.data
          this.headers = response.meta.headers
          this.values = response.meta.values
          this.draw()
        }).finally(() => {
          this.loading = false
        })
      },
      draw() {
        const chart = echarts.init(document.getElementById('ErrorQuestion'))
        const option = {
          title: { text: '错题分布', x: 'center' },
          xAxis: {
            type: 'category',
            data: this.headers
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.values,
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'inside'
              }
            }
          }]
        }
        chart.setOption(option)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>
