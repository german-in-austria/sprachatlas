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
                :search-input="searchInput"
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
    <transition name="layout-slide">
      <v-layout class="map-overlay erhebung" v-if="showAudio">
        <template v-if="aufgabenLoading">
          <v-skeleton-loader min-width="500" type="article, actions">
          </v-skeleton-loader>
        </template>
        <template
          v-else-if="
            antwortenAudio && antwortenAudio.length > 0 && !aufgabenLoading
          "
        >
          <transition name="expand-slide" appear>
            <v-card elevation="2">
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
                    v-for="(item, idx) in antwortenAudio"
                    :key="idx"
                  >
                    <v-expansion-panel-header>
                      {{ item.name }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content eager>
                      <v-data-table
                        v-if="item.content.length > 0"
                        :headers="audioInf"
                        :items="item.content"
                        hide-default-footer
                        :items-per-page="
                          items.content ? items.content.length : 15
                        "
                      >
                        <template v-slot:[`item.audio`]="{ item }">
                          <figure>
                            <figcaption>Aufnahme anhören:</figcaption>
                            <audio
                              controls
                              loop
                              :src="
                                getAudioPath(
                                  item.Dateipfad,
                                  item.Audiofile,
                                  item.startAntwort.minutes,
                                  item.startAntwort.seconds,
                                  item.stopAntwort.minutes,
                                  item.stopAntwort.seconds
                                )
                              "
                            ></audio>
                          </figure>
                        </template>
                        <template v-slot:[`item.trans`]="{ item }">
                          Ortho: {{ item.ortho }} <br />Text Ortho:
                          {{ item.orthoText }}
                        </template>
                        <template v-slot:[`item.komm`]="{ item }">
                          {{ item.kommentar }}
                        </template>
                      </v-data-table></v-expansion-panel-content
                    >
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
          </transition>
        </template>
      </v-layout>
    </transition>
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
import { computePropCircle, drawCircleDiagram } from "@/helpers/MapCompute";
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
} from "../static/apiModels";
import { erhebungModule } from "../store/modules/erhebungen";
import { transModule } from "../store/modules/transcripts";
import { phaeModule } from "@/store/modules/phaenomene";
import { aufgabenModule } from "@/store/modules/aufgaben";

import api from "../api/index";
import { tagModule } from "@/store/modules/tags";
import { legendMod } from "@/store/modules/legend";
import { flatten, isArray } from "lodash";
import IconBase from "@/icons/IconBase.vue";
import IconCircle from "@/icons/IconCircle.vue";

import { getOrtName } from "@/helpers/helper";
import { AntwortenTags } from "@/api/dioe-public-api";

const defaultCenter = [47.64318610543658, 13.53515625];
const defaultZoom = 8;
const standardFactor = 300;

type singleTag = {
  v: number;
  name: string;
  c: string;
  r: number;
  id: string;
};

type circleData = {
  data: Array<singleTag>;
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
  content: Array<AntwortenTags>;
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

  colors = ["#F00", "#0F0", "#0FF", "#FF0", "#0FF", "#F0F"];

  currentErhebung: ApiLocSingleResponse | null = null;
  showBundesl = false;
  showGemeinden = false;
  showDiaReg = false;
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

  get legendGlobal() {
    return this.LM.legend;
  }

  get legendGlobalQuery() {
    return this.LM.legend.filter((el) => el.type === SearchItems.Query);
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
    return erhebungModule.loading && tagModule.loading && this.AM.loading;
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

  get antwortenAudio() {
    const arr = this.AM.antwortenAudio;
    const res = [] as IAntwortenAudio[];
    [...new Set(arr.map((item) => item.tagId))].forEach((el) => {
      res.push({
        tagid: el,
        content: arr.filter((e) => e.tagId === el),
        name: arr.filter((e) => e.tagId === el)[0].tagName,
      });
    });
    return res;
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
    this.displayCircle(el);
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
    // @ts-ignore
    const map = this.$refs.map.mapObject;
    if (map.hasLayer(this.focusLayer)) {
      map.removeLayer(this.focusLayer);
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
      case SearchItems.Alle:
        this.addSearchTerms(this.erhebungen, SearchItems.Ort, "ort_namelang");
        this.addSearchTerms(this.tagListFlat, SearchItems.Tag, "tagName");
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

  submitSearch() {
    if (this.displayData()) {
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
    size: number,
    layer: L.LayerGroup
  ) {
    const res = L.circleMarker([lat, lon], {
      color: color,
      radius: size,
      // @ts-ignore
    }).addTo(layer);
    // @ts-ignore
    this.$refs.map.mapObject.addLayer(layer);
    return res;
  }

  setMapToPoint(lat: number, lon: number, zoom: number) {
    this.center = [lat, lon];
    this.zoom = zoom;
    this.map.flyTo(this.center);
  }

  resetMap() {
    this.zoom = defaultZoom;
    this.center = defaultCenter;
    this.setMapToPoint(this.center[0], this.center[1], defaultZoom);
  }

  displayCircle(tagsSingle: LegendGlobal) {
    // Legendarray with the filtered tag data
    const tags = this.legendGlobal.filter((el) => el.type === SearchItems.Tag);
    // Array for the extracted Tag data with geo data
    const data = [] as Array<circleData>;
    // Iterate through the array and sort by geo data
    // Get the values for the diagram
    for (const ele of tags) {
      // Layer where the data is going to be displayed
      const layer = ele.layer ? ele.layer : L.layerGroup();
      layer.clearLayers();
      const cont = ele.content as TagOrteResults[];
      if (ele.vis) {
        for (const tag of cont) {
          const ort = data.findIndex(
            (tD) =>
              (tag.osmId && tag.osmId == tD.osm) ||
              (tag.lat &&
                tag.lat &&
                tD.lon === Number(tag.lon) &&
                tD.lat === Number(tag.lat))
          );
          if (ort > -1) {
            // Element with geodata already exists in data
            const curTag = data[ort];
            if (isArray(curTag.data))
              curTag.data.push({
                v: tag.numTag,
                name: tag.tagName,
                c: ele.color,
                r: Math.sqrt(tag.numTag / Math.PI) * ele.size,
                id: tag.tagId,
              } as singleTag);
          } else {
            // Element doesnt exist and needs to be added
            const newTagData: circleData = {
              lat: Number(tag.lat),
              lon: Number(tag.lon),
              osm: tag.osmId ? tag.osmId : -1,
              ortName: tag.ortNamelang ? tag.ortNamelang : "",
              layer: layer,
              size: Math.sqrt(tag.numTag / Math.PI) * ele.size,
              strokeWidth: 1,
              data: [
                {
                  v: tag.numTag,
                  name: tag.tagName,
                  c: ele.color,
                  r: Math.sqrt(tag.numTag / Math.PI) * ele.size,
                  id: tag.tagId,
                },
              ] as singleTag[],
            };
            data.push(newTagData);
          }
        }
      }
    }
    for (const ort of data) {
      let s = ort.size;
      if (ort.data.length < 2) {
        s = ort.data[0].r;
      }
      const rad = (s * 2) / this.kmPerPixel;
      var circleIcon = L.icon({
        iconSize: [rad, rad],
        className: "circle-draw",
        iconUrl: this.drawCircleDiagram(
          ort.size,
          0.5,
          "#000",
          ort.data[0].c,
          ort.data,
          true
        ),
      });
      L.marker([ort.lat, ort.lon], {
        icon: circleIcon,
      })
        .addTo(ort.layer)
        .on("click", (e) => {
          const ids = [];
          for (const tag of ort.data) {
            const id = tag.id ? Number(tag.id) : -1;
            if (id != -1) ids.push(id);
          }
          this.selectedOrt = ort;
          this.AM.fetchAntwortAudio({ ids: ids, osmId: ort.osm });
          this.showAudio = true;
        });
      // @ts-ignore
      this.map.addLayer(ort.layer);
    }
  }

  displayOrt(map: any, layer: L.LayerGroup) {
    if (this.searchTerm) {
      const ort: ApiLocSingleResponse = this.searchTerm.content;
      const color = this.colors[this.colorid];
      const radius = 100 * this.kmPerPixel;
      const circle = this.addCircleMarkerToMap(
        Number(ort.lat),
        Number(ort.lon),
        color,
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

  displayParameters(para: Parameter[]) {
    for (const p of para) {
      if (p.tagList) {
        const ids = [];
        p.tagList.forEach((el) => {
          this.TaM.fetchTagOrteResultsMultiple({ ids: el.tagIds });
          // this.displayCircle(el.tagIds);
        });
      }
    }
  }

  displayDataFromLegend(legend: LegendGlobal[]) {
    // @ts-ignore
    const map = this.$refs.map.mapObject;
    this.clearLayer();
    this.showLegend = true;
    for (const l of legend) {
      const layer = l.layer ? l.layer : L.layerGroup();
      switch (l.type) {
        case SearchItems.Tag:
          this.displayCircle(l);
          break;
        case SearchItems.Ort:
          this.displayOrt(map, layer);
          break;
        case SearchItems.Query:
          if (l.parameter) this.displayParameters(l.parameter);
          break;
      }
    }
  }

  displayTag(map: any, layer: L.LayerGroup) {
    if (this.searchTerm) {
      const tag = this.searchTerm.content.tagId;
      const color = this.colors[this.colorid];
      const radius = 12;
      return this.loadTagOrt(tag).then((res) => {
        const curr = this.tagOrtResult;
        if (curr.length > 0) {
          // const divFactor = Math.sqrt(ele.numTag / Math.PI);
          const newLegend = {
            color: color,
            size: radius / this.kmPerPixel,
            type: SearchItems.Tag,
            content: curr,
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

  displayData() {
    const newLayer = L.layerGroup();
    this.clearLayer();
    this.showLegend = true;
    if (this.searchTerm) {
      // @ts-ignore
      const map = this.$refs.map.mapObject;
      this.colorid++;
      if (this.searchTerm.type === SearchItems.Ort) {
        const leg = this.displayOrt(map, newLayer);
        this.LM.addLegendEntry(leg);
        this.setMapToPoint(
          Number(leg?.content.lat),
          Number(leg?.content.lon),
          10
        );
        return true;
      } else if (this.searchTerm.type === SearchItems.Tag) {
        this.resetMap();
        this.LM.addLegendEntry(this.displayTag(map, newLayer));
        this.displayCircle(this.legendGlobal[this.legendGlobal.length - 1]);
        return true;
      }
      if (this.colorid >= this.colors.length) {
        this.colorid = 0;
      }
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

  computeMPerPixel(center: number, zoom: number) {
    /*this.kmPerPixel =
      (40075016.686 * Math.abs(Math.cos((center * Math.PI) / 180))) /
      Math.pow(2, zoom + 8) /
      1000;
      */
    this.kmPerPixel =
      (156543.03392 * Math.cos((center * Math.PI) / 180)) / Math.pow(2, zoom);
  }

  async loadTagOrt(tagId: number) {
    await tagModule.fetchTagOrteResults({ tagId: tagId });
  }

  // lifecycle hook
  mounted() {
    console.log("Map mounted");
    this.kmPerPixel =
      (156543.03392 * Math.cos((defaultCenter[0] * Math.PI) / 180)) /
      Math.pow(2, defaultZoom) /
      1000;
    if (!this.erhebungen?.orte || this.erhebungen.orte.length === 0) {
      erhebungModule.fetchErhebungen().then((res) => {
        this.addSearchTerms(this.tagListFlat, SearchItems.Tag, "tagName");
        this.addSearchTerms(this.erhebungen, SearchItems.Ort, "ort_namelang");
      });
    }

    this.PM.fetchAllPhaen();
    this.TM.fetchTranscripts();
    this.TM.fetchEinzelerhebungen();

    if (this.legendGlobal.length > 0) {
      this.displayDataFromLegend(legendMod.legend);
    }

    this.map.on("zoomend", (e: any) => {
      this.computeMPerPixel(this.map.getCenter().lat, this.map.getZoom());
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