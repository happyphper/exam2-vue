<template>
  <div id="GradeDistribution" :style="{ width: '400px', height: '400px' }"></div>
</template>

<script>
  import echarts from 'echarts'
  
  export default {
    name: 'GradeDistribution',
    mounted() {
      this.draw()
    },
    data() {
      return {}
    },
    methods: {
      draw() {
        const chart = echarts.init(document.getElementById('GradeDistribution'))
        const option = {
          title: { text: '成绩分布', subtext: '纯属虚构', x: 'center' },
          tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c} ({d}%)' },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['60分以下', '60-69', '70 - 79', '80-89', '90-100']
          },
          series: [
            {
              name: '成绩分布',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                { value: 335, name: '60分以下' },
                { value: 310, name: '60-69' },
                { value: 234, name: '70-79' },
                { value: 135, name: '80-89' },
                { value: 1548, name: '90-100' }
              ],
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
