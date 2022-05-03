<template>
  <v-select
    v-model="selSymbol"
    :items="symbols"
    label="Symbol"
    item-text="name"
    item-value="value"
  >
    <template v-slot:item="{ item }">
      <v-list-item-avatar tile>
        <template v-if="item.value === 0">
          <icon-circle :fillCol="color" :strokeWidth="0.1" />
        </template>
        <template v-if="item.value === 1"
          ><img :src="drawRect(7, 0.1, color, true)"
        /></template>
        <template v-if="item.value === 2"
          ><img :src="drawTriangle(7, 0.1, color, true)"
        /></template>
      </v-list-item-avatar>
      <v-list-item-title>
        {{ item.name }}
      </v-list-item-title>
    </template>
  </v-select>
</template>
<script lang="ts">
import { Component, PropSync, Vue, Prop, Watch } from 'vue-property-decorator';
import { drawRect, drawTriangle } from '@/helpers/MapCompute';
import { Symbols } from '@/static/apiModels';
import IconCircle from '@/icons/IconCircle.vue';

@Component({
  components: { IconCircle },
  name: 'SymbolPicker'
})
export default class SymbolPicker extends Vue {
  @Prop({ default: '#F00', type: String }) readonly color!: string;
  @Prop({ default: 0, type: Number, required: false })
  readonly propSymbol!: number;

  selSymbol: Symbols = Symbols.Circle;

  get symbol() {
    return this.selSymbol;
  }

  drawRect(size: number, border: number, color: string, encoded: boolean) {
    return drawRect(size, border, color, encoded, 1.0);
  }

  drawTriangle(size: number, border: number, color: string, encoded: boolean) {
    return drawTriangle(size, border, color, encoded, 1.0);
  }

  created() {
    if (this.propSymbol) {
      this.selSymbol = this.propSymbol;
    }
  }

  symbols = [
    { name: 'Kreis', value: Symbols.Circle },
    { name: 'Rechteck', value: Symbols.Rect },
    { name: 'Dreieck', value: Symbols.Tri }
  ];
}
</script>