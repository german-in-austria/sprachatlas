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
    Gruppieren nach:
    <v-select
      solo
      v-model="selGen"
      :items="typesGraph"
      @change="changeType()"
      item-text="name"
      item-value="value"
    ></v-select>

    <v-switch
      v-model="groupByErhebungen"
      label="Nach Erhebungsart zusätzlich gruppieren"
      color="info"
      inset
      @change="changeType()"
      v-if="selGen !== 'gp'"
    ></v-switch>
    <v-switch
      v-model="groupByGp"
      label="Nach Parameter unterteilen"
      color="info"
      inset
      @change="changeType()"
      v-if="selGen === 'gp'"
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

  erhebungColors: Map<string, string> = new Map<string, string>();

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
    let res = [] as Array<Description>;
    const cloneData = cloneDeep(this.desc);
    if (this.selGen === 'gp') {
      const groupedErh = groupBy(this.erhebungsArten, 'erhArt');
      for (let obj in groupedErh) {
        let colorHex: string;
        if (this.erhebungColors.has(groupedErh[obj][0].erhArt)) {
          const mapCol = this.erhebungColors.get(groupedErh[obj][0].erhArt);
          colorHex = mapCol ? mapCol : '#F00';
        } else {
          const color = selectColor(null);
          colorHex = hslToHex(color.h, color.s * 100, color.l * 100);
          this.erhebungColors.set(groupedErh[obj][0].erhArt, colorHex);
        }
        const dataErh = cloneData.filter(
          (el) => el.sigle === groupedErh[obj][0].sigle
        );
        if (groupedErh[obj].length > 1) {
          if (this.groupByGp) {
            const factor = 0.5 / groupedErh[obj].length;
            let colHsl = convertHexToHsl(colorHex);

            groupedErh[obj].forEach((gpElement) => {
              const erhName = dataErh.find((el) =>
                el.gp.some((gp) => gp.erhArtId === gpElement.erhArtId)
              );
              res.push({
                age: dataErh ? dataErh[0].age : -1,
                color: hslToHex(
                  colHsl[0] * 360,
                  colHsl[1] * 100,
                  colHsl[2] * 100
                ),
                group: dataErh ? dataErh[0].group : '',
                name: `${gpElement.erhArt} # ${erhName?.name}`,
                sigle: gpElement.sigle,
                value: gpElement.count,
                gp: [gpElement]
              });
              colHsl[2] -= factor;
            });
          } else {
            const curr = groupedErh[obj];
            const sum = curr.reduce((a, b) => a + b.count, 0);
            res.push({
              age: dataErh ? dataErh[0].age : -1,
              color: colorHex,
              group: dataErh ? dataErh[0].group : '',
              name: groupedErh[obj][0].erhArt,
              sigle: groupedErh[obj][0].sigle,
              value: sum,
              gp: groupedErh[obj]
            });
          }
        } else {
          if (this.groupByGp) {
            const erhName = dataErh.find((el) =>
              el.gp.some((gp) => gp.erhArtId === groupedErh[obj][0].erhArtId)
            );
            res.push({
              age: dataErh ? dataErh[0].age : -1,
              color: colorHex,
              group: dataErh ? dataErh[0].group : '',
              name: `${groupedErh[obj][0].erhArt} # ${erhName?.name}`,
              sigle: groupedErh[obj][0].sigle,
              value: groupedErh[obj][0].count,
              gp: groupedErh[obj]
            });
          } else {
            res.push({
              age: dataErh ? dataErh[0].age : -1,
              color: colorHex,
              group: dataErh ? dataErh[0].group : '',
              name: groupedErh[obj][0].erhArt,
              sigle: groupedErh[obj][0].sigle,
              value: groupedErh[obj][0].count,
              gp: groupedErh[obj]
            });
          }
        }
      }
    } else {
      const groupedData = groupBy(cloneData, this.selGen);
      for (let obj in groupedData) {
        groupedData[obj][0].name = obj;
        const curr = groupedData[obj][0];
        if (this.groupByErhebungen) {
          const erhebungenItem = groupedData[obj].reduce(
            (a, b) => a.concat(b.gp),
            [] as Array<GPData>
          );
          const factor = 0.5 / erhebungenItem.length;
          let colHsl = convertHexToHsl(groupedData[obj][0].color);
          erhebungenItem.forEach((element) => {
            const idxRes = res.findIndex(
              (el) => el.name === `${curr.name} # ${element.erhArt}`
            );
            if (idxRes > 0) {
              res[idxRes].value += element.count;
              res[idxRes].gp = res[idxRes].gp.concat(element);
            } else {
              res.push({
                age: curr.age,
                color: hslToHex(
                  colHsl[0] * 360,
                  colHsl[1] * 100,
                  colHsl[2] * 100
                ),
                group: curr.group,
                name: `${curr.name} # ${element.erhArt}`,
                sigle: curr.sigle,
                value: element.count,
                gp: [element]
              });
              colHsl[2] -= factor;
            }
          });
        } else {
          if (groupedData[obj].length > 1) {
            const valSum = groupedData[obj].reduce((a, b) => a + b.value, 0);
            groupedData[obj][0].value = valSum;
            res.push(groupedData[obj][0]);
          } else {
            res.push(groupedData[obj][0]);
          }
        }
      }
    }
    this.data = res;
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
