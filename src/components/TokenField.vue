<template>
  <v-text-field
    v-model="inputModel"
    :label="label"
    clearable
    :hint="hint"
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
</template>
<script lang="ts">
import { readonly } from 'vue';
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
  @Prop({ type: String, default: '' }) readonly hint!: string;

  inputModel: string = "";
  textToken: string[] = [];

  addToken() {
    this.textToken.push(this.inputModel);
    this.inputModel = "";
  }
}
</script>