<template>
  <v-card class="elevation-2 audio-card">
    <v-card-title fixed style="font-size: 18px">
      <template
        v-if="
          data.antwortAudio.length > 0 ||
          data.aufgabeAudio.length > 0 ||
          aufgabenLoading
        "
      >
        <DataSwitch
          :ortName="data.selectedOrt.ortName.split(',')[0]"
          :data="data.selectedOrt.data[data.selectedDataIdx]"
          :sideways="showDataSideways"
          :singleData="data.selectedOrt.data.length === 1"
          :typeItem="
            data.aufgabeAudio.length > 0
              ? getType(data.aufgabeAudio[0].audiofile)
              : false
          "
          v-on:callChange="switchData"
        />
      </template>
      <template v-else>
        Keine Aufnahmen verfügbar für
        {{ data.selectedOrt.ortName.split(',')[0] }}
      </template>
    </v-card-title>
    <template v-if="aufgabenLoading">
      <v-skeleton-loader min-width="500" type="article, actions">
      </v-skeleton-loader>
    </template>
    <template v-else>
      <v-card-text>
        <v-expansion-panels focusable>
          <v-expansion-panel v-for="(d, idx) in data.aufgabeAudio" :key="idx">
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
          <v-expansion-panel v-for="(d, idx) in data.antwortAudio" :key="idx">
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
                        evaluateData(
                          d,
                          idx,
                          data.selectedOrt?.ortName.split(',')[0]
                        )
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
          v-on:hideCard="$emit('hideCard', data.id)"
          v-on:moveCard="$emit('moveCard', $event)"
          v-on:pinCard="pinCard($event, !data.isPinned)"
          :pinned="data.isPinned"
          :showPin="true"
          color="indigo"
        />
      </v-card-actions>
    </template>
  </v-card>
</template>
<script lang="ts">
import {
  circleData, Description, pinData, SearchItems
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
  @Prop() readonly data!: pinData;

  @Prop(Boolean) readonly showDataSideways!: boolean;


  AM = aufgabenModule;
  LM = legendMod;

  get antVariation() {
    return this.AM.antVariation;
  }

  get aufgabenLoading() {

    return this.AM.loading && (this.data.antwortAudio.length === 0 && this.data.aufgabeAudio.length === 0);
  }

  get ageRange() {
    return legendMod.ageRange;
  }

  getType(val: string | null): boolean {
    return val ? isAufgabeStandard(val) : false;
  }

  pinCard(event: any, pinData: boolean) {
    this.LM.editPinnedShowById({ dataId: this.data.id, show: true, pinned: pinData });
  }

  switchData(dir: boolean) {
    if (this.data.selectedOrt) {
      // increment the index
      let idx;
      if (dir) {
        idx = this.data.selectedDataIdx === this.data.selectedOrt.data.length - 1 ? 0 : this.data.selectedDataIdx + 1;
        // decrease the index
      } else {
        idx = this.data.selectedDataIdx === 0 ? this.data.selectedOrt.data.length - 1 : this.data.selectedDataIdx - 1;
      }
      let data = this.LM.pinnedData.filter(el => el.id === this.data.id)[0];
      data.selectedDataIdx = idx;
      this.LM.editPinnedByID(data);
      const d = data.selectedOrt.data[this.data.selectedDataIdx];
      console.log(d);
      loadData(d, data.selectedOrt.osm, d.t, this.ageRange).then(() => {
        switch (d.t) {
          case SearchItems.Phaen:
          case SearchItems.Query:
          case SearchItems.Tag:
            data.antwortAudio = this.data.antwortAudio;
            break;
          case SearchItems.Aufgaben:
            data.aufgabeAudio = this.data.aufgabeAudio;
            break;
        }
        this.LM.editPinnedByID(data);
      });
    }
  }

  async evaluateData(d: AntwortTokenStamp, idx: number, ort: string | undefined) {
    const title = `Auswertung für sigle ${d.sigle} in ${ort ? ort : ''}`;
    this.AM.setDiagramTitle(`Auswertung für sigle ${d.sigle} in ${ort ? ort : ''}`);
    let curr = await this.LM.pushNewPinDataVar({ diagramTitle: title, isPinned: false, isShown: true, diagramData: [] });
    let res: Array<Description> = [];
    if (this.data.selectedOrt) {
      const currEle = this.data.selectedOrt?.data[this.data.selectedDataIdx];
      const val = d.res[0].data.length;
      let data = this.data.selectedOrt.data.filter(el => el.id !== currEle.id);
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
          osmId: this.data.selectedOrt.osm,
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
    curr.diagramData = res;
    this.LM.editPinnDataVar(curr);
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