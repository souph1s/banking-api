import type { TransferResponse } from '../types';
import { AccountService } from '../services/accountService';
import { WithdrawUseCase } from './withdrawUseCase';
import { DepositUseCase } from './depositUseCase';

export class TransferUseCase {
    private withdrawUseCase: WithdrawUseCase;
    private depositUseCase: DepositUseCase;

    constructor() {
        this.withdrawUseCase = new WithdrawUseCase();
        this.depositUseCase = new DepositUseCase();
    }

    execute(originId: string, destinationId: string, amount: number): TransferResponse | null {
        if (amount <= 0) {
            throw new Error('Amount must be positive');
        }

        if (!AccountService.accountExists(originId)) {
            return null;
        }

        const originAccount = AccountService.getAccount(originId);
        if (originAccount && originAccount.balance < amount) {
            throw new Error('Insufficient balance');
        }

        const origin = this.withdrawUseCase.execute(originId, amount);
        if (!origin) {
            return null;
        }

        const destination = this.depositUseCase.execute(destinationId, amount);

        return { origin, destination };
    }
}
