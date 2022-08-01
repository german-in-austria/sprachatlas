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
            <v-col cols="1">
              <v-menu
                :close-on-content-click="false"
                :nudge-width="800"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    elevation="1"
                    class="mx-1"
                    fab
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
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
                                    <div :key="i">
                                      <v-list-item>
                                        {{ val.content[val.name] }}
                                      </v-list-item>
                                      <v-divider></v-divider>
                                    </div>
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
                                      :key="index + i"
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
            <v-col cols="1">
              <AgeRange />
            </v-col>
            <v-col>
              <ErhebungsArt />
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
      </v-flex>
      <v-flex class="text-xs-right" offset-xs11>
        <v-btn small fab @click="sideBar = !sideBar">
          <v-icon>mdi-layers</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-dialog
        max-width="500"
        v-model="dialog"
        transition="dialog-top-transition"
      >
        <v-card>
          <v-card-title>
            Export der Karteneinstellungen
            <v-spacer></v-spacer>
            <v-btn icon color="indigo" @click="dialog = !dialog">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row align="center" justify="center">
              <v-col>
                {{ url }}
              </v-col>
              <v-col>
                <v-btn small @click="copyClipboard(url)">
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer> </v-spacer>
            <v-btn color="green darken-1" text @click="copyClipboard(url)"
              >In die Zwischenablage kopieren</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-slide-y-reverse-transition tag="Changev-layout">
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
              {{ selectedOrt.ortName.split(',')[0] }}
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
              {{ selectedOrt.ortName.split(',')[0] }}
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
            {{ selectedOrt.ortName.split(',')[0] }}
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
        v-on:callChange="splitTags"
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
      <l-geo-json v-if="showDiaReg" :geojson="dialektregionen" />
      <template v-if="showGemeinden">
        <l-circle-marker
          v-for="(ort, index) in erhebungen"
          :key="ort.id + index"
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
  drawTriangle
} from '@/helpers/MapCompute';

import { expData } from '@/service/ExportBase';

import { selectColor, convertHslToStr } from '@/helpers/helper';
import LegendItem from '@/components/LegendItem.vue';

import {
  ApiLocationResponse,
  ApiLocSingleResponse,
  einzErhebung,
  SearchItems,
  TagOrteResults,
  LegendGlobal,
  Phaen,
  Parameter,
  Symbols,
  SearchTerm
} from '../static/apiModels';
import { erhebungModule } from '../store/modules/erhebungen';
import { transModule } from '../store/modules/transcripts';
import { phaeModule } from '@/store/modules/phaenomene';
import { aufgabenModule } from '@/store/modules/aufgaben';
import { messageHandler } from '@/store/modules/message';
import { tagModule } from '@/store/modules/tags';
import { legendMod } from '@/store/modules/legend';
import { cloneDeep } from 'lodash';
import IconBase from '@/icons/IconBase.vue';
import IconCircle from '@/icons/IconCircle.vue';
import AudioPlayer from '@/components/AudioPlayer.vue';
import AgeRange from '@/components/AgeRange.vue';
import ErhebungsArt from '@/components/ErhebungsArt.vue';

import { IGetPresetOrtTagResult } from '@/api/dioe-public-api/models/IGetPresetOrtTagResult';

import { getOrtName } from '@/helpers/helper';
import {
  AntwortenFromAufgabe,
  AntwortTokenStamp,
  ISelectOrtAufgabeResult,
  tagDto
} from '@/api/dioe-public-api';

const defaultCenter = [47.64318610543658, 13.53515625];
const defaultZoom = 8;

type singleEntry = {
  // value of the entry
  v: number;
  // name of the entry
  name: string;
  // color
  c: string;
  // radius for sideways
  r: number;
  // id of the entry
  id: string;
  // Chosen icon
  icon: Symbols;
  // further parameters
  para?: Parameter;
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
    LLayerGroup,
    LIcon,
    IconBase,
    IconCircle,
    LegendItem,
    AudioPlayer,
    AgeRange,
    ErhebungsArt
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
  optionTab = 0;
  selectionMenu: boolean = false;
  selectedOrt: circleData | null = null;
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

  filterOptionMenu = [
    { name: 'Phänomene', type: SearchItems.Phaen },
    { name: 'Tags', type: SearchItems.Tag }
  ];
  filterMenuValue: Array<{ type: SearchItems; content: any; name: string }> =
    [];

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
  // layerGroup: any = null;


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
    { text: 'Aktionen', value: 'actions' }
  ];

  mapOptions = {
    scrollWheelZoom: true,
    zoomControl: false,
    renderer: L.canvas(),
    wheelPxPerZoomLevel: 150,
    maxZoom: 12,
    minZoom: 7
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
    },
    {
      name: 'Wikimedia',
      url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=local'
    },
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
    { name: this.tileSets[2].name, value: 2 },
    { name: this.tileSets[3].name, value: 3 }
  ];

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
    return `https://dioedb.dioe.at/private-media/${path}/${file}#t=${startMin * 60 + startSec
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

  get url() {
    return window.location.href;
  }

  @Watch('searchInput')
  search(val: any) {
    if (!val) return;
    this.fetchEntriesDebounced();
  }

  @Watch('iconId')
  onIconIdChange() {
    if (this.iconId > Object.keys(Symbols).length) {
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

  getColor() {
    return selectColor(null);
  }

  searchAufgabeByPhaen() {
    this.optionTab = 1;
    fetch;
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
          'bezPhaenomen'
        );
        break;
      case SearchItems.Tag:
        this.changeFilterMenuValue(
          SearchItems.Tag,
          this.tagListFlat,
          'tagName'
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
        /*this.AM.fetchSaetze({ query: this.searchInput }).then(() =>
          this.addSearchTerms(this.allSaetze, SearchItems.Saetze, 'Transkript')
        );*/
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
    // @ts-ignore
    // this.$refs.map.mapObject.setView(defaultCenter, this.zoom);
    // @ts-ignore
    const map = this.$refs.map.mapObject;

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
        this.addSearchTerms(this.phaen, SearchItems.Phaen, 'bez');
        break;
      case SearchItems.Aufgaben:
        this.addSearchTerms(
          this.allAufgaben,
          SearchItems.Aufgaben,
          'Aufgabenstellung'
        );
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
        this.addSearchTerms(
          this.allAufgaben,
          SearchItems.Aufgaben,
          'Aufgabenstellung'
        );
        this.addSearchTerms(
          this.tagListPreset,
          SearchItems.Presets,
          'Bezeichnung'
        );
        this.addSearchTerms(this.erhebungen, SearchItems.Ort, 'ort_namelang');
        this.addSearchTerms(this.tagListFlat, SearchItems.Tag, 'tagName');
        this.addSearchTerms(this.allSaetze, SearchItems.Saetze, 'Transkript');
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
      iconUrl: drawTriangle(3, ort.strokeWidth, data[0].c, true, 0.7)
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
          id: id,
          icon: icon,
          para: para
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
              para: para
            }
          ] as singleEntry[]
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
        this.AM.fetchAntwortAudio({
          ids: ids,
          osmId: ort.osm,
          ageLower: this.ageRange.lower,
          ageUpper: this.ageRange.upper
        });
        break;
      case SearchItems.Aufgaben:
        this.AM.fetchAufgabenAudioOrt({
          ids: ids,
          osmId: ort.osm,
          ageLower: this.ageRange.lower,
          ageUpper: this.ageRange.upper
        });
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
            lonToPoint.y
          ]);
          lonToPoint = this.map.latLngToContainerPoint(lonOffset);
          rad = s;
          const marker = L.marker(lonOffset, {
            icon: circleIcon,
            riseOnHover: true
          })
            .addTo(ort.layer)
            .on('click', (e) => this.audioListener(ort, type));
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
          .on('click', (e) => this.audioListener(ort, type));
        marker.on('mouseover', (e) => this.markerHover(ort, marker, e));
        ort.layer.addTo(this.layerGroup);
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
        aufg.ortNamelang,
        aufg.numAufg ? Number(aufg.numAufg) : 1,
        aufg.aufgabenstellung ? aufg.aufgabenstellung : '',
        propFactor * Number(aufg.numAufg),
        aufg.id.toString()
      );
    }
    return data;
    // this.addDataToMap(data);
  }

  copyClipboard(str: string) {
    navigator.clipboard.writeText(str).then(
      () => {
        // Success
      },
      () => {
        // Fail
      }
    );
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
        tag.tagId ? tag.tagId : ''
      );
    }
    return data;
    // this.addDataToMap(data);
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
        const query = {} as tagDto;
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

          if (p.gender) {
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
        }
        query.ids = [...new Set(ids)];
        query.group = true;
        if (this.LM.erhArtFilter.length > 0) {
          query.erhArt = this.LM.erhArtFilter;
        }
        await this.TaM.fetchTagOrteResultsMultiple(query);
        const tags = cloneDeep(this.tagOrtResult);
        q.parameter?.forEach((p: Parameter) => {
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
          );
          q.content = tagData;
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
              t.tagName,
              propFactor * t.numTag,
              t.tagId ? t.tagId : '',
              p
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

  displayDataFromLegend(legend: LegendGlobal[]) {
    // this.clearLayer();
    this.showLegend = true;
    this.layerGroup.clearLayers();
    this.displayParameters(this.legendGlobalQuery);
    let tagData: Array<circleData> = [];
    let aufData: Array<circleData> = [];
    for (const l of legend) {
      switch (l.type) {
        case SearchItems.Ort:
          // l.layer.clearLayers();
          const ort: any = l.content;
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
        case SearchItems.Presets:
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

  async createTagLegend(layer: L.LayerGroup, tagId: number) {
    const color = this.getColor();
    const radius = 20;
    return await this.loadTagOrt(tagId).then(() => {
      const curr = this.tagOrtResult;
      if (curr.length > 0) {
        const newLegend: LegendGlobal = {
          id: '',
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
          layer: layer
        };
        return newLegend;
      }
    });
  }

  async displayData(term: SearchTerm, encode: boolean) {
    const newLayer = L.layerGroup();
    // this.clearLayer();
    this.showLegend = true;
    // Variable for the new Legend
    // Is used for the export of the data
    let newLeg: LegendGlobal = {} as LegendGlobal;
    // id of the elment in the database
    let id: number = -1;
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
      const res = await this.createTagLegend(newLayer, id);
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
      id = content.aufId;
      await this.AM.fetchAufgabenOrt({ ids: [content.aufId] });
      newLeg = await this.LM.createLegendEntry({
        icon: Symbols.Circle,
        layer: L.layerGroup(),
        name: content.Aufgabenstellung,
        color: this.getColor(),
        radius: 12,
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
    console.log(id);
    console.log('test output');
    const element = this.matchTranscriptID(id);
    console.log(element);
    this.TM.fetchSingleTranscript({ id: id, page: 0 });
  }

  loadInfErhebung(infs: any[]) {
    erhebungModule.fetchInfErhebungen({
      infs: infs
    });
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

  async fetchContent(id: number, type: SearchItems) {
    if (type === SearchItems.Tag) {
      await this.loadTagOrt(id);
      return this.tagOrtResult;
    } else if (type === SearchItems.Presets) {
      await this.TaM.fetchPresetTagOrte(id)
      return this.tagOrtResult;
      // cast result as PresetOrtTagResult
      // @ts-ignore
    } else if (type === SearchItems.Saetze) {
      return await this.AM.fetchAntworten({ sid: id });
    } else if (type === SearchItems.Aufgaben) {
      return await this.AM.fetchAufgabenOrt({ ids: [id] });
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
          type: l.type,
        });
        this.LM.addLegendEntry(lm);
      }
    }
  }

  // lifecycle hook
  mounted() {
    console.log('Map mounted');
    if (!this.erhebungen?.orte || this.erhebungen.orte.length === 0) {
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
            this.displayDataFromLegend(legendMod.legend);
          }
        });
        this.computeMPerPixel();
        this.map.on('zoomend', (e: any) => {
          this.computeMPerPixel();
          this.displayDataFromLegend(legendMod.legend);
        });
      });
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
  @import '../../node_modules/leaflet/dist/leaflet.css';

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

  .expand-slide-enter,
  .expand-slide-leave-to {
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