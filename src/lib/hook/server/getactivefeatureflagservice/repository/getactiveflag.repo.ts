// repositories/flag.repo.ts
import { prisma } from "@/lib/prisma";
// lib/errors.ts

 export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// repositories/flag.repo.ts


export async function getactiveflagrepodata(flagId: string) {
  try {
    const data = await prisma.featureFlag.findUnique({
      where: { id: flagId },

      include: {
        createdBy:{
          select:{
            name:true,
            email:true
          }
        },
        environments: {
          select: {
            enabled: true,
            rollout: true,
            environment: {
              select: {
                type: true
              }
            }
          }
        },

        featureFlagVariation: {
          select: {
            id: true,
            name: true,
            value: true,
            weight: true
          }
        },

        targetingRule: {
          orderBy: {
            priority: "asc"
          },
          select: {
            id: true,
            attribute: true,
            operator: true,
            value: true,
            priority: true,
            variationId: true   // ✅ FIXED
          }
        },

        versions: {
          orderBy: {
            version: "desc"
          },
          take: 1,
          select: {
            version: true
          }
        },
        
      }
    
    });

    if (!data) {
      throw new AppError("Flag not found", 404);
    }

    return {
      ...data,
      version: data.versions[0]?.version ?? 1
    };

  } catch (error) {
    console.error("DB Error:", error);

    if (error instanceof AppError) throw error;

    throw new AppError("Database error while fetching flag", 500);
  }
}