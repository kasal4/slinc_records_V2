import { prisma } from "./prisma";

export async function audit(input: {
  actorUserId?: string;
  action: string;
  entity: string;
  entityId: string;
}) {
  await prisma.auditLog.create({
    data: {
      actorUserId: input.actorUserId,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
    },
  });
}
