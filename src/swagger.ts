// eslint-disable-next-line @typescript-eslint/no-require-imports
const swaggerJsdoc = require('swagger-jsdoc');
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Banking API',
            version: '1.0.0',
            description: 'Banking API to manage accounts, deposits, withdrawals, and transfers.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };