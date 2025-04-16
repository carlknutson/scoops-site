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
    productType: ProductType;
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

export enum ProductType {
    ncBreeze = "CREAMi Breeze",
    ncOriginal = "CREAMi Original",
    ncDeluxe = "CREAMi Deluxe",
    ice21 = "ICE-21"
}
