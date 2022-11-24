<template>
  <v-card class="card" v-if="desc.length > 0">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text> <graph-viewer :desc="desc" /> </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { Component, PropSync, Vue, Prop, Watch } from 'vue-property-decorator';
import { Description, Symbols } from '@/static/apiModels';
import GraphViewer from './GraphViewer.vue';

@Component({
  components: { GraphViewer },
  name: 'VariationCard'
})
export default class VariationCard extends Vue {
  @Prop(String) readonly title!: string;
  @Prop({ type: Array }) readonly desc!: Array<Description>;

}
</script>
<style lang="scss">
  .v-card__text {
    flex-grow: 1;
    overflow: auto;
    overflow-y: scroll;
  }

  .card {
    width: 450px;
  }
</style>