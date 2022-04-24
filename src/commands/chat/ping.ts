import { SlashCommand } from 'slashasaurus';
import { db } from '../../db';

export default new SlashCommand(
    {
        name: 'ping',
        description: 'Pings the bot to make sure everything is working',
        options: []
    },
    {
        run: interaction => {
            interaction.reply({
                embeds: [
                    {
                        description: `:ping_pong: Pong! ${interaction.client.ws.ping} ms.`,
                        color: 0xffaebd
                    }
                ]
            });
        }
    }
);
