import express, { type Request, type Response } from 'express';
import { AccountService } from '../services/accountService';

const router = express.Router();

/**
 * @swagger
 * /reset:
 *   post:
 *     summary: Reset all accounts
 *     description: Reset all accounts in the system
 *     tags: [System]
 *     responses:
 *       200:
 *         description: System reset successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: OK
 */
export function resetAccounts(_req: Request, res: Response) {
    AccountService.reset();
    res.status(200).send('OK');
}

router.post('/reset', resetAccounts);

export default router;
