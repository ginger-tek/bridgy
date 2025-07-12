import Chart from '../../components/chart.js'
import { Info } from '/nm/luxon/build/es6/luxon.js'

export default {
  components: { Chart },
  template: `<div>
    <b>Enrollments</b>
    <chart :data="enrollmentChartData" type="line" :options="{ plugins: { legend: { display: false } } }"></chart>
  </div>`,
  setup() {
    const enrollmentChartData = Vue.ref({
      labels: Info.monthsFormat('short'),
      datasets: [{
        label: 'Students',
        data: [10, 25, 15, 20, 50, 40, 55, 57, 35, 40, 37, 35],
        backgroundColor: 'rgba(27, 142, 250, 1)',
        borderColor: 'rgba(27, 142, 250, 1)',
        borderWidth: 2
      }]
    })

    return {
      enrollmentChartData
    }
  }
}