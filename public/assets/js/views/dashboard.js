import Chart from '../components/chart.js'

export default {
  components: { Chart },
  template: `<div>
    <b>Enrollments</b>
    <chart :data="enrollmentChartData" type="line" :options="{ plugins: { legend: { display: false } } }"></chart>
  </div>`,
  setup() {
    const enrollmentChartData = Vue.ref({
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [{
        label: 'Enrollments',
        data: [30, 20, 50, 40, 60, 70],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    })
    return {
      enrollmentChartData
    }
  }
}