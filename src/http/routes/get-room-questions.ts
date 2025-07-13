import { desc, eq } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';

export const getRoomsQuestionsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/rooms/:roomId/questions',
    { schema: { params: z.object({ roomId: z.string() }) } },
    async ({ params }, reply) => {
      const { roomId } = params;

      const questions = await db
        .select({
          id: schema.questions.id,
          question: schema.questions.question,
          answer: schema.questions.answer,
          createdAt: schema.questions.createdAt,
        })
        .from(schema.questions)
        .where(eq(schema.questions.roomId, roomId))
        .orderBy(desc(schema.questions.createdAt));

      return reply.status(200).send(questions);
    }
  );
};
