<template>
  <v-menu :close-on-content-click="false" :nudge-width="800" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn elevation="1" class="mx-5" fab small v-bind="attrs" v-on="on">
        <v-icon> {{ icon }} </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-tabs background-color="indigo" dark grow v-model="optionTab">
        <v-tab>Weitere Optionen </v-tab>
        <v-tab>Aufgabensets</v-tab>
        <v-tab>Aufgaben</v-tab>
      </v-tabs>
      <v-tabs-items v-model="optionTab">
        <v-tab-item>
          <v-card>
            <v-card-title>Weitere Optionen</v-card-title>
            <v-divider></v-divider>
            <v-container class="ma-0 pa-0">
              <v-row class="mb-12" no-gutters>
                <v-col>
                  <v-list flat>
                    <v-list-item-group color="indigo">
                      <v-list-item
                        v-for="(d, index) in filterOptionMenu"
                        :key="index"
                        link
                        @click="openFilter(d.type)"
                      >
                        <v-list-item-title>
                          {{ d.name }}
                        </v-list-item-title>
                        <v-icon> mdi-chevron-right </v-icon>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-col>
                <v-col>
                  <v-list max-height="300px" class="overflow-y-auto">
                    <v-list-item-group
                      v-if="filterMenuValue.length > 0"
                      v-model="phaenSelection"
                      color="indigo"
                      multiple
                    >
                      <div v-for="(val, i) in filterMenuValue" :key="i">
                        <v-list-item>
                          {{ val.content[val.name] }}
                        </v-list-item>
                        <v-divider></v-divider>
                      </div>
                    </v-list-item-group>
                  </v-list>
                </v-col>
              </v-row>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                small
                @click="searchAufgabeByPhaen()"
                v-if="
                  filterMenuValue.length > 0 &&
                  filterMenuValue[0].type === 2 &&
                  phaenSelection.length > 0
                "
              >
                Nach Aufgabensets suchen
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card :loading="aufgabenLoading">
            <v-card-title>Aufgabensets</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container class="ma-0 pa-0">
                <v-row class="mb-12" no-gutters>
                  <v-col>
                    <template v-if="asetPhaen.length > 0">
                      <v-list flat>
                        <v-list-item-group
                          v-model="asetSelection"
                          multiple
                          color="indigo"
                        >
                          <v-list-item
                            v-for="(d, i) in asetPhaen.filter(
                              (el) => el.id !== -1
                            )"
                            :key="i"
                          >
                            <v-list-item-title>
                              Name: {{ d.name }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </template>
                    <template v-else> Keine Aufgabensets vorhanden! </template>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                v-if="asetPhaen.length > 0"
                @click="displayOnMap()"
                :disabled="!(asetSelection.length > 0)"
              >
                Aufgabenset auf der Karte anzeigen
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-card-title>Aufgaben</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container class="ma-0 pa-0">
                <v-row class="mb-12" no-gutters>
                  <v-col>
                    <template v-if="asetPhaen.length > 0">
                      <v-list max-height="300px" class="overflow-y-auto">
                        <v-list-item-group
                          v-model="aufgabenSelection"
                          multiple
                          color="indigo"
                        >
                          <v-list-item
                            v-for="(d, i) in asetPhaen.filter(
                              (el) => el.id === -1
                            )[0].aufgaben"
                            :key="i"
                          >
                            <v-list-item-title>
                              Aufgabenstellung:
                              {{ d.aufgabenstellung }} <br />
                              Beschreibung:
                              {{ d.beschreibung }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </template>
                    <template v-else> Keine Aufgaben vorhanden! </template>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                v-if="asetPhaen.length > 0"
                @click="displayAufgabeOnMap()"
                :disabled="!(aufgabenSelection.length > 0)"
              >
                Ausgewählte Aufgaben auf der Karte anzeigen
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-menu>
</template>
<script lang="ts">
import { Aset, TagTree } from '@/api/dioe-public-api';
import { SearchItems } from '@/static/apiModels';
import { aufgabenModule } from '@/store/modules/aufgaben';
import { phaeModule } from '@/store/modules/phaenomene';
import { Component, PropSync, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  components: {},
  name: 'PhaenAufgabenSearch'
})
export default class PhaenAufgabenSearch extends Vue {
  @Prop(String) readonly icon!: string;
  @Prop() readonly tagListFlat!: TagTree[];

  PM = phaeModule;
  AM = aufgabenModule;
  optionTab = 0;

  filterMenuValue: Array<{ type: SearchItems; content: any; name: string }> = [];
  phaenSelection = [];
  asetSelection = [];
  aufgabenSelection = [];

  filterOptionMenu = [
    { name: 'Phänomene', type: SearchItems.Phaen },
    { name: 'Tags', type: SearchItems.Tag }
  ];


  get phaen() {
    return this.PM.phaen;
  }

  get asetPhaen() {
    return this.PM.phaenAufgaben;
  }

  get aufgabenLoading() {
    return this.AM.loading;
  }

  changeFilterMenuValue(type: SearchItems, content: Array<any>, name: string) {
    this.filterMenuValue = [];
    content.forEach((e) => {
      this.filterMenuValue.push({ content: e, type: type, name: name });
    });
  }

  async searchAufgabeByPhaen() {
    this.optionTab = 1;
    const elements = this.phaenSelection.map((x) => this.filterMenuValue[x]);
    const cont = [] as number[];
    for (const ele of elements) {
      const e = ele.content as Aset;
      cont.push(e.id);
    }
    await this.PM.fetchAsetByPhaen({ ids: cont });
    // this.AM.fetchAufgabenSet({ ids: cont });
    if (this.asetPhaen.length === 1 && this.asetPhaen[0].id === -1) {
      this.optionTab = 2;
    }
  }

  clearFilterMenu() {
    this.filterMenuValue = [];
  }

  displayAufgabeOnMap() {
    const elements = this.aufgabenSelection.map((x) => this.asetPhaen.filter(el => el.id === -1)[0].aufgaben[x]);
    const cont = [] as number[];
    console.log(this.aufgabenSelection);
    for (const ele of elements) {
      cont.push(ele.id);
    }
    this.$emit('displayAufgabenOnMap', cont);
  }

  displayOnMap() {
    const elements = this.asetSelection.map((x) => this.asetPhaen[x]);
    const cont = [] as number[];
    for (const ele of elements) {
      const e = ele as Aset;
      cont.push(e.id);
    }
    this.$emit('displayAsetOnMap', cont);
  }

  openFilter(type: SearchItems) {
    this.phaenSelection = [];
    switch (type) {
      case SearchItems.Phaen:
        this.changeFilterMenuValue(
          SearchItems.Phaen,
          this.phaen,
          'bezPhaenomen'
        );
        break;
      case SearchItems.Tag:
        this.changeFilterMenuValue(
          SearchItems.Tag,
          this.tagListFlat,
          'tagName'
        );
        break;
    }
  }
}
</script>