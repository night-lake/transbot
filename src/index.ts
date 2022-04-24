import 'dotenv/config';
import path from 'path';
import pino from 'pino';
import { SlashasaurusClient } from 'slashasaurus';

const client = new SlashasaurusClient(
    {
        intents: [],
        restRequestTimeout: 30 * 1000
    },
    {
        devServerId: '713675042143076352',
        logger: pino()
    }
);

client.once('ready', () => {
    client.logger.info(`Logged in: ${client.user?.tag}`);

    client.registerCommandsFrom(
        path.join(__dirname, '/commands'),
        process.env.NODE_ENV === 'development' ? 'dev' : 'global'
    );

    if (process.env.NODE_ENV === 'development') {
        client.application.commands.set([]);
    }
});

client.login();
