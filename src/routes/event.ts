import express, { type Request, type Response } from 'express';
import { AccountService } from '../services/accountService';
import type { Event } from '../types';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Account ID
 *         balance:
 *           type: number
 *           description: Account balance
 *       example:
 *         id: "100"
 *         balance: 10
 *     DepositEvent:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [deposit]
 *         destination:
 *           type: string
 *           description: Destination account ID
 *         amount:
 *           type: number
 *           description: Amount to be deposited
 *       required:
 *         - type
 *         - destination
 *         - amount
 *       example:
 *         type: deposit
 *         destination: "100"
 *         amount: 10
 *     WithdrawEvent:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [withdraw]
 *         origin:
 *           type: string
 *           description: Origin account ID
 *         amount:
 *           type: number
 *           description: Amount to be withdrawn
 *       required:
 *         - type
 *         - origin
 *         - amount
 *       example:
 *         type: withdraw
 *         origin: "100"
 *         amount: 5
 *     TransferEvent:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [transfer]
 *         origin:
 *           type: string
 *           description: Origin account ID
 *         destination:
 *           type: string
 *           description: Destination account ID
 *         amount:
 *           type: number
 *           description: Amount to be transferred
 *       required:
 *         - type
 *         - origin
 *         - destination
 *         - amount
 *       example:
 *         type: transfer
 *         origin: "100"
 *         destination: "300"
 *         amount: 15
 */

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Process banking events
 *     description: Process banking events (deposit, withdraw, transfer)
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/DepositEvent'
 *               - $ref: '#/components/schemas/WithdrawEvent'
 *               - $ref: '#/components/schemas/TransferEvent'
 *     responses:
 *       201:
 *         description: Event processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     destination:
 *                       $ref: '#/components/schemas/Account'
 *                 - type: object
 *                   properties:
 *                     origin:
 *                       $ref: '#/components/schemas/Account'
 *                 - type: object
 *                   properties:
 *                     origin:
 *                       $ref: '#/components/schemas/Account'
 *                     destination:
 *                       $ref: '#/components/schemas/Account'
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Account not found or insufficient balance
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "0"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/event', (req: Request, res: Response) => {
    const eventData: Event = req.body;
    const { type, amount } = eventData;

    if (!type || !amount) {
        return res.status(400).json({ error: 'type and amount are mandatory' });
    }

    switch (type) {
        case 'deposit': {
            const { destination } = eventData as { destination: string };
            if (!destination) {
                return res
                    .status(400)
                    .json({ error: 'destination is mandatory for deposit' });
            }

            try {
                const account = AccountService.deposit(destination, amount);
                return res.status(201).json({
                    destination: account,
                });
            } catch {
                return res.status(500).json({ error: 'Error processing deposit' });
            }
        }

        case 'withdraw': {
            const { origin } = eventData as { origin: string };
            if (!origin) {
                return res
                    .status(400)
                    .json({ error: 'Origin is mandatory for withdraw' });
            }

            try {
                const originAccount = AccountService.withdraw(origin, amount);
                if (!originAccount) {
                    return res.status(404).send('There is no account with this ID');
                }

                return res.status(201).json({
                    origin: originAccount,
                });
            } catch (error) {
                if (error instanceof Error && error.message === 'Insufficient balance') {
                    return res.status(400).json({ error: 'Insufficient balance' });
                }
                return res.status(500).json({ error: 'Error processing withdraw' });
            }
        }

        case 'transfer': {
            const { origin, destination } = eventData as { origin: string; destination: string };
            if (!origin || !destination) {
                return res
                    .status(400)
                    .json({
                        error: 'origin and destination are mandatory for transfer',
                    });
            }

            try {
                const result = AccountService.transfer(origin, destination, amount);
                if (!result) {
                    return res.status(404).send('0');
                }

                return res.status(201).json(result);
            } catch (error) {
                if (error instanceof Error && error.message === 'Insufficient balance') {
                    return res.status(400).json({ error: 'Insufficient balance' });
                }
                return res.status(500).json({ error: 'Error processing transfer' });
            }
        }

        default:
            return res.status(400).json({ error: 'Event type is invalid' });
    }
});

export default router;