<template>
  <svg></svg>
</template>
<script lang="ts">
import { Component, PropSync, Vue, Prop, Watch } from 'vue-property-decorator';

import * as d3 from 'd3';

@Component({
  components: {},
  name: 'ChartViewer'
})
export default class ChartViewer extends Vue {
  @Prop() readonly inputData!: Array<any>;

  mounted() {
    const width = 800;
    const height = 500;
    const svg = d3.select('svg').attr('width', width).attr('height', height);
    const g = svg.append('g');
  }
}
</script>
