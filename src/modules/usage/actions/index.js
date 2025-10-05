"use server";
import { auth } from "@clerk/nextjs/server";
import { DURATION, FREE_POINTS, PRO_POINTS, getUsageStatus } from "@/lib/usage";

export const status = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const {has} = await auth();

    const hasProAccess = has({plan:"pro"});

    const maxPoints = hasProAccess ? PRO_POINTS : FREE_POINTS

    const result = await getUsageStatus();

        if (!result) {
      return {
        remainingPoints: maxPoints,
        msBeforeNext: DURATION * 1000,
        consumedPoints: 0,
        isFirstRequest: true,
        maxPoints
      };      
    }
      const remainingPoints = result.remainingPoints ?? ( maxPoints - (result.consumedPoints || 0))

       return {
      remainingPoints,
      msBeforeNext: result.msBeforeNext || DURATION * 1000,
      consumedPoints: result.consumedPoints || 0,
      isFirstRequest: false,
      maxPoints
    };


  } catch (error) {
     console.error("Error in status action:", error);
    throw error;
  }
};
