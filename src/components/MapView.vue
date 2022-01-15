<template>
  <div>
    <v-layout>
      <v-card
        outlined
        elevation="2"
        class="search-overlay justify-center rounded-lg"
      >
        <v-container class="ma-0 pa-5">
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                ref="searchTermAutoComplete"
                v-model="searchTerm"
                :items="searchTerms"
                :loading="autoCompleteLoading"
                :search-input.sync="searchInput"
                solo
                clearable
                chips
                deletable-chips
                hide-no-data
                label="Suche über alles"
                item-text="name"
                return-object
                @change="submitSearch()"
                @click:clear="closeInfCard()"
              >
                <template v-slot:no-data>
                  <v-list-item v-if="selSearchModel === 1">
                    <v-list-item-title>
                      Suche für alle <strong>Orte</strong>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item v-else-if="selSearchModel === 0">
                    <v-list-item-title>
                      Suche über alle <strong>Tags</strong>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item v-else-if="selSearchModel === 2">
                    <v-list-item-title>
                      Suche für alle <strong>Phänomene</strong>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-else-if="selSearchModel === 4 || selSearchModel === 5"
                  >
                    <v-list-item-title>
                      Suche für alle <strong>Aufgaben</strong> und
                      <strong>Sätze</strong>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item v-else>
                    <v-list-item-title>
                      Suche über alle verfügbaren Daten
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <template v-slot:item="{ item }">
                  <v-list-item-avatar>
                    <template v-if="item.type === 1">
                      <v-icon>mdi-map-marker</v-icon>
                    </template>
                    <template v-else-if="item.type === 0">
                      <v-icon>mdi-tag</v-icon>
                    </template>
                    <template v-else-if="item.type === 2">
                      <v-icon>mdi-pandora</v-icon>
                    </template>
                    <template v-else-if="item.type === 4">
                      <v-icon>mdi-book</v-icon>
                    </template>
                    <template v-else-if="item.type === 5">
                      <v-icon>mdi-draw-pen</v-icon>
                    </template>
                    <template v-else-if="item.type === 6">
                      <v-icon>mdi-tag-multiple</v-icon>
                    </template>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <template v-if="item.type === 0">
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                      <v-list-item-subtitle
                        >{{
                          item.content.tagGene
                        }}.Generation</v-list-item-subtitle
                      >
                    </template>
                    <template v-else-if="item.type === 1">
                      <v-list-item-title
                        v-text="getOrtNameTemplate(item.name).name"
                      ></v-list-item-title>
                      <v-list-item-subtitle>{{
                        item.name
                      }}</v-list-item-subtitle>
                    </template>
                    <template v-else-if="item.type === 4">
                      <v-list-item-title>
                        {{ item.content.Aufgabenstellung }}</v-list-item-title
                      >
                      <v-list-item-subtitle
                        >{{ item.name ? item.name : item.kontext }} -
                        Aufgabenart:
                        {{ item.content.artBezeichnung }}</v-list-item-subtitle
                      >
                    </template>
                    <template v-else-if="item.type === 5">
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                      <v-list-item-subtitle
                        >ipa: {{ item.content.ipa }}</v-list-item-subtitle
                      >
                    </template>
                    <template v-else-if="item.type === 6">
                      <v-list-item-title>{{ item.name }}</v-list-item-title>
                      <v-list-item-subtitle
                        >Presettag:
                        {{ item.content.Kommentar }}</v-list-item-subtitle
                      >
                    </template>
                    <template v-else>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </template>
                  </v-list-item-content>
                  <v-list-item-action>
                    <template v-if="item.type === 1">
                      <v-row>
                        Erhebungen:
                        <v-spacer class="mr-5 mt-5"></v-spacer>
                        <v-chip class="white--text" small color="teal">
                          {{ item.content.erhebungen.length }}</v-chip
                        >
                      </v-row>
                      <v-row>
                        Aufnahmen:
                        <v-spacer class="mr-5 mt-5"></v-spacer>
                        <v-chip class="white--text" small color="teal">
                          {{ item.content.inferhebungen.length }}
                        </v-chip>
                      </v-row>
                    </template>
                  </v-list-item-action>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="2">
              <v-menu
                :close-on-content-click="false"
                :nudge-width="800"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="mx-1" fab small v-bind="attrs" v-on="on">
                    <v-icon> mdi-magnify </v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-tabs
                    background-color="indigo"
                    dark
                    grow
                    v-model="optionTab"
                  >
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
                                  <template
                                    v-for="(d, index) in filterOptionMenu"
                                  >
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
                              <v-list
                                max-height="300px"
                                class="overflow-y-auto"
                              >
                                <v-list-item-group
                                  v-if="filterMenuValue.length > 0"
                                  v-model="phaenSelection"
                                  color="indigo"
                                  multiple
                                >
                                  <template v-for="(val, i) in filterMenuValue">
                                    <v-list-item>
                                      {{ val.content[val.name] }}
                                    </v-list-item>
                                    <v-divider></v-divider>
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
                                  <template v-for="(d, i) in aufgabenSet">
                                    <v-list-item
                                      link
                                      :key="index"
                                      @click="openFilter(d.type)"
                                    >
                                      <v-list-item-title>
                                        Name: {{ d.nameAset }} Fokus:
                                        {{ d.Fokus }}
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
            </v-col>
            <v-col>
              <v-spacer></v-spacer>
            </v-col>
            <v-col v-if="selSearchModel === 0">
              <v-select
                solo
                v-model="selGen"
                :items="generation"
                @change="changeTags()"
                item-text="name"
                item-value="value"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                solo
                v-model="selSearchModel"
                :items="selSearchItem"
                v-on:change="changeSearchTerms()"
                item-text="name"
                item-value="value"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-layout>
    <template>
      <v-navigation-drawer :value="sideBar" permanent right app v-if="sideBar">
        <v-card elevation="0">
          <v-card-title> Karten </v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedTileSet"
              :items="items"
              item-text="name"
              item-value="value"
              label="Tileset auswählen"
            ></v-select>
            <v-checkbox
              v-model="showBundesl"
              hide-details
              label="Bundesländergrenzen einblenden"
            />
            <v-checkbox
              v-model="showGemeinden"
              hide-details
              label="untersuchte Gemeinden"
            />
            <v-checkbox
              v-model="showDiaReg"
              hide-details
              label="Dialektregionen einblenden"
            />
            <v-checkbox
              v-model="showDataSideways"
              hide-details
              @change="displayDataFromLegend(LM.legend)"
              label="Daten nebeneinander anzeigen"
            />
            <v-checkbox
              v-model="showDataProp"
              hide-details
              @change="displayDataFromLegend(LM.legend)"
              label="Daten proportional anzeigen"
            />
          </v-card-text>
        </v-card>
        <v-divider style="clear: both; margin-top: 20px" />
        <v-card elevation="0">
          <v-card-title> Legenden </v-card-title>
          <v-card-text>
            <v-expansion-panels accordion>
              <v-expansion-panel
                v-for="(item, idx) in legendGlobalQuery"
                :key="idx"
              >
                <v-expansion-panel-header>{{
                  item.name
                }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div v-for="(para, i) in item.parameter">
                    {{ para.name }}
                    <v-avatar :color="para.color" size="20"></v-avatar>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-navigation-drawer>
      <div
        class="map-overlay"
        style="left: 50%; top: 50%; transform: translate(-50%, -50%)"
      >
        <template>
          <v-fab-transition>
            <v-tooltip left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  style="float: right; top: 25%"
                  :class="{ drawer: sideBar }"
                  class="drawer-right"
                  small
                  right
                  rounded
                  v-bind="attrs"
                  v-on="on"
                  @click="sideBar = !sideBar"
                >
                  <template v-if="sideBar">
                    <v-icon> mdi-chevron-double-right </v-icon>
                  </template>
                  <template v-else>
                    <v-icon> mdi-chevron-double-left</v-icon>
                  </template>
                </v-btn>
              </template>
              <template v-if="sideBar">
                <span> Navigationsleiste schließen </span>
              </template>
              <template v-else>
                <span> Navigationsleiste öffnen </span>
              </template>
            </v-tooltip>
          </v-fab-transition>
        </template>
      </div>
    </template>
    <v-layout class="map-overlay pa-5">
      <v-flex xs1>
        <v-btn fab small class="zoom" @click="zoom = zoom + 1">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn fab small class="zoom" @click="zoom = zoom - 1">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <v-btn fab small class="zoom" @click="resetMap()">
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </v-flex>
      <v-flex class="text-xs-right" offset-xs11>
        <v-btn small fab @click="sideBar = !sideBar">
          <v-icon>mdi-layers</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-slide-y-reverse-transition tag="v-layout">
      <v-layout class="map-overlay erhebung" v-if="showAudio">
        <template v-if="aufgabenLoading">
          <v-skeleton-loader min-width="500" type="article, actions">
          </v-skeleton-loader>
        </template>
        <template
          v-else-if="
            ((antwortenAudio && antwortenAudio.length >= 0) ||
              (aufgabeSingleOrt && aufgabeSingleOrt.length >= 0)) &&
            !aufgabenLoading
          "
        >
          <v-card
            v-if="antwortenAudio.length > 0 || aufgabeSingleOrt.length > 0"
            elevation="2"
          >
            <v-card-title>
              Verfügbare Audioaufnahmen für
              {{ selectedOrt.ortName.split(",")[0] }}
              <v-spacer></v-spacer>
              <v-btn icon color="indigo" @click="showAudio = !showAudio">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-expansion-panels focusable>
                <v-expansion-panel
                  v-for="(d, idx) in aufgabeSingleOrt.concat(antwortenAudio)"
                  :key="idx"
                >
                  <v-expansion-panel-header>
                    {{ d.gruppeBez }} - Team: {{ d.teamBez }}
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
              </v-expansion-panels>
            </v-card-text>
          </v-card>
          <v-card v-else elevation="2">
            <v-card-title>
              Keine Aufnahmen verfügbar für
              {{ selectedOrt.ortName.split(",")[0] }}
              <v-spacer></v-spacer>
              <v-btn icon color="indigo" @click="showAudio = !showAudio">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
            </v-card-title>
          </v-card>
        </template>
      </v-layout>
    </v-slide-y-reverse-transition>
    <v-layout class="map-overlay buttons">
      <template
        v-if="!showAudio && antwortenAudio && antwortenAudio.length > 0"
      >
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              small
              rounded
              class="drawer-down"
              v-bind="attrs"
              v-on="on"
              @click="showAudio = !showAudio"
            >
              <v-icon>mdi-chevron-double-up</v-icon>
            </v-btn>
          </template>
          <span>
            Verfügbare Audioaufnahmen für
            {{ selectedOrt.ortName.split(",")[0] }}
          </span>
        </v-tooltip>
      </template>
    </v-layout>
    <v-layout class="map-overlay erhebung" v-if="currentErhebung">
      <v-card elevation="2">
        <v-card-text>
          <h2>Erhebungen für {{ currentErhebung.ort_namelang }}</h2>
          <v-data-table
            hide-default-footer
            v-if="currentErhebung"
            :headers="headerErheb"
            :items="currentErhebung.erhebungen"
            @click:row="loadInfErhebung(currentErhebung.inferhebungen)"
          >
            <template v-slot:[`item.Art_Erhebung`]="{ item }">{{
              item.Art_Erhebung
                ? item.Art_Erhebung.Bezeichnung
                : "Keine Art der Erhebung vorhanden"
            }}</template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn depressed color="blue" @click="closeInfCard()">
            Schließen
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card
        v-if="infErhebungen"
        elevation="2"
        class="text-xs-right"
        offset-xs11
      >
        <v-card-text>
          <h2>
            Verfügbare Audioaufnahmen für {{ currentErhebung.ort_namelang }}
          </h2>
          <v-data-table
            hide-default-footer
            v-if="infErhebungen"
            :headers="headerInf"
            :items="infErhebungen.infErhebungen"
          >
            <template v-slot:[`item.Datum`]="{ item }">{{
              item.Datum
            }}</template>
            <template
              v-slot:[`item.actions`]="{ item }"
              Konzept_von
              v-on:click="fetchTranscript(item.transcript.id)"
            >
              <figure>
                <figcaption>Aufnahme anhören:</figcaption>
                <audio
                  controls
                  :src="`https://dioedb.dioe.at/private-media/${item.Dateipfad}/${item.Audiofile}`"
                ></audio>
              </figure>
              <template v-if="item.transcript">
                <v-btn v-on:click="fetchTranscript(item.transcript.id)">
                  Transkript laden
                </v-btn>
              </template>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-layout>
    <v-layout class="map-overlay legend">
      <LegendItem
        v-on:callChange="onLegendChange"
        :vis.sync="showLegend"
        :propCircl="!showDataSideways"
      ></LegendItem>
    </v-layout>
    <div
      class="map-overlay"
      style="left: 50%; top: 75%; transform: translate(-50%, -50%)"
      v-if="!showLegend"
    >
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-slide-x-reverse-transition>
            <v-btn
              style="float: right"
              :class="{ drawer: showLegend }"
              class="drawer-right"
              small
              right
              rounded
              v-bind="attrs"
              v-on="on"
              @click="showLegend = !showLegend"
            >
              <template>
                <v-icon> mdi-chevron-double-left</v-icon>
              </template>
            </v-btn>
          </v-slide-x-reverse-transition>
        </template>
        <span> Legende anzeigen </span>
      </v-tooltip>
    </div>
    <l-map
      style="
        z-index: 0;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
      "
      v-if="!loading"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      ref="map"
    >
      <l-tile-layer :url="tileSetUrl" />

      <l-geo-json v-if="showBundesl" :geojson="bundeslaender" />
      <l-geo-json v-if="showGemeinden" :geojson="gemeinden" />
      <l-geo-json v-if="showDiaReg" :geojson="dialektregionen" />
      <template v-if="showGemeinden">
        <l-circle-marker
          v-for="(ort, index) in erhebungen"
          :key="ort.id"
          :lat-lng="[ort.lat, ort.lon]"
          :radius="4"
          @click="loadErheb(ort)"
        >
          <l-popup>
            <div>
              {{ ort.ort_namelang.split(",")[0] }}
            </div>
          </l-popup>
        </l-circle-marker>
      </template>
    </l-map>
  </div>
</template>
<script lang="ts">
import * as L from "leaflet";
import {
  LMap,
  LTileLayer,
  LMarker,
  LGeoJson,
  LCircleMarker,
  LPopup,
  LIcon,
} from "vue2-leaflet";
import { Component, Vue, Watch } from "vue-property-decorator";
import { geoStore } from "../store/geo";
import * as geojson from "geojson";
import {
  computePropCircle,
  drawCircleDiagram,
  drawRect,
  drawTriangle,
} from "@/helpers/MapCompute";
import LegendItem from "@/components/LegendItem.vue";

import {
  ApiLocationResponse,
  ApiLocSingleResponse,
  einzErhebung,
  SingleErhebResponse,
  SearchItems,
  TagOrteResults,
  LegendGlobal,
  Phaen,
  Parameter,
  Symbols,
} from "../static/apiModels";
import { erhebungModule } from "../store/modules/erhebungen";
import { transModule } from "../store/modules/transcripts";
import { phaeModule } from "@/store/modules/phaenomene";
import { aufgabenModule } from "@/store/modules/aufgaben";

import api from "../api/index";
import { tagModule } from "@/store/modules/tags";
import { legendMod } from "@/store/modules/legend";
import { flatten, isArray, cloneDeep } from "lodash";
import IconBase from "@/icons/IconBase.vue";
import IconCircle from "@/icons/IconCircle.vue";
import AudioPlayer from "@/components/AudioPlayer.vue";

import { getOrtName } from "@/helpers/helper";
import {
  AntwortenFromAufgabe,
  AntwortTokenStamp,
  ISelectOrtAufgabeResult,
} from "@/api/dioe-public-api";

const defaultCenter = [47.64318610543658, 13.53515625];
const defaultZoom = 8;
const standardFactor = 300;

type singleEntry = {
  // value of the entry
  v: number;
  name: string;
  // color
  c: string;
  // radius for sideways
  r: number;
  // id of the entry
  id: string;
  // Chosen icon
  icon: Symbols;
};

type circleData = {
  data: Array<singleEntry>;
  ortName: string;
  lat: number;
  lon: number;
  osm: number;
  layer: L.LayerGroup;
  size: number;
  strokeWidth: number;
};

type IAntwortenAudio = {
  name: string | null;
  tagid: number;
  content: Array<AntwortTokenStamp>;
};

@Component({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LGeoJson,
    LCircleMarker,
    LPopup,
    LIcon,
    IconBase,
    IconCircle,
    LegendItem,
    AudioPlayer,
  },
})
export default class MapView extends Vue {
  zoom: number = defaultZoom;
  kmPerPixel: number = 0;
  center: number[] = defaultCenter;
  sideBar: boolean = false;
  EM = erhebungModule;
  TM = transModule;
  TaM = tagModule;
  PM = phaeModule;
  LM = legendMod;
  AM = aufgabenModule;
  searchInput: string = "";
  searchTerms: { type: SearchItems; content: any; name: string }[] = [];
  optionTab = 0;
  selectionMenu: boolean = false;
  selectedOrt: circleData | null = null;
  showAudio: boolean = false;
  showLegend: boolean = false;
  phaenSelection = [];
  mapComp = null;
  selSearchModel = SearchItems.Alle;
  selSearchItem = [
    { name: "Alles", value: SearchItems.Alle },
    { name: "Nur Orte", value: SearchItems.Ort },
    { name: "Tags", value: SearchItems.Tag },
    { name: "Phänomene", value: SearchItems.Phaen },
    { name: "Aufgaben", value: SearchItems.Aufgaben },
    { name: "Presettags", value: SearchItems.Presets },
  ];
  selGen = -1;
  generation = [
    { name: 4, value: 4 },
    { name: 3, value: 3 },
    { name: 2, value: 2 },
    { name: 1, value: 1 },
    { name: 0, value: 0 },
    { name: "Alle Generationen", value: -1 },
  ];

  filterOptionMenu = [
    { name: "Phänomene", type: SearchItems.Phaen },
    { name: "Tags", type: SearchItems.Tag },
  ];
  filterMenuValue: Array<{ type: SearchItems; content: any; name: string }> =
    [];

  currentErhebungen = null;
  // TODO: Organsieren als Array mit Objekten
  // Tag/Ort als ID des Layers
  focusLayer: L.LayerGroup | null = null;

  showIcon: boolean = false;

  focusLayers: Array<{ layer: L.LayerGroup; name: string }> = [];

  colorid = 0;
  iconId = 0;

  colors = [
    "#F00",
    "#0F0",
    "#00F",
    "#0FF",
    "#FF0",
    "#0FF",
    "#F0F",
    "#FF0000",
    "#FFFF00",
    "#FF00FF",
    "#FFAA99",
  ];

  currentErhebung: ApiLocSingleResponse | null = null;
  _debounceId = 0;
  dbLoading = false;
  showBundesl = false;
  showGemeinden = false;
  showDiaReg = false;
  showDataSideways = false;
  showDataProp = false;
  searchTerm: { type: SearchItems; content: any; name: string } | null = null;
  geoStore = geoStore;
  mapOptions = {
    scrollWheelZoom: true,
    zoomControl: false,
    renderer: L.canvas(),
  };

  curZoom = {
    start: 0,
    end: 0,
  };

  headerErheb = [
    { text: "Art der Erhebung", value: "Art_Erhebung" },
    { text: "Bezeichnung der Erhebung", value: "Bezeichnung_Erhebung" },
  ];

  headerInf = [
    { text: "Datum", value: "Datum" },
    { text: "Aktionen", value: "actions" },
  ];

  audioInf = [
    { text: "Audio", value: "audio" },
    { text: "Transkript", value: "trans" },
    { text: "Kommentar", value: "komm" },
  ];

  tileSets = [
    {
      name: "Humanitarian Open Tiles",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png ",
    },
    {
      name: "Wikimedia",
      url: "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=local",
    },
    {
      name: "Minimal Ländergrenzen (hell)",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
    },
    {
      name: "Minimal Ländergrenzen (dunkel)",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?lang=de",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
    },
  ];

  items = [
    { name: this.tileSets[0].name, value: 0 },
    { name: this.tileSets[1].name, value: 1 },
    { name: this.tileSets[2].name, value: 2 },
    { name: this.tileSets[3].name, value: 3 },
  ];

  /*
   * Sprachatlas Feedback
   * Proportionaler Kreis muss der Größe beim Zoom auch entsprechen
   * Skalierbalken für das Einstellen der Größe
   *
   * Multiple Tag Suche mit einzeichnen von Kreisdiagramm (done)
   *
   * Predefined Tags für Ansichten
   *
   * Farben aussuchen für Symbole (done)
   *
   * Nach Phänomen filtern
   * Und daraus Aufgaben heraussuchen
   *
   * O-te Generation für Tags
   *
   * Extra Filter um die Generationen von Tags auszuwählen
   *
   * Schöne Startseite gestalten
   */

  /*
   * Suche bei den Tags nach Generation im Suchfeld
   * + Phänomene
   * Stattdessen generationen wise hineinladen
   * Aufgabensets können generell wegegelassen werden => Feature für Wissenschaftler (Für später)
   * Tags in Tagsets => Vorgefertigte Tags
   *
   */

  /*
   ToDo till SFB Days
    - Preset Tagsets
   Tag zusammenwerfen:
    - Sozialdaten herauswerfen
    - Tag funktionalität beibehalten
    - 
    Legende erstellen:
    Vorschau bzw soziale Daten ausgrauen
    Token suche (Als Expertenmodus vorschau)

    An einem Ort
    Aufnahmen zu einem Ort => nach Symbol

    Design:
    Saubere Gestaltung des gesamten Interface

    Führungen durch das Tool:
    - Stellen von Fragen
    - Klang (Auswahl der verschiedenen Phänomenen; Ausschnitt aus den Tondateien, was da drinnen ist)
    , Wortschatz
    , Satzbau
    - Orte selbst sollen nicht in der Legende stehen
      => Ortsnamen ein- & ausblenden
    Durchsuchen der untersuchten Gemeinden

    Streamlining für den User

    Sprachkarten sollen auf den Tags basieren (bzw auf deren Ebene)
    Auswertung dafür (Über die Legende) mit Vorschau für den Expertenmodus

    Suchfeld => Soll nicht in der Legende landen; Markiert werden wenn dieser gesucht wird
    Extra box um die Orte ein & auszublenden

    Legende ein & ausblenden

    Suche:
    visueller Hinweis für die Orte bei der Suche, damit diese unterscheidbar sind
    Nadel Ort; Notetag für Tags / Palette; Phäno  
    Fragebuch als Buch 

   */

  selectedTileSet = 0;

  get erhebungen() {
    return erhebungModule.erhebungen
      ? erhebungModule.erhebungen
      : ({} as ApiLocationResponse);
  }

  getAudioPath(
    path: string,
    file: string,
    startMin: number,
    startSec: number,
    stopMin: number,
    stopSec: number
  ) {
    return `https://dioedb.dioe.at/private-media/${path}/${file}#t=${
      startMin * 60 + startSec
    },${stopMin * 60 + stopSec}`;
  }

  get aufgabenSet() {
    return this.AM.aufgabenSet;
  }

  get aufgaben() {
    return this.AM.aufgaben;
  }

  get allAufgaben() {
    return this.AM.allAufgaben;
  }

  get aufgabenFromSet() {
    return this.AM.aufgabenFromSet;
  }

  get aufgabenLoading() {
    return this.AM.loading;
  }

  drawCircleDiagram(
    size: number,
    border: number,
    borderColor: string,
    color: string,
    data: any,
    encoded: boolean
  ) {
    return drawCircleDiagram(size, border, borderColor, color, data, encoded);
  }

  drawRect(size: number, border: number, color: string, encoded: boolean) {
    return drawRect(size, border, color, encoded, 0.7);
  }

  get legendGlobal() {
    return this.LM.legend;
  }

  get legendGlobalQuery() {
    return this.LM.legend.filter((el) => el.type === SearchItems.Query);
  }

  get legendGlobalTag() {
    return this.LM.legend.filter((el) => el.type === SearchItems.Tag);
  }

  get legendLoading() {
    return this.LM.loading;
  }

  get phaen() {
    return this.PM.phaen;
  }

  get phaenBer() {
    return this.PM.phaenBer;
  }

  get getSearchItem() {
    return SearchItems;
  }

  get parameters() {
    return this.TaM.parameters;
  }

  get tileSetUrl(): string {
    return this.tileSets[this.selectedTileSet].url;
  }

  get bundeslaender(): geojson.Feature[] {
    if (!this.isLoading && this.geoStore.bundeslaender !== null) {
      return this.geoStore.bundeslaender.features;
    } else {
      return [];
    }
  }

  get gemeinden(): geojson.Feature[] {
    if (!this.isLoading && this.geoStore.gemeinden !== null) {
      return this.geoStore.gemeinden.features;
    } else {
      return [];
    }
  }

  get dialektregionen(): geojson.Feature[] {
    if (!this.isLoading && this.geoStore.dialektregionen !== null) {
      return this.geoStore.dialektregionen.features;
    } else {
      return [];
    }
  }

  get map() {
    // @ts-ignore
    return this.$refs.map.mapObject;
  }

  get loading() {
    return erhebungModule.loading;
  }

  get autoCompleteLoading() {
    return (
      this.EM.loading || this.TaM.loading || this.AM.loading || this.dbLoading
    );
  }

  get einzelErhebungen() {
    return transModule.einzelErhebungen;
  }

  get transcripts() {
    return transModule.transcripts;
  }

  get infLoading() {
    return erhebungModule.infLoading;
  }

  get infErhebungen() {
    return erhebungModule.infErhebungen;
  }

  get tagOrtResult() {
    return tagModule.tagOrteNum;
  }

  get isLoading() {
    if (
      this.geoStore.gemeinden !== null ||
      this.geoStore.bundeslaender !== null
    ) {
      return false;
    } else {
      return true;
    }
  }

  get legends() {
    return this.TaM.legends;
  }

  get tagList() {
    return this.TaM.tags;
  }

  get tagListFlat() {
    const curr = this.flattenTagsArray(this.TaM.tags);
    return curr;
  }

  get tagListPreset() {
    return this.TaM.presetTags;
  }

  get antwortenAudio() {
    const arr = this.AM.antwortenAudio;
    /*const res = [] as IAntwortenAudio[];
    [...new Set(arr.map((item) => item.tagId))].forEach((el) => {
      res.push({
        tagid: el,
        content: arr.filter((e) => e.tagId === el),
        name: arr.filter((e) => e.tagId === el)[0].tagName,
      });
    });
    // console.log(res);*/
    return arr;
  }

  get allSaetze() {
    return this.AM.allSaetze;
  }

  get einzelAntworten() {
    return this.AM.antworten;
  }

  get aufgabenOrt() {
    return this.AM.aufgabenOrt;
  }

  get aufgabeSingleOrt() {
    return this.AM.aufgabeSingleOrt;
  }

  @Watch("searchInput")
  search(val: any) {
    if (!val) return;
    this.fetchEntriesDebounced();
  }

  @Watch("iconId")
  onIconIdChange() {
    if (this.iconId > Object.keys(Symbols).length) {
      this.iconId = 0;
    }
  }

  searchAufgabeByPhaen() {
    this.optionTab = 1;
    const elements = this.phaenSelection.map((x) => this.filterMenuValue[x]);
    const cont = [] as number[];
    for (const ele of elements) {
      const e = ele.content as Phaen;
      cont.push(e.id);
    }
    this.AM.fetchAufgabenSet({ ids: cont });
  }

  openFilter(type: SearchItems) {
    this.phaenSelection = [];
    switch (type) {
      case SearchItems.Phaen:
        this.changeFilterMenuValue(
          SearchItems.Phaen,
          this.phaen,
          "bezPhaenomen"
        );
        break;
      case SearchItems.Tag:
        this.changeFilterMenuValue(
          SearchItems.Tag,
          this.tagListFlat,
          "tagName"
        );
        break;
    }
  }

  async fetchEntriesDebounced() {
    // cancel pending call
    clearTimeout(this._debounceId);
    this.dbLoading = true;
    this._debounceId = setTimeout(() => {
      if (
        this.selSearchModel === SearchItems.Alle ||
        this.selSearchModel === SearchItems.Aufgaben
      )
        this.AM.fetchSaetze({ query: this.searchInput }).then(() =>
          this.addSearchTerms(this.allSaetze, SearchItems.Saetze, "Transkript")
        );
      this.dbLoading = false;
    }, 500);
  }

  changeFilterMenuValue(type: SearchItems, content: Array<any>, name: string) {
    this.filterMenuValue = [];
    content.forEach((e) => {
      this.filterMenuValue.push({ content: e, type: type, name: name });
    });
  }

  clearFilterMenu() {
    this.filterMenuValue = [];
  }

  onLegendChange(el: LegendGlobal) {
    if (el.type === SearchItems.Tag) {
      el.layer?.clearLayers();
      this.displayDataFromLegend(this.legendGlobalTag);
    } else if (el.type === SearchItems.Ort) {
      const lay = el.layer;
      if (lay) {
        lay.eachLayer((l) => {
          if (l instanceof L.CircleMarker) {
            l.setRadius(el.size);
            l.setStyle({
              color: el.color,
              weight: el.strokeWidth,
            });
          }
        });
      }
    }
  }

  flattenTagsArray(arr: any[]): any[] {
    return arr.reduce(
      (acc, val) =>
        acc.concat(
          Array.isArray(val.children) && val.children.length > 0
            ? [].concat(...this.flattenTagsArray(val.children), val)
            : val
        ),
      []
    );
  }

  addSearchTerms(terms: any, type: SearchItems, name: string) {
    for (let curr of terms) {
      this.searchTerms.push({
        type: type,
        content: curr,
        name: curr[name],
      });
    }
  }

  closeInfCard() {
    this.currentErhebung = null;
    // @ts-ignore
    this.$refs.map.mapObject.closePopup();
    this.center = defaultCenter;
    this.zoom = defaultZoom;
    // @ts-ignore
    this.$refs.map.mapObject.setView(defaultCenter, this.zoom);
    // @ts-ignore
    const map = this.$refs.map.mapObject;
    if (map.hasLayer(this.focusLayer)) {
      map.removeLayer(this.focusLayer);
      this.focusLayer?.clearLayers();
      this.searchInput = "";
      this.searchTerm = null;
    }
  }

  clearLayer() {
    if (this.map.hasLayer(this.focusLayer)) {
      this.map.removeLayer(this.focusLayer);
      this.focusLayer?.clearLayers();
      this.searchInput = "";
      this.searchTerm = null;
    }
  }

  removeLayer(l: L.LayerGroup) {
    if (this.map.hasLayer(l)) {
      this.map.removeLayer(l);
      l?.clearLayers();
    }
  }

  setTagDataMap(e: L.LatLng, msg: string) {
    const curr = this.tagOrtResult;
    const ort = curr.find(
      (lat, lon) => Number(lat) === e.lat && Number(lon) === e.lng
    );
  }

  getOrtNameTemplate(name: string): any {
    return getOrtName(name);
  }

  changeSearchTerms() {
    this.searchTerms = [];
    switch (this.selSearchModel) {
      case SearchItems.Ort:
        this.addSearchTerms(this.erhebungen, SearchItems.Ort, "ort_namelang");
        break;
      case SearchItems.Tag:
        this.addSearchTerms(this.tagListFlat, SearchItems.Tag, "tagName");
        break;
      case SearchItems.Phaen:
        this.addSearchTerms(this.phaen, SearchItems.Phaen, "bez");
        break;
      case SearchItems.Aufgaben:
        this.addSearchTerms(
          this.allAufgaben,
          SearchItems.Aufgaben,
          "Aufgabenstellung"
        );
        this.addSearchTerms(this.allSaetze, SearchItems.Saetze, "Transkript");
        break;
      case SearchItems.Presets:
        this.addSearchTerms(
          this.tagListPreset,
          SearchItems.Presets,
          "Bezeichnung"
        );
        break;
      case SearchItems.Alle:
        this.addSearchTerms(
          this.allAufgaben,
          SearchItems.Aufgaben,
          "Aufgabenstellung"
        );
        this.addSearchTerms(
          this.tagListPreset,
          SearchItems.Presets,
          "Bezeichnung"
        );
        this.addSearchTerms(this.erhebungen, SearchItems.Ort, "ort_namelang");
        this.addSearchTerms(this.tagListFlat, SearchItems.Tag, "tagName");
        this.addSearchTerms(this.allSaetze, SearchItems.Saetze, "Transkript");
        break;
    }
  }

  changeTags() {
    if (this.selGen > -1) {
      this.TaM.fetchGenTags({ gen: this.selGen }).then(() =>
        this.changeSearchTerms()
      );
    } else {
      this.TaM.fetchTags().then(() => this.changeSearchTerms());
    }
  }

  async submitSearch() {
    if (await this.displayData()) {
      // clear data of autocomplete
      //@ts-ignore
      this.$refs.searchTermAutoComplete.reset();
    } else {
      // Extend autocomplete with a error banner
      console.log("Fehler beim Suchen");
    }
  }

  addCircleMarkerToMap(
    lat: number,
    lon: number,
    color: string,
    stroke: number,
    size: number,
    layer: L.LayerGroup
  ) {
    const res = L.circleMarker([lat, lon], {
      color: color,
      radius: size,
      weight: stroke,
    }).addTo(layer);
    this.map.addLayer(layer);
    return res;
  }

  setMapToPoint(lat: number, lon: number, zoom: number) {
    this.center = [lat, lon];
    this.zoom = zoom;
    this.map.flyTo(this.center, zoom);
  }

  resetMap() {
    this.zoom = defaultZoom;
    this.center = defaultCenter;
    this.setMapToPoint(this.center[0], this.center[1], defaultZoom);
  }

  createRectIcon(ort: circleData, data: singleEntry[]): L.Icon<L.IconOptions> {
    let s = ort.size;
    if (ort.data.length > 1 && this.showDataProp) {
      s = data[0].r;
    }
    const rad = s;
    var rect = L.icon({
      iconSize: [rad, rad * 1.7],
      className: "circle-draw",
      iconUrl: this.drawRect(3, ort.strokeWidth, data[0].c, true),
    });
    return rect;
  }

  createTriIcon(ort: circleData, data: singleEntry[]): L.Icon<L.IconOptions> {
    let s = ort.size;
    if (ort.data.length > 1 && this.showDataProp) {
      s = data[0].r;
    }
    const rad = s;
    var rect = L.icon({
      iconSize: [rad, rad],
      className: "circle-draw",
      iconUrl: drawTriangle(3, ort.strokeWidth, data[0].c, true, 0.7),
    });
    return rect;
  }

  createCircleIcon(
    ort: circleData,
    data: singleEntry[]
  ): L.Icon<L.IconOptions> {
    let s = ort.size;
    if (ort.data.length > 1 && this.showDataProp) {
      s = data[0].r;
    }
    const rad = s;
    var circleIcon = L.icon({
      iconSize: [rad, rad],
      className: "circle-draw",
      iconUrl: this.drawCircleDiagram(
        24,
        ort.strokeWidth,
        "#000",
        data[0].c,
        data,
        true
      ),
    });
    return circleIcon;
  }

  extractTagData(
    color: string,
    icon: Symbols,
    size: number,
    vis: boolean,
    stroke: number,
    layer: L.LayerGroup,
    data: Array<circleData>,
    osm: number,
    lon: number,
    lat: number,
    ortName: string,
    num: number,
    name: string,
    propSize: number,
    id: string
  ): Array<circleData> {
    if (vis) {
      const ort = data.findIndex(
        (tD) => osm === tD.osm || (tD.lon === lon && tD.lat === lat)
      );
      if (ort > -1) {
        // Element with geodata already exists in data
        data[ort].data.push({
          v: num,
          name: name,
          c: color,
          r: propSize,
          id: id,
          icon: icon,
        } as singleEntry);
      } else {
        // Element doesnt exist and needs to be added
        const newTagData: circleData = {
          lat: lat,
          lon: lon,
          osm: osm,
          ortName: ortName,
          layer: layer,
          size: size,
          strokeWidth: stroke,
          data: [
            {
              v: num,
              name: name,
              c: color,
              r: propSize,
              id: id,
              icon: icon,
            },
          ] as singleEntry[],
        };
        data.push(newTagData);
      }
    }
    return data;
  }

  createIcon(
    ort: circleData,
    data: singleEntry[],
    icon: Symbols
  ): L.Icon<L.IconOptions> {
    switch (icon) {
      case Symbols.Circle:
        return this.createCircleIcon(ort, data);
        break;
      case Symbols.Rect:
        return this.createRectIcon(ort, data);
        break;
      case Symbols.Tri:
        return this.createTriIcon(ort, data);
        break;
    }
  }

  audioListener(ort: circleData, type: SearchItems) {
    const ids = [];
    for (const tag of ort.data) {
      const id = tag.id ? Number(tag.id) : -1;
      if (id != -1) ids.push(id);
    }
    this.selectedOrt = ort;
    this.showAudio = true;
    switch (type) {
      case SearchItems.Tag:
        this.AM.fetchAntwortAudio({ ids: ids, osmId: ort.osm });
        break;
      case SearchItems.Aufgaben:
        this.AM.fetchAufgabenAudioOrt({ ids: ids, osmId: ort.osm });
        break;
    }
  }

  addDataToMap(data: Array<circleData>, type: SearchItems) {
    for (const ort of data) {
      if (this.showDataSideways) {
        let idx = 0;
        let lonToPoint = this.map.latLngToContainerPoint([ort.lat, ort.lon]);
        let rad = 0;
        for (const d of ort.data) {
          const circleIcon = this.createIcon(ort, [d], d.icon);

          let s = ort.size;
          if (this.showDataProp) {
            s = d.r;
          }
          const lonOffset = this.map.containerPointToLatLng([
            idx === 0 ? lonToPoint.x : rad + lonToPoint.x + s * 2,
            lonToPoint.y,
          ]);
          lonToPoint = this.map.latLngToContainerPoint(lonOffset);
          rad = s;
          const marker = L.marker(lonOffset, {
            icon: circleIcon,
            riseOnHover: true,
          })
            .addTo(ort.layer)
            .on("click", (e) => this.audioListener(ort, type));
          marker.on("mouseover", (e) => this.markerHover(ort, marker, e));
          // @ts-ignore
          this.map.addLayer(ort.layer);
          idx++;
        }
      } else {
        const circleIcon = this.createCircleIcon(ort, ort.data);
        const marker = L.marker([ort.lat, ort.lon], {
          icon: circleIcon,
          riseOnHover: true,
        })
          .addTo(ort.layer)
          .on("click", (e) => this.audioListener(ort, type));
        marker.on("mouseover", (e) => this.markerHover(ort, marker, e));

        // @ts-ignore
        this.map.addLayer(ort.layer);
      }
    }
  }

  markerHover(ort: circleData, marker: L.Marker, e: L.LeafletEvent) {
    marker.bindTooltip(ort.ortName).openTooltip();
  }

  displayAufgabeFromLegend(
    aufgabe: LegendGlobal,
    data: Array<circleData>
  ): Array<circleData> {
    aufgabe.layer.clearLayers();
    const cont = aufgabe.content as ISelectOrtAufgabeResult[];
    const propFactor = computePropCircle(
      cont.map((val) => Number(val.numAufg)),
      20
    );
    for (const aufg of cont) {
      data = this.extractTagData(
        aufgabe.color,
        aufgabe.symbol,
        aufgabe.size,
        aufgabe.vis,
        aufgabe.strokeWidth,
        aufgabe.layer,
        data,
        aufg.osmId ? Number(aufg.osmId) : -1,
        Number(aufg.lon),
        Number(aufg.lat),
        aufg.ortNamelang,
        aufg.numAufg ? Number(aufg.numAufg) : 1,
        aufg.aufgabenstellung ? aufg.aufgabenstellung : "",
        propFactor * Number(aufg.numAufg),
        aufg.id.toString()
      );
    }
    return data;
    // this.addDataToMap(data);
  }

  displaySingleTagLegend(
    tags: LegendGlobal,
    data: Array<circleData>
  ): Array<circleData> {
    tags.layer.clearLayers();
    const cont = tags.content as TagOrteResults[];
    const propFactor = computePropCircle(
      cont.map((val) => val.numTag),
      20 * this.kmPerPixel
    );
    for (const tag of cont) {
      data = this.extractTagData(
        tags.color,
        tags.symbol,
        tags.size,
        tags.vis,
        tags.strokeWidth,
        tags.layer,
        data,
        tag.osmId ? tag.osmId : -1,
        Number(tag.lon),
        Number(tag.lat),
        tag.ortNamelang ? tag.ortNamelang : "",
        tag.numTag,
        tag.tagName,
        propFactor * tag.numTag,
        tag.tagId ? tag.tagId : ""
      );
    }
    return data;
    // this.addDataToMap(data);
  }

  displayOrt(layer: L.LayerGroup) {
    if (this.searchTerm) {
      const ort: ApiLocSingleResponse = this.searchTerm.content;
      const color = this.colors[this.colorid++];
      const radius = 20;
      const circle = this.addCircleMarkerToMap(
        Number(ort.lat),
        Number(ort.lon),
        color,
        1,
        radius,
        layer
      );
      circle.bindPopup(ort.ort_namelang.split(",")[0]);
      this.loadErheb(ort);

      const newLegend = {
        color: color,
        size: radius,
        type: SearchItems.Ort,
        content: {
          lat: Number(ort.lat),
          lon: Number(ort.lon),
          osmId: ort.osm_id,
        },
        stroke: true,
        strokeWidth: 1,
        parameter: null,
        vis: true,
        name:
          ort.ort_namekurz === "" || ort.ort_namekurz === null
            ? getOrtName(ort.ort_namelang).name
            : ort.ort_namekurz,
        layer: layer,
      };
      return newLegend;
    }
  }

  // Parameter darstellen
  // 1. Parameterdaten extrahieren
  // 2. Request für die Tagdaten durchführen
  // 3. Daten ins content feld vom Parameter einpflegen

  async displayParameters(queries: LegendGlobal[]) {
    let idToTag = new Map();
    let data = [] as Array<circleData>;
    for (const q of queries) {
      let ids: Array<number> = [];
      const layer = q.layer ? q.layer : L.layerGroup();
      idToTag.set(q.id, [] as number[]);
      if (q.parameter) {
        for (const p of q.parameter) {
          const id = p.id;
          if (p.tagList) {
            p.tagList.forEach((el) => {
              idToTag.set(
                id,
                idToTag.has(id) ? idToTag.get(id).push(el.tagIds) : el.tagIds
              );
              ids = ids.concat(el.tagIds);
            });
          }
        }

        await this.TaM.fetchTagOrteResultsMultiple({ ids: [...new Set(ids)] });
        const tags = cloneDeep(this.tagOrtResult);
        q.parameter?.forEach((p: Parameter) => {
          const tagData = tags.filter((el) =>
            idToTag.get(p.id).includes(el.tagId)
          );
          q.content = tagData;
          const propFactor = computePropCircle(
            q.content.map((val: any) => val.numTag),
            20 * this.kmPerPixel
          );
          for (const t of q.content) {
            data = this.extractTagData(
              p.color ? p.color : this.colors[this.colorid++],
              q.symbol,
              p.size ? p.size : 12,
              p.visible && q.vis,
              q.strokeWidth,
              layer,
              data,
              t.osmId ? t.osmId : -1,
              Number(t.lon),
              Number(t.lat),
              t.ortNamelang ? t.ortNamelang : "",
              t.numTag,
              t.tagName,
              propFactor * t.numTag,
              t.tagId ? t.tagId : ""
            );
          }
        });
      }
    }
    this.addDataToMap(data, SearchItems.Tag);
  }

  drawSentence(legSentence: Array<LegendGlobal>) {
    legSentence.forEach((el) => {
      const content = el.content as Array<AntwortenFromAufgabe>;
      content.forEach((satz) => {
        const circle = this.addCircleMarkerToMap(
          Number(satz.lat),
          Number(satz.lon),
          el.color,
          1,
          el.size,
          el.layer ? el.layer : L.layerGroup()
        );
        circle.on("click", (e) => {
          satz.data.forEach((antwort) => {
            // antwort.
          });
          // xthis.selectedOrt = ort;
          this.showAudio = true;
        });
      });
    });
  }

  displayDataFromLegend(legend: LegendGlobal[]) {
    this.clearLayer();
    this.showLegend = true;
    this.displayParameters(this.legendGlobalQuery);
    let tagData: Array<circleData> = [];
    let aufData: Array<circleData> = [];
    for (const l of legend) {
      switch (l.type) {
        case SearchItems.Ort:
          l.layer.clearLayers();
          const ort: ApiLocSingleResponse = l.content;
          const circle = this.addCircleMarkerToMap(
            Number(ort.lat),
            Number(ort.lon),
            l.color,
            l.strokeWidth,
            l.size,
            l.layer
          );
          circle.bindPopup(ort.ort_namelang.split(",")[0]);
          break;
        case SearchItems.Tag:
          this.displaySingleTagLegend(l, tagData);
          break;
        case SearchItems.Aufgaben:
          this.displayAufgabeFromLegend(l, aufData);
          break;
      }
    }
    this.addDataToMap(tagData, SearchItems.Tag);
    this.addDataToMap(aufData, SearchItems.Aufgaben);
  }

  async createTagLegend(layer: L.LayerGroup) {
    if (this.searchTerm) {
      const tag = this.searchTerm.content.tagId;
      const color = this.colors[this.colorid++];
      const radius = 20;
      return await this.loadTagOrt(tag).then(() => {
        const curr = this.tagOrtResult;
        if (curr.length > 0) {
          // const divFactor = Math.sqrt(ele.numTag / Math.PI);
          const newLegend: LegendGlobal = {
            id: "",
            color: color,
            size: radius,
            type: SearchItems.Tag,
            content: curr,
            symbol: this.iconId++,
            stroke: true,
            strokeWidth: 1,
            parameter: null,
            vis: true,
            name: curr[0].tagName,
            layer: layer,
          };
          return newLegend;
        }
      });
    }
  }

  async displayData() {
    const newLayer = L.layerGroup();
    this.clearLayer();
    this.showLegend = true;
    if (this.searchTerm) {
      if (this.searchTerm.type === SearchItems.Ort) {
        const leg = this.displayOrt(newLayer);
        this.LM.addLegendEntry(leg);
        this.setMapToPoint(
          Number(leg?.content.lat),
          Number(leg?.content.lon),
          10
        );
      } else if (this.searchTerm.type === SearchItems.Tag) {
        this.resetMap();
        this.createTagLegend(newLayer).then((res) => {
          legendMod.addLegendEntry(res);
          this.displayDataFromLegend(this.legendGlobalTag);
        });
      } else if (this.searchTerm.type === SearchItems.Presets) {
        this.resetMap();
        const preset = this.searchTerm.content.id;
        await this.TaM.fetchTagOrtePreset(preset);
        const tagIds = [...new Set(this.tagOrtResult.map((val) => val.tagId))];
        console.log(tagIds);
        for (const id of tagIds) {
          const tag = this.tagOrtResult.find((val) => val.tagId === id);
          const legEntry = await this.LM.createLegendEntry({
            icon: Symbols.Circle,
            layer: L.layerGroup(),
            name: tag?.tagName ? tag.tagName : "",
            color: this.colors[this.colorid++],
            radius: 20,
            content: this.tagOrtResult.filter((val) => val.tagId === id),
            type: SearchItems.Tag,
          });
          this.LM.addLegendEntry(legEntry);
        }
        this.displayDataFromLegend(this.legendGlobalTag);
      } else if (this.searchTerm.type === SearchItems.Saetze) {
        const sid = this.searchTerm.content.id;
        const term = this.searchTerm.content.transkript;
        await this.AM.fetchAntworten({ sid: sid });
        const res = this.einzelAntworten;
        this.resetMap();
        const legEntry = await this.LM.createLegendEntry({
          icon: Symbols.Circle,
          layer: L.layerGroup(),
          name: term,
          color: this.colors[this.colorid++],
          radius: 20,
          content: res,
          type: this.searchTerm.type,
        });
        this.LM.addLegendEntry(legEntry);
      } else if (this.searchTerm.type === SearchItems.Aufgaben) {
        const content = this.searchTerm.content;
        await this.AM.fetchAufgabenOrt({ ids: [content.aufId] });
        const leg = await this.LM.createLegendEntry({
          icon: Symbols.Circle,
          layer: L.layerGroup(),
          name: content.Aufgabenstellung,
          color: this.colors[this.colorid++],
          radius: 12,
          content: this.aufgabenOrt,
          type: this.searchTerm.type,
        });
        this.LM.addLegendEntry(leg);
        this.displayDataFromLegend([leg]);
      }
      if (this.colorid >= this.colors.length) {
        this.colorid = 0;
      }
      return true;
    } else {
      // TODO Add further error banner if data cant be loaded
      // Also proper message intern
      console.log("Empty");
      return false;
    }
  }

  matchTranscriptID(id: number) {
    if (this.einzelErhebungen && this.einzelErhebungen.length > 0) {
      const ele = this.einzelErhebungen.filter(
        () =>
          function (ele: einzErhebung, idx: number) {
            console.log(ele.ID_Erh);
            if (ele.ID_Erh === id) {
              return ele;
            }
          }
      );
      console.log(id);
      return ele;
    }
  }

  fetchTranscript(id: number) {
    console.log(id);
    console.log("test output");
    const element = this.matchTranscriptID(id);
    console.log(element);
    this.TM.fetchSingleTranscript({ id: id, page: 0 });
  }

  loadInfErhebung(infs: any[]) {
    erhebungModule.fetchInfErhebungen({
      infs: infs,
    });
  }

  loadErheb(ort: ApiLocSingleResponse) {
    this.currentErhebung = ort;
    this.$forceUpdate();
  }

  computeMPerPixel() {
    const centerLatLng = this.map.getCenter();
    const container = this.map.latLngToContainerPoint(centerLatLng);
    var pointX = [container.x + 1, container.y]; // add one pixel to x
    var pointY = [container.x, container.y + 1]; // add one pixel to y

    // convert containerpoints to latlng's
    var latLngC = this.map.containerPointToLatLng(container);
    var latLngX = this.map.containerPointToLatLng(pointX);
    var latLngY = this.map.containerPointToLatLng(pointY);

    var distanceX = latLngC.distanceTo(latLngX); // calculate distance between c and x (latitude)
    var distanceY = latLngC.distanceTo(latLngY);
    this.kmPerPixel = distanceX / 1000;
    /*this.kmPerPixel =
      (40075016.686 * Math.abs(Math.cos((center * Math.PI) / 180))) /
      Math.pow(2, zoom + 8) /
      1000;
    this.kmPerPixel =
      (156543.03392 * Math.cos((center * Math.PI) / 180)) /
      Math.pow(2, zoom) /
      1000;
      */
  }

  async loadTagOrt(tagId: number) {
    await tagModule.fetchTagOrteResults({ tagId: tagId });
  }

  // lifecycle hook
  mounted() {
    console.log("Map mounted");
    this.computeMPerPixel();
    if (!this.erhebungen?.orte || this.erhebungen.orte.length === 0) {
      erhebungModule.fetchErhebungen().then(() => {
        this.changeSearchTerms();
      });
    }

    this.PM.fetchAllPhaen();
    this.TM.fetchTranscripts();
    this.TM.fetchEinzelerhebungen();

    if (this.legendGlobal.length > 0) {
      this.displayDataFromLegend(legendMod.legend);
    }

    this.map.on("zoomend", (e: any) => {
      this.computeMPerPixel();
      this.displayDataFromLegend(legendMod.legend);
    });
  }

  created() {}

  beforeCreate() {
    // //this.l.log('Collections before created'); --logger does not exist yet. if needed define outside like in app
  }

  updated() {
    // this.l.log('Collections updated');
  }

  destroyed() {
    // this.l.log('Collections destroyed');
  }
}
</script>
<style lang="scss" scoped>
  @import "../../node_modules/leaflet/dist/leaflet.css";

  html {
    overflow: hidden;
  }

  .map-overlay {
    position: absolute;
    z-index: 1;
    width: 100%;
    left: 0;
    right: 0;
    pointer-events: none;
    * {
      pointer-events: all;
    }
  }

  .drawer {
    margin-right: 250px;
    z-index: 5;
  }

  .drawer-right {
    border-top-right-radius: 0em;
    border-bottom-right-radius: 0em;
  }

  .drawer-down {
    border-bottom-right-radius: 0em;
    border-bottom-left-radius: 0em;
  }

  .buttons {
    margin-bottom: 0px;
    bottom: 0px;
    left: 25%;
  }

  .search-overlay {
    position: relative;
    z-index: 1;
    width: 100%;
    margin-top: 100px;
  }

  .erhebung {
    bottom: 0;
    margin-bottom: 50px;
    margin-left: 50px;
    width: 50%;
    height: 35%;
  }

  .legend {
    bottom: 0;
    margin-bottom: 50px;
    margin-right: 20px;
    right: 20px;
    left: 80%;
    width: 20%;
  }

  .zoom {
    margin: 10px;
  }

  .v-card {
    display: flex !important;
    flex-direction: column;
  }

  .v-card__text {
    flex-grow: 1;
    overflow: auto;
    overflow-y: scroll;
  }

  .expand-slide-enter-active {
    transition: all 0.3s ease;
    transition-property: width;
  }

  .expand-slide-enter, .expand-slide-leave-to
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                /* .slide-fade-leave-active below version 2.1.8 */ {
    transition: max-height 0.25s ease-out;
    transition-property: width;
  }

  .circle-draw {
    animation: 1s ease-out 0s 1 fadeIn;
  }

  .layout-slide-enter-active,
  .layout-slide-leave-active {
    -moz-transition-duration: 0.3s;
    -webkit-transition-duration: 0.3s;
    -o-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -moz-transition-timing-function: ease-in;
    -webkit-transition-timing-function: ease-in;
    -o-transition-timing-function: ease-in;
    transition-timing-function: ease-in;
  }

  .layout-slide-fade-enter,
  .layout-slide-fade-leave-to {
    transform: translateY(100px);
  }
</style>