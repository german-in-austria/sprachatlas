<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4" offset-md="1">
          <h2>Parameter erstellen</h2>
          <v-form ref="form">
            <v-text-field
              v-model="paraName"
              label="Name des Parameters"
            ></v-text-field>
            <v-select
              v-model="selProject"
              :items="projects"
              label="Projekt"
            ></v-select>
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
              v-model="selEducation"
              :items="education"
              label="Bildungsstand"
            ></v-select>
            <v-select
              v-model="selParents"
              :items="parents"
              label="Eltern"
            ></v-select>
            <v-select
              v-model="selMobility"
              :items="mobility"
              label="Mobilität"
            ></v-select>
            <v-select v-model="selJob" :items="job" label="Beruf"></v-select>

            <v-autocomplete
              v-model="selTags"
              :items="tags"
              item-text="tagName"
              item-value="tagId"
              value="tagId"
              :loading="loading"
              clearable
              label="Tags auswählen"
              chips
              small-chips
              multiple
            ></v-autocomplete>
            <v-select
              v-model="selToken"
              :items="token"
              label="Token auswählen"
              chips
              multiple
            ></v-select>
            <v-color-picker
              v-model="paraColor"
              dot-size="19"
              hide-inputs
              hide-sliders
              hide-mode-switch
              swatches-max-height="226"
            ></v-color-picker>
            <v-btn @click="createParameter()" depressed color="primary">
              Parameter hinzufügen
            </v-btn>
          </v-form>
        </v-col>
        <v-col cols="1" offset-md="1"> </v-col>
        <v-col cols="2">
          <v-card outlined>
            <v-card-subtitle v-for="curr in parameters"
              ><v-icon small class="mr-2"> mdi-filter </v-icon>
              <v-avatar left size="15" :color="curr.color"> </v-avatar>
              {{ curr.name }}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";
import { tagModule } from "@/store/modules/tags";
import { TagTree } from "@/api/dioe-public-api";
import { Parameter } from "@/static/apiModels";

@Component({
  components: {},
})
export default class QueryCreator extends Vue {
  paraName: string = "";
  selProject: string = "";
  selTags: number[] = [];
  selToken: string[] = [];
  min: number = 0;
  max: number = 100;

  paraColor: {
    hex: string;
  } | null = null;

  selMobility: string = "";
  selParents: string = "";
  selEducation: string = "";
  selGender: string = "";
  selJob: string = "";

  range = [20, 70];

  token = ["Orthographische Umschrift", "LU", "Phonetische", "Lemma"];
  projects = ["PP11"];
  gender = ["Männlich", "Weiblich"];
  education = ["Pflichtschule", "Matura", "Studium"];
  parents = ["Herkunft"];
  job = ["Chemiker", "Tischler", "..."];
  mobility = ["Auto", "Zug", "Pferd"];

  TM = tagModule;

  get tags() {
    return this.TM.tagList == null ? [] : this.TM.tagList;
  }

  get loading() {
    return this.TM.loading;
  }

  get parameters() {
    return this.TM.parameters;
  }

  createParameter() {
    if (this.paraName == null || this.paraName === "") {
      this.paraName = "";
    }

    const ageRange = [this.range[0], this.range[1]];
    const newParameter: Parameter = {
      name: this.paraName,
      project: this.selProject,
      gender: this.selGender,
      education: this.selEducation,
      parents: this.selParents,
      job: this.selJob,
      tagList: this.selTags,
      token: this.selToken,
      ageRange: ageRange,
      color: this.paraColor === null ? "" : this.paraColor.hex,
    };
    const para = encodeURIComponent(JSON.stringify(this.TM.parameters));
    this.TM.addParameter(newParameter);
    this.$router.push({ path: "query", query: { parameters: para } });

    /*
    name: string;
    project?: string;
    ageRange: number[],
    gender?: string;
    education?: string;
    parents?: string;
    mobility?: string;
    job?: string;
    tagList?: TagTree[],
    token?: string[],
    color?: string
    */
  }

  beforeCreate() {
    if (tagModule.tagList == null) {
      tagModule.fetchTags();
    }
  }
}
</script>