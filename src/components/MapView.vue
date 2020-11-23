<template>
  <div>
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
    <template v-if="!loading">
      <v-container fluid>
        <v-row>
          <v-col xs-6>
            <div style="height: 500px; width: 100%">
              <l-map
                v-if="!loading"
                :zoom.sync="zoom"
                :center.sync="center"
                :options="mapOptions"
              >
                <l-tile-layer :url="tileSetUrl" />

                <l-geo-json v-if="showBundesl" :geojson="bundeslaender" />
                <l-geo-json v-if="showGemeinden" :geojson="gemeinden" />
                <template v-if="showGemeinden">
                  <l-circle-marker
                    v-for="(ort, index) in erhebungen"
                    :key="ort.id"
                    :lat-lng="[ort.lat, ort.lon]"
                    :radius="4"
                    @click="loadErheb(ort, index)"
                  >
                    <l-popup>
                      <div>
                        {{ ort.ort_namelang.split(",")[0] }},
                        {{ ort.ort_namelang.split(",")[1] }}
                      </div>
                    </l-popup>
                  </l-circle-marker>
                </template>
              </l-map>
            </div>
          </v-col>
          <v-col xs-6>
            <v-select
              v-model="selectedTileSet"
              :items="items"
              item-text="name"
              item-value="value"
              label="Tileset auswählen"
            ></v-select>
            <h2 v-if="currentErhebung">
              Erhebungen für {{ currentErhebung.ort_namelang }}
            </h2>
            <v-data-table
              hide-default-footer
              v-if="currentErhebung"
              :headers="headerErheb"
              :items="currentErhebung.erhebungen"
              @click:row="loadInfErhebung(currentErhebung.inferhebungen)"
            >
              <template v-slot:[`item.Konzept_von`]="{ item }" Konzept_von>{{
                item.Konzept_von ? item.Konzept_von.str : "Kein Name vorhanden"
              }}</template>
              <template v-slot:[`item.Art_Erhebung`]="{ item }">{{
                item.Art_Erhebung
                  ? item.Art_Erhebung.Bezeichnung
                  : "Keine Art der Erhebung vorhanden"
              }}</template>
            </v-data-table>
          </v-col>
          <v-col xs-6>
            <h2 v-if="currentErhebung">
              Verfügbare Erhebungen für {{ currentErhebung.ort_namelang }}
            </h2>
            <v-data-table
              hide-default-footer
              v-if="infErhebungen"
              :headers="headerInf"
              :items="infErhebungen.infErhebungen"
            >
              <template v-slot:[`item.Bezeichnung_Erhebung`]="{ item }">{{
                item.erhebung
                  ? item.erhebung.Bezeichnung_Erhebung
                  : "Keine Art der Erhebung vorhanden"
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
          </v-col>
        </v-row>
      </v-container>
    </template>
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
} from "vue2-leaflet";
import { Component, Vue } from "vue-property-decorator";
import { geoStore } from "../store/geo";
import * as geojson from "geojson";
import {
  ApiLocationResponse,
  ApiLocSingleResponse,
  einzErhebung,
  SingleErhebResponse,
} from "../static/apiModels";
import { erhebungModule } from "../store/modules/erhebungen";
import { transModule } from "../store/modules/transcripts";

const defaultCenter = [47.64318610543658, 13.53515625];
const defaultZoom = 7;

@Component({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LGeoJson,
    LCircleMarker,
    LPopup,
  },
})
export default class MapView extends Vue {
  zoom: number = defaultZoom;
  center: number[] = defaultCenter;
  EM = erhebungModule;
  TM = transModule;

  currentErhebungen = null;
  currentErhebung: ApiLocSingleResponse | null = null;
  showBundesl = false;
  showGemeinden = false;
  geoStore = geoStore;
  mapOptions = {
    scrollWheelZoom: true,
    zoomControl: false,
    renderer: L.canvas(),
  };

  headerErheb = [
    { text: "Konzept von", value: "Konzept_von" },
    { text: "Art der Erhebung", value: "Art_Erhebung" },
    { text: "Bezeichnung der Erhebung", value: "Bezeichnung_Erhebung" },
  ];

  headerInf = [
    { text: "Bezeichnung", value: "Bezeichnung_Erhebung" },
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
      url:
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
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

  selectedTileSet = 1;

  get erhebungen() {
    return erhebungModule.erhebungen;
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

  get loading() {
    return erhebungModule.loading;
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

  loadErheb(ort: ApiLocSingleResponse, id: number) {
    this.currentErhebung = ort;
    this.$forceUpdate();
  }

  // lifecycle hook
  mounted() {
    console.log("Map mounted");
    if (!this.erhebungen || this.erhebungen.orte.length === 0) {
      erhebungModule.fetchErhebungen();
    }

    this.TM.fetchTranscripts();
    this.TM.fetchEinzelerhebungen();
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
