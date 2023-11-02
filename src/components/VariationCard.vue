<template>
  <v-card class="card">
    <v-card-title
      ><span style="text-align: center; width: 100%">
        {{ data.diagramTitle }}
      </span></v-card-title
    >
    <v-card-text align="center" style="height: 80%">
      <v-skeleton-loader
        v-if="loading && data.diagramData.length === 0"
        class="varCard"
        type="article, list-item-two-line"
      >
      </v-skeleton-loader>
      <div v-else>
        <graph-viewer
          v-if="data.diagramData.length > 0"
          :desc="data.diagramData"
        />
      </div>
    </v-card-text>
    <v-card-actions>
      <action-buttons
        v-on:hideCard="$emit('hideCard', data)"
        v-on:moveCard="$emit('moveCard', $event)"
        v-on:pinCard="pinCard($event, !data.isPinned)"
        v-on:removeElement="removeElement()"
        :showPin="true"
        :pinned="data.isPinned"
        color="indigo"
      />
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { Component, PropSync, Vue, Prop, Watch } from 'vue-property-decorator';
import { Description, pinDataVar, Symbols } from '@/static/apiModels';
import GraphViewer from './GraphViewer.vue';
import ActionButtons from './ActionButtons.vue';
import { legendMod } from '@/store/modules/legend';

@Component({
  components: { GraphViewer, ActionButtons },
  name: 'VariationCard'
})
export default class VariationCard extends Vue {
  @Prop() readonly data!: pinDataVar;
  @Prop(Boolean) readonly loading!: boolean;

  LM = legendMod;

  pinCard(event: any, pinData: boolean) {
    let d = this.data;
    d.isPinned = pinData;
    this.LM.editPinDataByID(d);
  }

  removeElement() {
    this.LM.removeElementFromPinDataVarById(this.data.id);
  }
}
</script>
<style lang="scss">
.v-card__text {
  flex-grow: 1;
  overflow: auto;
  overflow-y: scroll;
}

.card {
  height: 100%;
  width: 100%;
}
</style>
