<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="500"
    offset-y
  >
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-badge
            bordered
            bottom
            offset-x="18"
            offset-y="15"
            color="primary"
            :icon="`mdi-filter${filterByArt ? '' : '-off'}`"
            overlap
          >
            <v-btn
              class="mx-1"
              fab
              small
              elevation="1"
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              <v-icon> mdi-book </v-icon>
            </v-btn>
          </v-badge>
        </template>
        <span>Erhebungsart auswählen</span>
      </v-tooltip>
    </template>
  </v-menu>
</template>
<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Vue } from 'vue-property-decorator';
import { legendMod } from '@/store/modules/legend';
import { messageHandler } from '@/store/modules/message';

@Component({
  name: 'ErhebungsArt',
  components: {}
})
export default class ErhebungsArt extends Vue {
  menu = false;
  LM = legendMod;

  get filterByArt() {
    return this.LM.filterByArt;
  }
}
</script>