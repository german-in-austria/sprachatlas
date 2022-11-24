<template></template>
<script lang="ts">
import { Component, PropSync, Vue, Prop, Watch } from 'vue-property-decorator';
import { Description, Symbols } from '@/static/apiModels';
import GraphViewer from './GraphViewer.vue';

@Component({
  components: { GraphViewer },
  name: 'VariationCard'
})
export default class VariationCard extends Vue {
}
</script>