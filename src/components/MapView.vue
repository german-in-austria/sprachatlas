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
              @change="displayData()"
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
    <v-layout
      class="map-overlay legend"
      v-if="searchTerm && searchTerm.type === getSearchItem.Tag"
    >
      <v-card elevation="2">
        <v-card-text>
          <h2>Daten für Tag {{ searchTerm.content.tagName }}</h2>
        </v-card-text>
        <v-card-text>
          {{ popUpData }}
        </v-card-text>
        <v-divider class="mx-4"></v-divider>
        <v-card-title>Legende</v-card-title>
        <v-card-text>
          <v-list class="transparent">
            <v-list-item>
              <v-list-item-icon>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  transition="scale-transition"
                  :close-on-content-click="false"
                  :return-value.sync="color"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">
                      <icon-circle
                        width="100"
                        height="50"
                        radius="15"
                        fillCol="red"
                      />
                    </v-icon>
                  </template>
                  <v-color-picker
                    v-model="color"
                    hide-canvas
                    hide-inputs
                    show-swatches
                    class="mx-auto"
                  ></v-color-picker>
                </v-menu>
              </v-list-item-icon>
              {{ searchTerm.content.tagName }}
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
      <template v-if="showIcon">
        <template v-for="(ort, index) in tagOrtResult">
          <l-marker :lat-lng="[ort.lat, ort.lon]" :key="index + ort.tagName">
            <l-icon
              :icon-size="[(12 * 2) / 1, (12 * 2) / 1]"
              :icon-url="
                drawCircleDiagram(24, 1, '#000', '#FFF', ort.numTag, true)
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

  <!--
  <div>
    <template v-if="!loading">
      <v-container fluid>
        <v-row>
          <v-col xs-4>
            <v-navigation-drawer
              :value="sideBar"
              temporary
              right
              app
              v-if="sideBar"
            >
              <v-card elevation="0">
                <v-card-title style="z-index: 1"> Karten </v-card-title>
                <v-divider style="clear: both; margin-top: 50px" />
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
            </v-navigation-drawer>
          </v-col>
          <v-col xs-4>
            <div style="height: 500px; width: 100%">
              <v-flex class="text-xs-right" offset-xs11>
                <v-btn style="margin-top: 5px" fab @click="sideBar = !sideBar">
                  <v-icon>mdi-layers</v-icon>
                </v-btn>
              </v-flex>
            </div>
          </v-col>
          
        </v-row>
      </v-container>
    </template>
  </div>-->
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
} from "vue2-leaflet";
import { Component, Vue } from "vue-property-decorator";
import { geoStore } from "../store/geo";
import * as geojson from "geojson";
import { computePropCircle, drawCircleDiagram } from "@/helpers/MapCompute";
import {
  ApiLocationResponse,
  ApiLocSingleResponse,
  einzErhebung,
  SingleErhebResponse,
  SearchItems,
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

@Component({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LGeoJson,
    LCircleMarker,
    LPopup,
    IconBase,
    IconCircle,
  },
})
export default class MapView extends Vue {
  zoom: number = defaultZoom;
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
  currentErhebung: ApiLocSingleResponse | null = null;
  showBundesl = false;
  color: string = "";
  menu = false;
  showGemeinden = false;
  showDiaReg = false;
  searchTerm: { type: SearchItems; content: any; name: string } | null = null;
  geoStore = geoStore;
  popUpData: string = "";
  mapOptions = {
    scrollWheelZoom: true,
    zoomControl: false,
    renderer: L.canvas(),
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
      url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png ",
    },
    {
      name: "Wikimedia",
      url: "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png",
    },
    {
      name: "Minimal Ländergrenzen (hell)",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
    },
    {
      name: "Minimal Ländergrenzen (dunkel)",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
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

  setTagDataMap(e: L.LatLng, msg: string) {
    const curr = this.tagOrtResult;
    const ort = curr.find(
      (lat, lon) => Number(lat) === e.lat && Number(lon) === e.lng
    );
    console.log(curr.find((lat, lon) => Number(lat) === e.lat));
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

  displayData() {
    this.focusLayer = L.layerGroup();
    this.clearLayer();
    if (this.searchTerm) {
      // @ts-ignore
      const map = this.$refs.map.mapObject;
      if (this.searchTerm.type === SearchItems.Ort) {
        const ort: ApiLocSingleResponse = this.searchTerm.content;
        const circle = L.circle([Number(ort.lat), Number(ort.lon)], {
          color: "red",
          radius: 4,
          // @ts-ignore
        }).addTo(this.focusLayer);
        // @ts-ignore
        this.$refs.map.mapObject.addLayer(this.focusLayer);
        circle.bindPopup(ort.ort_namelang.split(",")[0]).openPopup();
        this.loadErheb(ort);
        this.center = [Number(ort.lat), Number(ort.lon)];
        this.zoom = 12;
        map.setView(new L.LatLng(Number(ort.lat), Number(ort.lon)), this.zoom);
      } else if (this.searchTerm.type === SearchItems.Tag) {
        const tag = this.searchTerm.content.tagId;
        this.loadTagOrt(tag).then((res) => {
          const curr = this.tagOrtResult;
          if (curr.length > 0) {
            for (const ele of curr) {
              const divFactor = Math.sqrt(ele.numTag / Math.PI);
              const circle = L.circle([Number(ele.lat), Number(ele.lon)], {
                color: "red",
                //radius: divFactor * 100 * 2 * this.zoom,
                radius: divFactor * 300,
              })
                // @ts-ignore
                .addTo(this.focusLayer)
                // @ts-ignore
                .on("click", (e) => this.setTagDataMap(e.latlng));
              // @ts-ignore
              this.$refs.map.mapObject.addLayer(this.focusLayer);
              circle
                .bindPopup(
                  ele.ortNamelang
                    ? ele.ortNamelang.split(",")[0]
                    : "Kein Name vorhanden"
                )
                .openPopup();
            }
          }
        });
        this.zoom = defaultZoom;
        this.center = defaultCenter;
        map.setView(this.center, this.zoom);
      }
    } else {
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

  async loadTagOrt(tagId: number) {
    await tagModule.fetchTagOrteResults({ tagId: tagId });
  }

  // lifecycle hook
  mounted() {
    console.log("Map mounted");
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
    // this.l.log('Collections created');
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
    height: 20%;
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