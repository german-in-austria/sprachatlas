<template>
  <v-container style="margin-top: 75px">
    <v-row>
      <v-col md="4">
        <v-btn color="primary" dark @click="createlegend()">
          Neue Legende erstellen
        </v-btn>
        <v-dialog v-model="dialog" max-width="1000px">
          <v-card>
            <v-card-title> Item erstellen </v-card-title>
            <v-card-text>
              <v-form ref="form">
                <v-text-field
                  v-model="formControl.paraName"
                  label="Name des Parameters"
                ></v-text-field>
                <v-select
                  v-model="formControl.selProject"
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
                        v-model="formControl.range"
                        :max="max"
                        :min="min"
                        hide-details
                        class="align-center"
                      >
                        <template v-slot:prepend>
                          <v-text-field
                            :value="formControl.range[0]"
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
                            :value="formControl.range[1]"
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
                        v-model="formControl.selGender"
                        :items="gender"
                        label="Geschlecht"
                      ></v-select>
                      <v-select
                        v-model="formControl.selMaxEducation"
                        :items="ausbildungsGrade"
                        label="Höchster Bildungsgrad"
                        item-text="ausbildungMax"
                        item-value="ausbildungMax"
                      >
                      </v-select>
                      <v-select
                        v-model="formControl.selEducation"
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
                      <v-select
                        v-model="formControl.selMobility"
                        :items="mobility"
                        label="Mobilität"
                      ></v-select>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <TagView
                  :color="
                    formControl.paraColor
                      ? formControl.paraColor.hex
                      : formControl.parColor
                  "
                  class="mt-10 mb-10"
                  ref="tagView"
                />
                <SymbolPicker
                  ref="sym"
                  :color="
                    formControl.paraColor
                      ? formControl.paraColor.hex
                      : formControl.parColor
                  "
                  :propSymbol="formControl.symbol"
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
                        disabled
                        v-model="formControl.selToken"
                        :items="token"
                        label="Token auswählen"
                        chips
                        multiple
                      ></v-select>
                      <v-text-field
                        v-model="formControl.paraLemma"
                        label="Token eingeben"
                        clearable
                        hint="Z.b. hat, hatte, ..."
                        append-outer-icon="mdi-plus"
                        @click:append-outer="addToken"
                        @keydown.enter="addToken"
                      ></v-text-field>
                      <v-chip
                        v-for="(val, idx) in textToken"
                        :key="idx"
                        class="ma-2"
                        close
                        color="orange"
                        text-color="white"
                        @click:close="textToken.splice(idx, 1)"
                      >
                        {{ val }}
                      </v-chip>
                      <v-autocomplete v-model="paraLemma" />

                      <v-text-field
                        disabled
                        v-model="formControl.paraLemma"
                        label="Lemma eingeben"
                      ></v-text-field>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
                <v-color-picker
                  v-model="formControl.paraColor"
                  dot-size="19"
                  hide-inputs
                  swatches-max-height="226"
                ></v-color-picker>
                <v-textarea
                  name="beschreibung"
                  label="Beschreibung für den Parameter"
                  v-model="paraDesc"
                ></v-textarea>
                <v-card-actions v-if="!editMode">
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
                <v-card-actions v-else>
                  <v-btn @click="editParameter()" depressed color="primary">
                    Item bearbeiten
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
                <v-row>
                  <v-col cols="6">
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
                  </v-col>
                  <v-col cols="1">
                    <v-btn
                      elevation="2"
                      class="ml-2"
                      fab
                      dark
                      small
                      color="primary"
                      @click="editItem(curr)"
                    >
                      <v-icon dark> mdi-square-edit-outline </v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="1">
                    <v-btn
                      elevation="2"
                      class="ml-2"
                      fab
                      dark
                      small
                      color="error"
                      @click="deleteItem(i)"
                    >
                      <v-icon dark> mdi-trash-can-outline </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
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
  editPar: Parameter = {} as Parameter;
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
  textToken: string[] = [];

  formControl: {
    paraName: string;
    paraLemma: string;
    selProject: number;
    selTags: number[];
    symbol: number;
    selToken: string[];
    selMaxEducation: string;
    paraDesc: string;
    min: number;
    max: number;
    paraColor: {
      hex: string;
    };
    range: Array<number>;
    selMobility: string;
    selParents: string;
    selEducation: number;
    selGender: string;
    selJob: string;
  } = {} as any;

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

  editMode: boolean = false;

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

  addToken() {
    this.textToken.push(this.formControl.paraLemma);
    this.formControl.paraLemma = "";
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

  deleteItem(id: number) {
    this.focusParameter.splice(id, 1);
  }

  editItem(curr: Parameter) {
    this.editMode = true;
    this.dialog = true;
    this.formControl.paraName = curr.name;
    this.formControl.symbol = curr.symbol;
    this.formControl.selParents = curr.parents ? curr.parents : '';
    this.formControl.selProject = curr.project ? curr.project : 0;
    this.formControl.paraDesc = curr.description ? curr.description : '';
    this.formControl.paraColor.hex = curr.color ? curr.color : '#F00';
    this.formControl.range = curr.ageRange;
    this.formControl.selEducation = curr.education ? curr.education : -1;
    this.formControl.selMaxEducation = curr.maxEducation
      ? curr.maxEducation
      : '';
    this.TM.setTagSelection(curr.tagList ? curr.tagList : []);
    this.editPar = curr;
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

  editParameter() {
    const id = this.editPar.id;
    if (this.focusLegend.parameter) {
      let par = this.focusLegend.parameter.find((el) => el.id === id);
      const parId = this.focusLegend.parameter.findIndex((el) => el.id === id);
      const ageRange = [this.formControl.range[0], this.formControl.range[1]];
      par = {
        name: this.formControl.paraName,
        content: null,
        visible: true,
        id: id,
        // @ts-ignore
        symbol: this.$refs.sym.symbol,
        project: this.formControl.selProject,
        gender: this.formControl.selGender === 'Weiblich' ? true : false, // Boolean
        education: this.formControl.selEducation, // ID
        maxEducation: this.formControl.selMaxEducation,
        parents: this.formControl.selParents,
        job: this.formControl.selJob,
        tagList: this.TM.tagSelection,
        token: this.formControl.selToken, //
        ageRange: ageRange, // Array with 2 numbers
        color:
          this.formControl.paraColor === null
            ? ''
            : this.formControl.paraColor.hex,
        description: this.formControl.paraDesc
      };
      this.focusLegend.parameter[parId] = par;
      this.dialog = false;
      this.editMode = false;
      this.clearForm();
      this.TM.setTagSelection([]);
    }
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
      const ageRange = [this.formControl.range[0], this.formControl.range[1]];
      const newParameter: Parameter = {
        name: this.formControl.paraName,
        content: null,
        id: generateID(),
        visible: true,
        // @ts-ignore
        symbol: this.$refs.sym.symbol,
        project: this.formControl.selProject,
        gender: this.formControl.selGender === 'Weiblich' ? true : false, // Boolean
        education: this.formControl.selEducation, // ID
        maxEducation: this.formControl.selMaxEducation,
        parents: this.formControl.selParents,
        job: this.formControl.selJob,
        tagList: this.TM.tagSelection,
        token: this.formControl.selToken, //
        textTokenList: this.textToken,
        ageRange: ageRange, // Array with 2 numbers
        color:
          this.formControl.paraColor === null
            ? ''
            : this.formControl.paraColor.hex,
        description: this.formControl.paraDesc
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
      console.log(this.focusLegend);
      if (clear) this.dialog = false;
      this.clearForm();
      this.TM.setTagSelection([]);
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
    this.formControl.range = this.range;
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

  destroyed() {
    console.log(this.queryLegend);
    console.log('Unmounting component');
  }
}
</script>