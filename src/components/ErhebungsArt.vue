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
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <h3>Nach Erhebungsart filtern</h3>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-divider></v-divider>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-combobox
              v-model="chips"
              :items="items"
              chips
              clearable
              label="Erhebungsarten auswählen"
              multiple
              prepend-icon="mdi-filter-variant"
              solo
            >
              <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip
                  v-bind="attrs"
                  :input-value="selected"
                  close
                  @click="select"
                  @click:close="remove(item)"
                >
                  <strong>{{ item }}</strong
                  >&nbsp;
                  <span>(interest)</span>
                </v-chip>
              </template>
            </v-combobox>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions class="pa-5">
        <v-row class="pa-5">
          <v-btn
            class="mr-10"
            fab
            small
            color="primary"
            @click="changeArtFilter()"
          >
            <template v-if="filterByArt">
              <v-icon>mdi-filter</v-icon>
            </template>
            <template v-else>
              <v-icon>mdi-filter-off</v-icon>
            </template>
          </v-btn>
          <v-btn class="mr-10" fab small color="error" @click="removeArt()"
            ><v-icon>mdi-arrow-u-left-top</v-icon></v-btn
          >
          <v-btn fab small color="success" @click="applyAge()"
            ><v-icon>mdi-check</v-icon></v-btn
          >
        </v-row>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Vue } from 'vue-property-decorator';
import { legendMod } from '@/store/modules/legend';
import { erhebungModule } from '@/store/modules/erhebungen';
import { messageHandler } from '@/store/modules/message';

@Component({
  name: 'ErhebungsArt',
  components: {}
})
export default class ErhebungsArt extends Vue {
  menu = false;
  LM = legendMod;
  MM = messageHandler;
  erhArt: number[] = [];

  get filterByArt() {
    return this.LM.filterByArt;
  }

  get erhArten() {
    return erhebungModule.erhebungsarten;
  }

  changeArtFilter() {
    this.LM.setFilterByArt(!this.filterByArt);
    if (this.filterByArt) {
      this.MM.setSuccessMsg({
        message: 'Daten werden nach Erhebungsart gefiltert',
        icon: 'mdi-info'
      });
    } else {
      this.MM.setSuccessMsg({
        message: 'Daten werden nicht nach Erhebungsart gefiltert',
        icon: 'mdi-info'
      });
    }
  }

  removeArt() {
    this.LM.setFilterByArt(false);
    this.MM.setSuccessMsg({
      message: 'Filter wurde entfernt',
      icon: 'mdi-info'
    });
  }

  applyFilter() {
    this.LM.setErhArtFilter(this.erhArt);
  }

  mounted() {
    if (!this.erhArt || this.erhArt.length === 0)
      erhebungModule.fetchErhebungsArten();
  }
}
</script>