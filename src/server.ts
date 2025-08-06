import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import balanceRoutes from './routes/balance';
import eventRoutes from './routes/event';
import resetRoutes from './routes/reset';
import { specs, swaggerUi } from './swagger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', balanceRoutes);
app.use('/', eventRoutes);
app.use('/', resetRoutes);

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