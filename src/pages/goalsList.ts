import { db } from '../db';
import { ButtonInteraction } from 'discord.js';
import { DeserializeStateFn, Page, PageInteractableButton, RenderedPage } from 'slashasaurus';
import { MessageButtonStyles } from 'discord.js/typings/enums';

interface GoalsListData {
    goalId: number;
    userId: string;
}

export default class PaginatedTransitionGoalsList extends Page<GoalsListData, GoalsListData> {
    static pageId = 'transitionGoalsPaginator';

    constructor(props: GoalsListData) {
        super(props);
        this.state = props;
    }

    async getGoalId(sort: 'asc' | 'desc') {
        this.client.logger.debug(`hi ${sort}`);
        return db.transitionGoal.findFirst({
            where: {
                authorId: this.state.userId
            },
            orderBy: {
                goalId: sort
            },
            select: {
                goalId: true
            }
        });
    }

    async handleUserNotEqual(interaction: ButtonInteraction) {
        if (interaction.user.id !== this.state.userId) {
            return interaction.reply({
                embeds: [
                    {
                        title: "You can't use this",
                        color: 0xffaebd
                    }
                ],
                ephemeral: true
            });
        }
    }
    async flipNext(interaction: ButtonInteraction) {
        this.handleUserNotEqual(interaction);

        const { goalId } = await db.transitionGoal.findFirst({
            where: {
                authorId: interaction.user.id,
                goalId: {
                    gt: this.state.goalId
                }
            },
            orderBy: {
                goalId: 'asc'
            },
            select: {
                goalId: true
            }
        });

        this.setState({ goalId });
    }

    async flipBack(interaction: ButtonInteraction) {
        this.handleUserNotEqual(interaction);

        const { goalId } = await db.transitionGoal.findFirst({
            where: {
                authorId: interaction.user.id,
                goalId: {
                    lt: this.state.goalId
                }
            },
            orderBy: {
                goalId: 'desc'
            },
            select: {
                goalId: true
            }
        });

        this.setState({ goalId });
    }

    async render(): Promise<RenderedPage> {
        if (!this.getGoalId('asc')) {
            return;
        }

        const { goalId: firstGoalId } = await this.getGoalId('asc');
        const { goalId: lastGoalId } = await this.getGoalId('desc');

        const goal = await db.transitionGoal.findFirst({
            where: {
                goalId: {
                    equals: this.state.goalId
                }
            }
        });

        const components = [
            new PageInteractableButton({
                handler: interaction => this.flipBack(interaction),
                emoji: '⬅️',
                style: MessageButtonStyles.PRIMARY,
                disabled: this.state.goalId === firstGoalId
            }),
            new PageInteractableButton({
                handler: interaction => this.flipNext(interaction),
                emoji: '➡️',
                style: MessageButtonStyles.PRIMARY,
                disabled: this.state.goalId === lastGoalId
            })
        ];

        return {
            content: null,
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
            ],
            components: firstGoalId === lastGoalId ? [] : [components]
        };
    }

    serializeState() {
        return JSON.stringify(this.state);
    }
}

export const deserializeState: DeserializeStateFn<GoalsListData, GoalsListData> = serializedState => {
    const data = JSON.parse(serializedState);
    return {
        props: data,
        state: data
    };
};
