import type { Account } from '../types';
import { AccountService } from '../services/accountService';

export class DepositUseCase {
    execute(accountId: string, amount: number): Account {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }

        if (!AccountService.accountExists(accountId)) {
            return AccountService.createAccount(accountId, amount);
        }

        const account = AccountService.getAccount(accountId);
        if (!account) {
            throw new Error('Account not found');
        }

        const currentBalance = account.balance;
        const updatedAccount = AccountService.updateBalance(accountId, currentBalance + amount);

        if (!updatedAccount) {
            throw new Error('Error updating account balance');
        }

        return updatedAccount;
    }
}
