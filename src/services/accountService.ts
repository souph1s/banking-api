import type { Account, TransferResponse } from '../types';

let accounts: Record<string, Account> = {};

export namespace AccountService {
    export function reset(): void {
        accounts = {};
    }

    export function getAccount(accountId: string): Account | null {
        return accounts[accountId] || null;
    }

    export function createAccount(accountId: string, initialBalance = 0): Account {
        accounts[accountId] = {
            id: accountId,
            balance: initialBalance,
        };
        return accounts[accountId];
    }

    export function updateBalance(accountId: string, newBalance: number): Account | null {
        const account = accounts[accountId];
        if (account) {
            account.balance = newBalance;
            return account;
        }
        return null;
    }

    export function accountExists(accountId: string): boolean {
        return accountId in accounts;
    }

    export function deposit(accountId: string, amount: number): Account {
        if (!accountExists(accountId)) {
            return createAccount(accountId, amount);
        }

        const account = accounts[accountId];
        if (!account) {
            throw new Error('Conta não encontrada');
        }
        const currentBalance = account.balance;
        const updatedAccount = updateBalance(accountId, currentBalance + amount);

        if (!updatedAccount) {
            throw new Error('Erro ao atualizar saldo da conta');
        }

        return updatedAccount;
    }

    export function withdraw(accountId: string, amount: number): Account | null {
        if (!accountExists(accountId)) {
            return null;
        }

        const account = accounts[accountId];
        if (!account) {
            return null;
        }

        const currentBalance = account.balance;
        if (currentBalance < amount) {
            throw new Error('Insufficient balance');
        }

        return updateBalance(accountId, currentBalance - amount);
    }

    export function transfer(
        originId: string,
        destinationId: string,
        amount: number,
    ): TransferResponse | null {
        if (!accountExists(originId)) {
            return null;
        }

        const originAccount = accounts[originId];
        if (originAccount && originAccount.balance < amount) {
            throw new Error('Insufficient balance');
        }

        const origin = withdraw(originId, amount);
        if (!origin) {
            return null;
        }

        const destination = deposit(destinationId, amount);

        return { origin, destination };
    }
}