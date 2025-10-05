import {useQuery} from "@tanstack/react-query";
import {status} from "../actions"

export const useStatus = ()=>{
    return useQuery({
        queryKey:["status"],
        queryFn:()=>status()
    })
}