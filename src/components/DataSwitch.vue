<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-btn
        icon
        color="indigo"
        @click="changeData(false)"
        :disabled="singleData"
      >
        <v-icon>mdi-arrow-left-bold</v-icon>
      </v-btn>
      <template v-if="data.icon === 0 || !sideways">
        <v-avatar>
          <icon-circle :fillCol="data.c" :strokeWidth="1" />
        </v-avatar>
      </template>
      <template v-else-if="data.icon === 1">
        <img :src="drawRect(20, 1, data.c, true)" />
      </template>
      <template v-else>
        <img :src="drawTriangle(20, 1, data.c, true)" />
      </template>
      {{ data.name }} - {{ ortName }}
      <template v-if="typeFile !== ''"> - Typ: {{ typeFile }} </template>
      <v-btn
        icon
        color="indigo"
        @click="changeData(true)"
        :disabled="singleData"
      >
        <v-icon>mdi-arrow-right-bold</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator';
import IconCircle from '@/icons/IconCircle.vue';

import { drawRect, drawTriangle } from '@/helpers/MapCompute';


import { Hsl, SearchItems, singleEntry } from '@/static/apiModels';

@Component({
  components: {
    IconCircle
  },
  name: 'DataSwitch'
})
export default class DataSwitch extends Vue {
  @Prop(String) readonly ortName!: string;
  @Prop({ type: String, default: "" }) readonly typeLeg!: string;
  @Prop(Boolean) readonly sideways!: boolean;
  @Prop({ type: Boolean, default: false }) readonly singleData!: boolean;
  @Prop() readonly data!: singleEntry;
  @Prop(Boolean) readonly typeItem!: boolean;

  get typeFile() {
    if (this.data.t === SearchItems.Aufgaben) {
      return !this.typeItem ? 'Standard' : 'Dialekt';
    }
    return ""
  }

  changeData(dir: boolean) {
    this.$emit('callChange', dir);
  }

  drawRect(size: number, border: number, color: string, encoded: boolean) {
    return drawRect(size, border, color, encoded, 1.0);
  }

  drawTriangle(size: number, border: number, color: string, encoded: boolean) {
    return drawTriangle(size, border, color, encoded, 1.0);
  }
}
</script>