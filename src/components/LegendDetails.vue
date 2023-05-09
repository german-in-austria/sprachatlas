<template>
  <v-container>
    <div v-for="(leg, idx) in legendGlobal" :key="idx" style="margin-top: 10px">
      <v-row align="center" justify="center">
        <template v-if="leg.type !== 3">
          <v-col align="center" cols="2">
            <v-avatar>
              <template v-if="leg.symbol === 0">
                <icon-circle
                  :fillCol="convertHsl(leg.color)"
                  :strokeWidth="1"
                />
              </template>
              <template v-else-if="leg.symbol === 1">
                <img
                  :src="
                    drawRect(20, leg.strokeWidth, convertHsl(leg.color), true)
                  "
                />
              </template>
              <template v-else>
                <img
                  :src="
                    drawTriangle(
                      20,
                      leg.strokeWidth,
                      convertHsl(leg.color),
                      true
                    )
                  "
                />
              </template>
            </v-avatar>
          </v-col>
        </template>
        <v-col>Name: {{ leg.name }}</v-col>
        <v-col>Typ: {{ nameForSearchItems(leg.type) }}</v-col>
        <template v-if="leg.type !== 3">
          <v-col>Größe: {{ leg.size }} px</v-col>
        </template>
        <template v-else>
          <v-col cols="5">
            <v-expansion-panels focusable>
              <v-expansion-panel
                v-for="(item, idx) in leg.parameter"
                :key="idx"
              >
                <v-expansion-panel-header>
                  <div>
                    <v-avatar>
                      <icon-circle
                        :fillCol="
                          convertHexToHsl(
                            item.color !== undefined ? item.color : '#F00'
                          )
                        "
                        :strokeWidth="leg.strokeWidth"
                      />
                    </v-avatar>
                    <span>{{ item.name }}</span>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <ItemDescription :item="item" />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </template>
      </v-row>
      <v-row>
        <v-divider></v-divider>
      </v-row>
    </div>
  </v-container>
</template>
<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator';
import { expData } from '@/service/ExportBase';
import { Hsl, SearchItems } from '@/static/apiModels';
import { legendMod } from '@/store/modules/legend';
import { messageHandler } from '@/store/modules/message';
import {
  nameForSearchItems,
  convertHslToStr,
  convertHexToHsl
} from '@/helpers/helper';
import IconCircle from '@/icons/IconCircle.vue';
import ItemDescription from './ItemDescription.vue';

import { drawRect, drawTriangle } from '@/helpers/MapCompute';

@Component({
  name: 'LegendDetails',
  components: { IconCircle, ItemDescription }
})
export default class LegendDetails extends Vue {
  LM = legendMod;

  get legendGlobal() {
    return this.LM.legend;
  }

  convertHexToHsl(col: string) {
    if (col.length > 7) {
      col = col.substring(0, 7);
    }
    const hsl = convertHexToHsl(col);
    return convertHslToStr(hsl[0] * 360, hsl[1], hsl[2]);
  }

  nameForSearchItems(val: SearchItems | null) {
    return val !== null ? nameForSearchItems(val) : val;
  }

  convertHsl(col: Hsl) {
    return convertHslToStr(col.h, col.s, col.l);
  }

  drawRect(size: number, border: number, color: string, encoded: boolean) {
    return drawRect(size, border, color, encoded, 1.0);
  }

  drawTriangle(size: number, border: number, color: string, encoded: boolean) {
    return drawTriangle(size, border, color, encoded, 1.0);
  }

  mounted() {}
}
</script>
