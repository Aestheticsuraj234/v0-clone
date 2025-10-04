"use server";

import { MessageRole, MessageType } from "@prisma/client";
import db from "@/lib/db";
import { inngest } from "@/inngest/client";
import { getCurrentUser } from "@/modules/auth/actions";

export const createMessages = async (value, projectId) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  const project = await db.project.findUnique({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) throw new Error("Project not found");

  const newMessage = await db.message.create({
    data: {
      projectId: projectId,
      content: value,
      role: MessageRole.USER,
      type: MessageType.RESULT,
    },
  });

  await inngest.send({
    name: "code-agent/run",
    data: {
      value: value,
      projectId: projectId,
    },
  });

  return newMessage;
};

export const getMessages = async (projectId) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");

  const project = await db.project.findUnique({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) throw new Error("Project not found or unauthorized");

  const messages = await db.message.findMany({
    where:{
        projectId
    },
    orderBy:{
        updatedAt:"asc"
    },
    include:{
        fragments:true
    }
  })

  return messages;
};
