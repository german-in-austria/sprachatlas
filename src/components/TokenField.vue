<template>
  <fieldset class="box">
    <legend>{{ header }}</legend>
    <v-text-field
      v-model="inputModel"
      :label="label"
      clearable
      :hint="hint"
      :append-outer-icon="appendIcon"
      @click:append-outer="addToken"
      @keydown.enter="addToken"
    ></v-text-field>
    <v-chip
      v-for="(val, idx) in textToken"
      :key="idx"
      class="ma-2"
      close
      :color="color"
      text-color="white"
      @click:close="textToken.splice(idx, 1)"
    >
      {{ val }}
    </v-chip>
  </fieldset>
</template>
<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator';
import { expData } from '@/service/ExportBase';
import { SearchItems } from '@/static/apiModels';
import { legendMod } from '@/store/modules/legend';
import { messageHandler } from '@/store/modules/message';


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


  inputModel: string = "";
  textToken: string[] = [];

  addToken() {
    this.textToken.push(this.inputModel);
    this.inputModel = "";
    this.$emit('update:elements', this.textToken);
  }

  mounted() {

  }
}
</script>
<style scoped>
  .box {
    border: 1px solid black;
    border-radius: 10px;
    box-sizing: border-box;
    grid-area: 1 / 2;
    padding: 20px;
  }

  .box legend {
    margin-right: auto;
    padding: 0.2em 1.5em;
    border-bottom-left-radius: 1em;
  }
</style>