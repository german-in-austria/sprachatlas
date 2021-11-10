<template>
  <div>
    <v-layout>
      <v-card outlined elevation="2" class="search-overlay justify-center">
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
              </v-autocomplete>
            </v-col>
            <v-col cols="2">
              <v-menu
                :close-on-content-click="false"
                :nudge-width="400"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="mx-1" fab small v-bind="attrs" v-on="on">
                    <v-icon> mdi-magnify </v-icon>
                  </v-btn>
                </template>
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
                        <v-list max-height="300px" class="overflow-y-auto" flat>
                          <v-list-item-group
                            v-model="filterMenuValue.length > 0"
                            color="indigo"
                          >
                            <template v-for="(val, i) in filterMenuValue">
                              <v-list-item link>
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
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-col>
            <v-col>
              <v-spacer></v-spacer>
            </v-col>
            <v-col>
              <v-select
                solo
                v-model="selSearchModel"
                :items="selSearchItem"
                v-on:change="changeSearchTerms"
                item-text="name"
                item-value="value"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-layout>
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
            <v-expansion-panel v-for="(item, idx) in legends" :key="idx">
              <v-expansion-panel-header>{{
                item.name
              }}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <div v-for="(para, i) in item.parameter">
                  {{ para.name }}
                  <v-avatar :color="para.color" size="16"></v-avatar>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
    <v-layout class="map-overlay pa-4">
      <v-flex xs1>
        <v-btn fab small class="zoom" @click="zoom = zoom + 1">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn fab small class="zoom" @click="zoom = zoom - 1">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <v-btn
          fab
          small
          @click="
            center = defaultCenter;
            zoom = defaultZoom;
          "
        >
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </v-flex>
      <v-flex class="text-xs-right" offset-xs11>
        <v-btn elevation="4" fab @click="sideBar = !sideBar">
          <v-icon>mdi-layers</v-icon>
        </v-btn>
      </v-flex>
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
    <v-layout class="map-overlay legend" v-if="legendGlobal.length > 0">
      <v-card elevation="2" class="mx-auto" max-width="300" min-width="250">
        <v-divider class="mx-4"></v-divider>
        <v-card-title>Legende</v-card-title>
        <v-card-text class="mx-auto">
          <v-list class="transparent">
            <v-list-item v-for="(d, i) in legendGlobal">
              <v-list-item-icon>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  transition="scale-transition"
                  :close-on-content-click="false"
                  :return-value.sync="color"
                  class="mx-auto pr-100"
                >
                  <!--
                  TODO:
                  In Komponente auslagern
                  Und Daten von dort bearbeiten in Array
                  Farben+Maße seperat pro Datensatz speichern 

                  -->
                  <template v-slot:activator="{ on }">
                    <v-avatar v-on="on">
                      <icon-circle
                        :fillCol="d.color"
                        :strokeWidth="d.strokeWidth"
                      />
                    </v-avatar>
                  </template>
                  <template>
                    <v-card>
                      <v-card-title>Farbe</v-card-title>
                      <v-card-text @click="onLegendChange(d.layer, d)">
                        <v-color-picker
                          v-model="d.color"
                          hide-inputs
                        ></v-color-picker>
                      </v-card-text>
                      <v-divider class="mx-4"></v-divider>
                      <v-card-title>Durchmesser</v-card-title>
                      <v-card-text>
                        {{ d.size }} px
                        <v-slider
                          v-model="d.size"
                          hint="Durchmesser einstellen"
                          min="2"
                          max="50"
                          @change="onLegendChange(d.layer, d)"
                        ></v-slider
                      ></v-card-text>
                      <v-divider class="mx-4"></v-divider>
                      <v-card-title>Durchmesser Rand</v-card-title>
                      <v-card-text>
                        {{ d.strokeWidth }} px
                        <v-slider
                          v-model="d.strokeWidth"
                          hint="Durchmesser von Strich einstellen"
                          min="1"
                          max="10"
                          @change="onLegendChange(d.layer, d)"
                        ></v-slider
                      ></v-card-text>
                    </v-card>
                  </template>
                </v-menu>
              </v-list-item-icon>
              <v-list-item-content class="mx-auto">
                {{ d.name }}
              </v-list-item-content>
              <v-list-item-action>
                <v-container>
                  <v-row>
                    <v-btn icon color="red" @click="deleteLegendEntry(d, i)">
                      <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      color="grey"
                      @click="
                        d.vis = !d.vis;
                        onLegendChange(d.layer, d);
                      "
                    >
                      <template v-if="d.vis">
                        <v-icon>mdi-eye-outline</v-icon>
                      </template>
                      <template v-else>
                        <v-icon>mdi-eye-off-outline</v-icon>
                      </template>
                    </v-btn>
                  </v-row>
                </v-container>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-layout>

    <l-map
      style="z-index: 0; position: absolute; left: 0; top: 0; right: 0"
      v-if="!loading"
      :zoom.sync="zoom"
      :center.sync="center"
      :options="mapOptions"
      ref="map"
      @update:zoom="onMapZoomUpdate()"
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
import {
  ApiLocationResponse,
  ApiLocSingleResponse,
  einzErhebung,
  SingleErhebResponse,
  SearchItems,
  TagOrteResults,
  LegendGlobal,
} from "../static/apiModels";
import { erhebungModule } from "../store/modules/erhebungen";
import { transModule } from "../store/modules/transcripts";
import { phaeModule } from "@/store/modules/phaenomene";

import api from "../api/index";
import { tagModule } from "@/store/modules/tags";
import { legendMod } from "@/store/modules/legend";
import { flatten, isArray } from "lodash";
import IconBase from "@/icons/IconBase.vue";
import IconCircle from "@/icons/IconCircle.vue";

import { getOrtName } from "@/helpers/helper";

const defaultCenter = [47.64318610543658, 13.53515625];
const defaultZoom = 8;
const standardFactor = 300;

type singleTag = {
  v: number;
  name: string;
  c: string;
  r: number;
};

type circleData = {
  data: Array<singleTag>;
  lat: number;
  lon: number;
  osm: number;
  layer: L.LayerGroup;
  size: number;
  strokeWidth: number;
};

type tagDataObj = {
  data: Array<singleTag> | ApiLocSingleResponse;
  res: TagOrteResults[] | null;
  size: number;
  strokeWidth: number;
  lat: number;
  lon: number;
  osm: number;
  layer: L.LayerGroup | null;
  type: SearchItems;
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
  searchInput: string = "";
  searchTerms: { type: SearchItems; content: any; name: string }[] = [];

  selectionMenu: boolean = false;

  mapComp = null;
  selSearchModel = SearchItems.Alle;
  selSearchItem = [
    { name: "Alles", value: SearchItems.Alle },
    { name: "Nur Orte", value: SearchItems.Ort },
    { name: "Tags", value: SearchItems.Tag },
    { name: "Phänomene", value: SearchItems.Phaen },
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
  color: string = "";
  menu = false;
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
   * Multiple Tag Suche mit einzeichnen von Kreisdiagramm
   *
   * Predefined Tags für Ansichten
   *
   * Farben aussuchen für Symbole
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

  selectedTileSet = 2;

  get erhebungen() {
    return erhebungModule.erhebungen
      ? erhebungModule.erhebungen
      : ({} as ApiLocationResponse);
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
    return erhebungModule.loading && tagModule.loading;
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

  onMapZoomUpdate() {
    this.computeMPerPixel(this.map.getCenter().lat, this.map.getZoom());
  }

  openFilter(type: SearchItems) {
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

  deleteLegendEntry(el: LegendGlobal, idx: number | null) {
    const l = el.layer;
    l?.clearLayers();
    if (idx) {
      this.LM.removeEntryByIdx(idx);
    } else {
      this.LM.removeEntryById(el.id);
    }
  }

  onLegendChange(layer: L.LayerGroup, el: LegendGlobal) {
    layer.clearLayers();
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
    // @ts-ignore
    const map = this.$refs.map.mapObject;
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
    this.map.setView(new L.LatLng(lat, lon), zoom);
  }

  resetMap() {
    this.zoom = defaultZoom;
    this.center = defaultCenter;
    this.setMapToPoint(this.center[0], this.center[1], 7);
  }

  displayCircle(tags: LegendGlobal) {
    const radius = 1;
    // Layer where the data is going to be displayed
    const layer = tags.layer ? tags.layer : L.layerGroup();
    // Legendarray with the filtered tag data
    // Array for the extracted Tag data with geo data
    const data = [] as Array<circleData>;
    // Iterate through the array and sort by geo data
    // Get the values for the diagram
    const cont = tags.content as TagOrteResults[];
    if (tags.vis) {
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
              c: tags.color,
            } as singleTag);
        } else {
          // Element doesnt exist and needs to be added
          const newTagData: circleData = {
            lat: Number(tag.lat),
            lon: Number(tag.lon),
            osm: tag.osmId ? tag.osmId : -1,
            layer: layer,
            size: 15,
            strokeWidth: 1,
            data: [
              {
                v: tag.numTag,
                name: tag.tagName,
                c: tags.color,
                r: Math.sqrt(tag.numTag / Math.PI) * radius,
              },
            ] as singleTag[],
          };
          data.push(newTagData);
        }
      }
    }
    for (const ort of data) {
      let s = ort.size;
      if (ort.data.length < 2) {
        s = ort.data[0].r;
      }
      var circleIcon = L.icon({
        iconSize: [(s * 2) / this.kmPerPixel, (s * 2) / this.kmPerPixel],
        iconUrl: this.drawCircleDiagram(
          ort.size,
          0.5,
          "#000",
          ort.data[0].c,
          ort.data,
          true
        ),
      });
      L.marker([ort.lat, ort.lon], { icon: circleIcon }).addTo(layer);
      // @ts-ignore
      this.map.addLayer(layer);
    }
  }

  displayOrt(map: any, layer: L.LayerGroup) {
    if (this.searchTerm) {
      const ort: ApiLocSingleResponse = this.searchTerm.content;
      const color = this.colors[this.colorid];
      const radius = 15;
      const circle = this.addCircleMarkerToMap(
        Number(ort.lat),
        Number(ort.lon),
        color,
        radius,
        layer
      );
      circle.bindPopup(ort.ort_namelang.split(",")[0]).openPopup();
      this.loadErheb(ort);
      this.setMapToPoint(Number(ort.lat), Number(ort.lon), 12);
      const newLegend = {
        color: color,
        size: radius * this.kmPerPixel,
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
      this.LM.addLegendEntry(newLegend);
      return true;
    }
  }

  displayTag(map: any, layer: L.LayerGroup) {
    if (this.searchTerm) {
      const tag = this.searchTerm.content.tagId;
      const tagName = this.searchTerm.content.tagName;
      const color = this.colors[this.colorid];
      const radius = 12;
      this.resetMap();
      return this.loadTagOrt(tag).then((res) => {
        const curr = this.tagOrtResult;
        if (curr.length > 0) {
          // const divFactor = Math.sqrt(ele.numTag / Math.PI);
          const newLegend = {
            color: color,
            size: radius,
            type: SearchItems.Tag,
            content: curr,
            stroke: true,
            strokeWidth: 1,
            parameter: null,
            vis: true,
            name: curr[0].tagName,
            layer: layer,
          };
          this.LM.addLegendEntry(newLegend);
          const nL = this.legendGlobal[this.legendGlobal.length - 1];
          this.displayCircle(nL);
        }
        return true;
      });
    }
  }

  displayData() {
    const newLayer = L.layerGroup();
    this.clearLayer();
    if (this.searchTerm) {
      // @ts-ignore
      const map = this.$refs.map.mapObject;
      this.colorid++;
      if (this.searchTerm.type === SearchItems.Ort) {
        return this.displayOrt(map, newLayer);
      } else if (this.searchTerm.type === SearchItems.Tag) {
        return this.displayTag(map, newLayer);
      }
      if (this.colorid >= this.colors.length) {
        this.colorid = 0;
      }
    } else {
      // TODO Add further error banner if data cant be loaded
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
    this.kmPerPixel =
      (40075016.686 * Math.abs(Math.cos((center * Math.PI) / 180))) /
      Math.pow(2, zoom + 8) /
      1000;
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

    if (this.tagList.length > 0) {
    }
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

  .search-overlay {
    position: relative;
    z-index: 1;
    width: 100%;
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
    margin: 5px;
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
</style>