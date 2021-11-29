<template>
  <v-slide-x-reverse-transition>
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
                class="mx-auto pr-100"
              >
                <template v-slot:activator="{ on }">
                  <template v-if="d.symbol === 0 || propCircl">
                    <v-avatar v-on="on">
                      <icon-circle
                        :fillCol="d.color"
                        :strokeWidth="d.strokeWidth"
                      />
                    </v-avatar>
                  </template>
                  <template v-else>
                    <v-avatar tile v-on="on">
                      <template v-if="d.symbol === 1">
                        <img :src="drawRect(7, d.strokeWidth, d.color, true)" />
                      </template>
                      <template v-else="d.symbol === 2">
                        <img
                          :src="drawTriangle(7, d.strokeWidth, d.color, true)"
                        />
                      </template>
                    </v-avatar>
                  </template>
                </template>
                <template>
                  <v-card>
                    <v-card-title>Farbe</v-card-title>
                    <v-card-text @click="onLegendChange(d)">
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
                        max="100"
                        @change="onLegendChange(d)"
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
                        @change="onLegendChange(d)"
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
                      onLegendChange(d);
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
          <v-list-item
            v-for="(d, i) in legendGlobal.filter((el) => el.type === 3)"
          >
            <v-list-item-content class="mx-auto">
              {{ d.name }}
              <v-list-item v-for="(para, idx) in d.parameter" :key="idx">
                <v-avatar v-on="on">
                  <icon-circle
                    :fillCol="para.color"
                    :strokeWidth="d.strokeWidth"
                  />
                </v-avatar>
                <v-list-item-content>
                  {{ para.name }}
                </v-list-item-content>
              </v-list-item>
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
                      onLegendChange(d);
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
  </v-slide-x-reverse-transition>
</template>
<script lang="ts">
import Component from "vue-class-component";
import { Prop, Vue } from "vue-property-decorator";
import { legendMod } from "@/store/modules/legend";
import { aufgabenModule } from "@/store/modules/aufgaben";
import IconCircle from "@/icons/IconCircle.vue";

import { LegendGlobal } from "../static/apiModels";

import {
  computePropCircle,
  drawCircleDiagram,
  drawRect,
  drawTriangle,
} from "@/helpers/MapCompute";

@Component({
  name: "LegendItem",
  components: {
    IconCircle,
  },
})
export default class LegendItem extends Vue {
  @Prop(Boolean) readonly vis!: boolean;
  @Prop(Boolean) readonly propCircl!: boolean;

  menu = false;
  LM = legendMod;
  AM = aufgabenModule;

  get legendGlobal() {
    return this.LM.legend;
  }

  drawRect(size: number, border: number, color: string, encoded: boolean) {
    return drawRect(size, border, color, encoded);
  }

  drawTriangle(size: number, border: number, color: string, encoded: boolean) {
    return drawTriangle(size, border, color, encoded);
  }

  deleteLegendEntry(el: LegendGlobal, idx: number | null) {
    this.LM.deleteLegendEntry(el, idx);
    this.AM.clearAntworten();
    this.$emit("callChange", el);
  }

  onLegendChange(el: LegendGlobal) {
    this.$emit("callChange", el);
  }

  updateVis() {
    this.$emit("update:vis", !this.vis);
  }
}
</script>
