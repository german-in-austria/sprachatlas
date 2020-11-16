<template>
  <div class="home">
    <h1>Sprachatlas</h1>
    <MapView></MapView>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MapView from '@/components/MapView.vue' // @ is an alias to /src

@Component({
  components: {
    MapView
  }
})
export default class Home extends Vue {}
</script>
