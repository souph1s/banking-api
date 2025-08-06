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
 *           description: ID da conta
 *         balance:
 *           type: number
 *           description: Saldo da conta
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
 *           description: ID da conta de destino
 *         amount:
 *           type: number
 *           description: Valor a ser depositado
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
 *           description: ID da conta de origem
 *         amount:
 *           type: number
 *           description: Valor a ser sacado
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
 *           description: ID da conta de origem
 *         destination:
 *           type: string
 *           description: ID da conta de destino
 *         amount:
 *           type: number
 *           description: Valor a ser transferido
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
 *     description: Processa eventos bancários (depósito, saque, transferência)
 *     tags: [Eventos]
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
 *         description: Evento processado com sucesso
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
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Conta não encontrada ou saldo insuficiente
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "0"
 *       500:
 *         description: Erro interno do servidor
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
        return res.status(400).json({ error: 'type e amount são obrigatórios' });
    }

    switch (type) {
        case 'deposit': {
            const { destination } = eventData as { destination: string };
            if (!destination) {
                return res
                    .status(400)
                    .json({ error: 'destination é obrigatório para deposit' });
            }

            try {
                const account = AccountService.deposit(destination, amount);
                return res.status(201).json({
                    destination: account,
                });
            } catch {
                return res.status(500).json({ error: 'Erro ao processar depósito' });
            }
        }

        case 'withdraw': {
            const { origin } = eventData as { origin: string };
            if (!origin) {
                return res
                    .status(400)
                    .json({ error: 'origin é obrigatório para withdraw' });
            }

            const originAccount = AccountService.withdraw(origin, amount);
            if (!originAccount) {
                return res.status(404).send('0');
            }

            return res.status(201).json({
                origin: originAccount,
            });
        }

        case 'transfer': {
            const { origin, destination } = eventData as { origin: string; destination: string };
            if (!origin || !destination) {
                return res
                    .status(400)
                    .json({
                        error: 'origin e destination são obrigatórios para transfer',
                    });
            }

            const result = AccountService.transfer(origin, destination, amount);
            if (!result) {
                return res.status(404).send('0');
            }

            return res.status(201).json(result);
        }

        default:
            return res.status(400).json({ error: 'Tipo de evento inválido' });
    }
});

export default router;