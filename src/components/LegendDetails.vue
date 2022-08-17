<template>
  <v-container>
    <v-row v-for="(leg, idx) in legendGlobal" align="center" :key="idx">
      <v-col>
        <v-avatar>
          <template v-if="leg.symbol === 0">
            <icon-circle :fillCol="convertHsl(leg.color)" :strokeWidth="1" />
          </template>
          <template v-else-if="leg.symbol === 1">
            <img
              :src="drawRect(20, leg.strokeWidth, convertHsl(leg.color), true)"
            />
          </template>
          <template v-else>
            <img
              :src="
                drawTriangle(20, leg.strokeWidth, convertHsl(leg.color), true)
              "
            />
          </template>
        </v-avatar>
      </v-col>
      <v-col>Name: {{ leg.name }}</v-col>
      <v-col>Typ: {{ nameForSearchItems(leg.type) }}</v-col>
      <v-col>Größe: {{ leg.size }} px</v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator';
import { expData } from '@/service/ExportBase';
import { Hsl, SearchItems } from '@/static/apiModels';
import { legendMod } from '@/store/modules/legend';
import { messageHandler } from '@/store/modules/message';
import { nameForSearchItems, convertHslToStr } from '@/helpers/helper';
import IconCircle from '@/icons/IconCircle.vue';

import { drawRect, drawTriangle } from '@/helpers/MapCompute';


@Component({
  name: 'LegendDetails',
  components: { IconCircle }
})
export default class LegendDetails extends Vue {
  LM = legendMod;

  get legendGlobal() {
    return this.LM.legend;
  }

  nameForSearchItems(val: SearchItems) {
    return nameForSearchItems(val);
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

  mounted() {
    console.log(this.LM.legend);
  }
}
</script>