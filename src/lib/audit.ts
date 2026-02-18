import { prisma } from "./prisma";

export async function auditLog({
    event, actorId, entity , entityId, metadata,
}:{event:string, actorId:string, entity:string, entityId:string, metadata?:any}) {
    await prisma.auditLog.create({
        data:{
            event,
            actorId,
            entity,
            entityId,
            metadata,
        }
    })
}