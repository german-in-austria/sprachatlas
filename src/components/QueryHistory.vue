<template>
  <v-data-table
    :headers="headers"
    :items="queries"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:item.legend="{ item }">
      <template v-if="item.legend.type === 3">
        Legende {{ item.legend.name }} Beschreibung:
        {{ item.legend.description }}
      </template>
      <template v-else>
        <v-avatar>
          <icon-circle
            :fillCol="
              convertHslToStr(
                item.legend.color.h,
                item.legend.color.s,
                item.legend.color.l
              )
            "
            :strokeWidth="item.legend.strokeWidth"
          />
        </v-avatar>
        <template v-if="item.legend.type === 0">
          Tags: {{ item.legend.name }}
        </template>
        <template v-else-if="item.legend.type === 1">
          Ort: {{ item.legend.name }}
        </template>
        <template v-else-if="item.legend.type === 2">
          Phänomen: {{ item.legend.name }}
        </template>
        <template v-else-if="item.legend.type === 4">
          Aufgabe: {{ item.legend.name }}
        </template>
      </template>
    </template>
    <template v-slot:item.date="{ item }">
      {{ new Date(item.date).toLocaleDateString() }}
    </template>
    <template v-slot:item.deleted="{ item }">
      <template v-if="item.deleted"> Gelöscht </template>
      <template v-else> Nicht gelöscht </template>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon
        color="red"
        @click="changeDelLegend(item.legend, item.deleted)"
      >
        <template v-if="item.deleted">
          <v-icon>mdi-undo</v-icon>
        </template>
        <template v-else>
          <v-icon>mdi-trash-can-outline</v-icon>
        </template>
      </v-btn>
      <template v-if="!item.deleted">
        <v-btn icon color="grey" @click="changeLegendVis(item.legend.id)">
          <template v-if="item.legend.vis">
            <v-icon>mdi-eye-outline</v-icon>
          </template>
          <template v-else>
            <v-icon>mdi-eye-off-outline</v-icon>
          </template>
        </v-btn>
      </template>

      <template v-if="item.legend.type === 3">
        <v-btn
          icon
          color="primary"
          @click="
            $router.push({ path: 'query', query: { legend: item.legend.id } })
          "
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </template>
  </v-data-table>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { messageHandler } from '@/store/modules/message';

import { legendMod } from '@/store/modules/legend';
import { exportLegend, localStorageQuery, SearchItems } from '@/static/apiModels';
import { expData } from '@/service/ExportBase';

import ItemDescription from './ItemDescription.vue';
import IconCircle from '@/icons/IconCircle.vue';
import { convertHexToHsl, convertHslToStr, fetchContent } from '@/helpers/helper';
import { LayerGroup } from 'leaflet';

@Component({
  components: { ItemDescription, IconCircle },
  name: 'QueryHistory'
})
export default class QueryHistory extends Vue {
  queries: localStorageQuery[] = [];
  headers = [
    { text: 'Query', value: 'legend' },
    { text: 'Erzeugt am', value: 'date' },
    { text: 'Gelöscht', value: 'deleted' },
    { text: 'Aktionen', value: 'actions' },
  ];

  LM = legendMod;

  get legendGlobal() {
    return legendMod.legend;
  }

  convertHslToStr(h: number, s: number, l: number) {
    return convertHslToStr(h * 360, s, l);
  }

  changeLegendVis(id: string) {
    let legIdx = this.queries.findIndex(el => el.legend.id === id);
    if (legIdx !== undefined) {
      let editLeg = this.queries[legIdx].legend;
      editLeg.vis = !editLeg.vis;
      const legFilter = this.legendGlobal.filter(el => el.id === editLeg.id);
      if (legFilter.length !== 1) return;
      legFilter[0].vis = !legFilter[0].vis;
      this.LM.editLegendByID(legFilter[0]);
      this.queries[legIdx].legend = editLeg;
      expData.editLocalStorageEntry(this.queries, editLeg.id, this.queries[legIdx]);
    }
  }

  async changeDelLegend(leg: exportLegend, deleted: boolean) {
    leg.vis = deleted;
    if (deleted) {
      expData.markAsDeleted(leg.id, leg.type ? leg.type : SearchItems.Tag, false);
      // Fetch the needed content for the legend
      const res = await fetchContent(leg.elementId, leg.type);
      // create the new entry
      const lm = await this.LM.createLegendEntry({
        icon: leg.symbol,
        layer: new LayerGroup(),
        name: leg.name,
        color: leg.color,
        radius: leg.size,
        content: leg.type === SearchItems.Ort ? leg.content : res,
        type: leg.type,
        id: leg.id
      });
      lm.parameter = leg.type === SearchItems.Query ? leg.parameter : null;
      this.LM.addLegendEntry(lm);
    } else {
      expData.markAsDeleted(leg.id, leg.type ? leg.type : SearchItems.Tag, true);
      const ele = this.legendGlobal.find(el => el.id === leg.id);
      if (ele === undefined) return;
      this.LM.deleteLegendEntry(ele, null);
    }
    this.queries = expData.getQueryFromLocalStorage();
  }

  mounted() {
    this.queries = expData.getQueryFromLocalStorage();
    this.queries.forEach(el => {
      if (this.legendGlobal.length === 0 || this.legendGlobal.find(ele => el.legend.id === ele.id) === undefined) {
        el.deleted = true;
        return;
      }


    })
  }
}
</script>