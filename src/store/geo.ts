import * as geojson from 'geojson';
import * as _ from 'lodash';

export const geoStore = {
  bundeslaender: null as geojson.FeatureCollection | null,
  dialektregionen: null as geojson.FeatureCollection | null,
  gemeinden: null as geojson.FeatureCollection | null,
  test: null as geojson.FeatureCollection | null
};

async function init() {
  console.log('Called geo Init function');
  geoStore.bundeslaender = (await (
    await fetch('geojson/bundeslaender.geojson.json')
  ).json()) as geojson.FeatureCollection;
  const sfb = (await (
    await fetch('geojson/SFB_Dialektregionen.geojson')
  ).json()) as geojson.FeatureCollection;
  const vlbg = (await (
    await fetch('geojson/vbg.geojson')
  ).json()) as geojson.FeatureCollection;
  geoStore.dialektregionen = concatGeoJSON(
    sfb,
    vlbg
  ) as geojson.FeatureCollection;
}

function concatGeoJSON(g1: any, g2: any) {
  return {
    type: 'FeatureCollection',
    features: [...g1.features, ...g2.features]
  };
}

export const initialize = _.once(init);
