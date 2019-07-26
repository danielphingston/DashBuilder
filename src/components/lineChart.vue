<script>
import { Line } from "vue-chartjs";
export default {
  extends: Line,
  data() {
    return {
      options: {
        // responsive: false,
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

