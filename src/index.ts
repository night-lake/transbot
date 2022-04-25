import 'dotenv/config';
import path from 'path';
import pino from 'pino';
import { SlashasaurusClient } from 'slashasaurus';
import { db } from './db';

const logger = pino();

const client = new SlashasaurusClient(
    {
        intents: [],
        restRequestTimeout: 30 * 1000
    },
    {
        devServerId: '713675042143076352',
        logger,
        storePageState: async (messageId, pageId, stateString, messageData) => {
            await db.paginationState.upsert({
                where: {
                    messageId
                },
                create: {
                    messageId,
                    messageData,
                    pageId,
                    stateString
                },
                update: {
                    messageData,
                    pageId,
                    stateString
                }
            });
        },
        getPageState: async messageId => db.paginationState.findFirst({ where: { messageId } })
    }
);

client.once('ready', () => {
    client.logger.info(`Logged in: ${client.user?.tag}`);

    client.registerCommandsFrom(
        path.join(__dirname, '/commands'),
        process.env.NODE_ENV === 'development' ? 'dev' : 'global'
    );

    client.registerPagesFrom(path.join(__dirname, '/pages'));

    if (process.env.NODE_ENV === 'development') {
        client.application.commands.set([]);
    }
});

process.on('unhandledRejection', (err: Error) => {
    logger.error({ type: err.constructor.name, message: err.message, stack: err.stack.split('\n') });
});

client.login();
