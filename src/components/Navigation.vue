<template>
  <v-app-bar app>
    <v-toolbar-title class="headline text-uppercase">
      <router-link tag="button" to="/">Sprachatlas</router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>
    <v-btn text to="/"> Karte </v-btn>
    <v-btn text to="/query"> Legende erstellen </v-btn></v-app-bar
  >
</template>
<script lang = "ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  // if you use components add them here
  components: {},
  /* name is necessary for recursive components
   * (at least in older versions, might be auto generated through the vue-property-decorator)
   */
  name: "Navigation",
})
export default class Navigation extends Vue {}
</script>