<template class="">
  <v-container>
    <router-view />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MapView from "@/components/MapView.vue"; // @ is an alias to /src
import QueryCreator from "@/components/QueryCreator.vue";

@Component({
  components: {
    MapView,
    QueryCreator,
  },
})
export default class Home extends Vue {}
</script>
