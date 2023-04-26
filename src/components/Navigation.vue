<template>
  <v-app-bar app>
    <v-toolbar-title class="headline text-uppercase">
      <router-link tag="button" to="/">Sprachatlas</router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>
    <v-btn icon to="/"> <v-icon>mdi-map</v-icon></v-btn>
    <v-btn icon to="/list"><v-icon>mdi-view-list</v-icon> </v-btn>
    <v-btn text to="/query"> Legende erstellen </v-btn>
    <v-card-actions class="justify-center">
      <Darkbtn class="mt-4" />
    </v-card-actions>
  </v-app-bar>
</template>
<script lang = "ts">
import { Component,Vue } from 'vue-property-decorator';
import Darkbtn from './Darkbtn.vue';
@Component({
  // if you use components add them here
  components: { Darkbtn },
  /* name is necessary for recursive components
   * (at least in older versions, might be auto generated through the vue-property-decorator)
   */
  name: 'Navigation'
})
export default class Navigation extends Vue { }
</script>
<style lang="scss">
  .navbar {
    opacity: 100%;
    transition: opacity 0.5s ease-out;
    -moz-transition: opacity 0.5s ease-out;
    -webkit-transition: opacity 0.5s ease-out;
    -o-transition: opacity 0.5s ease-out;
  }

  .navbar:hover {
    opacity: 100%;
  }
</style>