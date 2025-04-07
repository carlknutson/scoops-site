export interface Pint {
    name: string;
    urlName: string;
    pintType: PintType;
}

export interface PintScore {
    appearance: number;
    texture: number;
    flavor: number;
    aftertaste: number;
}

export interface PintNotes {
    date: string;
    text: string;
}

export interface PintDetails {
    name: string;
    referenceUrls: string[];
    creamiProductType: CreamiProductType;
    ingredients: string[];
    steps: string[];
    notes: PintNotes[];
    score: PintScore;
}

export enum PintType {
    iceCream = "ice-cream",
    sorbet = "sorbet",
    milkShake = "milk-shake"
}

export enum CreamiProductType {
    breeze = "breeze",
    original = "original",
    deluxe = "deluxe"
}
