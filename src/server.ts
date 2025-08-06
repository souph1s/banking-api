import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import balanceController from './controllers/balanceController';
import eventController from './controllers/eventController';
import resetController from './controllers/resetController';
import { specs, swaggerUi } from './swagger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', balanceController);
app.use('/', eventController);
app.use('/', resetController);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;