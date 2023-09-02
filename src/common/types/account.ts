export type Account = {
    identifier: string;
    amount: Number;
    events: Operation[];
};

export type Operation = {
    type: string;
    originIdentifier: string;
    destinyIdentifier: string;
    amount: Number;
}