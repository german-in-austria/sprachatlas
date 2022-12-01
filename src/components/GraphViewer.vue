<template>
  <div v-if="inputData && inputData.length > 0">
    <circle-diagram :data="inputData" />
    <v-list class="transparent">
      <v-list-item v-for="(d, idx) in inputData" :key="idx">
        <v-list-item-content class="mx-auto">
          <v-avatar>
            <icon-circle :fillCol="d.color" :strokeWidth="1" />
          </v-avatar>
          {{ d.name }} - {{ d.value }}
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
<script lang="ts">
import { Component, PropSync, Vue, Prop, Watch } from 'vue-property-decorator';
import {
  computePropCircle,
  drawCircleDiagram,
  drawRect,
  drawTriangle,
  drawCircle
} from '@/helpers/MapCompute';
import { Description, Symbols } from '@/static/apiModels';
import CircleDiagram from './CircleDiagram.vue';
import IconCircle from '@/icons/IconCircle.vue';

@Component({
  components: { CircleDiagram, IconCircle },
  name: 'GraphViewer'
})
export default class GraphViewer extends Vue {
  @Prop({ type: Array }) readonly desc!: Array<Description>;
  /*
desc: Array<Description> = [{
  color: '#F00',
  name: 'I1',
  value: 20
},
{
  color: '#0F0',
  name: 'I2',
  value: 60
}];*/

  get inputData() {
    return this.desc ? this.desc : [] as Array<Description>
  }

  icon: Symbols = Symbols.Circle;

  mounted() {
  }
}
</script>
<style lang="scss">
</style>