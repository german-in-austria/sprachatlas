<template>
  <div v-if="inputData && inputData.length > 0">
    <v-tabs v-model="tab" fixed-tabs background-color="indigo" dark>
      <v-tab>Kreisdiagramm <v-icon>mdi-chart-pie-outline</v-icon></v-tab>
      <v-tab>Balkendiagramm <v-icon>mdi-chart-bar-stacked</v-icon></v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item key="0"
        ><circle-diagram :data="inputData" />
        <v-list class="transparent">
          <v-list-item v-for="(d, idx) in inputData" :key="idx">
            <v-list-item-content class="mx-auto">
              <v-container>
                <v-row align="center" justify="space-around">
                  Name: {{ d.name }} - Anzahl: {{ d.value }}
                  <v-avatar>
                    <icon-circle :fillCol="d.color" :strokeWidth="1" />
                  </v-avatar>
                </v-row>
              </v-container>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-tab-item>
      <v-tab-item key="1">
        <chart-viewer :inputData="inputData" />
      </v-tab-item>
    </v-tabs-items>
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
import ChartViewer from './ChartViewer.vue';

@Component({
  components: { CircleDiagram, IconCircle, ChartViewer },
  name: 'GraphViewer'
})
export default class GraphViewer extends Vue {
  @Prop({ type: Array }) readonly desc!: Array<Description>;

  tab = null;
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
    console.log(this.desc);
    return this.desc ? this.desc : ([] as Array<Description>);
  }

  icon: Symbols = Symbols.Circle;

  mounted() {}
}
</script>
<style lang="scss"></style>
