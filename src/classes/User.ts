export enum USER_TYPE {
    RICH = 'rich',
    POOR = 'poor'
}

export class User {
    name: string;
    id: number;
    balance: number;
    publicKey: string;
    type: USER_TYPE;
    story?: string;

    constructor(id: number, name: string, type: USER_TYPE = USER_TYPE.RICH, balance: number, publicKey: string, story?: string) {
        this.name = name;
        this.type = type;
        this.id = id;
        this.balance = balance;
        this.publicKey = publicKey;
        if (story) {
            this.story = story;
        }
    }
}