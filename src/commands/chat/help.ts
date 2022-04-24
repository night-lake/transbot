import { SlashCommand } from 'slashasaurus';

export default new SlashCommand(
    {
        name: 'help',
        description: 'How the fuck do I use this thing, Sadie',
        options: []
    },
    {
        run: interaction => {
            interaction.reply({
                embeds: [
                    {
                        title: `Because of Discord.js 13.6.0, you don't! :tada:`,
                        description: '*remembers message commands exist*',
                        color: 0xffaebd
                    }
                ]
            });
        }
    }
);
