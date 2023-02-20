<template>
  <div>
    <span>{{ item.name }} - </span>
    <v-avatar>
      <icon-circle
        :fillCol="
          convertHexToHsl(item.color !== undefined ? item.color : '#F00')
        "
        :strokeWidth="legendGlobalQuery[0].strokeWidth"
      />
    </v-avatar>
    <strong> Beschreibung: </strong>
    <span v-html="item.description ? item.description : ''"></span>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { messageHandler } from '@/store/modules/message';
import { Parameter } from '@/static/apiModels';
import { legendMod } from '@/store/modules/legend';
import { SearchItems } from '@/static/apiModels';
import { convertHexToHsl, convertHslToStr } from '@/helpers/helper';
import IconCircle from '@/icons/IconCircle.vue';

@Component({
  components: { IconCircle },
  name: 'ItemDescription'
})
export default class ItemDescription extends Vue {
  @Prop() readonly item!: Parameter;

  value: string = '';
  LM = legendMod;
  edit: boolean = false;

  get legendGlobalQuery() {
    return this.LM.legend.filter((el) => el.type === SearchItems.Query);
  }

  get queryLegend() {
    return this.LM.legend.filter((el) => el.type === SearchItems.Query);
  }


  convertHexToHsl(col: string) {
    if (col.length > 7) {
      col = col.substring(0, 7);
    }
    const hsl = convertHexToHsl(col);
    return convertHslToStr(hsl[0] * 360, hsl[1], hsl[2]);
  }

}
</script>