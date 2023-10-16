<template>
  <div v-if="inputData && inputData.length > 0">
    <v-tabs v-model="tab" fixed-tabs background-color="indigo" dark>
      <v-tab>Kreisdiagramm <v-icon>mdi-chart-pie-outline</v-icon></v-tab>
      <v-tab>Balkendiagramm <v-icon>mdi-chart-bar-stacked</v-icon></v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item key="0"
        ><circle-diagram :groupByGp="groupByGp" :data="inputData" />
        <v-list v-if="inputData" class="transparent">
          <v-list-item v-for="(d, idx) in inputData" :key="idx">
            <v-list-item-content class="mx-auto">
              <v-container>
                <v-row align="center" justify="space-around">
                  Name: {{ d.name }} - Anzahl: {{ d.value }}
                  {{ groupByGp ? `- GP: ${d.sigle} (${d.group})` : '' }}
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
        <chart-viewer :groupByGp="groupByGp" :inputData="inputData" />
      </v-tab-item>
    </v-tabs-items>
    <v-switch
      v-model="groupByGp"
      inset
      :label="`Nach Gewährspersonen gruppieren`"
    ></v-switch>
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
import { cloneDeep, Dictionary, groupBy } from 'lodash';
import { convertHexToHsl, hslToHex } from '@/helpers/helper';

@Component({
  components: { CircleDiagram, IconCircle, ChartViewer },
  name: 'GraphViewer'
})
export default class GraphViewer extends Vue {
  @Prop({ type: Array }) readonly desc!: Array<Description>;
  groupedDiagramData: Array<Description> = this.desc;
  groupByGp: boolean = false;
  tab = null;

  get inputData() {
    if (!this.groupByGp) {
      return this.groupedData;
    }
    const res = [] as Array<Description>;
    const groupedObject = groupBy(this.desc, 'name');
    for (let obj in groupedObject) {
      if (groupedObject[obj].length > 1) {
        let colHsl = convertHexToHsl(groupedObject[obj][0].color);
        const factor = 0.5 / groupedObject[obj].length;
        groupedObject[obj].forEach((el) => {
          el.color = hslToHex(colHsl[0], colHsl[1] * 100, colHsl[2] * 100);
          colHsl[2] -= factor;
        });
        res.push(...groupedObject[obj]);
      } else {
        res.push(groupedObject[obj][0]);
      }
    }
    return res;
  }

  get groupedData() {
    let groupedData: Array<Description> = [];

    cloneDeep(this.desc).forEach((desc) => {
      const idx = groupedData.findIndex((el) => el.name === desc.name);
      if (idx < 0) {
        groupedData.push(desc);
      } else {
        groupedData[idx].value += desc.value;
      }
    });
    return groupedData;
  }

  computeGroupedDiagramData() {
    let groupedData: Array<Description> = [];
    this.groupedDiagramData = [];
    console.log(this.inputData);
    const inputDataCopy = [...this.inputData];
    inputDataCopy.forEach((desc) => {
      const idx = groupedData.findIndex((el) => el.name === desc.name);
      if (idx < 0) {
        groupedData.push(desc);
      } else {
        groupedData[idx].value += desc.value;
      }
    });
    this.groupedDiagramData = groupedData;
  }

  icon: Symbols = Symbols.Circle;

  mounted() {
    // this.computeGroupedDiagramData();
  }
}
</script>
<style lang="scss"></style>
