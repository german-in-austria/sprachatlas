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
    <v-select
      solo
      v-model="selGen"
      :items="typesGraph"
      @change="changeType()"
      item-text="name"
      item-value="value"
    ></v-select>
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
import { Description, GPData, Symbols } from '@/static/apiModels';
import CircleDiagram from './CircleDiagram.vue';
import IconCircle from '@/icons/IconCircle.vue';
import ChartViewer from './ChartViewer.vue';
import { cloneDeep, Dictionary, groupBy } from 'lodash';
import { convertHexToHsl, hslToHex, selectColor } from '@/helpers/helper';

@Component({
  components: { CircleDiagram, IconCircle, ChartViewer },
  name: 'GraphViewer'
})
export default class GraphViewer extends Vue {
  @Prop({ type: Array }) readonly desc!: Array<Description>;
  data: Array<Description> = [];
  groupedDiagramData: Array<Description> = [];
  groupByGp: boolean = false;
  groupByErhebungen: boolean = false;
  tab = null;
  selGen = 'name';
  typesGraph = [
    { name: 'Parameter', value: 'name' },
    { name: 'Gruppe', value: 'group' },
    { name: 'Sigle', value: 'sigle' },
    { name: 'Erhebung', value: 'gp' }
  ];
  erhebungsArten: Array<GPData> = [];

  sigleColors: Map<string, string> = new Map<string, string>();

  get inputData() {
    return this.data;
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
    console.log(groupedData);
    return groupedData;
  }

  changeType() {
    const res = [] as Array<Description>;
    const cloneData = cloneDeep(this.desc);
    if (this.selGen === 'gp') {
      const groupedErh = groupBy(this.erhebungsArten, 'erhArt');
      for (let obj in groupedErh) {
        const color = selectColor(null);
        const colorHex = hslToHex(color.h, color.s * 100, color.l * 100);
        if (groupedErh[obj].length > 1) {
          const curr = groupedErh[obj];
          const sum = curr.reduce((a, b) => a + b.count, 0);
          res.push({
            age: -1,
            color: colorHex,
            group: '',
            name: groupedErh[obj][0].erhArt,
            sigle: groupedErh[obj][0].sigle,
            value: sum,
            gp: groupedErh[obj]
          });
        } else {
          res.push({
            age: -1,
            color: colorHex,
            group: '',
            name: groupedErh[obj][0].erhArt,
            sigle: groupedErh[obj][0].sigle,
            value: groupedErh[obj][0].count,
            gp: groupedErh[obj]
          });
        }
      }
    } else {
      const groupedData = groupBy(cloneData, this.selGen);
      for (let obj in groupedData) {
        groupedData[obj][0].name = obj;
        if (groupedData[obj].length > 1) {
          const valSum = groupedData[obj].reduce((a, b) => a + b.value, 0);
          groupedData[obj][0].value = valSum;
          res.push(groupedData[obj][0]);
        } else {
          res.push(groupedData[obj][0]);
        }
      }
    }
    this.data = res;
  }

  computeGroupedByErhebungen() {
    const res = [] as Array<Description>;
    const cloneData = cloneDeep(this.desc);
    if (!this.groupByErhebungen) {
      this.computeGroupedDiagramData();
      return;
    }
    for (let obj in cloneData) {
      const curr = cloneData[obj];
      const factor = 0.2 / curr.gp.length;
      let colHsl = convertHexToHsl(curr.color);
      res.push(
        ...cloneData[obj].gp.map((el) => {
          let colHex = hslToHex(
            colHsl[0] * 360,
            colHsl[1] * 100,
            colHsl[2] * 100
          );
          colHsl[2] -= factor;
          return {
            age: curr.age,
            color: colHex,
            group: curr.group,
            name: el.erhArt,
            sigle: curr.sigle,
            value: el.count
          } as Description;
        })
      );
    }
    this.data = res;
    console.log(res);
  }

  computeGroupedDiagramData() {
    const res = [] as Array<Description>;
    const groupedObject = groupBy(cloneDeep(this.desc), 'name');
    for (let obj in groupedObject) {
      if (this.groupByGp) {
        if (groupedObject[obj].length > 1) {
          let colHsl: any;
          if (this.sigleColors.size > 0) {
            const col = this.sigleColors.get(groupedObject[obj][0].sigle);
            colHsl =
              col !== undefined ? convertHexToHsl(col) : selectColor(null);
          } else {
            colHsl = selectColor(null);
          }
          const factor = 0.3 / groupedObject[obj].length;
          groupedObject[obj].forEach((el) => {
            el.color = hslToHex(
              colHsl[0] * 360,
              colHsl[1] * 100,
              colHsl[2] * 100
            );
            colHsl[2] -= factor;
          });
          res.push(...groupedObject[obj]);
        } else {
          res.push(groupedObject[obj][0]);
        }
      } else {
        if (groupedObject[obj].length > 1) {
          const sum = groupedObject[obj].reduce((a, b) => a + b.value, 0);
          res.push({
            age: groupedObject[obj][0].age,
            color: groupedObject[obj][0].color,
            group: groupedObject[obj][0].group,
            name: groupedObject[obj][0].name,
            sigle: groupedObject[obj][0].sigle,
            value: sum,
            gp: groupedObject[obj].reduce(
              (a, b) => a.concat(b.gp),
              [] as Array<GPData>
            )
          } as Description);
        } else {
          res.push(groupedObject[obj][0]);
        }
      }
    }
    this.data = res;
  }

  icon: Symbols = Symbols.Circle;

  created() {
    this.data = cloneDeep(this.desc);
    this.desc
      .map((el) => el.sigle)
      .forEach((val) => {
        const color = selectColor(null);
        this.sigleColors.set(
          val,
          hslToHex(color.h, color.s * 100, color.l * 100)
        );
      });
    this.erhebungsArten = this.data.reduce(
      (a, b) => a.concat(b.gp),
      [] as Array<GPData>
    );
    this.computeGroupedDiagramData();
  }
}
</script>
<style lang="scss"></style>
