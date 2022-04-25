import PaginatedTransitionGoalsList from '../../pages/goalsList';
import { SlashCommand } from 'slashasaurus';
import { db } from '../../db';

export default new SlashCommand(
    {
        name: 'list',
        description: 'Shows you all your transition goals.',
        options: []
    },
    {
        run: async interaction => {
            const { goalId } = await db.transitionGoal.findFirst({
                where: {
                    authorId: interaction.user.id
                },
                orderBy: {
                    goalId: 'asc'
                },
                select: {
                    goalId: true
                }
            });

            const pag = new PaginatedTransitionGoalsList({ goalId, userId: interaction.user.id });
            pag.sendAsReply(interaction);
        }
    }
);
