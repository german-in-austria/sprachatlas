<template>
  <div>
    <div v-if="edit">
      <vue-editor
        v-model="value"
        placeholder="Beschreibung für den Parameter"
      ></vue-editor>
      <div class="mt-5">
        <v-btn
          dark
          color="success"
          @click="
            $emit('update:description', value);
            edit = !edit;
          "
        >
          <v-icon left> mdi-check </v-icon>
          Speichern
        </v-btn>
        <v-btn
          class="ml-3"
          dark
          color="error"
          @click="
            edit = !edit;
            value = description;
          "
        >
          <v-icon left> mdi-close </v-icon>
          Verwerfen
        </v-btn>
      </div>
    </div>
    <div v-else>
      <span v-html="value"></span>
      <v-btn dark color="success" @click="edit = !edit">
        <v-icon left> mdi-pencil </v-icon>
        Bearbeiten
      </v-btn>
      <v-btn
        class="ml-3"
        dark
        color="error"
        @click="
          value = '';
          $emit('update:description', value);
        "
      >
        <v-icon left> mdi-trash-can </v-icon>
        Löschen
      </v-btn>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { messageHandler } from '@/store/modules/message';

import { VueEditor } from 'vue2-editor';
import { legendMod } from '@/store/modules/legend';
import { SearchItems } from '@/static/apiModels';

@Component({
  components: { VueEditor },
  name: 'LegendDescEdit'
})
export default class LegendDescEdit extends Vue {
  @Prop(String) readonly description!: string;

  value: string = '';
  LM = legendMod;
  edit: boolean = false;

  get queryLegend() {
    return this.LM.legend.filter((el) => el.type === SearchItems.Query);
  }

  created() {
    this.value = this.description;
  }

}
</script>