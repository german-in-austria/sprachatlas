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
                      <template v-for="(d, index) in filterOptionMenu">
                        <v-list-item
                          link
                          :key="index"
                          @click="openFilter(d.type)"
                        >
                          <v-list-item-title>
                            {{ d.name }}
                          </v-list-item-title>
                          <v-icon> mdi-chevron-right </v-icon>
                        </v-list-item>
                      </template>
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
                      <template v-for="(val, i) in filterMenuValue">
                        <div :key="i">
                          <v-list-item>
                            {{ val.content[val.name] }}
                          </v-list-item>
                          <v-divider></v-divider>
                        </div>
                      </template>
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
            <v-container class="ma-0 pa-0">
              <v-row class="mb-12" no-gutters>
                <v-col>
                  <v-list flat>
                    <v-list-item-group color="indigo">
                      <template v-for="(d, i) in asetPhaen">
                        <v-list-item link :key="i" @click="openFilter(d.type)">
                          <v-list-item-title>
                            Name: {{ d.name }} Fokus:
                            {{ d.fokus }}
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                    </v-list-item-group>
                  </v-list>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card>
            <v-card-title>Aufgaben</v-card-title>
            <v-divider></v-divider>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-menu>
</template>
<script lang="ts">
import { TagTree } from '@/api/dioe-public-api';
import { Phaen, SearchItems } from '@/static/apiModels';
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
      const e = ele.content as Phaen;
      cont.push(e.id);
    }
    await this.PM.fetchAsetByPhaen({ ids: cont });
    // this.AM.fetchAufgabenSet({ ids: cont });
    console.log(this.asetPhaen);
  }

  clearFilterMenu() {
    this.filterMenuValue = [];
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