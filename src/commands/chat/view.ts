import { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';
import { SlashCommand } from 'slashasaurus';
import { db } from '../../db';

export default new SlashCommand(
    {
        name: 'view',
        description: 'Views a transition goal.',
        options: [
            {
                name: 'title',
                description: 'The name of the transition goal',
                type: ApplicationCommandOptionTypes.STRING,
                autocomplete: true
            }
        ] as const
    },
    {
        run: async (interaction, _client, options) => {
            // if (
            //     !options.image_url.startsWith('https:') &&
            //     !options.image_url.includes('png') &&
            //     !options.image_url.includes('jpg')
            // ) {
            //     return interaction.reply({
            //         embeds: [
            //             {
            //                 title: "That's not an image",
            //                 color: 0xffaebd
            //             }
            //         ],
            //         ephemeral: true
            //     });
            // }

            const goal = await db.transitionGoal.findFirst({
                where: { title: options.title, authorId: interaction.user.id }
            });

            if (!goal) {
                return interaction.reply({
                    embeds: [
                        {
                            title: "You don't have that goal",
                            color: 0xffaebd
                        }
                    ],
                    ephemeral: true
                });
            }

            // const newGoal = await db.transitionGoal.create({
            //     data: { authorid: interaction.user.id, imageURL: options.image_url, title: options.title }
            // });

            interaction.reply({
                embeds: [
                    {
                        title: goal.title,
                        color: 0xffaebd,
                        image: {
                            url: goal.imageURL
                        },
                        footer: {
                            text: `Goal #${goal.goalId}`
                        },
                        timestamp: goal.createdAt
                    }
                ]
            });
        },
        autocomplete: async (interaction, focusedName, focusedValue) => {
            if (focusedName === 'title') {
                const goals = await db.transitionGoal.findMany({
                    select: { title: true },
                    // @ts-expect-error i hate number autocompletes
                    where: { authorid: interaction.user.id, title: { contains: focusedValue } },
                    limit: 25
                });

                const preparedGoals = goals.map(goal => ({
                    name: goal.title,
                    value: goal.title
                }));

                interaction.respond(preparedGoals);
            }
        }
    }
);
