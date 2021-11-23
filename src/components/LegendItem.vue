<template>
  <v-card
    v-if="vis"
    elevation="2"
    class="mx-auto"
    max-width="300"
    min-width="250"
  >
    <v-divider class="mx-4"></v-divider>
    <v-card-title
      >Legende
      <v-spacer></v-spacer>
      <v-btn icon color="indigo" @click="updateVis()">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="mx-auto">
      <v-list class="transparent">
        <v-list-item
          v-for="(d, i) in legendGlobal.filter((el) => el.type !== 3)"
        >
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
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Prop, Vue } from "vue-property-decorator";
import { legendMod } from "@/store/modules/legend";
import { aufgabenModule } from "@/store/modules/aufgaben";

import { LegendGlobal } from "../static/apiModels";

@Component({
  name: "LegendItem",
})
export default class LegendItem extends Vue {
  @Prop(Boolean) readonly vis!: boolean;

  LM = legendMod;
  AM = aufgabenModule;

  get legendGlobal() {
    return this.LM.legend;
  }

  deleteLegendEntry(el: LegendGlobal, idx: number | null) {
    this.LM.deleteLegendEntry(el, idx);
    this.AM.clearAntworten();
  }

  onLegendChange(layer: L.LayerGroup) {
    layer.clearLayers();
  }

  updateVis() {
    this.$emit("update:vis", !this.vis);
  }
}
</script>
