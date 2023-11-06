<template>
  <div style="margin-top: 75px">
    <v-data-table
      group-by="ort"
      class="elevation-1"
      show-group-by
      :headers="headers"
      :items="listData"
      :loading="loading"
      :search="searchInput"
      :custom-filter="filterByOrtAndName"
    >
      <template v-slot:top>
        <v-text-field
          v-model="searchInput"
          label="Daten filtern"
          class="mx-4"
        ></v-text-field>
      </template>
      <template
        v-slot:group.header="{ group, groupBy, items, isOpen, toggle, remove }"
      >
        <th :colspan="headers.length">
          <v-icon @click="toggle"
            >{{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
          </v-icon>
          {{ group }}
          <v-icon @click="remove">mdi-window-close</v-icon>
          <template
            v-if="
              groupBy.length === 1 && groupBy[0] === 'name' && items.length > 0
            "
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" color="grey">
                  <template v-if="isLegendVisible(items[0].legendId)">
                    <v-icon @click="changeVisibility(items[0].legendId)"
                      >mdi-eye-outline</v-icon
                    >
                  </template>
                  <template v-else>
                    <v-icon @click="changeVisibility(items[0].legendId)"
                      >mdi-eye-off-outline</v-icon
                    >
                  </template>
                </v-btn>
              </template>
              <span>{{
                isLegendVisible(items[0].legendId)
                  ? 'Unsichtbar schalten'
                  : 'Sichtbar schalten'
              }}</span>
            </v-tooltip>
            <v-tooltip bottom color="error">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  color="red"
                  v-bind="attrs"
                  v-on="on"
                  @click="deleteLegend(items[0].legendId)"
                >
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </template>
              <span>Legende löschen</span>
            </v-tooltip>
          </template>
        </th>
      </template>
      <template v-slot:[`item.icon`]="{ item }">
        <v-avatar>
          <icon-circle
            :fillCol="
              convertHexToHsl(
                item.icon.color !== undefined ? item.icon.color : '#FF0000'
              )
            "
            :strokeWidth="1"
          />
        </v-avatar>
      </template>
      <template v-slot:[`item.infos`]="{ item }">
        <template v-if="item.type !== 3">
          {{ item.infos }}
        </template>
        <template v-else>
          <ItemDescription :item="JSON.parse(item.infos)"></ItemDescription>
        </template>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip bottom color="error">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              color="red"
              @click="deleteData(item)"
            >
              <v-icon>mdi-trash-can-outline</v-icon>
            </v-btn>
          </template>
          <span>Eintrag löschen</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>
<script lang="ts">
import {
  ISelectAllAufgabenResult,
  ISelectOrtAufgabeResult,
  ISelectPhaenResult
} from '@/api/dioe-public-api';
import {
  hslToHex,
  convertHexToHsl,
  convertHslToStr,
  getOrtName,
  generateID
} from '@/helpers/helper';
import {
  listData,
  Parameter,
  SearchItems,
  Symbols,
  TagOrteResults
} from '@/static/apiModels';
import { legendMod } from '@/store/modules/legend';
import { Component, Vue } from 'vue-property-decorator';
import { messageHandler } from '@/store/modules/message';

import IconCircle from '@/icons/IconCircle.vue';
import ItemDescription from './ItemDescription.vue';
import TokenChips from './TokenChips.vue';

@Component({
  // if you use components add them here
  components: { IconCircle, ItemDescription, TokenChips },
  /* name is necessary for recursive components
   * (at least in older versions, might be auto generated through the vue-property-decorator)
   */
  name: 'ListView'
})
export default class ListView extends Vue {
  LM = legendMod;

  listData: Array<listData> = [];
  loading: boolean = false;

  searchInput: string = '';

  headers = [
    { text: 'Ortsname', value: 'ort', filterable: true },
    {
      text: 'Name',
      value: 'name',
      sortable: true,
      filterable: true,
      groupable: true
    },
    {
      text: 'Weitere Informationen',
      value: 'infos',
      sortable: true,
      filterable: true,
      groupable: false
    },
    {
      text: 'Referenzen',
      value: 'ref',
      sortable: true,
      filterable: true,
      groupable: false
    },
    {
      text: 'Icon',
      value: 'icon',
      sortable: false,
      filterable: false,
      groupable: false
    },
    {
      text: 'Aktionen',
      value: 'actions',
      sortable: false,
      filterable: false,
      groupable: false
    }
  ];

  get legendGlobal() {
    return legendMod.legend;
  }

  isLegendVisible(id: string) {
    const leg = this.legendGlobal.filter((el) => el.id === id);
    return leg && leg.length > 0 ? leg[0].vis : false;
  }

  changeVisibility(id: string) {
    this.LM.changeVisOfLegend(id);
  }

  deleteLegend(id: string) {
    this.LM.removeEntryById(id);
  }

  convertHexToHsl(col: string) {
    if (col.length > 7) {
      col = col.substring(0, 7);
    }
    const hsl = convertHexToHsl(col);
    return convertHslToStr(hsl[0] * 360, hsl[1], hsl[2]);
  }

  deleteData(item: listData) {
    this.LM.removeOrtFromLegend({ legId: item.legendId, osm: item.osm });
    this.listData.splice(
      this.listData.findIndex((el) => item.idx === el.idx),
      1
    );
  }

  extractTableData(
    color: string,
    osm: number,
    icon: Symbols,
    vis: boolean,
    ortName: string,
    num: number,
    name: string,
    id: string,
    type: SearchItems,
    infos: string
  ) {
    const res: Array<listData> = [];
    const ort = res.findIndex((tD) => osm === tD.osm || tD.ort === ortName);
    res.push({
      idx: generateID(),
      ort: getOrtName(ortName).name,
      osm: osm,
      icon: {
        color: color,
        icon: icon
      },
      ref: num,
      vis: vis,
      legendId: id,
      name: name,
      infos: infos,
      type: type
    });
    return res;
  }

  filterByOrtAndName(value: any, search: string | null, item: any) {
    if (value === null || search === null) {
      return true;
    }
    return item.ort.indexOf(search) !== -1 || item.name.indexOf(search) !== -1;
  }

  loadData() {
    this.legendGlobal.forEach((el, idx) => {
      if (el.type === SearchItems.Tag) {
        const content = el.content as TagOrteResults[];
        const info = el.searchInfo as any;
        for (const tag of content) {
          this.listData = this.listData.concat(
            this.extractTableData(
              hslToHex(el.color.h, el.color.s * 100, el.color.l * 100),
              tag.osmId ? Number(tag.osmId) : -1,
              el.symbol,
              el.vis,
              tag.ortNamelang ? tag.ortNamelang : '',
              tag.numTag ? Number(tag.numTag) : 1,
              tag.tagName ? tag.tagName : '',
              el.id,
              SearchItems.Tag,
              `Generation: ${info.tagGene}; Name: ${info.tagName}`
            )
          );
        }
      } else if (el.type === SearchItems.Aufgaben) {
        const content = el.content as ISelectOrtAufgabeResult[];
        const info = el.searchInfo as ISelectAllAufgabenResult;
        for (const aufgabe of content) {
          this.listData = this.listData.concat(
            this.extractTableData(
              hslToHex(el.color.h, el.color.s * 100, el.color.l * 100),
              aufgabe.osmId ? Number(aufgabe.osmId) : -1,
              el.symbol,
              el.vis,
              aufgabe.ortNamelang ? aufgabe.ortNamelang : '',
              aufgabe.numAufg ? Number(aufgabe.numAufg) : 1,
              aufgabe.aufgabenstellung ? aufgabe.aufgabenstellung : '',
              el.id,
              SearchItems.Aufgaben,
              `Art Bezeichnung: ${info.artBezeichnung}, Beschreibung: ${info.beschreibung}`
            )
          );
        }
      } else if (el.type === SearchItems.Phaen) {
        const content = el.content as TagOrteResults[];
        const info = el.searchInfo as ISelectPhaenResult;
        for (const phaen of content) {
          this.listData = this.listData.concat(
            this.extractTableData(
              hslToHex(el.color.h, el.color.s * 100, el.color.l * 100),
              phaen.osmId ? Number(phaen.osmId) : -1,
              el.symbol,
              el.vis,
              phaen.ortNamelang ? phaen.ortNamelang : '',
              phaen.numTag ? Number(phaen.numTag) : 1,
              phaen.tagName ? phaen.tagName : '',
              el.id,
              SearchItems.Phaen,
              `Bezeichnung: ${info.bezPhaenomen}, Beschreibung: ${info.beschrPhaenomen}`
            )
          );
        }
      } else if (
        el.type === SearchItems.Query &&
        el.parameter &&
        el.parameter.length > 0
      ) {
        const content = el.content as any[];
        for (const p of content) {
          if (el.parameter) {
            const parameter: Parameter | undefined = el.parameter.find(
              (el) => el.id === p.para
            );
            if (parameter !== undefined) {
              this.listData = this.listData.concat(
                this.extractTableData(
                  parameter.color ? parameter.color : '#FF0000',
                  p.osmId ? Number(p.osmId) : -1,
                  parameter.symbol,
                  el.vis,
                  p.ortNamelang ? p.ortNamelang : '',
                  p.numTag ? Number(p.numTag) : 1,
                  parameter.name ? parameter.name : '',
                  el.id,
                  SearchItems.Query,
                  JSON.stringify(parameter)
                )
              );
            }
          }
        }
      }
    });
    this.loading = false;
  }

  mounted() {
    if (legendMod.loadDataPromise) {
      this.loading = true;
      legendMod.loadDataPromise.then(
        () => {
          this.loadData();
        },
        (reject) => {
          if (legendMod.legend.length === 0) {
            messageHandler.setErrorMsg({
              message: `Fehler beim Laden der Daten: ${reject}`,
              icon: 'mdi-alert'
            });
          } else {
            this.loadData();
          }
        }
      );
    }
  }
}
</script>
