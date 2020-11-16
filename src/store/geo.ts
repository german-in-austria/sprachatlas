import * as geojson from 'geojson'
import * as _ from 'lodash'

export const geoStore = {
  bundeslaender: null as geojson.FeatureCollection | null,
  gemeinden: null as geojson.FeatureCollection|null,
  test: null as geojson.FeatureCollection | null
}

async function init () {
  console.log('Called geo Init function')
  // geoStore.bundeslaender = await (await fetch('static/bundeslaender.geojson.json')).json() as geojson.FeatureCollection
}

export const initialize = _.once(init)
