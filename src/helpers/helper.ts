import {
  AntwortTokenStamp,
  AufgabeStamp,
  selectionObject,
  tagDto
} from '@/api/dioe-public-api';
import { expData } from '@/service/ExportBase';
import {
  exportLegend,
  Hsl,
  SearchItems,
  sigleAntwort,
  singleEntry
} from '@/static/apiModels';
import { aufgabenModule } from '@/store/modules/aufgaben';
import { legendMod } from '@/store/modules/legend';
import { tagModule } from '@/store/modules/tags';
import L from 'leaflet';

let colorid = 0;

export const getOrtName = (name: string) => {
  if (name !== null) {
    const reg =
      /^([\w\sa-zA-Z\u00E4\u00F6\u00FC\u00C4\u00D6\u00DC\u00df]*),\s(\w*)/;
    const res = reg.exec(name);
    if (res) {
      return res.length > 2
        ? { name: res[1], bl: res[2] }
        : res.length === 2
        ? { name: res[1] }
        : { name: res[0] };
    }
  }
  return { name };
};

export const convertStrToHsl = (str: string): Hsl => {
  const hsl = str
    .substring(4, str.length - 1)
    .replaceAll('%', '')
    .split(',');
  return { h: Number(hsl[0]), s: Number(hsl[1]), l: Number(hsl[2]) } as Hsl;
};

export const convertHslToStr = (a: number, s: number, l: number) => {
  return `hsl(${a},${s * 100}%,${l * 100}%)`;
};

/*
 * Takes a HSL color (All three components seperate) and converts it to a hex notation (#FFFFFF)
 * h is provided as an angle in degrees
 * s and l are to be provided as numbers between 0 and 100
 */
export const hslToHex = (h: number, s: number, l: number) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: any) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0'); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const convertHexToHsl = (str: string) => {
  let r = parseInt(str.substring(1, 3), 16);
  let g = parseInt(str.substring(3, 5), 16);
  let b = parseInt(str.substring(5), 16);

  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h: number = (max + min) / 2;
  let s: number = h;
  const l: number = h;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
};

export const generateID = () => {
  return (
    Date.now().toString(36) + Math.random().toString(36).substring(2, 5)
  ).toUpperCase();
};

export const selectColor = (num: number | null) => {
  let angle = 0;
  if (num !== null) {
    angle = num * 137.508; // use golden angle approximation
    colorid += num;
  } else {
    angle = colorid++ * 137.508;
  }
  //return `hsl(${angle},100%,75%)`;
  return {
    h: angle,
    s: 1,
    l: 0.75,
    a: 1
  };
};

/*
 */
export const isAufgabeStandard = (val: string): string => {
  if (val.search('(UED|SPTD|SPT-D)') > -1) {
    return 'Dialekt';
  } else if (val.search('(UES|SPTS)') > -1) {
    return 'Standard';
  } else {
    return '';
  }
};

/**
 * This function arranges data by its sigle in a result array from the type sigleAntwort
 * @param data data that will be arranged by sigle
 * @returns Array with data arranged by sigle.
 */
export const arrangeBySigle = (
  data: AntwortTokenStamp[] | AufgabeStamp[]
): sigleAntwort[] => {
  let res: sigleAntwort[] = [];
  data.forEach((el) => {
    const isAntwortTokenStamp = (x: any): x is AntwortTokenStamp =>
      (el as AntwortTokenStamp).res !== undefined;
    const idx = res.findIndex((e) => e.sigle === el.sigle);
    let data: any = [];
    // Is of type AntwortTokenStamp
    if (isAntwortTokenStamp(el)) {
      data = el.res.map((el) => el.data);
    } else {
      data = el.data;
    }
    // Element exists
    if (idx > -1) {
      res[idx].data.push({
        dateipfad: el.dateipfad ? el.dateipfad : '',
        audiofile: el.audiofile ? el.audiofile : '',
        data: data,
        id: isAntwortTokenStamp(el) ? el.res.map((d) => d.id) : undefined
      });
    } else {
      // does not exist
      res.push({
        sigle: el.sigle,
        age: el.age,
        gruppeBez: el.gruppeBez,
        teamBez: el.teamBez,
        data: [
          {
            dateipfad: el.dateipfad ? el.dateipfad : '',
            audiofile: el.audiofile ? el.audiofile : '',
            data: data,
            id: isAntwortTokenStamp(el) ? el.res.map((d) => d.id) : undefined
          }
        ]
      });
    }
  });
  return res;
};

export const loadData = async (
  data: singleEntry,
  osm: number,
  type: SearchItems,
  ageRange: { lower: number; upper: number }
) => {
  const AM = aufgabenModule;
  const erhArt = legendMod.erhArtFilter;
  let ids = [] as number[];
  if (data.id !== '' && type !== SearchItems.Query) {
    ids = [Number(data.id)];
  }
  let max = ageRange.upper;
  let min = ageRange.lower;
  let token = [] as selectionObject[];
  let lemma = [] as selectionObject[];
  const p = data.para;
  if (p) {
    if (p.ageRange[0]) {
      min = Math.min(p.ageRange[0], min > -1 ? min : p.ageRange[0]);
    }
    if (p.ageRange[1]) {
      max = Math.max(p.ageRange[1], max);
    }
    token = p.textTokenList ? p.textTokenList : [];
    lemma = p.lemmaList ? p.lemmaList : [];
    ids = p.tagList && p.tagList.length > 0 ? p.tagList[0].tagIds : [-1];
  }
  switch (data.t) {
    case SearchItems.Phaen:
      await AM.fetchAntwortAudio({
        phaen: ids,
        erhArt: erhArt,
        ids: [],
        osmId: osm,
        ageLower: min,
        ageUpper: max,
        text: token,
        ausbildung:
          p?.maxEducation !== undefined && p?.maxEducation !== null
            ? p.maxEducation
            : '',
        beruf_id:
          p?.education !== undefined && p?.education !== null
            ? p.education
            : -1,
        weiblich: p?.gender !== undefined ? p.gender : undefined,
        lemma: lemma
      });
      break;
    case SearchItems.Query:
    case SearchItems.Tag:
      await AM.fetchAntwortAudio({
        ids: ids,
        paraid: data.id.toString(),
        osmId: osm,
        ageLower: min,
        ageUpper: max,
        text: token,
        ausbildung:
          p?.maxEducation !== undefined && p?.maxEducation !== null
            ? p.maxEducation
            : '',
        beruf_id:
          p?.education !== undefined && p?.education !== null
            ? p.education
            : -1,
        weiblich: p?.gender !== undefined ? p.gender : undefined,
        project: p?.project ? p.project : undefined,
        erhArt: erhArt,
        group: data.t === SearchItems.Query ? true : false,
        lemma: lemma
      });
      break;
    case SearchItems.Aufgaben:
      await AM.fetchAufgabenAudioOrt({
        ids: ids,
        osmId: osm,
        ageLower: min,
        ageUpper: max
        //text: ort.data[0].para?.textTokenList
      });
      break;
  }
};

export const nameForSearchItems = (val: SearchItems): string => {
  switch (val) {
    case SearchItems.Tag:
      return 'Tag';
    case SearchItems.Ort:
      return 'Ort';
    case SearchItems.Phaen:
      return 'Ort';
    case SearchItems.Query:
      return 'Query';
    case SearchItems.Aufgaben:
      return 'Aufgabe';
    case SearchItems.Presets:
      return 'Preset';
    default:
      return '';
  }
};

export const fetchContent = async (
  id: number | number[],
  type: SearchItems
) => {
  if (type === SearchItems.Tag) {
    await tagModule.fetchTagOrteResults({ tagId: id as number });
    return tagModule.tagOrteNum;
  } else if (type === SearchItems.Phaen) {
    const dto = {
      ids: [-1],
      phaen: id
    } as tagDto;
    await tagModule.fetchTagOrteResultsMultiple([dto]);
    return tagModule.tagOrteNum;
  } else if (type === SearchItems.Presets) {
    await tagModule.fetchPresetTagOrte(id as number);
    return tagModule.tagOrteNum;
    // cast result as PresetOrtTagResult
    // @ts-ignore
  } else if (type === SearchItems.Saetze) {
    return await aufgabenModule.fetchAntworten({ sid: id as number });
  } else if (type === SearchItems.Aufgaben) {
    await aufgabenModule.fetchAufgabenOrt({
      ids: typeof id === 'number' ? [id] : id
    });
    return aufgabenModule.aufgabenOrt;
  }
};

/*
 * Decode the components of the URI
 * Happens by reading the data from the URI
 * Afterwards converts the recieved data into the internal data structure
 * 1. Create new Legend Entries
 * 2. display these new entries on the map
 */
export const decodeURI = async () => {
  if (legendMod.legend.length === 0 || !legendMod.legend[0].content) {
    const uriData = expData.fetchUriAndDecodeData();
    let legend: exportLegend[] = [];
    if (uriData.id.length > 0) {
      legend = await expData.getDataFromDioeDB(uriData.id);
      if (legend.length > 1) {
        legend.forEach((el, idx, arr) => {
          if (!el.id || el.id === null || el.id === undefined) {
            legend.splice(idx, 1);
          }
        });
        let legendDesc = legend.filter(
          (el) => el.description && el.description !== ''
        );
        if (
          legendDesc.length === 0 ||
          legendDesc[0].description === undefined
        ) {
          legendDesc.push(legend[0]);
          if (legendDesc[0].description === undefined)
            legendDesc[0].description = '';
        }
        legend.forEach((el) => (el.description = legendDesc[0].description));
      }
    } else {
      legend = uriData.leg ? uriData.leg : [];
    }
    legendMod.resetLocalStorage();
    legendMod.clearLegend();
    const queries = expData.getQueryFromLocalStorage();
    legendMod.setLocalStorage(queries);
    if (legend.length === 0 && queries.length > 0) {
      legend = queries.filter((el) => !el.deleted).map((el) => el.legend);
    }
    if (legend.length > 0) {
      if (queries.length > 0) {
        queries.forEach((el) => {
          const idx = legend.findIndex((l) => el.legend.id === l.id);
          if (idx === -1 && !el.deleted) {
            legend.push(el.legend);
          }
        });
      }
      for (const l of legend) {
        // Same ID is already in use and in the map
        if (
          legendMod.legend.some(
            (el) => el.id === l.id || (el.type === l.type && el.name === l.name)
          )
        ) {
          continue;
        }
        let res = null;
        if (l.type !== SearchItems.Query) {
          // Fetch the needed content for the legend
          res = await fetchContent(l.elementId, l.type);
        }
        // create the new entry
        const lm = await legendMod.createLegendEntry({
          icon: l.symbol,
          layer: L.layerGroup(),
          name: l.name,
          color: l.color,
          radius: l.size,
          content: l.type === SearchItems.Ort ? l.content : res,
          id: l.id,
          type: l.type,
          description: l.description
        });
        lm.parameter = l.type === SearchItems.Query ? l.parameter : null;
        lm.searchInfo = l.searchInfo;
        if (lm.type === SearchItems.Query) delete lm.content;
        legendMod.addLegendEntry(lm);
      }
    }
    return new Promise((resolve, reject) => {
      if (legend.length === 0) reject('Keine Legende zum Laden vorhanden!');
      resolve('Daten wurden geladen!');
    });
  }
};

export const deocdeImportedMap = async (mapEncoded: string) => {
  // Returns decoded map as an Array
  const decodedMap = expData.decompressAndParse(mapEncoded);
  for (const l of decodedMap) {
    // Same ID is already in use and in the map
    if (
      legendMod.legend.some(
        (el) => el.id === l.id || (el.type === l.type && el.name === l.name)
      )
    ) {
      continue;
    }
    let res = null;
    if (l.type !== SearchItems.Query) {
      // Fetch the needed content for the legend
      res = await fetchContent(l.elementId, l.type);
    }
    // create the new entry
    const lm = await legendMod.createLegendEntry({
      icon: l.symbol,
      layer: L.layerGroup(),
      name: l.name,
      color: l.color,
      radius: l.size,
      content: l.type === SearchItems.Ort ? l.content : res,
      id: l.id,
      type: l.type,
      description: l.description
    });
    lm.parameter = l.type === SearchItems.Query ? l.parameter : null;
    lm.searchInfo = l.searchInfo;
    if (lm.type === SearchItems.Query) delete lm.content;
    legendMod.addLegendEntry(lm);
  }
};
