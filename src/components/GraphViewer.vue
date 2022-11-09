<template></template>
<script lang="ts">
import { Component, PropSync, Vue, Prop, Watch } from 'vue-property-decorator';

export interface Description {
  color: string;
  name: string;
  value: number;
}

@Component({
  components: {},
  name: 'GraphViewer'
})
export default class GraphViewer extends Vue {
  @Prop({ type: Array, required: false }) readonly desc!: Array<Description>;
}
</script>