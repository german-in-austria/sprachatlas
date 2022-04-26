<template>
  <v-container style="margin-top: 75px">
    <v-row>
      <v-col md="4">
        <v-btn color="primary" dark @click="createlegend()">
          Neue Legende erstellen
        </v-btn>
        <v-dialog v-model="dialog" max-width="1000px">
          <!--
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">
            Neues Item erstellen
          </v-btn>
        </template>-->

          <v-card>
            <v-card-title> Item erstellen </v-card-title>
            <v-card-text>
              <v-form ref="form">
                <v-text-field
                  v-model="paraName"
                  label="Name des Parameters"
                ></v-text-field>
                <v-select
                  v-model="selProject"
                  :items="teams"
                  item-text="team"
                  item-value="teamId"
                  label="Projekt"
                  clearable
                ></v-select>
                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      Sozialdaten
                      <template v-slot:actions>
                        <v-icon color="primary"> $expand </v-icon>
                      </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <h3>Alter auswählen</h3>
                      <v-range-slider
                        v-model="range"
                        :max="max"
                        :min="min"
                        hide-details
                        class="align-center"
                      >
                        <template v-slot:prepend>
                          <v-text-field
                            :value="range[0]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                            @change="$set(range, 0, $event)"
                          ></v-text-field>
                        </template>
                        <template v-slot:append>
                          <v-text-field
                            :value="range[1]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                            @change="$set(range, 1, $event)"
                          ></v-text-field>
                        </template>
                      </v-range-slider>
                      <v-select
                        v-model="selGender"
                        :items="gender"
                        label="Geschlecht"
                      ></v-select>
                      <v-select
                        v-model="selMaxEducation"
                        :items="ausbildungsGrade"
                        label="Höchster Bildungsgrad"
                        item-text="ausbildungMax"
                        item-value="ausbildungMax"
                      >
                      </v-select>
                      <v-select
                        v-model="selEducation"
                        :items="jobs"
                        item-text="bezeichnung"
                        item-value="pk"
                        @change="checkEducation"
                        label="Berufsbezeichnung"
                      ></v-select>
                      <span v-if="selEducationAll !== null">
                        Berufskategorie:
                        {{ selEducationAll.berufskategorie }}
                        Kommunikationsgrad:
                        {{ selEducationAll.kommunikationsgrad }}
                        Standardkompetenz:
                        {{ selEducationAll.standardkompetenz }}
                      </span>
                      <!--
                      <v-select
                        v-model="selParents"
                        :items="parents"
                        label="Eltern"
                      ></v-select>-->
                      <v-select
                        v-model="selMobility"
                        :items="mobility"
                        label="Mobilität"
                      ></v-select>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <TagView class="mt-10 mb-10" ref="tagView" />
                <SymbolPicker
                  ref="sym"
                  :color="paraColor ? paraColor.hex : parColor"
                />
                <v-expansion-panels class="mb-10">
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      Lemma & Token
                      <template v-slot:actions>
                        <v-icon color="primary"> $expand </v-icon>
                      </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-select
                        v-model="selToken"
                        :items="token"
                        label="Token auswählen"
                        chips
                        multiple
                      ></v-select>
                      <v-text-field
                        v-model="paraLemma"
                        label="Token eingeben"
                      ></v-text-field>
                      <v-autocomplete v-model="paraLemma" />

                      <v-text-field
                        v-model="paraLemma"
                        label="Lemma eingeben"
                      ></v-text-field>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <v-color-picker
                  v-model="paraColor"
                  dot-size="19"
                  hide-inputs
                  swatches-max-height="226"
                ></v-color-picker>
                <v-textarea
                  name="beschreibung"
                  label="Beschreibung für den Parameter"
                  v-model="paraDesc"
                ></v-textarea>
                <v-card-actions>
                  <v-btn
                    @click="createParameter(true)"
                    depressed
                    color="primary"
                  >
                    Hinzufügen
                  </v-btn>
                  <v-btn
                    @click="createParameter(false)"
                    depressed
                    color="primary"
                  >
                    Weiteren Parameter hinzufügen
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-list rounded>
          <v-subheader> Legenden </v-subheader>
          <v-list-item-group color="primary">
            <v-list-item v-for="(item, idx) in queryLegend" :key="idx">
              <v-list-item-content :key="idx" @click="viewLegend(idx, item)">
                <v-list-item-title v-text="item.name">{{
                  item.name
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="5">
        <v-flex justify-center v-if="showTimeline">
          <v-timeline dense align-top>
            <draggable
              :list="focusParameter"
              draggable=".item"
              @start="dragging = true"
              @end="dragging = false"
            >
              <v-timeline-item
                slot="header"
                class="list-group-item mb-6"
                role="group"
                hide-dot
              >
                <v-edit-dialog :return-value.sync="focusLegend.name">
                  <h2>
                    {{ focusLegend.name }}
                    <v-btn icon color="blue"
                      ><v-icon>mdi-square-edit-outline</v-icon></v-btn
                    >
                  </h2>
                  <template v-slot:input>
                    <v-text-field
                      v-model="focusLegend.name"
                      label="Legendenname bearbeiten"
                      single-line
                      @keydown.enter="editLegName()"
                    />
                  </template>
                </v-edit-dialog>
              </v-timeline-item>
              <v-timeline-item
                v-for="(curr, i) in focusParameter"
                :key="i"
                :color="curr.color"
                class="list-group-item item"
              >
                <v-expansion-panels focusable>
                  <v-expansion-panel outlined>
                    <v-expansion-panel-header
                      ><h4>{{ curr.name }}</h4>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      {{ 'Suchanfrage' }}</v-expansion-panel-content
                    >
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-timeline-item>
            </draggable>
          </v-timeline>
          <template justify="center">
            <v-btn
              class="mx-2"
              fab
              small
              dark
              color="indigo"
              @click.stop="dialog = true"
            >
              <v-icon dark> mdi-plus </v-icon>
            </v-btn>
          </template>
        </v-flex>
      </v-col>
    </v-row>
    <v-row> </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, PropSync, Vue, Prop, Watch } from 'vue-property-decorator';
import { tagModule } from '@/store/modules/tags';
import { legendMod } from '@/store/modules/legend';
import { transModule } from '@/store/modules/transcripts';
import { TagTree } from '@/api/dioe-public-api';
import TagView from '@/components/TagView.vue';
import draggable from 'vuedraggable';
import {
  Job,
  Parameter,
  LegendList,
  SearchItems,
  LegendGlobal,
  Symbols
} from '@/static/apiModels';
import * as LZ from 'lz-string';
import { generateID } from '@/helpers/helper';
import IconCircle from '@/icons/IconCircle.vue';
import SymbolPicker from '@/components/SymbolPicker.vue';
import { aufgabenModule } from '@/store/modules/aufgaben';

@Component({
  components: { draggable, TagView, IconCircle, SymbolPicker },
  name: 'QueryTool'
})
export default class QueryCreator extends Vue {
  editLegendDialog: boolean = false;
  showTimeline: boolean = false;
  dialog: boolean = false;
  selectedItem = null;

  focusLegend: LegendGlobal = {} as LegendGlobal;
  focusParameter: Parameter[] = [];
  focusLegId: number = -1;

  paraName: string = '';
  paraLemma: string = '';
  selProject: number = 0;
  selTags: number[] = [];
  selToken: string[] = [];
  selMaxEducation: string = '';
  paraDesc: string = '';
  min: number = 0;
  max: number = 100;

  @Prop(Number) readonly legendId: number | undefined;

  @Prop(Number) readonly focusItem: number | undefined;

  paraColor: {
    hex: string;
  } = { hex: '#F00' };

  selMobility: string = '';
  selParents: string = '';
  selEducation: number = -1;
  selGender: string = '';
  selJob: string = '';
  selEducationAll: Job | null | undefined = null;
  legName: string = '';

  range = [20, 70];

  token = ['Orthographisch', 'Phonetisch'];
  projects = ['PP11'];
  testItems = ['UND', 'ODER'];
  gender = ['Männlich', 'Weiblich'];
  parents = ['Herkunft'];
  job = ['Chemiker', 'Tischler', '...'];
  mobility = ['Auto', 'Zug', 'Pferd'];

  TM = tagModule;
  LM = legendMod;
  AM = aufgabenModule;
  TaM = transModule;

  get jobs() {
    return this.TM.jobList;
  }

  get ausbildungsGrade() {
    return this.LM.ausbildungsGrad;
  }

  get tags() {
    return this.TM.tagList == null ? [] : this.TM.tagList;
  }

  get loading() {
    return this.TM.loading;
  }

  get parameters() {
    return this.TM.parameters;
  }

  get queryLegend() {
    return this.LM.legend.filter((el) => el.type === SearchItems.Query);
  }

  get legends() {
    return this.TM.legends;
  }

  get globalLegend() {
    return this.LM.legend;
  }

  get legendLoad() {
    return this.LM.loading;
  }

  get teams() {
    return this.AM.teams;
  }

  editLegName() {
    if (this.focusLegend.name !== '') this.LM.editLegendByID(this.focusLegend);
  }

  checkEducation(pk: number) {
    const found = this.jobs.find((pk) => pk === pk);
    this.selEducationAll = found;
  }

  viewLegend(idx: number, legend: LegendGlobal) {
    this.legName = legend.name;
    this.focusParameter = legend.parameter
      ? legend.parameter
      : ([] as Parameter[]);
    this.focusLegId = idx;
    this.focusLegend = legend;
    if (!this.showTimeline) this.showTimeline = !this.showTimeline;
  }

  createlegend() {
    const name = 'Unbennante Legende';
    const emptyLegend = {
      color: '#F00',
      size: 15,
      type: SearchItems.Query,
      content: null,
      stroke: true,
      strokeWidth: 1,
      parameter: null,
      layer: null,
      vis: true,
      name: name
    };
    this.LM.addLegendEntry(emptyLegend);
    this.legName = name;
    this.focusParameter = [];
    this.focusLegend = this.globalLegend[this.globalLegend.length - 1];
    this.focusLegId = -1;
    this.showTimeline = true;
  }

  openForm() {
    this.editLegendDialog = true;
  }

  clearForm() {
    // @ts-ignore
    this.$refs.form.reset();
    // @ts-ignore
    this.$refs.tagView.clear();
  }

  createParameter(clear: boolean) {
    if (this.paraName === null) {
      this.paraName = '';
    }
    if (this.focusLegend) {
      const ageRange = [this.range[0], this.range[1]];
      const newParameter: Parameter = {
        name: this.paraName,
        content: null,
        id: generateID(),
        visible: true,
        // @ts-ignore
        symbol: this.$refs.sym.symbol,
        project: this.selProject,
        gender: this.selGender === 'Weiblich' ? true : false, // Boolean
        education: this.selEducation, // ID
        maxEducation: this.selMaxEducation,
        parents: this.selParents,
        job: this.selJob,
        tagList: this.TM.tagSelection,
        token: this.selToken, //
        ageRange: ageRange, // Array 2 Number
        color: this.paraColor === null ? '' : this.paraColor.hex,
        description: this.paraDesc
      };
      if (!this.focusLegend.parameter) {
        this.focusLegend.parameter = [] as Parameter[];
      }
      this.focusLegend.parameter.push(newParameter);
      this.focusParameter = this.focusLegend.parameter;
      /*
      const para = LZ.compressToEncodedURIComponent(
        JSON.stringify(this.legends)
      );
      this.$router.push({
        path: "query",
        query: { parameters: para },
      });*/
      if (clear) this.dialog = false;
      this.clearForm();
    }
  }

  beforeCreate() {
    aufgabenModule.fetchAllTeams();

    if (tagModule.tagList == null) {
      console.log('fetching Tags');
      tagModule.fetchTags();
    }

    if (!this.ausbildungsGrade || this.ausbildungsGrade.length < 0) {
      legendMod.fetchAusbildung();
    }
  }

  mounted() {
    if (this.$route.query.parameters) {
      const para = this.$route.query.parameters;
      let legend = undefined;
      if (typeof para === 'string') {
        const parameter = LZ.decompressFromEncodedURIComponent(para);
        legend = new Function(
          'return [' + parameter?.substring(1, parameter.length - 1) + '];'
        )();
        tagModule.clearLegend();
        legend.forEach((element: { name: string; parameter: Parameter[] }) => {
          tagModule.addLegend({
            name: element.name,
            parameter: element.parameter
          });
          // this.legName = element.name;
          tagModule.setParameters(element.parameter);
        });
      } else {
        console.log('Queryparameter has wrong format');
        if (this.$props.legendID) {
        }
      }

      if (legend === undefined) {
        if (this.$props.legendID) {
          const id = this.$props.legendID;
        }
      }
    }

    if (this.legName === '') {
      // const legend = this.TM.legends.slice(-1)[0];
      // this.legName = "Unbenannte Legende";
    }
  }
}
</script>