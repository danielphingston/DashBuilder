<script>
import { Pie } from "vue-chartjs";
export default {
  extends: Pie,
  data() {
    return {
      options: {
        // responsive: false,
        legend: {
          display: this.data.labels.length > 10 ? false : true
        },
        maintainAspectRatio: false
      }
    };
  },
  props: ["data"],
  mounted() {
    this.renderChart(this.data, this.options);
  }
};
</script>

