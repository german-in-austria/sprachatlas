import { exportLegend, LegendGlobal, SearchItems } from '@/static/apiModels';
import { clone } from 'lodash';
import * as LZ from 'lz-string';

export const expData = {
  transformLegend(legend: LegendGlobal, id: number): exportLegend {
    console.log('Exporting Legend');
    const expLegend: any = clone(legend) as any;
    delete expLegend.content;
    delete expLegend.layer;
    const eL = expLegend as exportLegend;
    eL.elementId = id;
    return expLegend as exportLegend;
  },
  fetchLegendFromUri() {
    const url = new URL(window.location.href);
    const leg = this.decode(url.searchParams);
    return leg;
  },
  decode(searchParams: URLSearchParams): Array<exportLegend> | null{
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
    if(uri === '' || uri.length === 0){
      url.searchParams.delete('legend');
    }else{
      url.searchParams.set('legend', `${uri}`);
    }
    window.history.replaceState({}, '', url.toString());
  },
  encodeObject(obj: any){
    return LZ.compressToEncodedURIComponent(JSON.stringify(obj));
  },
  pushNewLegend(legend: LegendGlobal, id: number) {
    const leg = this.fetchLegendFromUri();
    const tL = this.transformLegend(legend, id);
    let enc = null;
    if(leg){
      enc = this.encodeObject(leg.concat(tL));
    }else{
      enc = this.encodeObject([tL]);
    }
    this.pushURL(enc);
  },
  removeEntryFromUri(name: string, type: SearchItems) {
    let leg = this.fetchLegendFromUri();
    if(leg) {
      leg = leg?.filter((el) => el.name !== name && el.type !== type);
      let enc = '';
      if(leg.length > 0){
        enc = this.encodeObject(leg);
        this.pushURL(enc);
      }else{
        this.replaceUrl(enc);
      }
    }

  }
};
