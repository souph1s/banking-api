import type { Account } from '../types';
import { AccountService } from '../services/accountService';

export class WithdrawUseCase {
    execute(accountId: string, amount: number): Account | null {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }

        if (!AccountService.accountExists(accountId)) {
            return null;
        }

        const account = AccountService.getAccount(accountId);
        if (!account) {
            return null;
        }

        const currentBalance = account.balance;
        if (currentBalance < amount) {
            throw new Error('Insufficient balance');
        }

        return AccountService.updateBalance(accountId, currentBalance - amount);
    }
}
