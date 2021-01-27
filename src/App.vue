<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import Home from "./views/Home.vue";
import { initialize as initGeo } from "./store/geo";
import { tagModule } from "@/store/modules/tags";

@Component({
  components: {
    Home,
  },
})
export default class App extends Vue {
  mounted() {
    initGeo();
    tagModule.fetchTags();
  }
}
</script>
