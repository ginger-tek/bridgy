import '/nm/chart.js/dist/chart.umd.js'

export default {
  template: `<div style="position:relative;width:100%;height:50dvh;display:flex;align-items:center;justify-content:center">
    <canvas ref="chartRef"></canvas>
    <p v-if="!hasData" align="center" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">No data available</p>
  </div>`,
  props: {
    data: {
      type: Object,
      default: () => ({
        labels: [],
        datasets: []
      })
    },
    type: {
      type: String,
      default: 'bar'
    },
    options: {
      type: Object,
      default: () => ({
        plugins: {}
      })
    }
  },
  setup(props) {
    const chartRef = Vue.ref(null)

    function initChart() {
      if (!hasData.value) return
      if (!chartRef.value) return
      chartRef.value.chart = new Chart(chartRef.value, {
        type: props.type || 'bar',
        data: props.data,
        options: {
          ...props.options,
          maintainAspectRatio: false,
          responsive: true
        }
      })
    }

    Vue.watch(() => [props.type, props.data, props.options], (o, n) => {
      console.log('Chart data or type changed:', o, n)
      if (o[0] !== n[0] && chartRef.value?.chart) {
        chartRef.value.chart.destroy()
        initChart()
      } else if (chartRef.value?.chart) {
        chartRef.value.chart.data.labels = n[1].labels
        chartRef.value.chart.data.datasets = n[1].datasets
        chartRef.value.chart.update()
      }
    }, { deep: true })

    const hasData = Vue.computed(() => props.data && props.data?.datasets?.length && props.data?.labels?.length)

    Vue.onMounted(initChart)

    return {
      initChart,
      hasData,
      chartRef
    }
  }
}