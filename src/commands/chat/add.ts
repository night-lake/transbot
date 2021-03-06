import { SlashCommand } from 'slashasaurus';
import { db } from '../../db';
import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';

export default new SlashCommand(
    {
        name: 'add',
        description: 'Adds a transition goal.',
        options: [
            {
                name: 'image_url',
                description: 'The url to the image, prefferably a Discord CDN image.',
                type: ApplicationCommandOptionTypes.STRING,
                required: true
            },
            {
                name: 'title',
                description: 'The name of the transition goal',
                type: ApplicationCommandOptionTypes.STRING,
                required: true
            }
        ] as const
    },
    {
        run: async (interaction, _client, options) => {
            if (
                !options.image_url.startsWith('https:') &&
                !options.image_url.includes('png') &&
                !options.image_url.includes('jpg')
            ) {
                return interaction.reply({
                    embeds: [
                        {
                            title: "That's not an image",
                            color: 0xffaebd
                        }
                    ],
                    ephemeral: true
                });
            }

            const existingGoal = await db.transitionGoal.findFirst({
                where: { title: options.title, imageURL: options.image_url, authorId: interaction.user.id }
            });

            if (existingGoal) {
                return interaction.reply({
                    embeds: [
                        {
                            title: 'You already have that goal',
                            color: 0xffaebd
                        }
                    ],
                    ephemeral: true
                });
            }

            const newGoal = await db.transitionGoal.create({
                data: { authorId: interaction.user.id, imageURL: options.image_url, title: options.title }
            });

            interaction.reply({
                embeds: [
                    {
                        title: options.title,
                        color: 0xffaebd,
                        image: {
                            url: options.image_url
                        },
                        footer: {
                            text: `Goal #${newGoal.goalId}`
                        },
                        timestamp: newGoal.createdAt
                    }
                ]
            });
        }
    }
);
