export interface DonationHistory {
    to: string;
    amount: number;
    date: Date;
    spent?: SpentHistory[];
}

export interface SpentHistory {
    name: string;
    amount: number;
    total: number;
    date: Date;
}