<template>
  <div id="ErrorQuestion" :style="{ width: '400px', height: '400px' }"></div>
</template>

<script>
  import echarts from 'echarts'
  
  export default {
    name: 'ErrorQuestion',
    mounted() {
      this.draw()
    },
    data() {
      return {}
    },
    methods: {
      draw() {
        const chart = echarts.init(document.getElementById('ErrorQuestion'))
        const option = {
          title: { text: '错题分布', subtext: '纯属虚构', x: 'center' },
          xAxis: {
            type: 'category',
            data: ['题目1', '题目2', '题目3', '题目4', '题目5', '题目6', '题目7', '题目8', '题目9', '题目10', '题目11']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [120, 200, 150, 80, 70, 110, 130, 123, 123, 123, 123],
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
