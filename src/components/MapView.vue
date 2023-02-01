<template>
  <div>
    <v-layout>
      <v-card
        outlined
        elevation="2"
        class="search-overlay justify-center rounded-lg"
        v-if="showSearchBar"
      >
        <v-container class="ma-0" style="height: 80px">
          <v-row style="padding-bottom: 5px" align-content="center">
            <v-col cols="1" align="center" justify="center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    class="zoom"
                    @click="showSearchBar = !showSearchBar"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </template>
                <span> Suchleiste verbergen</span>
              </v-tooltip>
            </v-col>
            <v-col cols="6" class="mt-1">
              <v-autocomplete
                ref="searchTermAutoComplete"
                v-model="searchTerm"
                :items="searchTerms"
                :filter="customFilter"
                :loading="autoCompleteLoading"
                :search-input.sync="searchInput"
                solo
                clearable
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
                        >{{ item.content.tagGene }}.Generation - Kürzel:
                        {{ item.content.tagAbbrev }}</v-list-item-subtitle
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
                    <template v-if="item.type === 2">
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                      <v-list-item-subtitle
                        v-if="item.content.bezPhaenber.length > 0"
                        >Phänomenbereich:
                        {{ item.content.bezPhaenber }}</v-list-item-subtitle
                      >
                    </template>
                    <template v-else-if="item.type === 4">
                      <template v-if="item.content.aufgabenstellung !== ''">
                        <v-list-item-title>
                          {{ item.content.aufgabenstellung }}</v-list-item-title
                        >
                      </template>
                      <template v-else-if="item.content.beschreibung !== ''">
                        <v-list-item-title>
                          {{ item.content.beschreibung }}</v-list-item-title
                        >
                      </template>
                      <template v-else>
                        <v-list-item-title>
                          {{ item.content.kontext }}</v-list-item-title
                        >
                      </template>
                      <v-list-item-subtitle
                        >{{ item.name ? item.name : item.kontext }} -

                        {{
                          item.content.artBezeichnung
                            ? `Aufgabenart: ${item.content.artBezeichnung}`
                            : `Aufgabensetname: ${item.content.asetName}`
                        }}</v-list-item-subtitle
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
            <v-col cols="1" class="mt-2">
              <AgeRange />
            </v-col>
            <v-col class="mt-2">
              <ErhebungsArt />
            </v-col>
            <v-col cols="1" class="mt-2">
              <PhaenAufgabenSearch
                icon="mdi-magnify"
                :tagListFlat="tagListFlat"
                v-on:displayAsetOnMap="displayAset"
                v-on:displayAufgabenOnMap="displayAufgaben"
              />
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
                  <div v-for="(para, i) in item.parameter" :key="i">
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
    <v-layout class="map-overlay btn-overlay pa-5">
      <v-flex>
        <v-row>
          <v-btn fab small class="zoom" @click="zoom = zoom + 1">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn fab small class="zoom" @click="zoom = zoom - 1">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </v-row>
        <v-row>
          <v-btn fab small class="zoom" @click="resetMap()">
            <v-icon>mdi-home</v-icon>
          </v-btn>

          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                small
                v-bind="attrs"
                v-on="on"
                class="zoom"
                @click.stop="dialog = true"
              >
                <v-icon>mdi-export</v-icon>
              </v-btn>
            </template>
            <span> Karteneinstellungen exportieren </span>
          </v-tooltip>
        </v-row>
        <v-row>
          <v-tooltip right v-if="!showSearchBar">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                small
                v-bind="attrs"
                v-on="on"
                class="zoom"
                @click="showSearchBar = !showSearchBar"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
            <span> Suchleiste anzeigen</span>
          </v-tooltip>
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                small
                v-bind="attrs"
                v-on="on"
                class="zoom"
                @click="resetPosition"
              >
                <v-icon>mdi-undo</v-icon>
              </v-btn>
            </template>
            <span> Positionen zurücksetzen</span>
          </v-tooltip>
        </v-row>
      </v-flex>
      <v-flex class="text-xs-right" offset-xs11>
        <v-btn small fab @click="sideBar = !sideBar">
          <v-icon>mdi-layers</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-dialog
        max-width="750"
        v-model="dialog"
        transition="dialog-top-transition"
      >
        <ExportMap :vis.sync="dialog" />
      </v-dialog>
    </v-layout>
    <v-layout class="card-overlay">
      <div v-for="(d, idx) in pinnedData" :key="idx">
        <v-slide-y-reverse-transition tag="Changev-layout">
          <dragable-card
            v-if="d.showCard"
            class="audioCard"
            component="audio-card"
            :props="{
              showDataSideways: showDataSideways,
              data: d
            }"
            :func="{
              hideCard: changeShowAudio
            }"
            @interface="getInterface"
          />
        </v-slide-y-reverse-transition>
      </div>
    </v-layout>
    <v-layout class="card-overlay">
      <div v-for="(d, idx) in pinnedVarCards" :key="idx">
        <component is="v-slide-y-reverse-transition">
          <dragable-card
            v-if="d.isShown"
            class="varCard"
            component="variation-card"
            :props="{
              data: d,
              loading: varLoading
            }"
            :func="{ hideCard: hideVarCard }"
            @interface="getInterface"
          />
        </component>
      </div>
    </v-layout>
    <v-layout class="map-overlay buttons">
      <div v-for="(d, idx) in pinnedData" :key="idx">
        <template
          v-if="
            !d.showCard &&
            d.antwortAudio &&
            d.antwortAudio.length > 0 &&
            d.selectedOrt
          "
        >
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                rounded
                class="drawer-down"
                v-bind="attrs"
                v-on="on"
                @click="changeShowAudio(d.id)"
              >
                <v-icon>mdi-chevron-double-up</v-icon>
              </v-btn>
            </template>
            <span>
              Verfügbare Audioaufnahmen für
              {{ d.selectedOrt.ortName.split(',')[0] }}
            </span>
          </v-tooltip>
        </template>
      </div>
    </v-layout>
    <v-layout class="map-overlay button-var">
      <div v-for="(d, idx) in pinnedVarCards" :key="idx">
        <template v-if="!d.isShown">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                rounded
                class="drawer-down"
                v-bind="attrs"
                v-on="on"
                @click="hideVarCard(d)"
              >
                <v-icon>mdi-chevron-double-up</v-icon>
              </v-btn>
            </template>
            <span>
              {{ d.diagramTitle }}
            </span>
          </v-tooltip>
        </template>
      </div>
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
            @click:row="loadInfErhebung"
          >
            <template v-slot:[`item.Art_Erhebung`]="{ item }">{{
              item.Art_Erhebung
                ? item.Art_Erhebung.Bezeichnung
                : 'Keine Art der Erhebung vorhanden'
            }}</template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn depressed color="blue" @click="closeInfCard()">
            Schließen
          </v-btn>
        </v-card-actions>
      </v-card>
      <template v-if="infOrtLoading">
        <v-skeleton-loader min-width="500" type="article, actions">
        </v-skeleton-loader>
      </template>
      <template v-else>
        <v-card
          v-if="infOrtErhebungen.length > 0"
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
              :headers="headerInf"
              :items="infOrtErhebungen"
            >
              <template v-slot:[`item.Datum`]="{ item }">{{
                new Date(item.Datum).toLocaleString()
              }}</template>
              <template v-slot:[`item.Kommentar`]="{ item }">{{
                item.Kommentar
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
      </template>
    </v-layout>
    <dragable-card
      class="legend"
      component="legend-item"
      :props="{
        vis: showLegend,
        propCircl: showDataSideways
      }"
      :func="{ callChange: splitTags, changeVis: changeLegVis }"
      @interface="getInterface"
    />
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
      class="mapStyle"
      v-show="!loading"
      :zoom.sync="zoom"
      :center.sync="center"
      :options="mapOptions"
      ref="map"
    >
      <l-layer-group ref="points" />
      <l-tile-layer :url="tileSetUrl" />

      <l-geo-json v-if="showBundesl" :geojson="bundeslaender" />
      <l-geo-json v-if="showGemeinden" :geojson="gemeinden" />
      <l-geo-json
        v-if="showDiaReg"
        :geojson="dialektregionen"
        :options="geoJsonOptions"
        :options-style="styleFunction"
      />
      <template v-if="showGemeinden">
        <l-circle-marker
          v-for="(ort, index) in erhebungen"
          :key="index"
          :lat-lng="[ort.lat, ort.lon]"
          :radius="4"
          @click="loadErheb(ort)"
        >
          <l-popup>
            <div>
              {{ ort.ort_namelang.split(',')[0] }}
            </div>
          </l-popup>
        </l-circle-marker>
      </template>
    </l-map>
  </div>
</template>
<script lang="ts">
import L from 'leaflet';
import {
  LMap,
  LTileLayer,
  LMarker,
  LGeoJson,
  LCircleMarker,
  LPopup,
  LIcon,
  LLayerGroup
} from 'vue2-leaflet';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { geoStore } from '../store/geo';
import * as geojson from 'geojson';
import {
  computePropCircle,
  drawCircleDiagram,
  drawRect,
  drawTriangle,
  drawCircle
} from '@/helpers/MapCompute';

import { expData } from '@/service/ExportBase';

import { selectColor, convertHslToStr, hslToHex, generateID, loadData } from '@/helpers/helper';
import LegendItem from '@/components/LegendItem.vue';

import {
  ApiLocationResponse,
  ApiLocSingleResponse,
  einzErhebung,
  SearchItems,
  TagOrteResults,
  LegendGlobal,
  Parameter,
  Symbols,
  SearchTerm,
  singleEntry,
  Description,
  circleData,
  pinData,
  pinDataVar
} from '../static/apiModels';
import { erhebungModule } from '../store/modules/erhebungen';
import { transModule } from '../store/modules/transcripts';
import { phaeModule } from '@/store/modules/phaenomene';
import { aufgabenModule } from '@/store/modules/aufgaben';
import { messageHandler } from '@/store/modules/message';
import { tagModule } from '@/store/modules/tags';
import { legendMod } from '@/store/modules/legend';
import { cloneDeep, once } from 'lodash';
import IconBase from '@/icons/IconBase.vue';
import IconCircle from '@/icons/IconCircle.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import AgeRange from '@/components/AgeRange.vue';
import ErhebungsArt from '@/components/ErhebungsArt.vue';
import ExportMap from '@/components/ExportMap.vue';
import DataSwitch from '@/components/DataSwitch.vue';
import PhaenAufgabenSearch from '@/components/PhaenAufgabenSearch.vue';
import VariationCard from './VariationCard.vue';
import DragableCard from './DragableCard.vue';

import { IGetPresetOrtTagResult } from '@/api/dioe-public-api/models/IGetPresetOrtTagResult';


import { getOrtName } from '@/helpers/helper';
import {
  AntwortenFromAufgabe,
  ISelectOrtAufgabeResult,
  tagDto,
  TagTree
} from '@/api/dioe-public-api';

const defaultCenter = [47.64318610543658, 13.53515625];
const defaultZoom = 8;

@Component({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LGeoJson,
    LCircleMarker,
    LPopup,
    LLayerGroup,
    LIcon,
    IconBase,
    IconCircle,
    LegendItem,
    AudioPlayer,
    AgeRange,
    ErhebungsArt,
    ExportMap,
    DataSwitch,
    PhaenAufgabenSearch,
    VariationCard,
    DragableCard
  }
})
export default class MapView extends Vue {
  zoom: number = defaultZoom;
  kmPerPixel: number = 0;
  center: L.LatLng = new L.LatLng(defaultCenter[0], defaultCenter[1]);
  sideBar: boolean = false;
  EM = erhebungModule;
  TM = transModule;
  TaM = tagModule;
  PM = phaeModule;
  LM = legendMod;
  AM = aufgabenModule;
  MM = messageHandler;
  searchInput: string = '';
  searchTerms: Array<SearchTerm> = [];

  selectionMenu: boolean = false;
  selectedOrt: circleData | null = null;
  selectedDataidx: number = 0;
  showAudio: boolean = false;
  showLegend: boolean = false;
  phaenSelection = [];
  mapComp = null;
  selSearchModel = SearchItems.Alle;
  selSearchItem = [
    { name: 'Alles', value: SearchItems.Alle },
    { name: 'Nur Orte', value: SearchItems.Ort },
    { name: 'Tags', value: SearchItems.Tag },
    { name: 'Phänomene', value: SearchItems.Phaen },
    { name: 'Aufgaben', value: SearchItems.Aufgaben },
    { name: 'Presettags', value: SearchItems.Presets }
  ];
  selGen = -1;
  generation = [
    { name: 4, value: 4 },
    { name: 3, value: 3 },
    { name: 2, value: 2 },
    { name: 1, value: 1 },
    { name: 0, value: 0 },
    { name: 'Alle Generationen', value: -1 }
  ];

  currentErhebungen = null;

  focusLayer: L.LayerGroup | null = null;

  showIcon: boolean = false;

  focusLayers: Array<{ layer: L.LayerGroup; name: string }> = [];

  colorid = 0;
  iconId = 0;

  currentErhebung: ApiLocSingleResponse | null = null;
  _debounceId = 0;
  dbLoading = false;
  showBundesl = false;
  showGemeinden = false;
  showDiaReg = false;
  showDataSideways = false;
  showDataProp = false;
  searchTerm: SearchTerm | null = null;
  geoStore = geoStore;

  curZoom = {
    start: 0,
    end: 0
  };

  dialog = false;

  showSearchBar = true;

  headerErheb = [
    { text: 'Art der Erhebung', value: 'Art_Erhebung' },
    { text: 'Bezeichnung der Erhebung', value: 'Bezeichnung_Erhebung' }
  ];

  headerInf = [
    { text: 'Datum', value: 'Datum' },
    { text: 'Kommentar', value: 'Kommentar' },
    { text: 'Aktionen', value: 'actions' }
  ];

  mapOptions = {
    scrollWheelZoom: true,
    zoomControl: false,
    renderer: L.canvas(),
    wheelPxPerZoomLevel: 150,
    maxZoom: 10,
    minZoom: 7,
    maxBounds: L.latLngBounds(L.latLng(46.0, 8.0), L.latLng(49.5, 19.0))
  };


  audioInf = [
    { text: 'Audio', value: 'audio' },
    { text: 'Transkript', value: 'trans' },
    { text: 'Kommentar', value: 'komm' }
  ];

  tileSets = [
    {
      name: 'Humanitarian Open Tiles',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png '
    }/*,
    {
      name: 'Wikimedia',
      url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=local'
    }*/,
    {
      name: 'Minimal Ländergrenzen (hell)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
    },
    {
      name: 'Minimal Ländergrenzen (dunkel)',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?lang=de',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd'
    }
  ];

  items = [
    { name: this.tileSets[0].name, value: 0 },
    { name: this.tileSets[1].name, value: 1 },
    { name: this.tileSets[2].name, value: 2 }
    //{ name: this.tileSets[3].name, value: 3 }
  ];

  selectedTileSet = 0;

  get erhebungen() {
    return erhebungModule.erhebungen
      ? erhebungModule.erhebungen
      : ([] as ApiLocSingleResponse[]);
  }

  getAudioPath(
    path: string,
    file: string,
    startMin: number,
    startSec: number,
    stopMin: number,
    stopSec: number
  ) {
    return `https://dioedb.dioe.at/private-media/${path}/${file}#t=${startMin * 60 + startSec
      },${stopMin * 60 + stopSec}`;
  }

  get diagramData() {
    return this.AM.diagramData;
  }

  get diagramTitle() {
    return this.AM.diagramTitle;
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


  get layerGroup(): L.LayerGroup {
    // @ts-ignore
    return this.$refs.points.mapObject;
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

  get pinnedData() {
    return this.LM.pinnedData;
  }

  get pinnedVarCards() {
    return this.LM.pinDataVar;
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

  get isDarkMode() {
    return this.$vuetify.theme.dark;
  }

  get phaen() {
    return this.PM.phaen;
  }

  get phaenLoading() {
    return this.PM.loading;
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


  get map(): L.Map {
    // @ts-ignore
    return this.$refs.map.mapObject;
  }

  get loading() {
    return erhebungModule.loading;
  }

  get ageRange() {
    return legendMod.ageRange;
  }

  get erhArt() {
    return legendMod.erhArtFilter;
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

  get infOrtLoading() {
    return this.EM.infOrtLoading;
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
    return arr;
  }

  get antVariation() {
    return this.AM.antVariation;
  }

  get varLoading() {
    return this.AM.varLoading;
  }

  get infOrtErhebungen() {
    return this.EM.infOrtsErhebungen;
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

  get url() {
    return window.location.href;
  }

  get queryLegend() {
    return this.LM.legend.filter((el) => el.type === SearchItems.Query);
  }

  get phaenTags() {
    return this.PM.phaenTags;
  }

  get asetPhaen() {
    return this.PM.phaenAufgaben;
  }

  @Watch('searchInput')
  search(val: any) {
    if (!val) return;
    this.fetchEntriesDebounced();
  }

  @Watch('iconId')
  onIconIdChange() {
    if (this.iconId >= Object.keys(Symbols).length / 2) {
      this.iconId = 0;
    }
  }

  @Watch('isDarkMode')
  onDarkModeChange() {
    if (this.isDarkMode) {
      this.selectedTileSet = 3;
    } else {
      this.selectedTileSet = 0;
    }
  }


  customFilter(item: SearchTerm, queryText: string, itemText: string) {
    const query = queryText.toLowerCase();
    if (item.type === SearchItems.Tag) {
      const cont = item.content as TagTree;
      return cont.tagAbbrev.toLowerCase().includes(query) || item.name.toLowerCase().includes(query);
    }
    return itemText.toLowerCase().includes(query);
  }

  getColor() {
    return selectColor(null);
  }

  async fetchEntriesDebounced() {
    // cancel pending call
    clearTimeout(this._debounceId);
    this.dbLoading = true;
    this._debounceId = setTimeout(() => {
      this.dbLoading = false;
      if (
        this.selSearchModel === SearchItems.Alle ||
        this.selSearchModel === SearchItems.Aufgaben
      )
        /*this.AM.fetchSaetze({ query: this.searchInput }).then(() =>
          this.addSearchTerms(this.allSaetze, SearchItems.Saetze, 'Transkript')
        );*/
        this.dbLoading = false;
    }, 500);
  }

  splitTags() {
    this.displayDataFromLegend(this.legendGlobal);
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
              color: convertHslToStr(el.color.h, el.color.s, el.color.l),
              weight: el.strokeWidth
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
        name: curr[name]
      });
    }
  }

  closeInfCard() {
    this.currentErhebung = null;
    // @ts-ignore
    this.$refs.map.mapObject.closePopup();
    this.resetMap();

    this.focusLayer?.clearLayers();
    this.searchInput = '';
    this.searchTerm = null;
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

  resetPosition() {
    // @ts-ignore
    this.$options.dragInterface.forEach(el => {
      el.reset();
    })
    // this.$options.dragInterface.reset();
  }

  getInterface(dragInterface: any) {
    // @ts-ignore
    this.$options.dragInterface.push(dragInterface);
  }

  changeLegVis(val: boolean) {
    this.showLegend = val;
  }

  changeSearchTerms() {
    this.searchTerms = [];
    switch (this.selSearchModel) {
      case SearchItems.Ort:
        this.addSearchTerms(this.erhebungen, SearchItems.Ort, 'ort_namelang');
        break;
      case SearchItems.Tag:
        this.addSearchTerms(this.tagListFlat, SearchItems.Tag, 'tagName');
        break;
      case SearchItems.Phaen:
        this.addSearchTerms(this.phaen, SearchItems.Phaen, 'bezPhaenomen');
        break;
      case SearchItems.Aufgaben:
        this.addAufgabenToTerms();
        this.addSearchTerms(this.allSaetze, SearchItems.Saetze, 'Transkript');
        break;
      case SearchItems.Presets:
        this.addSearchTerms(
          this.tagListPreset,
          SearchItems.Presets,
          'Bezeichnung'
        );
        break;
      case SearchItems.Alle:
        this.addAufgabenToTerms();
        this.addSearchTerms(
          this.tagListPreset,
          SearchItems.Presets,
          'Bezeichnung'
        );
        this.addSearchTerms(this.erhebungen, SearchItems.Ort, 'ort_namelang');
        this.addSearchTerms(this.tagListFlat, SearchItems.Tag, 'tagName');
        this.addSearchTerms(this.phaen, SearchItems.Phaen, 'bezPhaenomen');
        this.addSearchTerms(this.allSaetze, SearchItems.Saetze, 'Transkript');
        break;
    }
  }

  addAufgabenToTerms() {
    const aufgaben = this.allAufgaben.filter(el => el.aufgabenstellung !== "");
    const spt = this.allAufgaben.filter(el => el.aufgabenstellung === "" && el.beschreibung !== "");
    const puzzle = this.allAufgaben.filter(el => el.aufgabenstellung === "" && el.beschreibung === "");
    this.addSearchTerms(
      aufgaben,
      SearchItems.Aufgaben,
      'aufgabenstellung'
    );
    this.addSearchTerms(
      spt,
      SearchItems.Aufgaben,
      'beschreibung'
    );
    this.addSearchTerms(
      puzzle,
      SearchItems.Aufgaben,
      'kontext'
    );
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
    if (this.searchTerm) {
      if (await this.displayData(this.searchTerm, true)) {
        this.MM.setSuccessMsg({
          message: `${this.searchTerm.name} wurde hinzugefügt`,
          icon: 'mdi-info'
        });
        // clear data of autocomplete
        //@ts-ignore
        this.$refs.searchTermAutoComplete.reset();
      } else {
        this.MM.setErrorMsg({
          message: `Fehler beim Hinzufügen von ${this.searchTerm.name}`,
          icon: 'mdi-alert-outline'
        });
        console.log('Fehler beim Suchen');
      }
    }
  }

  addCircleMarkerToMap(
    lat: number,
    lon: number,
    color: string,
    stroke: number,
    size: number,
    layer: L.LayerGroup,
    ort: ApiLocSingleResponse
  ) {
    const res = L.circleMarker([lat, lon], {
      fillColor: color,
      color: 'black',
      radius: size,
      weight: stroke,
      opacity: 0.9,
      fillOpacity: 0.9
    }).addTo(layer).on('click', (e) => this.loadErheb(ort));;
    layer.addTo(this.layerGroup);
    // this.map.addLayer(layer);
    return res;
  }

  setMapToPoint(lat: number, lon: number, zoom: number) {
    this.map.flyTo(new L.LatLng(lat, lon), zoom);
    //this.center = new L.LatLng(lat, lon);
    //this.zoom = zoom;
  }

  resetMap() {
    // this.zoom = defaultZoom;
    // this.center = new L.LatLng(defaultCenter[0], defaultCenter[1]);
    this.setMapToPoint(defaultCenter[0], defaultCenter[1], defaultZoom);
  }

  showExport() { }

  changeShowAudio(id: string) {
    const show = this.pinnedData.filter(el => el.id === id)[0]?.showCard;
    this.LM.editPinShowById({ dataId: id, show: !show });
    // d.showCard = !d.showCard;
    this.showAudio = !this.showAudio;
  }

  createRectIcon(ort: circleData, data: singleEntry[]): L.Icon<L.IconOptions> {
    let s = ort.size;
    if (ort.data.length > 1 && this.showDataProp) {
      s = data[0].r;
    }
    const rad = s;
    var rect = L.icon({
      iconSize: [rad, rad * 1.7],
      className: 'circle-draw',
      iconUrl: this.drawRect(3, ort.strokeWidth, data[0].c, true)
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
      className: 'circle-draw',
      iconUrl: drawTriangle(3, ort.strokeWidth, data[0].c, true, 1.0)
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
      className: 'circle-draw',
      iconUrl: this.drawCircleDiagram(
        24,
        ort.strokeWidth,
        '#000',
        data[0].c,
        data,
        true
      )
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
    id: string,
    type: SearchItems,
    parameters?: Parameter
  ): Array<circleData> {
    if (vis) {
      const ort = data.findIndex(
        (tD) => osm === tD.osm || (tD.lon === lon && tD.lat === lat)
      );
      let para: null | Parameter = null;
      if (parameters) {
        para = parameters;
      }
      if (ort > -1) {
        let s = data[ort].size;
        s += size;
        s /= 2;
        // Element with geodata already exists in data
        data[ort].size = s;
        data[ort].data.push({
          v: num,
          name: name,
          c: color,
          r: propSize,
          id: para ? para.id : id,
          icon: icon,
          para: para,
          t: type
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
              id: para ? para.id : id,
              icon: icon,
              para: para,
              t: type
            }
          ] as singleEntry[]
        };
        data.push(newTagData);
      }
    }
    return data;
  }

  hideVarCard(content: pinDataVar) {
    content.isShown = !content.isShown;
    this.LM.editPinDataByID(content);
    this.AM.setDiagramTitle('');
  }

  createIcon(
    ort: circleData,
    data: singleEntry[],
    icon: Symbols
  ): L.Icon<L.IconOptions> {
    switch (icon) {
      case Symbols.Circle:
        return this.createCircleIcon(ort, data);
      case Symbols.Rect:
        return this.createRectIcon(ort, data);
      case Symbols.Tri:
        return this.createTriIcon(ort, data);
    }
  }

  async audioListener(ort: circleData) {
    this.selectedOrt = ort;
    this.showAudio = true;
    const idx = this.selectedDataidx;
    let curr = await this.LM.pushNewData({
      selOrt: ort,
      selIdx: idx,
      isPinned: false,
      antwortAudio: [],
      aufgabeAudio: []
    });
    const type = ort.data[idx].t;
    loadData(ort.data[idx], ort.osm, type, this.ageRange).then(() => {
      switch (type) {
        case SearchItems.Phaen:
        case SearchItems.Query:
        case SearchItems.Tag:
          curr.antwortAudio = this.antwortenAudio;
          break;
        case SearchItems.Aufgaben:
          curr.aufgabeAudio = this.aufgabeSingleOrt;
          break;
      }
      this.LM.editPinnedByID(curr);
    });
  }

  addDataToMap(data: Array<circleData>) {
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
            lonToPoint.y
          ]);
          lonToPoint = this.map.latLngToContainerPoint(lonOffset);
          rad = s;
          const marker = L.marker(lonOffset, {
            icon: circleIcon,
            riseOnHover: true
          })
            .addTo(ort.layer)
            .on('click', (e) => this.audioListener(ort));
          marker.on('mouseover', (e) => this.markerHover(ort, marker, e));
          ort.layer.addTo(this.layerGroup);
          // @ts-ignore
          // this.map.addLayer(ort.layer);
          idx++;
        }
      } else {
        const circleIcon = this.createCircleIcon(ort, ort.data);
        const marker = L.marker([ort.lat, ort.lon], {
          icon: circleIcon,
          riseOnHover: true
        })
          .addTo(ort.layer)
          .on('click', (e) => this.audioListener(ort));
        marker.on('mouseover', (e) => this.markerHover(ort, marker, e));
        ort.layer.addTo(this.layerGroup);
      }
    }
  }

  markerHover(ort: circleData, marker: L.Marker, e: L.LeafletEvent) {
    let str = `<b>${ort.ortName}</b><br />`;
    str += ort.data.map(el => {
      let col = el.c;
      if (el.c.startsWith("hsl")) {
        const hsl = col.substring(4, col.length - 1).replaceAll("%", "").split(",");
        col = hslToHex(Number(hsl[0]), Number(hsl[1]), Number(hsl[2]));
      }
      return `${drawCircle(12, 0.5, col, false, 1.0)} ${el.name}: ${el.v} <br />`
    }).join("");
    marker.bindTooltip(str).openTooltip();
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
        convertHslToStr(aufgabe.color.h, aufgabe.color.s, aufgabe.color.l),
        aufgabe.symbol,
        aufgabe.size,
        aufgabe.vis,
        aufgabe.strokeWidth,
        aufgabe.layer,
        data,
        aufg.osmId ? Number(aufg.osmId) : -1,
        Number(aufg.lon),
        Number(aufg.lat),
        aufg.ortNamelang ? aufg.ortNamelang : '',
        aufg.numAufg ? Number(aufg.numAufg) : 1,
        aufg.aufgabenstellung ? aufg.aufgabenstellung : '',
        propFactor * Number(aufg.numAufg),
        aufg.id ? aufg.id.toString() : '',
        SearchItems.Aufgaben
      );
    }
    return data;
    // this.addDataToMap(data);
  }

  styleFunction(feature: any) {
    const col = this.getColor();
    const fillColor = hslToHex(col.h, col.s * 100, col.l * 100);
    return {
      weight: 2,
      color: "#ECEFF1",
      opacity: 0.8,
      fillColor: feature.properties.color ? feature.properties.color : fillColor,
      fillOpacity: 0.5
    };

  }

  get geoJsonOptions() {
    return {
      onEachFeature: this.onEachFeatureFunction
    };
  }

  get onEachFeatureFunction() {
    return (feature: any, layer: any) => {
      layer.bindTooltip(
        "<div>Region: <br />" +
        feature.properties.name +
        "</div>",
        { permanent: false, sticky: true }
      );

    };
  }


  copyClipboard(str: string) {
    // Exporting queryLegend
    if (this.queryLegend.length > 0) {
      expData.removeEntryTypeFromUri(SearchItems.Query);
      this.queryLegend.forEach(el => expData.pushNewLegend(el, -1));
    }
    navigator.clipboard.writeText(this.url).then(
      () => {
        // Success
      },
      () => {
        // Fail
      }
    );
  }

  async displayAset(asetIds: number[]) {
    await this.AM.fetchAufgabenOrt({ ids: [], asetIds: asetIds });
  }

  async displayAufgaben(ids: number[]) {
    await this.AM.fetchAufgabenOrt({ ids: ids });
    for (const id of ids) {
      const content = this.aufgabenOrt.filter(e => e.id === id);
      const newLeg = await this.LM.createLegendEntry({
        icon: Symbols.Circle,
        layer: L.layerGroup(),
        name: id.toString(),
        color: this.getColor(),
        radius: 30,
        content: content,
        type: SearchItems.Aufgaben
      });
      this.LM.addLegendEntry(newLeg);
      expData.pushNewLegend(newLeg, id)
    }

    this.displayDataFromLegend(this.legendGlobal);
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
        convertHslToStr(tags.color.h, tags.color.s, tags.color.l),
        tags.symbol,
        tags.size,
        tags.vis,
        tags.strokeWidth,
        tags.layer,
        data,
        tag.osmId ? tag.osmId : -1,
        Number(tag.lon),
        Number(tag.lat),
        tag.ortNamelang ? tag.ortNamelang : '',
        tag.numTag,
        tag.tagName,
        propFactor * tag.numTag,
        tag.tagId ? tag.tagId : this.tagListFlat.filter((el) => el.tagAbbrev === tag.tagName)[0].tagId,
        SearchItems.Tag
      );
    }
    return data;
  }

  displayPhaenLegend(
    phaen: LegendGlobal,
    data: Array<circleData>
  ): Array<circleData> {
    phaen.layer.clearLayers();
    const cont = phaen.content as TagOrteResults[];
    const propFactor = computePropCircle(
      cont.map((val) => val.numTag),
      20 * this.kmPerPixel
    );
    for (const ph of cont) {
      data = this.extractTagData(
        convertHslToStr(phaen.color.h, phaen.color.s, phaen.color.l),
        phaen.symbol,
        phaen.size,
        phaen.vis,
        phaen.strokeWidth,
        phaen.layer,
        data,
        ph.osmId ? ph.osmId : -1,
        Number(ph.lon),
        Number(ph.lat),
        ph.ortNamelang ? ph.ortNamelang : '',
        ph.numTag,
        phaen.name,
        propFactor * ph.numTag,
        this.phaen.filter((el) => el.bezPhaenomen === phaen.name)[0].id.toString(),
        SearchItems.Phaen
      );
    }
    return data;
  }

  displayOrt(layer: L.LayerGroup) {
    if (this.searchTerm) {
      const ort: ApiLocSingleResponse = this.searchTerm.content;
      const color = this.getColor();
      const radius = 15;
      const circle = this.addCircleMarkerToMap(
        Number(ort.lat),
        Number(ort.lon),
        convertHslToStr(color.h, color.s, color.l),
        1,
        radius,
        layer,
        ort
      );
      circle.bindPopup(ort.ort_namelang.split(',')[0]);
      this.loadErheb(ort);

      const newLegend = {
        color: color,
        size: radius,
        type: SearchItems.Ort,
        content: {
          lat: Number(ort.lat),
          lon: Number(ort.lon),
          osmId: ort.osm_id,
          ort: getOrtName(ort.ort_namelang).name
        },
        stroke: true,
        strokeWidth: 1,
        parameter: null,
        vis: true,
        name:
          ort.ort_namekurz === '' || ort.ort_namekurz === null
            ? getOrtName(ort.ort_namelang).name
            : ort.ort_namekurz,
        layer: layer
      };
      return newLegend;
    }
  }

  // Parameter darstellen
  // 1. Parameterdaten extrahieren
  // 1a. Daten für den Request ans Backend vorbereiten
  // => d.h. auch mehrere Legenden vorbereiten
  // 2. Request für die Tagdaten durchführen
  // 3. Daten ins content feld vom Parameter einpflegen

  async displayParameters(queries: LegendGlobal[], data: Array<circleData>) {
    //let idToTag = new Map();
    const symbol = this.iconId++;
    const dto = [] as tagDto[];
    for (const q of queries) {
      q.symbol = symbol;
      //idToTag.set(q.id, [] as number[]);
      if (q.parameter) {
        for (const p of q.parameter) {
          const query = {} as tagDto;
          let ids: Array<number> = [];
          if (p.tagList) {
            p.tagList.forEach((el) => {
              /*idToTag.set(
                id,
                idToTag.has(id) ? [...idToTag.get(id), ...el.tagIds] : [...el.tagIds]
              );*/
              ids = ids.concat(el.tagIds);
            });
          }

          if (p.gender !== undefined) {
            query.weiblich = p.gender;
          }

          if (p.education) {
            query.beruf_id = p.education;
          }

          if (p.maxEducation) {
            query.ausbildung = p.maxEducation;
          }

          if (p.project) {
            query.project = p.project;
          }

          if (p.textTokenList && p.textTokenList.length > 0) {
            query.text = p.textTokenList;
          }

          if (p.lemmaList && p.lemmaList.length > 0) {
            query.lemma = p.lemmaList;
          }
          query.group = true;
          if (this.LM.erhArtFilter.length > 0) {
            query.erhArt = this.LM.erhArtFilter;
          }
          query.para = p.id;
          query.ids = [...new Set(ids)];
          dto.push(query);
        }
      }
    }
    for (const q of queries) {
      if (q.parameter) {
        await this.TaM.fetchTagOrteResultsMultiple(dto);
        const tags = cloneDeep(this.tagOrtResult);
        const layer = q.layer ? q.layer : L.layerGroup();
        q.parameter?.forEach((p: Parameter) => {
          const paraId = p.id;
          const returnData = tags.filter((el) => el.para === paraId);
          /*
          const tagIds = idToTag.get(p.id);
          let idsSet: any = [];
          if (!tagIds || tagIds.length === 0) {
            idsSet = [...new Set(tags.map(item => item.tagId))];
          }
          const tagData = tags.filter((el) => {
            if (tagIds && tagIds.length > 0) {
              return idToTag.get(p.id).includes(el.tagId)
            } else if (idsSet.length > 0) {
              return idsSet.includes(el.tagId);
            }
            return false;
          }
          );*/
          q.content = returnData;
          const propFactor = computePropCircle(
            q.content.map((val: any) => val.numTag),
            20 * this.kmPerPixel
          );
          for (const t of q.content) {
            var col = null;
            if (p.color) {
              col = p.color;
            } else {
              var newCol = this.getColor();
              col = convertHslToStr(newCol.h, newCol.s, newCol.l);
            }
            data = this.extractTagData(
              col,
              q.symbol,
              p.size ? p.size : 25,
              p.visible && q.vis,
              q.strokeWidth,
              layer,
              data,
              t.osmId ? t.osmId : -1,
              Number(t.lon),
              Number(t.lat),
              t.ortNamelang ? t.ortNamelang : '',
              t.numTag,
              p.name,
              propFactor * t.numTag,
              '',
              SearchItems.Query,
              p
            );
          }
        });
      }
    }
  }

  drawSentence(legSentence: Array<LegendGlobal>) {
    legSentence.forEach((el) => {
      const content = el.content as Array<AntwortenFromAufgabe>;
      content.forEach((satz) => {
        const circle = this.addCircleMarkerToMap(
          Number(satz.lat),
          Number(satz.lon),
          convertHslToStr(el.color.h, el.color.s, el.color.l),
          1,
          el.size,
          el.layer ? el.layer : L.layerGroup(),
          satz as any
        );
        circle.on('click', (e) => {
          satz.data.forEach((antwort) => {
            // antwort.
          });
          // xthis.selectedOrt = ort;
          this.showAudio = true;
        });
      });
    });
  }

  async displayDataFromLegend(legend: LegendGlobal[]) {
    // this.clearLayer();
    this.showLegend = true;
    this.layerGroup.clearLayers();
    let tagData: Array<circleData> = [];
    let aufData: Array<circleData> = [];
    if (this.legendGlobalQuery.length > 0)
      await this.displayParameters(this.legendGlobalQuery, tagData);
    for (const l of legend) {
      switch (l.type) {
        case SearchItems.Ort:
          // l.layer.clearLayers();
          const ort: any = l.content;
          if (!this.erhebungen) {
            await erhebungModule.fetchErhebungen()
          }
          const erh: any = (this.erhebungen as any as any[]).find((el) => el.osm_id === ort.osmId);
          const circle = this.addCircleMarkerToMap(
            Number(ort.lat),
            Number(ort.lon),
            convertHslToStr(l.color.h, l.color.s, l.color.l),
            l.strokeWidth,
            l.size,
            l.layer,
            erh
          );
          circle.bindPopup(ort.ort.split(',')[0]);
          break;
        case SearchItems.Phaen:
          this.displayPhaenLegend(l, tagData);
          break;
        case SearchItems.Presets:
        case SearchItems.Tag:
          this.displaySingleTagLegend(l, tagData);
          break;
        case SearchItems.Aufgaben:
          this.displayAufgabeFromLegend(l, aufData);
          break;
      }
    }
    this.addDataToMap(this.mergeCircleData([tagData, aufData]));
  }

  mergeCircleData(data: Array<Array<circleData>>): Array<circleData> {
    let res: Array<circleData> = [];
    data.forEach((el: Array<circleData>) => {
      el.forEach((cData: circleData) => {
        const idx = res.findIndex(e => Number(e.osm) === Number(cData.osm));
        if (idx > -1) {
          res[idx].data = res[idx].data.concat(cData.data);
        } else {
          res.push(cData);
        }
      });
    });
    return res;
  }

  async createTagLegend(layer: L.LayerGroup, tagId: number, phaenId: number[], type: SearchItems, name?: string) {
    const color = this.getColor();
    const radius = 30;
    const erhArt = this.erhArt;
    const dto = {
      erhArt: erhArt,
      ids: [tagId],
      phaen: phaenId
    } as tagDto;
    await this.TaM.fetchTagOrteResultsMultiple([dto]);
    const curr = cloneDeep(this.tagOrtResult);
    if (curr.length > 0) {
      const newLegend: LegendGlobal = {
        id: '',
        description: '',
        color: color,
        size: radius,
        type: type,
        content: curr,
        symbol: this.iconId++,
        stroke: true,
        strokeWidth: 1,
        parameter: null,
        vis: true,
        name: name === undefined ? curr[0].tagName : name,
        layer: layer
      };
      return newLegend;
    }
  }

  async displayData(term: SearchTerm, encode: boolean) {
    const newLayer = L.layerGroup();
    // this.clearLayer();
    this.showLegend = true;
    // Variable for the new Legend
    // Is used for the export of the data
    let newLeg: LegendGlobal = {} as LegendGlobal;
    // id of the elment in the database
    let id: number | number[] = -1;
    if (term.type === SearchItems.Ort) {
      const leg = this.displayOrt(newLayer);
      id = leg?.content.osmId ? leg?.content.osmId : -1;
      legendMod.addLegendEntry(leg);
      if (leg && leg !== undefined) {
        newLeg = this.legendGlobal[this.legendGlobal.length - 1];
        this.setMapToPoint(
          Number(leg.content.lat),
          Number(leg.content.lon),
          10
        );
      }
    } else if (term.type === SearchItems.Tag) {
      this.resetMap();
      id = term.content.tagId;
      const res = await this.createTagLegend(newLayer, id as number, [], SearchItems.Tag);
      if (res && res !== undefined) {
        legendMod.addLegendEntry(res);
        this.displayDataFromLegend(this.legendGlobal);
        if (res) newLeg = res;
      }
    } else if (term.type === SearchItems.Phaen) {
      this.resetMap();
      id = term.content.id;
      const res = await this.createTagLegend(newLayer, -1, Array.isArray(id) ? id : [id], SearchItems.Phaen, term.content.bezPhaenomen);
      if (res && res !== undefined) {
        legendMod.addLegendEntry(res);
        this.displayDataFromLegend(this.legendGlobal);
        if (res) newLeg = res;
      }
    } else if (term.type === SearchItems.Presets) {
      this.resetMap();
      const preset = (id = term.content.id);
      await this.TaM.fetchPresetTagOrte(preset);
      // cast result as PresetOrtTagResult
      // @ts-ignore
      const res = cloneDeep(this.tagOrtResult as IGetPresetOrtTagResult[]);
      newLeg = await this.LM.createLegendEntry({
        icon: Symbols.Circle,
        layer: L.layerGroup(),
        name: res[0].presetName,
        color: this.getColor(),
        radius: 20,
        content: res,
        type: SearchItems.Presets
      });
      legendMod.addLegendEntry(newLeg);
      if (res && res !== undefined) {
        this.displayDataFromLegend(this.legendGlobal);
      }
    } else if (term.type === SearchItems.Saetze) {
      const sid = (id = term.content.id);
      const tranksript = term.content.transkript;
      await this.AM.fetchAntworten({ sid: sid });
      const res = this.einzelAntworten;
      this.resetMap();
      newLeg = await this.LM.createLegendEntry({
        icon: Symbols.Circle,
        layer: L.layerGroup(),
        name: tranksript,
        color: this.getColor(),
        radius: 20,
        content: res,
        type: term.type
      });
      this.LM.addLegendEntry(newLeg);
    } else if (term.type === SearchItems.Aufgaben) {
      const content = term.content;
      id =
        this.searchTerms.filter((el: SearchTerm) => el.type === SearchItems.Aufgaben)
          .filter((el: SearchTerm) => el.content.aufgabenstellung === content.aufgabenstellung)
          .map((el) => el.content.aufId);
      await this.AM.fetchAufgabenOrt({ ids: id });
      newLeg = await this.LM.createLegendEntry({
        icon: Symbols.Circle,
        layer: L.layerGroup(),
        name: content.aufgabenstellung,
        color: this.getColor(),
        radius: 30,
        content: this.aufgabenOrt,
        type: term.type
      });
      this.LM.addLegendEntry(newLeg);
      this.displayDataFromLegend(this.legendGlobal);
    }
    if (Object.keys(newLeg).length <= 0) return false;
    if (encode) expData.pushNewLegend(newLeg, id);
    // Encode and export data afterwards to URL Bar
    // Remove certain parts of data
    return true;
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
    const element = this.matchTranscriptID(id);
    this.TM.fetchSingleTranscript({ id: id, page: 0 });
  }

  loadInfErhebung(val: any) {
    const id = val.id;
    const osm = this.currentErhebung?.osm_id ? this.currentErhebung.osm_id : "0";
    erhebungModule.fetchOrtsInfErhebungen({
      osm: osm.toString(),
      erhId: id
    });
    /*
    erhebungModule.fetchInfErhebungen({
      infs: infs
    });*/
  }

  loadErheb(ort: ApiLocSingleResponse) {
    this.currentErhebung = ort;
    this.$forceUpdate();
  }

  computeMPerPixel() {
    const centerLatLng = this.map.getCenter();
    const container = this.map.latLngToContainerPoint(centerLatLng);
    var pointX = L.point([container.x + 1, container.y]); // add one pixel to x
    var pointY = L.point([container.x, container.y + 1]); // add one pixel to y

    // convert containerpoints to latlng's
    var latLngC = this.map.containerPointToLatLng(container);
    var latLngX = this.map.containerPointToLatLng(pointX);
    var latLngY = this.map.containerPointToLatLng(pointY);

    var distanceX = latLngC.distanceTo(latLngX); // calculate distance between c and x (latitude)
    var distanceY = latLngC.distanceTo(latLngY);
    this.kmPerPixel = distanceX / 1000;
  }

  async loadTagOrt(tagId: number) {
    await tagModule.fetchTagOrteResults({ tagId: tagId });
  }

  async fetchContent(id: number | number[], type: SearchItems) {
    if (type === SearchItems.Tag) {
      await this.loadTagOrt(id as number);
      return this.tagOrtResult;
    } else if (type === SearchItems.Phaen) {
      const dto = {
        ids: [-1],
        phaen: id
      } as tagDto;
      await tagModule.fetchTagOrteResultsMultiple([dto]);
      return this.tagOrtResult;
    } else if (type === SearchItems.Presets) {
      await this.TaM.fetchPresetTagOrte(id as number)
      return this.tagOrtResult;
      // cast result as PresetOrtTagResult
      // @ts-ignore
    } else if (type === SearchItems.Saetze) {
      return await this.AM.fetchAntworten({ sid: id as number });
    } else if (type === SearchItems.Aufgaben) {
      await this.AM.fetchAufgabenOrt({ ids: typeof (id) === "number" ? [id] : id });
      return this.aufgabenOrt;
    }
  }

  /*
   * Decode the components of the URI
   * Happens by reading the data from the URI
   * Afterwards converts the recieved data into the internal data structure
   * 1. Create new Legend Entries
   * 2. display these new entries on the map
   */
  async decodeURI() {
    const legend = expData.fetchLegendFromUri();
    if (legend) {
      // legend.forEach((l) => { });
      for (const l of legend) {
        // Same ID is already in use and in the map
        if (
          this.legendGlobal.some(
            (el) => el.id === l.id && el.type === l.type && el.name === l.name
          )
        ) {
          continue;
        }
        // Fetch the needed content for the legend
        const res = await this.fetchContent(l.elementId, l.type);
        // create the new entry
        const lm = await this.LM.createLegendEntry({
          icon: l.symbol,
          layer: L.layerGroup(),
          name: l.name,
          color: l.color,
          radius: l.size,
          content: l.type === SearchItems.Ort ? l.content : res,
          type: l.type
        });
        lm.parameter = l.type === SearchItems.Query ? l.parameter : null;
        this.LM.addLegendEntry(lm);
      }
    }
  }

  // lifecycle hook
  mounted() {
    console.log('Map mounted');
    if (!this.erhebungen || this.erhebungen.length === 0) {
      erhebungModule.fetchErhebungen().then(() => {
        this.changeSearchTerms();
      });
    }

    this.PM.fetchAllPhaen();
    this.TM.fetchTranscripts();
    this.TM.fetchEinzelerhebungen();
    this.$nextTick(() => {
      // @ts-ignore
      this.$refs.map.mapObject.whenReady(() => {
        // this.layerGroup = this.$refs.points.mapObject;
        this.decodeURI().then(() => {
          if (this.legendGlobal.length > 0) {
            messageHandler.setSuccessMsg({
              message: 'Daten werden abgefragt. Dies kann einige Sekunden dauern.',
              icon: 'mdi-info'
            });
            this.displayDataFromLegend(legendMod.legend);

          }
        });
        this.computeMPerPixel();
        this.map.on('zoomend', (e: any) => {
          this.computeMPerPixel();
          // this.displayDataFromLegend(legendMod.legend);
        });
      });
    });
  }

  beforeCreate() {
    //@ts-ignore
    this.$options.dragInterface = [];
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
  @import '../../node_modules/leaflet/dist/leaflet.css';

  html {
    overflow: hidden;
  }

  .map-overlay {
    position: fixed;
    z-index: 1;
    width: 100%;
    left: 0;
    right: 0;
    pointer-events: none;
    * {
      pointer-events: all;
    }
  }

  .card-overlay {
    //height: 100%;
    position: fixed;
    z-index: 1;
    //width: 100%;
    //left: 0;
    //right: 0;
    // top: 55%;
  }

  .btn-overlay {
    top: 100px;
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
    margin-right: 15px;
  }

  .buttons {
    margin-bottom: 0px;
    bottom: 0px;
    left: 25%;
  }

  .button-var {
    margin-bottom: 0px;
    bottom: 0px;
    left: 50%;
  }

  .search-overlay {
    position: relative;
    z-index: 1;
    width: 80%;
    margin-top: 100px;
    margin-left: auto;
    margin-right: auto;
  }

  .audioCard {
    top: 60vh;
    left: 10vw;
    position: fixed;
    width: 600px;
    height: 35vh;
  }

  .varCard {
    top: 71%;
    left: 45%;
    max-width: 450px;
    position: fixed;
  }

  .erhebung {
    bottom: 0;
    margin-bottom: 50px;
    margin-left: 50px;
    width: 35%;
    max-width: 45%;
    height: 35%;
  }

  .legend {
    top: 75%;
    left: 75%;
    position: fixed;
    z-index: 2;
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

  .expand-slide-enter,
  .expand-slide-leave-to {
    transition: max-height 0.25s ease-out;
    transition-property: width;
  }

  .circle-draw {
    animation: 1s ease-out 0s 1 fadeIn;
  }

  .mapStyle {
    z-index: 0;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
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

  .icon {
    order: 0;
  }
  .header {
    order: 1;
  }

  .v-expansion-panel-header__icon {
    margin-left: auto;
  }
</style>