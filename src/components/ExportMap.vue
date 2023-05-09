<template>
  <v-card>
    <v-card-title>
      Export der Karteneinstellungen
      <v-spacer></v-spacer>
      <v-btn icon color="indigo" @click="updateVis()">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-row>
        <LegendDetails />
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer> </v-spacer>
      <v-btn color="green darken-1" text @click="copyClipboard(url)"
        >In die Zwischenablage kopieren</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import { readonly } from 'vue';
import { Prop, Vue, Component } from 'vue-property-decorator';
import { expData } from '@/service/ExportBase';
import { SearchItems } from '@/static/apiModels';
import { legendMod } from '@/store/modules/legend';
import { messageHandler } from '@/store/modules/message';
import LegendDetails from '@/components/LegendDetails.vue';
import { authModule } from '@/store/modules/auth';
import { generateID } from '@/helpers/helper';

@Component({
  name: 'ExportMap',
  components: {
    LegendDetails
  }
})
export default class ExportMap extends Vue {
  @Prop({ type: Boolean, default: false }) readonly vis!: boolean;

  LM = legendMod;
  MH = messageHandler;

  get url() {
    return window.location.href;
  }

  updateVis() {
    this.$emit('update:vis', !this.vis);
  }

  get queryLegend() {
    return this.LM.legend.filter((el) => el.type === SearchItems.Query);
  }

  async copyClipboard(str: string) {
    // Exporting queryLegend
    let res = '';
    res = expData.encodeObject(
      legendMod.localStorageLegend
        .filter((el) => !el.deleted)
        .map((el) => el.legend)
    );
    if (res.length > 0) {
      const urlID = generateID();
      const data = { data: res, url: urlID };
      // send the link to dioedb
      // and await ID

      await authModule.postExportLink(data);
      const response = authModule.exportId;

      if (!response.error) {
        // Copy to Clipboard
        // const uri = window.location.href;
        navigator.clipboard
          .writeText(`${window.location.origin}?id=${urlID}`)
          .then(
            () => {
              this.MH.setSuccessMsg({
                message: `URL wurde in die Zwischenablage kopiert`,
                icon: 'mdi-info'
              });
              this.updateVis();
            },
            () => {
              this.MH.setErrorMsg({
                message: `Fehler beim Kopieren der URL!`,
                icon: 'mdi-alert-outline'
              });
            }
          );
      } else {
        this.MH.setErrorMsg({
          message: `Fehler beim Exportieren der URL!`,
          icon: 'mdi-alert-outline'
        });
      }
    }
  }
}
</script>
