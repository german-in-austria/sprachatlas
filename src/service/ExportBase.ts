import {
  exportLegend,
  LegendGlobal,
  localStorageQuery,
  SearchItems
} from '@/static/apiModels';
import { messageHandler } from '@/store/modules/message';
import { clone, isArray } from 'lodash';
import * as LZ from 'lz-string';

export const expData = {
  transformLegend(legend: LegendGlobal, id: number | number[]): exportLegend {
    console.log('Exporting Legend');
    const expLegend: any = clone(legend) as any;
    if (legend.type !== SearchItems.Ort) {
      delete expLegend.content;
    }
    delete expLegend.layer;
    const eL = expLegend as exportLegend;
    if (id > -1 || (isArray(id) && id.length > 0)) {
      eL.elementId = id;
    }
    return expLegend as exportLegend;
  },
  fetchLegendFromUri() {
    const url = new URL(window.location.href);
    const leg = this.decode(url.searchParams);
    return leg;
  },
  decode(searchParams: URLSearchParams): Array<exportLegend> | null {
    console.log('Decoding');

    let leg: Array<exportLegend> | null = null;
    for (const e of searchParams.entries()) {
      if (e[0] === 'legend') {
        leg = this.decodeLegend(e[1]);
      }
    }
    return leg;
  },
  decodeLegend(uri: string) {
    const decompStr = LZ.decompressFromEncodedURIComponent(uri);
    const str = JSON.parse(decompStr ? decompStr : '') as Array<exportLegend>;
    return str;
  },
  pushURL(uri: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('legend', `${uri}`);
    window.history.pushState({}, '', url.toString());
  },
  replaceUrl(uri: string) {
    const url = new URL(window.location.href);
    if (uri === '' || uri.length === 0) {
      url.searchParams.delete('legend');
    } else {
      url.searchParams.set('legend', `${uri}`);
    }
    window.history.replaceState({}, '', url.toString());
  },
  encodeObject(obj: any) {
    return LZ.compressToEncodedURIComponent(JSON.stringify(obj));
  },
  pushNewLegend(legend: LegendGlobal, id: number | number[]) {
    const leg = this.fetchLegendFromUri();
    const tL = this.transformLegend(legend, id);
    if (this.checkIfLocalStorageIsAvailable()) {
      this.pushToLocalStorage(legend, id);
    } else {
      messageHandler.setErrorMsg({
        message: `LocalStorage ist nicht verfügbar`,
        icon: 'mdi-alert-outline'
      });
    }
    let enc = null;
    if (leg) {
      enc = this.encodeObject(leg.concat(tL));
    } else {
      enc = this.encodeObject([tL]);
    }
    this.pushURL(enc);
  },
  removeEntry(id: string, name: string, type: SearchItems) {
    this.removeEntryFromUri(name, type);
    this.markAsDeleted(id, type, true);
  },
  removeEntryFromUri(name: string, type: SearchItems) {
    let leg = this.fetchLegendFromUri();
    if (leg) {
      leg = leg?.filter((el) => el.name !== name && el.type !== type);
      let enc = '';
      if (leg.length > 0) {
        enc = this.encodeObject(leg);
        this.pushURL(enc);
      } else {
        this.replaceUrl(enc);
      }
    }
  },
  removeEntryTypeFromUri(type: SearchItems) {
    let leg = this.fetchLegendFromUri();
    if (leg) {
      leg = leg?.filter((el) => el.type !== type);
      let enc = '';
      if (leg.length > 0) {
        enc = this.encodeObject(leg);
        this.pushURL(enc);
      } else {
        this.replaceUrl(enc);
      }
    }
  },
  storageAvailable(type: any): boolean {
    let storage;
    try {
      storage = window[type];
      const x = '__storage_test__';
      //@ts-ignore
      storage.setItem(x, x);
      //@ts-ignore
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        // everything except Firefox
        (e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        ((storage && storage.length !== 0) as boolean)
      );
    }
  },
  checkIfLocalStorageIsAvailable(): boolean {
    return this.storageAvailable('localStorage');
  },
  pushToLocalStorage(legend: LegendGlobal, id: number | number[]) {
    const q = localStorage.getItem('queries');
    if (q) {
      // exists and push to localStorage
      const query = this.decompressAndParse(q) as localStorageQuery[];
      const tL = this.transformLegend(legend, id);
      query.push({ legend: tL, date: Date.now(), deleted: false });
      localStorage.setItem('queries', this.encodeObject(query));
    } else {
      // does not exist and set new Style
      const tL = this.transformLegend(legend, id);
      const enc = this.encodeObject([
        { legend: tL, date: Date.now(), deleted: false }
      ] as localStorageQuery[]);
      localStorage.setItem('queries', enc);
    }
  },
  setQueryLocalStorage(query: localStorageQuery[]) {
    const q = localStorage.getItem('queries');
    if (q) {
      // exists and push to localStorage
      localStorage.setItem('queries', this.encodeObject(query));
    }
  },
  markAsDeleted(name: string, type: SearchItems, deleted: boolean) {
    const q = localStorage.getItem('queries');
    if (q) {
      let query = this.decompressAndParse(q) as localStorageQuery[];
      if (query.length === 0) return;
      const idx = query.findIndex(
        (el) => el.legend.id === name && el.legend.type === type
      );
      query[idx].deleted = deleted;
      localStorage.setItem('queries', this.encodeObject(query));
    }
  },
  removeFromLocalStorage(name: string, type: SearchItems) {
    const q = localStorage.getItem('queries');
    if (q) {
      // exists and push to localStorage
      const query = this.decompressAndParse(q);
      if (query.length === 0) return;
      const newQuery = query.filter(
        (el: any) => el.legend.name !== name && el.legend.type !== type
      );
      localStorage.setItem('queries', this.encodeObject(newQuery));
    }
  },
  getQueryFromLocalStorage(): localStorageQuery[] {
    const q = localStorage.getItem('queries');
    if (q) {
      const decompStr = LZ.decompressFromEncodedURIComponent(q);
      const str = JSON.parse(
        decompStr ? decompStr : ''
      ) as Array<localStorageQuery>;
      return str;
    }
    return [] as localStorageQuery[];
  },
  editLocalStorageEntry(
    query: localStorageQuery[],
    id: string,
    entry: localStorageQuery
  ) {
    const idx = query.findIndex((el) => el.legend.id === id);
    query[idx] = entry;
    this.setQueryLocalStorage(query);
  },
  decompressAndParse(encodedString: string): any {
    const decompStr = LZ.decompressFromEncodedURIComponent(encodedString);
    const str = JSON.parse(decompStr ? decompStr : '');
    return str;
  }
};
