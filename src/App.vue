<template>
  <v-app>
    <Snackbar />
    <v-main
      class="pa-0"
      style="pa-0; postion: absolute; width: 100%; height: 100%"
    >
      <Navigation></Navigation>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import Home from './views/Home.vue';
import Snackbar from '@/components/Snackbar.vue';
import { initialize as initGeo } from './store/geo';
import { tagModule } from '@/store/modules/tags';
import { authModule } from '@/store/modules/auth';
import { aufgabenModule } from '@/store/modules/aufgaben';
import Navigation from '@/components/Navigation.vue';
import { getTranscripts } from '@/api/transcripts';
import { getSingleInfErhebung } from './api/erhebungen';
import { messageHandler } from './store/modules/message';
import { phaeModule } from './store/modules/phaenomene';
import { transModule } from './store/modules/transcripts';
import { decodeURI } from './helpers/helper';
import { legendMod } from './store/modules/legend';
@Component({
  components: {
    Home,
    Navigation,
    Snackbar
  }
})
export default class App extends Vue {
  loggedIn: boolean = false;
  errorMessage: string | null = '';
  PM = phaeModule;
  TM = transModule;

  get legendGlobal() {
    return legendMod.legend;
  }

  get dioeDBEndpoint() {
    return process.env.VUE_APP_DB_ENDPOINT;
  }

  async loadTranscripts() {
    try {
      this.errorMessage = null;
      const res = (await getSingleInfErhebung(146)).data;
      if (res.infErhebungen !== undefined) {
        this.loggedIn = true;
      } else if ((res as any).error === 'login') {
        this.loggedIn = false;
      }
    } catch (e) {
      this.loggedIn = false;
      this.errorMessage = 'could not load transcripts from backend.';
    }
  }

  mounted() {
    initGeo();
    tagModule.fetchTags();
    tagModule.fetchPresetTags();
    tagModule.getAllSppos();
    this.PM.fetchAllPhaen();
    authModule.getAllMaps();
    authModule
      .fetchCurrentUser()
      .then(() => {
        const user = authModule.currentUser;
        if (user.error) {
          messageHandler.setWarnMsg({
            message: `Sie sind aktuell nicht eingeloggt`,
            icon: 'mdi-warn'
          });
        } else {
          messageHandler.setSuccessMsg({
            message: `Willkommen zurück ${user.user.name}`,
            icon: 'mdi-info'
          });
        }
      })
      .then(() => {
        if (this.legendGlobal.length === 0) {
          legendMod.setLoadDataPromise(decodeURI());
        }
      });
    aufgabenModule.fetchAllAufgaben();
    this.loadTranscripts();
  }
}
</script>
<style lang="scss" scoped>
html {
  overflow: hidden !important;
}
</style>
