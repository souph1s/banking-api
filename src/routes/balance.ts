import express, { type Request, type Response } from 'express';
import { AccountService } from '../services/accountService';

const router = express.Router();

/**
 * @swagger
 * /balance:
 *   get:
 *     summary: Get account balance
 *     description: Get the balance of a specific account
 *     tags: [Accounts]
 *     parameters:
 *       - in: query
 *         name: account_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *         example: "100"
 *     responses:
 *       200:
 *         description: Account balance
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "10"
 *       404:
 *         description: Account not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "0"
 *       400:
 *         description: Account ID is mandatory
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "account_id is mandatory"
 */
router.get('/balance', (req: Request, res: Response) => {
    const { account_id } = req.query;

    if (!account_id || typeof account_id !== 'string') {
        return res.status(400).json({ error: 'account_id is mandatory' });
    }

    const account = AccountService.getAccount(account_id);

    if (!account) {
        return res.status(404).send('0');
    }

    return res.status(200).send(account.balance.toString());
});

export default router;