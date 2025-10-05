"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextAreaAutosize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import z from "zod";
import { Spinner } from "@/components/ui/spinner"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { onInvoke } from "../actions";
import { useCreateMessages } from "@/modules/messages/hooks/message";
import { useStatus } from "@/modules/usage/hooks/usage";
import { Usage } from "@/modules/usage/components/usage";

// import { onInvoke } from "../actions";

const formSchema = z.object({
  content: z
    .string()
    .min(1, "Message description is required")
    .max(1000, "Description is too long"),
});



const MessageForm = ({projectId}) => {
  const [isFocused, setIsFocused] = useState(false);

  const {mutateAsync , isPending} = useCreateMessages(projectId)

  const {data:usage} = useStatus()

  const showUsage = !!usage;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
    mode:"onChange"
  });

 
  const onSubmit = async (values) => {
    try {
      const res = await mutateAsync(values.content)
   
      toast.success("Message sent successfully")
      form.reset()
      toast.success("Message Sent Successfully")
    } catch (error) {
       toast.error(error.message || "Failed to send message");
    }
  };


  

  return (
      <Form {...form}>
        {
          showUsage && (
            <Usage/>
          )
        }
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
            isFocused && "shadow-lg ring-2 ring-primary/20"
          )}
        >
         <FormField
         control={form.control}
         name="content"
         render={({field})=>(
                <TextAreaAutosize
                {...field}
                disabled={isPending}
                placeholder="Describe what you want to create..."
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                minRows={3}
                maxRows={8}
                className={cn(
                  "pt-4 resize-none border-none w-full outline-none bg-transparent",
                  isPending && "opacity-50"
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }
                }}
              />
         )}
         />   

         <div className="flex gap-x-2 items-end justify-between pt-2">
            <div className="text-[10px] text-muted-foreground font-mono">
                 <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span>&#8984;</span>Enter
              </kbd>
              &nbsp; to submit
            </div>
            <Button
            className={cn("size-8 rounded-full" , 
              isPending && "bg-muted-foreground border"
            )}
            disabled={isPending}
            type="submit"
            >
              {
                isPending ? (<Spinner/>) : (<ArrowUpIcon className="size-4"/>)
              }
                
            </Button>
         </div>
        </form>
      </Form>
   
  );
};

export default MessageForm;
