import Vue from 'vue'
import Vuex from 'vuex'

import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,

  reducer: state => ({
  })
})

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [vuexLocal.plugin]
})
