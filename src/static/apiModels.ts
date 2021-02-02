import { TagTree } from '@/api/dioe-public-api';

type ServerTranscriptId = number

export type TokenTierType = 'text'|'ortho'|'phon'

export interface SingleInfResponse {
    id: number;
    hasTranskript: boolean;
}

export interface einzErhebung {
    Datum: string
    Kommentar: string
    Logfile: string
    Explorator: number
    Dateipfad: string
    id_transcript: number
    Ort: string
    Besonderheiten: string
    ID_Erh: number
    pk: number
    OrtString: string
    Audiofile: string
    FX_Informanten: {
        pk: number
        Name: string
        Vorname: string
        Kuerzel: string
        Kuerzel_anonym: string
    }[] 
}

export interface SingleErhebResponse {
    id: number;
    zeitraum: string;
    Bezeichnung_Erhebung: string;
    Art_Erhebung: {
        Bezeichnung: string;
        id: number;
    };
    Konzept_von: {
        str: string;
        id: number;
    };
}

export interface ApiLocSingleResponse {
    ort_namekurz: string;
    osm_id: number;
    id: number;
    ort_namelang: string;
    lat: string;
    lon: string;
    osm_type: string;
    inferhebungen: SingleInfResponse[];
    erhebungen: SingleErhebResponse[];
}

export interface Job{
    berufskategorie: string;
    kommunikationsgrad: string;
    bezeichnung: string;
    standardkompetenz: string;
}

export interface JobList {
    jobs: Job[];
}

export interface Parameter{
    name: string;
    project?: string;
    ageRange: number[],
    gender?: string;
    education?: string;
    parents?: string;
    mobility?: string;
    job?: string;
    tagList?: number[],
    token?: string[],
    color?: string
}

export interface InfResponse {
    transcript: {
        id: number,
        name: string
    }, 
    erhebung: {
        Zeitraum: string,
        Art_Erhebung: {
            id: number,
            Bezeichnung: string
        },
        Bezeichnung_Erhebung: string,
        id: number,
        Konzept_von: string
    },
    id: number,
    Besonderheiten: string,
    Kommentar: string,
    Datum: Date,
    sprecher: [{
        str: string,
        id: number
    }],
    Audiofile: string,
    Dateipfad: string,
}

export interface ApiInfErhResponse {
    infErhebungen: InfResponse[]
}

export interface ApiLocationResponse {
    orte: ApiLocSingleResponse[];
}

export interface ServerAnswer {
    // there are other properties here
    // that we don’t care about now
    it: number // token id
}

export interface ServerAnswerSet {
    // there are other properties here
    // that we don’t care about now
    its: number // token set id
}

export interface TokenRange {
    ivt: number // token id (id von token)
    ibt: number // token id (id bis token)
}
  
export interface TokenSet {
    t: number[] // token ids
}

export interface ServerTier {
    tier_name: string
}

export interface ServerToken {
    tr: number // token reihung
    tt: number // token type
    sr: number // sequence in sentence
    t: string // text
    to: string // text in ortho
    s: number // sentence id
    i: number // inf id
    e: number // event id
    o?: string // ortho
    p?: string // add phon on server
    fo?: number // fragment of
}


export interface ServerTranscriptInformants {
    [speaker_id: number]: ServerTranscriptInformant
}

export interface ServerTranscriptInformant {
    ka: string // abbrev anonymized
    k: string // abbrev
}

export interface ServerTranscriptTokenTypes {
    // token type id
    [id: string]: {
      n: string // token type name
    }
}

export interface ServerEvent {
    pk: number
    tid: {
      [speaker_id: string]: number[]
    }
    event_tiers: ServerSpeakerEventTiers
    e: string // end
    s: string // start
    l: 0
}

export interface ServerEventTierContent {
    // event tier string
    t: string
    // tier id
    ti: number
  }
  
  export interface ServerEventTiers {
    [event_tier_id: string]: ServerEventTierContent
  }
  
  export interface ServerSpeakerEventTiers {
    [speaker_id: string]: ServerEventTiers
  }

export interface ServerTranscript {
    aAntworten?: {
      [answer_id: string]: ServerAnswer|ServerAnswerSet
    }
    aTokenSets?: {
      [set_id: number]: TokenRange|TokenSet
    }
    aTiers: {
      [tier_id: string]: ServerTier
    }
    aTokens: {
      [token_id: string]: ServerToken
    }
    aEinzelErhebung?: {
      af: string
      d: string
      dp: string
      e: number
      pk: number
      trId: number
    }
    aInformanten?: ServerTranscriptInformants
    aTranskript?: {
      default_tier?: TokenTierType|null
      n: string // name
      pk: ServerTranscriptId
      ut: string
    }
    aTokenTypes?: ServerTranscriptTokenTypes
    aEvents: ServerEvent[]
    nNr: number
    aNr: number
    aTmNr?: number
  }

  export interface transRoute {
      pk: number
      n: string
      ut: string
      default_tier: TokenTierType
  }