export interface Pint {
    name: string;
    urlName: string;
    pintType: PintType;
}

export interface PintScore {
    texture: number;
    flavor: number;
}

export interface PintNotes {
    date: string;
    version: number;
    versionLink: string;
    text: string;
}

export interface PintDetails {
    name: string;
    version: number;
    referenceUrls: string[];
    creamiProductType: CreamiProductType;
    ingredients: string[];
    steps: string[];
    notes: PintNotes[];
    score: PintScore;
}

export enum PintType {
    iceCream = "ice-cream",
    sorbet = "sorbet"
}

export enum CreamiProductType {
    breeze = "breeze",
    original = "original",
    deluxe = "deluxe"
}
