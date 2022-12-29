<template>
  <v-card class="elevation-2 audio-card">
    <template
      v-if="
        antwortenAudio.length > 0 ||
        aufgabeSingleOrt.length > 0 ||
        aufgabenLoading
      "
    >
      <v-card-title fixed style="font-size: 18px">
        <DataSwitch
          :ortName="selectedOrt.ortName.split(',')[0]"
          :data="selectedOrt.data[selectedDataidx]"
          :sideways="showDataSideways"
          :singleData="selectedOrt.data.length === 1"
          :type="
            aufgabeSingleOrt.length > 0
              ? getType(aufgabeSingleOrt[0].audiofile)
              : false
          "
          v-on:callChange="switchData"
        />
      </v-card-title>
    </template>
    <template v-else>
      <v-card-title>
        Keine Aufnahmen verfügbar für
        {{ selectedOrt.ortName.split(',')[0] }}
        <v-spacer></v-spacer>
      </v-card-title>
    </template>
    <template v-if="aufgabenLoading">
      <v-skeleton-loader min-width="500" type="article, actions">
      </v-skeleton-loader>
    </template>
    <template v-else>
      <v-card-text>
        <v-expansion-panels focusable>
          <v-expansion-panel v-for="(d, idx) in aufgabeSingleOrt" :key="idx">
            <v-expansion-panel-header>
              <div>
                {{ d.gruppeBez }} - Team: {{ d.teamBez }} - Typ:
                {{ getType(d.audiofile) ? 'Standard' : 'Dialekt' }}
              </div>
            </v-expansion-panel-header>

            <v-expansion-panel-content eager>
              <figure>
                <figcaption>Aufnahme anhören:</figcaption>
                <AudioPlayer
                  class="mx-10"
                  :dateipfad="d.dateipfad"
                  :audiofile="d.audiofile"
                  :data="d.data"
                />
              </figure>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-for="(d, idx) in antwortenAudio" :key="idx">
            <v-expansion-panel-header>
              {{ d.gruppeBez }} - Team: {{ d.teamBez }} - Typ:
              {{ getType(d.audiofile) ? 'Standard' : 'Dialekt' }} - Sigle:
              {{ d.sigle }}
              <template>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      @click.native.stop="
                        evaluateData(d, idx, selectedOrt?.ortName.split(',')[0])
                      "
                      v-bind="attrs"
                      v-on="on"
                      class="header"
                    >
                      <v-icon>mdi-chart-bar</v-icon>
                    </v-btn>
                  </template>
                  <span> Variation auswerten</span>
                </v-tooltip>
              </template>
              <template v-slot:actions>
                <v-icon class="icon">$expand</v-icon>
              </template>
            </v-expansion-panel-header>

            <v-expansion-panel-content eager>
              <figure>
                <figcaption>Aufnahme anhören:</figcaption>
                <AudioPlayer
                  class="mx-10"
                  :dateipfad="d.dateipfad"
                  :audiofile="d.audiofile"
                  :data="d.res[0].data"
                />
              </figure>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-card-actions>
        <action-buttons
          v-on:hideCard="$emit('hideCard', dataId)"
          v-on:moveCard="$emit('moveCard', $event)"
          v-on:pinCard="pinCard($event, !pinned)"
          :pinned="pinned"
          :showPin="true"
          color="indigo"
        />
      </v-card-actions>
    </template>
  </v-card>
</template>
<script lang="ts">
import {
  circleData, Description, SearchItems
} from '../static/apiModels';
import { loadData } from '@/helpers/helper';
import { Component, Vue, Prop } from 'vue-property-decorator';
import DataSwitch from './DataSwitch.vue';
import AudioPlayer from './AudioPlayer.vue';
import ActionButtons from './ActionButtons.vue';
import { isAufgabeStandard } from '@/helpers/helper';
import { aufgabenModule } from '@/store/modules/aufgaben';
import { legendMod } from '@/store/modules/legend';
import { antwortenDto, AntwortTokenStamp, AufgabeStamp, selectionObject } from '@/api/dioe-public-api';


@Component({
  components: { DataSwitch, AudioPlayer, ActionButtons },
  name: 'AudioCard'
})
export default class DragableCard extends Vue {
  @Prop() readonly selectedOrt!: circleData;
  @Prop() readonly antwortenAudio!: AntwortTokenStamp[];
  @Prop() readonly aufgabeSingleOrt!: AufgabeStamp[];

  @Prop(String) readonly dataId!: string;
  @Prop(Boolean) readonly showDataSideways!: boolean;
  @Prop(Boolean) showAudio!: boolean;
  @Prop(Boolean) readonly pinned!: boolean;

  selectedDataidx: number = 0;

  AM = aufgabenModule;
  LM = legendMod;

  get antVariation() {
    return this.AM.antVariation;
  }

  get aufgabenLoading() {
    return this.AM.loading && (this.antwortenAudio.length === 0 && this.aufgabeSingleOrt.length === 0);
  }

  get ageRange() {
    return legendMod.ageRange;
  }

  getType(val: string | null): boolean {
    return val ? isAufgabeStandard(val) : false;
  }

  pinCard(event: any, pinData: boolean) {
    this.LM.editPinnedShowById({ dataId: this.dataId, show: true, pinned: pinData });
  }

  switchData(dir: boolean) {
    if (this.selectedOrt) {
      // increment the index
      if (dir) {
        this.selectedDataidx = this.selectedDataidx === this.selectedOrt.data.length - 1 ? 0 : this.selectedDataidx + 1;
        // decrease the index
      } else {
        this.selectedDataidx = this.selectedDataidx === 0 ? this.selectedOrt.data.length - 1 : this.selectedDataidx - 1;
      }
      const d = this.selectedOrt.data[this.selectedDataidx];
      loadData(d, this.selectedOrt.osm, d.t, this.ageRange);
    }
  }

  async evaluateData(d: AntwortTokenStamp, idx: number, ort: string | undefined) {
    this.AM.setDiagramTitle(`Auswertung für sigle ${d.sigle} in ${ort ? ort : ''}`);
    let res: Array<Description> = [];
    if (this.selectedOrt) {
      const currEle = this.selectedOrt?.data[this.selectedDataidx];
      const val = d.res[0].data.length;
      let data = this.selectedOrt.data.filter(el => el.id !== currEle.id);
      let dto: Array<antwortenDto> = [];
      for (const key of data) {
        let ids = [] as number[];
        if (key.t !== SearchItems.Query) {
          continue;
        }
        if (key.id !== "") {
          ids = [Number(key.id)];
        }
        let token = [] as selectionObject[];
        let lemma = [] as selectionObject[];
        let max = this.ageRange.upper;
        let min = this.ageRange.lower;
        const p = key.para;
        if (p) {
          max = Math.max(p.ageRange[1], max);
          min = Math.min(p.ageRange[0], min > -1 ? min : p.ageRange[0]);
          token = p.textTokenList ? p.textTokenList : [];
          lemma = p.lemmaList ? p.lemmaList : [];
          ids = p.tagList && p.tagList.length > 0 ? p.tagList[0].tagIds : [-1];
        }
        dto.push({
          ids: ids,
          paraid: key.id,
          osmId: this.selectedOrt.osm,
          ageLower: min,
          ageUpper: max,
          text: token,
          ausbildung: p?.maxEducation,
          beruf_id: p?.education,
          weiblich: p?.gender !== undefined ? p.gender : undefined,
          project: p?.project ? p.project : undefined,
          erhArt: legendMod.erhArtFilter,
          lemma: lemma
        });
      }
      await this.AM.fetchAntwortVariation(dto);
      const variation = this.antVariation;
      const person = variation.find((el: any) => el.sigle === d.sigle);
      res.push({
        color: currEle.c,
        name: currEle.name,
        value: val
      })
      person?.res.forEach((el: any) => {
        console.log(el);
        const d = data.find(e => e.id === el.id);
        res.push({
          color: d ? d.c : '#000',
          name: d ? d.name : '',
          value: el.data.length
        })

      })
    }
    this.AM.setDiagramData(res);
  }
}
</script>
<style lang="scss" scoped>
  html {
    overflow: hidden !important;
  }

  .audio-card {
    height: 100%;
  }

  .v-card {
    display: flex !important;
    flex-direction: column;
  }

  .v-card__text {
    flex-grow: 1;
    overflow: auto;
  }
</style>