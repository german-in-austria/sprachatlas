<template>
  <div>
    <v-layout>
      <v-card
        outlined
        elevation="2"
        class="mx-auto search-overlay justify-center"
        xs12
      >
        <v-card-actions>
          <v-flex xs8>
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
          </v-flex>
          <v-spacer xs1></v-spacer>
          <v-flex xs2>
            <v-select
              solo
              v-model="selSearchModel"
              :items="selSearchItem"
              v-on:change="changeSearchTerms"
              item-text="name"
              item-value="value"
            >
            </v-select>
          </v-flex>
        </v-card-actions>
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
    <v-layout class="map-overlay legend" v-if="dataArray.length > 0">
      <v-card elevation="2" class="mx-auto" max-width="500" min-width="250">
        <v-divider class="mx-4"></v-divider>
        <v-card-title>Legende</v-card-title>
        <v-card-text class="mx-auto">
          <v-list class="transparent">
            <v-list-item v-for="(d, i) in dataArray">
              <v-list-item-icon>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  transition="scale-transition"
                  :close-on-content-click="false"
                  :return-value.sync="color"
                  min-width="auto"
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
                        :radius="d.size"
                        :fillCol="d.color"
                        :strokeWidth="d.strokeWidth"
                      />
                    </v-avatar>
                  </template>
                  <template>
                    <v-card>
                      <v-card-title>Farbe</v-card-title>
                      <v-card-text
                        @click="
                          onLegendChange(
                            d.layer,
                            d.color,
                            d.size,
                            d.strokeWidth,
                            d.strokeColor
                          )
                        "
                      >
                        <v-color-picker
                          v-model="d.color"
                          hide-inputs
                          class="mx-auto"
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
                          max="20"
                          @change="
                            onLegendChange(
                              d.layer,
                              d.color,
                              d.size,
                              d.strokeWidth,
                              d.strokeColor
                            )
                          "
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
                          @change="
                            onLegendChange(
                              d.layer,
                              d.color,
                              d.size,
                              d.strokeWidth,
                              d.strokeColor
                            )
                          "
                        ></v-slider
                      ></v-card-text>
                    </v-card>
                  </template>
                </v-menu>
              </v-list-item-icon>
              {{ d.term }}
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
    >
      <l-tile-layer :url="tileSetUrl" />

      <l-geo-json v-if="showBundesl" :geojson="bundeslaender" />
      <l-geo-json v-if="showGemeinden" :geojson="gemeinden" />
      <l-geo-json v-if="showDiaReg" :geojson="dialektregionen" />
      <template v-if="tagData.data && tagData.data.length > 1">
        <template v-for="(d, index) in tagData.res">
          <l-marker :lat-lng="[d.lat, d.lon]" :key="index + d.tagName">
            <l-icon
              :icon-size="[
                (d.radius * 2) / mPerPixel,
                (d.radius * 2) / mPerPixel,
              ]"
              :icon-url="
                drawCircleDiagram(
                  24,
                  1,
                  d.strokeColor,
                  d.color,
                  [d.numTag],
                  true
                )
              "
            />
          </l-marker>
        </template>
      </template>
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
} from "../static/apiModels";
import { erhebungModule } from "../store/modules/erhebungen";
import { transModule } from "../store/modules/transcripts";

import api from "../api/index";
import { tagModule } from "@/store/modules/tags";
import { flatten } from "lodash";
import IconBase from "@/icons/IconBase.vue";
import IconCircle from "@/icons/IconCircle.vue";

const defaultCenter = [47.64318610543658, 13.53515625];
const defaultZoom = 8;
const standardFactor = 300;

type tagDataObj = {
  data: Array<{
    v: number;
    name: string;
    c: string;
  }>;
  res: TagOrteResults[];
  size: number;
  strokeWidth: number;
  lat: number;
  lon: number;
  osm: number;
  layer: L.LayerGroup | null;
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
  mPerPixel: number = 0;
  center: number[] = defaultCenter;
  sideBar: boolean = false;
  EM = erhebungModule;
  TM = transModule;
  TaM = tagModule;
  searchInput: string = "";
  searchTerms: { type: SearchItems; content: any; name: string }[] = [];

  mapComp = null;
  selSearchModel = SearchItems.Alle;
  selSearchItem = [
    { name: "Alles", value: SearchItems.Alle },
    { name: "Nur Orte", value: SearchItems.Ort },
    { name: "Tags", value: SearchItems.Tag },
  ];
  currentErhebungen = null;
  // TODO: Organsieren als Array mit Objekten
  // Tag/Ort als ID des Layers
  focusLayer: L.LayerGroup | null = null;

  showIcon: boolean = false;

  focusLayers: Array<{ layer: L.LayerGroup; name: string }> = [];

  // Contains the data for the tag Array
  dataArray: Array<{
    data: TagOrteResults[] | ApiLocSingleResponse;
    color: string;
    size: number;
    strokeColor: string;
    strokeWidth: number;
    term: string;
    layer: L.LayerGroup | null;
  }> = [];

  colorid = 0;

  colors = ["#F00", "#0F0", "#0FF", "#FF0", "#0FF", "#F0F"];

  tagData = [
    {
      data: [],
      res: [],
      size: 1,
      strokeWidth: 1,
      lat: 0,
      lon: 0,
      osm: 0,
      layer: null,
    },
  ] as tagDataObj[];

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
    console.log(data);
    drawCircleDiagram(size, border, borderColor, color, data, encoded);
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

  onLegendChange(
    layer: L.LayerGroup,
    color: string,
    size: number,
    strokeWidth: number,
    strokeColor: string
  ) {
    layer.eachLayer((l: L.Layer) => {
      if (l instanceof L.CircleMarker) {
        l.setRadius(size);
        l.setStyle({
          color: strokeColor,
          weight: strokeWidth,
          fillColor: color,
        });
      }
    });
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

  displayOrt(map: any, layer: L.LayerGroup) {
    if (this.searchTerm) {
      const ort: ApiLocSingleResponse = this.searchTerm.content;
      const color = this.color[this.colorid];
      const radius = 4;
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
      this.dataArray.push({
        data: ort,
        color: color,
        size: radius,
        strokeColor: color,
        strokeWidth: 1,
        term: ort.ort_namekurz,
        layer: layer,
      });
      return true;
    }
  }

  displayTag(map: any, layer: L.LayerGroup) {
    const tagLayer = L.layerGroup();
    if (this.searchTerm) {
      const tag = this.searchTerm.content.tagId;
      const tagName = this.searchTerm.content.tagName;
      const color = this.color[this.colorid];
      const radius = 15;
      this.resetMap();
      return this.loadTagOrt(tag).then((res) => {
        const curr = this.tagOrtResult;
        if (curr.length > 0) {
          let divFactor = 0;
          for (const ele of curr) {
            divFactor = Math.sqrt(ele.numTag / Math.PI);
            const ort = this.tagData.findIndex(
              (tD) =>
                (ele.osmId && ele.osmId == tD.osm) ||
                (ele.lon &&
                  ele.lat &&
                  tD.lon === Number(ele.lon) &&
                  tD.lat === Number(ele.lat))
            );
            if (ort > -1) {
              // Element with coordiantes already exists in Array
              const currArray = this.tagData[ort];
              currArray.data.push({
                v: ele.numTag,
                name: ele.tagName,
                c: color,
              });
            } else {
              // Doesn't exist in Array
              const newTagData: tagDataObj = {
                res: curr,
                size: radius,
                strokeWidth: 1,
                lat: Number(ele.lat),
                lon: Number(ele.lon),
                osm: ele.osmId ? ele.osmId : -1,
                layer: tagLayer,
                data: [
                  {
                    v: ele.numTag,
                    name: ele.tagName,
                    c: color,
                  },
                ],
              };
              this.tagData.push(newTagData);
            }
            /*
            // @ts-ignore
            circ.on("click", (e) => this.setTagDataMap(e.latlng));
            circ
              .bindPopup(
                ele.ortNamelang
                  ? ele.ortNamelang.split(",")[0]
                  : "Kein Name vorhanden"
              )
              .openPopup();*/
          }
          this.dataArray.push({
            data: curr,
            color: color,
            size: divFactor * radius,
            strokeColor: color,
            strokeWidth: 1,
            term: tagName,
            layer: layer,
          });
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
      if (this.searchTerm.type === SearchItems.Ort) {
        return this.displayOrt(map, newLayer);
      } else if (this.searchTerm.type === SearchItems.Tag) {
        return this.displayTag(map, newLayer);
      }
      if (this.colorid >= this.colors.length) {
        this.colorid = 0;
      }
      this.colorid++;
    } else {
      // TODO Add further error banner if data cant be loaded
      return false;
      console.log("Empty");
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
    this.mPerPixel =
      (156543.03392 * Math.cos((center * Math.PI) / 180)) / Math.pow(2, zoom);
  }

  async loadTagOrt(tagId: number) {
    await tagModule.fetchTagOrteResults({ tagId: tagId });
  }

  // lifecycle hook
  mounted() {
    console.log("Map mounted");
    this.mPerPixel =
      (156543.03392 * Math.cos((defaultCenter[0] * Math.PI) / 180)) /
      Math.pow(2, defaultZoom);
    if (!this.erhebungen?.orte || this.erhebungen.orte.length === 0) {
      erhebungModule.fetchErhebungen().then((res) => {
        this.addSearchTerms(this.tagListFlat, SearchItems.Tag, "tagName");
        this.addSearchTerms(this.erhebungen, SearchItems.Ort, "ort_namelang");
      });
    }

    this.TM.fetchTranscripts();
    this.TM.fetchEinzelerhebungen();

    if (this.tagList.length > 0) {
    }
  }

  created() {
    this.map.on("zoomstart", () => {
      this.curZoom.start = this.map.getZoom();
    });

    this.map.on("zoomend", () => {
      this.curZoom.end = this.map.getZoom();
      const diff = this.curZoom.start - this.curZoom.end;
      this.computeMPerPixel(defaultCenter[0], this.map.getZoom());
    });
  }

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