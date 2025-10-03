import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
   <div className="flex flex-col items-center justify-center h-screen">
    <Button>Test</Button>  
    <UserButton/>  
   </div>
  );
}
