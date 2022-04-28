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
            if (focusedName === 'title' && typeof focusedValue === 'string') {
                const goals = await db.transitionGoal.findMany({
                    select: { title: true },
                    where: { authorId: interaction.user.id, title: { startsWith: focusedValue } },
                    take: 25
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
