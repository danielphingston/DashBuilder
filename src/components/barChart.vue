<script>
import { Bar } from "vue-chartjs";
export default {
  extends: Bar,
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

