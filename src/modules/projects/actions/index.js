"use server";

import { inngest } from "@/inngest/client";
import db from "@/lib/db";
import { getCurrentUser } from "@/modules/auth/actions";
import { MessageRole , MessageType } from "@prisma/client";
import { generateSlug } from "random-word-slugs";


export const createProject = async (value)=>{
    const user = await getCurrentUser();

    if(!user) throw new Error("Unauthorized");

    const newProject = await db.project.create({
        data:{
            name:generateSlug(2 , {format:"kebab"}),
            userId:user.id,
            messages:{
                create:{
                    content:value,
                    role:MessageRole.USER,
                    type:MessageType.RESULT
                }
            }
        }
    })

    await inngest.send({
        name:"code-agent/run",
        data:{
            value:value,
            projectId:newProject.id
        }
    })

    return newProject;
}

export const getProjects = async()=>{
    const user = await getCurrentUser();

    if(!user) throw new Error("Unauthorized");

    const projects = await db.project.findMany({
        where:{
            userId:user.id
        },
        orderBy:{
            createdAt:"desc"
        }
    });

    return projects;
}

export const getProjectById = async (projectId) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const project = await db.project.findUnique({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) throw new Error("Project not found");

  return project;
};
