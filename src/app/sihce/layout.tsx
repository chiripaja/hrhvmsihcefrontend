


import { TopMenu2 } from "@/components/ui/TopMenu2";



export default  function SihceLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <>
        <TopMenu2  />
        <div className="flex-1 p-4 flex justify-center items-center ">
          <div className="h-full w-full">
            {children}
          </div>
        </div>
    
    </>
  );
}