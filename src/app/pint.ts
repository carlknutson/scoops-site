export interface Pint {
    name: string;
    urlName: string;
    pintType: PintType;
}

export interface PintDetails {
    name: string;
    version: number;
    referenceUrls: string[];
    revisions: string[];
    creamiProductType: CreamiProductType;
    ingredients: string[];
    steps: string []
}

export enum PintType {
    iceCream = "ice-cream"
}

export enum CreamiProductType {
    breeze = "breeze",
    original = "original",
    deluxe = "deluxe"
}
