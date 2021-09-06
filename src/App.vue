<template>
  <v-app>
    <v-main>
      <Navigation></Navigation>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import Home from "./views/Home.vue";
import { initialize as initGeo } from "./store/geo";
import { tagModule } from "@/store/modules/tags";
import Navigation from "@/components/Navigation.vue";
@Component({
  components: {
    Home,
    Navigation,
  },
})
export default class App extends Vue {
  mounted() {
    initGeo();
    tagModule.fetchTags();
    tagModule.fetchJobs();
  }
}
</script>
