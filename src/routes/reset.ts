import express, { type Request, type Response } from 'express';
import { AccountService } from '../services/accountService';

const router = express.Router();

/**
 * @swagger
 * /reset:
 *   post:
 *     summary: Reset all accounts
 *     description: Remove todas as contas do sistema
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: Sistema resetado com sucesso
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: OK
 */
router.post('/reset', (res: Response) => {
    AccountService.reset();
    res.status(200).send('OK');
});

export default router;