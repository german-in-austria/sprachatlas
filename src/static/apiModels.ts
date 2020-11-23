export interface SingleInfResponse {
    id: number;
    hasTranskript: boolean;
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
