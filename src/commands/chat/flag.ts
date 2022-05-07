import { SlashCommand } from 'slashasaurus';
import { db } from '../../db';

export default new SlashCommand(
    {
        name: 'flag',
        description: 'a trans flag',
        options: []
    },
    {
        run: interaction => {
            interaction.reply({
                embeds: [
                    {
                        thumbnail: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.themarysue.com%2Fwp-content%2Fuploads%2F2017%2F02%2FTrans-Flag-e1518216276411.jpg&f=1&nofb=1',
                        color: 0xffaebd
                    }
                ]
            });
        }
    }
