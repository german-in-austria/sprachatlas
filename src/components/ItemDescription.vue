<template>
  <div>
    <strong> Beschreibung: </strong>
    <span
      v-html="
        item.description && item.description.length > 0
          ? item.description
          : 'Keine Beschreibung vorhanden'
      "
    ></span>
    <v-divider></v-divider>
    <template v-if="item.tagList && item.tagList.length > 0">
      Tags
      <div
        v-for="(tag, idx) in item.tagList"
        style="margin-top: 5px; margin-bottom: 5px"
      >
        <TagViewSelect
          :generation="0"
          :children="tag.children"
          :tagData="tag.tagGroup"
          :tagSelection="tag"
          :color="item.color"
          :topTag="true"
          :editMode="false"
        />
      </div>
    </template>
    <v-divider></v-divider>
    <template v-if="item.textTokenList && item.textTokenList.length > 0">
      Token:
      <token-chips
        :selectedElements="item.textTokenList"
        :color="item.color"
        :edit="false"
      ></token-chips>
    </template>
    <v-divider></v-divider>
    <template v-if="item.lemmaList && item.lemmaList.length > 0">
      Lemma:
      <token-chips
        :selectedElements="item.lemmaList"
        :color="item.color"
        :edit="false"
      ></token-chips>
    </template>
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
import TagViewSelect from './TagViewSelect.vue';
import TokenChips from './TokenChips.vue';
@Component({
  components: { IconCircle, TagViewSelect, TokenChips },
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