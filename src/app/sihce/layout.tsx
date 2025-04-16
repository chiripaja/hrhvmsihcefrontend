


import { TopMenu2 } from "@/components/ui/TopMenu2";



export default  function SihceLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <>
    <div className="h-screen ">
    <TopMenu2 />
        <div className="flex-1 p-4 flex justify-center items-center ">
    
          <div className=" w-full">
     
            {children}
          </div>
        </div>
    </div>
           
    
    </>
  );
}