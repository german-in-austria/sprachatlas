<template>
  <v-slide-x-reverse-transition>
    <v-card
      v-if="vis"
      elevation="2"
      class="mx-auto"
      min-width="300"
      height="inherit"
    >
      <v-divider class="mx-4"></v-divider>
      <v-card-title
        >Legende
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text class="mx-auto">
        <v-list class="transparent">
          <v-list-item
            v-for="(d, i) in legendGlobal.filter((el) => el.type !== 3)"
            :key="d.id"
          >
            <v-list-item-icon>
              <v-menu
                ref="menu"
                transition="scale-transition"
                :close-on-content-click="false"
                class="mx-auto pr-100"
              >
                <template v-slot:activator="{ on }">
                  <template v-if="d.symbol === 0 || !propCircl">
                    <v-avatar v-on="on">
                      <icon-circle
                        :fillCol="convertHsl(d.color)"
                        :strokeWidth="d.strokeWidth"
                      />
                    </v-avatar>
                  </template>
                  <template v-else>
                    <v-avatar tile v-on="on">
                      <template v-if="d.symbol === 1">
                        <img
                          :src="
                            drawRect(
                              7,
                              d.strokeWidth,
                              convertHsl(d.color),
                              true
                            )
                          "
                        />
                      </template>
                      <template v-else>
                        <img
                          :src="
                            drawTriangle(
                              7,
                              d.strokeWidth,
                              convertHsl(d.color),
                              true
                            )
                          "
                        />
                      </template>
                    </v-avatar>
                  </template>
                </template>
                <template>
                  <v-card>
                    <v-card-title>Farbe</v-card-title>
                    <v-card-text @click="onLegendChange(d)">
                      <v-color-picker
                        v-model="d.color"
                        hide-inputs
                      ></v-color-picker>
                    </v-card-text>
                    <v-divider class="mx-4"></v-divider>
                    <v-card-title>Durchmesser</v-card-title>
                    <v-card-text>
                      {{ d.size }} px
                      <v-slider
                        v-model="d.size"
                        hint="Durchmesser einstellen"
                        min="2"
                        max="100"
                        @change="onLegendChange(d)"
                      ></v-slider
                    ></v-card-text>
                    <v-divider class="mx-4"></v-divider>
                    <v-card-title>Durchmesser Rand</v-card-title>
                    <v-card-text>
                      {{ d.strokeWidth }} px
                      <v-slider
                        v-model="d.strokeWidth"
                        hint="Durchmesser von Strich einstellen"
                        min="1"
                        max="10"
                        @change="onLegendChange(d)"
                      ></v-slider
                    ></v-card-text>
                  </v-card>
                </template>
              </v-menu>
            </v-list-item-icon>
            <v-list-item-content class="mx-auto">
              {{ d.name }}
            </v-list-item-content>
            <v-list-item-action>
              <v-container>
                <v-row>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        icon
                        color="red"
                        @click="deleteLegendEntry(d, i)"
                      >
                        <v-icon>mdi-trash-can-outline</v-icon>
                      </v-btn>
                    </template>

                    <span>Eintrag löschen</span>
                  </v-tooltip>
                  <v-btn
                    icon
                    color="grey"
                    @click="
                      d.vis = !d.vis;
                      onLegendChange(d);
                    "
                  >
                    <template v-if="d.vis">
                      <v-icon>mdi-eye-outline</v-icon>
                    </template>
                    <template v-else>
                      <v-icon>mdi-eye-off-outline</v-icon>
                    </template>
                  </v-btn>

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-if="d.type === 6"
                        icon
                        color="green"
                        v-bind="attrs"
                        v-on="on"
                        @click="splitPreset(d, i)"
                      >
                        <v-icon>mdi-call-split</v-icon>
                      </v-btn>
                    </template>
                    <span>Presettag aufteilen</span>
                  </v-tooltip>
                </v-row>
              </v-container>
            </v-list-item-action>
          </v-list-item>
          <v-list-item
            v-for="(d, i) in legendGlobal.filter((el) => el.type === 3)"
            :key="d.id"
          >
            <v-list-item-content class="mx-auto">
              {{ d.name }}
              <v-list-item v-for="(para, idx) in d.parameter" :key="idx">
                <v-avatar>
                  <icon-circle
                    :fillCol="
                      convertHexToHsl(
                        para.color !== undefined ? para.color : '#F00'
                      )
                    "
                    :strokeWidth="d.strokeWidth"
                  />
                </v-avatar>
                <v-list-item-content>
                  {{ para.name }}
                </v-list-item-content>
              </v-list-item>
            </v-list-item-content>
            <v-list-item-action>
              <v-container>
                <v-row>
                  <v-btn icon color="red" @click="deleteLegendEntry(d, i)">
                    <v-icon>mdi-cancel</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="primary"
                    @click="
                      $router.push({ path: 'query', query: { legend: d.id } })
                    "
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="grey"
                    @click="
                      d.vis = !d.vis;
                      onLegendChange(d);
                    "
                  >
                    <template v-if="d.vis">
                      <v-icon>mdi-eye-outline</v-icon>
                    </template>
                    <template v-else>
                      <v-icon>mdi-eye-off-outline</v-icon>
                    </template>
                  </v-btn>
                </v-row>
              </v-container>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <action-buttons
          v-on:hideCard="updateVis()"
          v-on:moveCard="$emit('moveCard', $event)"
          color="indigo"
          :showTrash="false"
        />
      </v-card-actions>
    </v-card>
  </v-slide-x-reverse-transition>
</template>
<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Vue } from 'vue-property-decorator';
import { legendMod } from '@/store/modules/legend';
import { aufgabenModule } from '@/store/modules/aufgaben';
import IconCircle from '@/icons/IconCircle.vue';
import ActionButtons from './ActionButtons.vue';
import { IGetPresetOrtTagResult } from '@/api/dioe-public-api/models/IGetPresetOrtTagResult';
import { tagModule } from '@/store/modules/tags';
import { expData } from '@/service/ExportBase';

import * as L from 'leaflet';
import { LegendGlobal, Hsl, SearchItems, Symbols } from '../static/apiModels';

import { drawRect, drawTriangle } from '@/helpers/MapCompute';

import {
  selectColor,
  convertHslToStr,
  convertHexToHsl
} from '@/helpers/helper';

@Component({
  name: 'LegendItem',
  components: {
    IconCircle,
    ActionButtons
  }
})
export default class LegendItem extends Vue {
  @Prop(Boolean) readonly vis!: boolean;
  @Prop(Boolean) readonly propCircl!: boolean;

  menu = false;
  LM = legendMod;
  AM = aufgabenModule;

  get legendGlobal() {
    return this.LM.legend;
  }

  get tagOrteResults() {
    return tagModule.tagOrteNum;
  }

  convertHsl(col: Hsl) {
    return convertHslToStr(col.h, col.s, col.l);
  }

  convertHexToHsl(col: string) {
    if (col.length > 7) {
      col = col.substring(0, 7);
    }
    const hsl = convertHexToHsl(col);
    return convertHslToStr(hsl[0] * 360, hsl[1], hsl[2]);
  }

  hslToObj(hsl: string) {
    const vals = hsl.substring(4, hsl.length - 1).split(',');
    return {
      h: vals[0],
      s: Number(vals[1].substring(0, vals[1].length - 1)) / 100,
      l: Number(vals[2].substring(0, vals[2].length - 1)) / 100,
      a: 1
    };
  }

  drawRect(size: number, border: number, color: string, encoded: boolean) {
    return drawRect(size, border, color, encoded, 1.0);
  }

  drawTriangle(size: number, border: number, color: string, encoded: boolean) {
    return drawTriangle(size, border, color, encoded, 1.0);
  }

  deleteLegendEntry(el: LegendGlobal, idx: number | null) {
    this.LM.deleteLegendEntry(el, idx);
    expData.removeEntry(el.id, el.name, el.type ? el.type : 0);
    this.AM.clearAntworten();
    this.$emit('callChange', el);
    if (this.legendGlobal.length === 0) this.updateVis();
  }

  onLegendChange(el: LegendGlobal) {
    this.$emit('callChange', el);
  }

  updateVis() {
    this.$emit('changeVis', !this.vis);
  }

  async splitPreset(el: LegendGlobal, idx: number) {
    const id = (el.content[0] as IGetPresetOrtTagResult).presetId;
    await tagModule.fetchTagOrtePreset({
      ids: [id],
      erhArt: legendMod.erhArtFilter
    });
    const tagIds = [...new Set(this.tagOrteResults.map((val) => val.tagId))];
    for (const id of tagIds) {
      const tag = this.tagOrteResults.find((val) => val.tagId === id);
      const legEntry = await this.LM.createLegendEntry({
        icon: Symbols.Circle,
        layer: L.layerGroup(),
        name: tag?.tagName ? tag.tagName : '',
        color: selectColor(null),
        radius: 20,
        content: this.tagOrteResults.filter((val) => val.tagId === id),
        type: SearchItems.Tag
      });
      this.LM.addLegendEntry(legEntry);
    }
    this.deleteLegendEntry(el, idx);
    this.$emit('callChange', el);
  }
}
</script>
<style lang="scss" scoped>
.v-card {
  display: flex !important;
  flex-direction: column;
}

.v-card__text {
  flex-grow: 1;
  overflow: auto;
}
</style>
