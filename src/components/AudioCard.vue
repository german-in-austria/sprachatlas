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
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            @click.native.stop="
              evaluateDataForLocation(data.selectedOrt?.ortName.split(',')[0])
            "
            v-bind="attrs"
            v-on="on"
            class="header"
          >
            <v-icon>mdi-chart-bar</v-icon>
          </v-btn>
        </template>
        <span> Variation für Ort auswerten</span>
      </v-tooltip>
    </v-card-title>
    <template v-if="aufgabenLoading">
      <v-skeleton-loader min-width="500" type="article, actions">
      </v-skeleton-loader>
    </template>
    <template v-else>
      <v-card-text>
        <v-expansion-panels focusable>
          <v-expansion-panel
            v-for="(d, idx) in arrangeBySigle(data.aufgabeAudio)"
            :key="idx"
          >
            <v-expansion-panel-header>
              <div>
                {{ d.gruppeBez }} - Team: {{ d.teamBez }} - Sigle:
                {{ d.sigle }} - Alter: {{ d.age }}
              </div>
            </v-expansion-panel-header>

            <v-expansion-panel-content eager>
              <figure>
                <AudioPlayer
                  class="mx-10"
                  :dateipfad="d.data[aufgIdx].dateipfad"
                  :audiofile="d.data[aufgIdx].audiofile"
                  :data="d.data[aufgIdx].data"
                />
                <div align="center">
                  <template v-if="d.data.length > 1">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="indigo"
                          :disabled="aufgIdx === 0"
                          @click="aufgIdx--"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                      </template>
                      <span> Expermimentdurchgang wechseln </span>
                    </v-tooltip>
                    <template v-if="getType(d.data[aufgIdx].audiofile) !== ''">
                      Typ:
                      {{ getType(d.data[aufgIdx].audiofile) }}
                    </template>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="indigo"
                          :disabled="aufgIdx + 1 === d.data.length"
                          @click="aufgIdx++"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-arrow-right</v-icon>
                        </v-btn>
                      </template>
                      <span> Expermimentdurchgang wechseln </span>
                    </v-tooltip>
                  </template>
                </div>
              </figure>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel
            v-for="(d, idx) in arrangeBySigle(data.antwortAudio)"
            :key="idx"
          >
            <v-expansion-panel-header>
              {{ d.gruppeBez }} - Team: {{ d.teamBez }} - Sigle: {{ d.sigle }} -
              Alter: {{ d.age }}
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    @click.native.stop="
                      evaluateData(
                        data.selectedOrt?.ortName.split(',')[0],
                        d.sigle,
                        d
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
            </v-expansion-panel-header>
            <v-expansion-panel-content eager>
              <figure>
                <AudioPlayer
                  class="mx-10"
                  :dateipfad="d.data[antIdx].dateipfad"
                  :audiofile="d.data[antIdx].audiofile"
                  :data="audioData(d)"
                />
                <div align="center">
                  <template v-if="d.data.length > 1">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="indigo"
                          :disabled="antIdx === 0"
                          @click="antIdx--"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                      </template>
                      <span> Expermimentdurchgang wechseln </span>
                    </v-tooltip>
                    <template v-if="getType(d.data[antIdx].audiofile) !== ''">
                      Typ:
                      {{ getType(d.data[antIdx].audiofile) }}
                    </template>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="indigo"
                          :disabled="antIdx + 1 === d.data.length"
                          @click="antIdx++"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-arrow-right</v-icon>
                        </v-btn>
                      </template>
                      <span> Expermimentdurchgang wechseln </span>
                    </v-tooltip>
                  </template>
                </div>
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
          v-on:removeElement="removeElement()"
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
  circleData,
  Description,
  LegendGlobal,
  Parameter,
  pinData,
  SearchItems,
  sigleAntwort
} from '../static/apiModels';
import { arrangeBySigle, loadData } from '@/helpers/helper';
import { Component, Vue, Prop } from 'vue-property-decorator';
import DataSwitch from './DataSwitch.vue';
import AudioPlayer from './AudioPlayer.vue';
import ActionButtons from './ActionButtons.vue';
import { isAufgabeStandard } from '@/helpers/helper';
import { aufgabenModule } from '@/store/modules/aufgaben';
import { legendMod } from '@/store/modules/legend';
import { convertHslToStr } from '@/helpers/helper';

import {
  Antwort,
  antwortenDto,
  AntwortToken,
  AntwortTokenStamp,
  AufgabeStamp,
  selectionObject
} from '@/api/dioe-public-api';
import { isArray } from 'lodash';

@Component({
  components: { DataSwitch, AudioPlayer, ActionButtons },
  name: 'AudioCard'
})
export default class DragableCard extends Vue {
  @Prop() readonly data!: pinData;

  @Prop(Boolean) readonly showDataSideways!: boolean;

  aufgIdx: number = 0;
  antIdx: number = 0;

  AM = aufgabenModule;
  LM = legendMod;

  get antVariation() {
    return this.AM.antVariation;
  }

  get aufgabenLoading() {
    return (
      this.AM.loading &&
      this.data.antwortAudio.length === 0 &&
      this.data.aufgabeAudio.length === 0
    );
  }

  get ageRange() {
    return legendMod.ageRange;
  }

  audioData(d: sigleAntwort) {
    return d.data[this.antIdx].data[0];
  }

  arrangeBySigle(data: AntwortTokenStamp[] | AufgabeStamp[]): sigleAntwort[] {
    return arrangeBySigle(data);
  }

  getType(val: string | null): string {
    if (!val) return '';
    return isAufgabeStandard(val);
  }

  pinCard(event: any, pinData: boolean) {
    this.LM.editPinnedShowById({
      dataId: this.data.id,
      show: true,
      pinned: pinData
    });
  }

  removeElement() {
    this.LM.removeElementFromPinDataById(this.data.id);
  }

  switchData(dir: boolean) {
    if (this.data.selectedOrt) {
      // increment the index
      let idx;
      if (dir) {
        idx =
          this.data.selectedDataIdx === this.data.selectedOrt.data.length - 1
            ? 0
            : this.data.selectedDataIdx + 1;
        // decrease the index
      } else {
        idx =
          this.data.selectedDataIdx === 0
            ? this.data.selectedOrt.data.length - 1
            : this.data.selectedDataIdx - 1;
      }
      let data = this.LM.pinnedData.filter((el) => el.id === this.data.id)[0];
      data.selectedDataIdx = idx;
      this.LM.editPinnedByID(data);
      const d = data.selectedOrt.data[this.data.selectedDataIdx];
      loadData(d, data.selectedOrt.osm, d.t, this.ageRange).then(() => {
        switch (d.t) {
          case SearchItems.Phaen:
          case SearchItems.Query:
          case SearchItems.Tag:
            data.antwortAudio = this.AM.antwortenAudio;
            break;
          case SearchItems.Aufgaben:
            data.aufgabeAudio = this.AM.aufgabeSingleOrt;
            break;
        }
        console.log(data.aufgabeAudio);
        this.LM.editPinnedByID(data);
      });
    }
  }

  async evaluateDataForLocation(ort: string | undefined) {
    const title = `Auswertung für ${ort ? ort : ''}`;
    this.AM.setDiagramTitle(`Auswertung für ${ort ? ort : ''}`);
    console.log(this.data);
    let curr = await this.LM.pushNewPinDataVar({
      diagramTitle: title,
      isPinned: false,
      isShown: true,
      diagramData: []
    });
    let res: Array<Description> = [];
    const currEle = this.data.selectedOrt?.data[this.data.selectedDataIdx];
    if (this.data.antwortAudio.length > 0) {
      this.data.antwortAudio.forEach((el) => {
        const val = el.res.reduce((prev, curr) => {
          return prev + curr.data.length;
        }, 0);
        const idx = res.findIndex((e) => e.sigle === el.sigle);
        if (idx < 0) {
          res.push({
            age: el.age,
            sigle: el.sigle,
            group: el?.gruppeBez ? el.gruppeBez : '',
            value: val,
            color: currEle.c,
            name: currEle.name
          });
        } else {
          res[idx].value += val;
        }
      });
    }

    if (this.data.aufgabeAudio.length > 0) {
      this.data.aufgabeAudio.forEach((el) => {
        const val = el.data.length;
        const idx = res.findIndex((e) => e.sigle === el.sigle);
        if (idx < 0) {
          res.push({
            age: el.age,
            sigle: el.sigle,
            group: el?.gruppeBez ? el.gruppeBez : '',
            value: val,
            color: currEle.c,
            name: currEle.name
          });
        } else {
          res[idx].value += val;
        }
      });
    }
    if (this.data.selectedOrt) {
      let data = this.data.selectedOrt.data.filter(
        (el) => el.id !== currEle.id
      );
      let dto: Array<antwortenDto> = [];
      for (const key of data) {
        let ids = [] as number[];
        if (key.t !== SearchItems.Query) {
          continue;
        }
        if (key.id !== '') {
          ids = [Number(key.id)];
        }
        let token = [] as selectionObject[];
        let lemma = [] as selectionObject[];
        let max = this.ageRange.upper;
        let min = this.ageRange.lower;
        const p = key.para;
        let group = false;
        if (p) {
          token = p.textTokenList ? p.textTokenList : [];
          lemma = p.lemmaList ? p.lemmaList : [];
          ids = p.tagList && p.tagList.length > 0 ? p.tagList[0].tagIds : [-1];
          group = ids.length > 0;
        }
        dto.push({
          ids: ids,
          paraid: key.id,
          osmId: this.data.selectedOrt.osm,
          ageLower: min,
          ageUpper: max,
          text: token,
          ausbildung: p?.maxEducation ? p.maxEducation : undefined,
          beruf_id: p?.education != undefined ? p.education : undefined,
          weiblich: p?.gender !== undefined ? p.gender : undefined,
          project: p?.project ? p.project : undefined,
          erhArt: legendMod.erhArtFilter,
          lemma: lemma,
          group: group
        });
      }
      await this.AM.fetchAntwortVariation(dto);
      const variation = this.antVariation;
      variation.forEach((element) => {
        element.res.forEach((ele) => {
          const id = ele.id;
          const legend = this.data.selectedOrt.data.find(
            (dataElement) => dataElement.id === id
          );

          const legName = legend?.name;
          const idx = res.findIndex(
            (e) => e.sigle === element.sigle && e.name === legName
          );
          if (idx < 0 && legend) {
            res.push({
              age: element.age,
              sigle: element.sigle,
              group: element?.gruppeBez ? element.gruppeBez : '',
              value: ele.data.length,
              color: legend.c,
              name: legend.name
            });
          } else {
            res[idx].value += ele.data.length;
          }
        });
      });
    }
    curr.diagramData = res;
    this.LM.editPinnDataVar(curr);
    this.AM.setDiagramData(res);
  }
  /*
  async fetchVariationData() {
    let res: Array<Description> = [];
      const currEle = this.data.selectedOrt?.data[this.data.selectedDataIdx];
      const val = d.data.reduce((acc, curr) => {
        const data = curr.data[0];
        if (isArray(data)) {
          return acc + data.length;
        }
        return acc + curr.data.length;
      }, 0);
      let data = this.data.selectedOrt.data.filter(
        (el) => el.id !== currEle.id
      );
      let dto: Array<antwortenDto> = [];
      for (const key of data) {
        let ids = [] as number[];
        if (key.t !== SearchItems.Query) {
          continue;
        }
        if (key.id !== '') {
          ids = [Number(key.id)];
        }
        let token = [] as selectionObject[];
        let lemma = [] as selectionObject[];
        let max = this.ageRange.upper;
        let min = this.ageRange.lower;
        const p = key.para;
        let group = false;
        if (p) {
          max = Math.max(p.ageRange[1], max);
          min = Math.min(p.ageRange[0], min > -1 ? min : p.ageRange[0]);
          token = p.textTokenList ? p.textTokenList : [];
          lemma = p.lemmaList ? p.lemmaList : [];
          ids = p.tagList && p.tagList.length > 0 ? p.tagList[0].tagIds : [-1];
          group = ids.length > 0;
        }
        dto.push({
          ids: ids,
          paraid: key.id,
          osmId: this.data.selectedOrt.osm,
          ageLower: d.age,
          ageUpper: d.age,
          text: token,
          ausbildung: p?.maxEducation ? p.maxEducation : undefined,
          beruf_id: p?.education != undefined ? p.education : undefined,
          weiblich: p?.gender !== undefined ? p.gender : undefined,
          project: p?.project ? p.project : undefined,
          erhArt: legendMod.erhArtFilter,
          lemma: lemma,
          group: group
        });
      }
      await this.AM.fetchAntwortVariation(dto);
      const variation = this.antVariation;
      const person = variation.find((el: any) => el.sigle === sigle);
      res.push({
        color: currEle.c,
        name: currEle.name,
        value: val,
        age: person?.age ? person.age : 0,
        sigle: person?.sigle ? person.sigle : '',
        group: person?.gruppeBez ? person.gruppeBez : ''
      });
      person?.res.forEach((el: any) => {
        const d = data.find((e) => e.id === el.id);
        res.push({
          color: d ? d.c : '#000',
          name: d ? d.name : '',
          value: el.data.length,
          age: person?.age ? person.age : 0,
          sigle: person?.sigle ? person.sigle : '',
          group: person?.gruppeBez ? person.gruppeBez : ''
        });
      });
      return res;
  }*/

  async evaluateData(ort: string | undefined, sigle: string, d: sigleAntwort) {
    this.data.antwortAudio.forEach((el) => {
      console.log(el.sigle);
      el.res.forEach((data) => {
        console.log(data.data.forEach((element) => console.log(element.tagId)));
      });
    });
    const title = `Auswertung für sigle ${sigle} in ${ort ? ort : ''}`;
    this.AM.setDiagramTitle(
      `Auswertung für sigle ${sigle} in ${ort ? ort : ''}`
    );
    let curr = await this.LM.pushNewPinDataVar({
      diagramTitle: title,
      isPinned: false,
      isShown: true,
      diagramData: []
    });
    let res: Array<Description> = [];
    if (this.data.selectedOrt) {
      const currEle = this.data.selectedOrt?.data[this.data.selectedDataIdx];
      const val = d.data.reduce((acc, curr) => {
        const data = curr.data[0];
        if (isArray(data)) {
          return acc + data.length;
        }
        return acc + curr.data.length;
      }, 0);
      let data = this.data.selectedOrt.data.filter(
        (el) => el.id !== currEle.id
      );
      let dto: Array<antwortenDto> = [];
      for (const key of data) {
        let ids = [] as number[];
        if (key.t !== SearchItems.Query) {
          continue;
        }
        if (key.id !== '') {
          ids = [Number(key.id)];
        }
        let token = [] as selectionObject[];
        let lemma = [] as selectionObject[];
        let max = this.ageRange.upper;
        let min = this.ageRange.lower;
        const p = key.para;
        let group = false;
        if (p) {
          max = Math.max(p.ageRange[1], max);
          min = Math.min(p.ageRange[0], min > -1 ? min : p.ageRange[0]);
          token = p.textTokenList ? p.textTokenList : [];
          lemma = p.lemmaList ? p.lemmaList : [];
          ids = p.tagList && p.tagList.length > 0 ? p.tagList[0].tagIds : [-1];
          group = ids.length > 0;
        }
        dto.push({
          ids: ids,
          paraid: key.id,
          osmId: this.data.selectedOrt.osm,
          ageLower: d.age,
          ageUpper: d.age,
          text: token,
          ausbildung: p?.maxEducation ? p.maxEducation : undefined,
          beruf_id: p?.education != undefined ? p.education : undefined,
          weiblich: p?.gender !== undefined ? p.gender : undefined,
          project: p?.project ? p.project : undefined,
          erhArt: legendMod.erhArtFilter,
          lemma: lemma,
          group: group
        });
      }
      await this.AM.fetchAntwortVariation(dto);
      const variation = this.antVariation;
      const person = variation.find((el: any) => el.sigle === sigle);
      res.push({
        color: currEle.c,
        name: currEle.name,
        value: val,
        age: person?.age ? person.age : 0,
        sigle: person?.sigle ? person.sigle : '',
        group: person?.gruppeBez ? person.gruppeBez : ''
      });
      person?.res.forEach((el: any) => {
        const d = data.find((e) => e.id === el.id);
        res.push({
          color: d ? d.c : '#000',
          name: d ? d.name : '',
          value: el.data.length,
          age: person?.age ? person.age : 0,
          sigle: person?.sigle ? person.sigle : '',
          group: person?.gruppeBez ? person.gruppeBez : ''
        });
      });
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
