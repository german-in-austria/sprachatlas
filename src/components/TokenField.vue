<template>
  <fieldset class="box">
    <legend>{{ header }}</legend>
    <v-row>
      <v-col cols="7">
        <v-form v-model="validInput">
          <v-text-field
            v-model="inputModel"
            :label="label"
            clearable
            :hint="hint"
            :append-outer-icon="appendIcon"
            @click:append-outer="addToken"
            @keydown.enter="addToken"
            :rules="caseSen === 'RegEx' ? [rules.regexp] : []"
          >
          </v-text-field>
        </v-form>
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="state"
          :items="itemState"
          item-text="text"
          item-value="val"
          label="Kondition"
        ></v-select>
      </v-col>
      <v-col cols="3">
        <v-select v-model="caseSen" :items="itemCase"></v-select>
      </v-col>
    </v-row>
    <v-chip
      v-for="(val, idx) in selectedElements"
      :key="idx"
      class="ma-2"
      close
      :color="color"
      text-color="white"
      @click:close="selectedElements.splice(idx, 1)"
    >
      <template v-if="val.state === 'nicht'">
        <v-icon left> mdi-code-not-equal </v-icon>
      </template>
      <template v-else-if="val.state === 'muss'">
        <v-icon left> mdi-equal-box </v-icon>
      </template>
      <template v-if="val.case === 'case-sensitive'">
        <v-icon left> mdi-case-sensitive-alt </v-icon>
      </template>
      <template v-else-if="val.case === 'case-insensitive'">
        <v-icon left> mdi-format-letter-case </v-icon>
      </template>
      <template v-else-if="val.case === 'Regexp'">
        <v-icon left> mdi-regex </v-icon>
      </template>
      {{ val.val }}
    </v-chip>
  </fieldset>
</template>
<script lang="ts">
import { Prop, Vue, Component, PropSync } from 'vue-property-decorator';
import { selectionObject } from '@/api/dioe-public-api';

@Component({
  name: 'TokenField',
  components: {}
})
export default class TokenField extends Vue {
  @Prop({ type: String, default: 'Anfrage eingeben' }) readonly label!: string;
  @Prop({ type: String, default: '' }) readonly header!: string;
  @Prop({ type: String, default: '' }) readonly hint!: string;
  @Prop({ type: String, default: 'mdi-plus' }) readonly appendIcon!: string;
  @Prop({ type: String, default: '#FF0000' }) readonly color!: string;
  @PropSync('selElements') readonly selectedElements!: selectionObject[];

  itemState = [{ text: 'genau', val: 'genau' }, { text: 'enthält', val: 'muss' }, { text: 'nicht', val: 'nicht' }];
  itemCase = ['case-sensitive', 'case-insensitive', 'RegEx'];

  state = 'genau';
  caseSen = 'case-sensitive';

  inputModel: string = "";

  validInput: boolean = true;

  rules = {
    regexp: (value: string) => {
      const pattern = /^\/.*?\/[gimy]{0,4}$/;
      return pattern.test(value) || 'Ungültige RegEx'
    }
  };

  addToken() {
    if (!this.validInput) return;
    this.selectedElements.push({
      val: this.inputModel,
      state: this.state,
      case: this.caseSen
    });
    this.inputModel = "";
    this.$emit('update:elements', this.selectedElements);
  }

  updated() {
    if (!this.state || this.state === '')
      this.state = 'muss';
    if (!this.caseSen || this.caseSen === '')
      this.caseSen = 'case-sensitive';
  }


}
</script>
<style scoped>
  .box {
    border: 1px solid black;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
  }

  .box legend {
    margin-right: auto;
    padding: 0.2em 1.5em;
    border-bottom-left-radius: 1em;
  }
</style>