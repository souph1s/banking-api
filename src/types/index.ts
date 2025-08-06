export interface Account {
    id: string;
    balance: number;
}

export interface DepositEvent {
    type: 'deposit';
    destination: string;
    amount: number;
}

export interface WithdrawEvent {
    type: 'withdraw';
    origin: string;
    amount: number;
}

export interface TransferEvent {
    type: 'transfer';
    origin: string;
    destination: string;
    amount: number;
}

export type Event = DepositEvent | WithdrawEvent | TransferEvent;

export interface DepositResponse {
    destination: Account;
}

export interface WithdrawResponse {
    origin: Account;
}

export interface TransferResponse {
    origin: Account;
    destination: Account;
}