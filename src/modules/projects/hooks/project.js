import {useQuery , useMutation , useQueryClient} from "@tanstack/react-query"
import { createProject , getProjectById , getProjects } from "../actions"

export const useGetProjects = ()=>{
    return useQuery({
        queryKey:["projects"],
        queryFn:()=>getProjects()
    })
}

export const useCreateProject = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:(value)=>createProject(value),
        onSuccess:()=>queryClient.invalidateQueries({ queryKey: ["projects" , "status"] })
    })
}


export const useGetProjectById = (projectId)=>{
    return useQuery({
        queryKey:["project" , projectId],
        queryFn:()=>getProjectById(projectId)
    })
}