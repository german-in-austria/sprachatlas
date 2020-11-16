<template>
  <v-app>
    <v-main>
      <Home/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import Home from './views/Home.vue'
import { initialize as initGeo } from './store/geo'

@Component({
  components: {
    Home
  }
})
export default class App extends Vue {
  mounted () {
    initGeo()
  }
}
</script>
