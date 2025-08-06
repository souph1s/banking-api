import type { Account } from '../types';

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

    export function getAllAccounts(): Record<string, Account> {
        return { ...accounts };
    }
}