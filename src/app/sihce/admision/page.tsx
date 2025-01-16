import { auth } from '@/auth';
import { ModuloAdmision } from '@/components/ModuloAdmision/ModuloAdmision'
import React from 'react'

export default async function admisionPage() {
  const session = await auth()
  return (
    <div className="flex-1 bg-white  p-1 shadow print:p-1 print:shadow-none">

      <ModuloAdmision usuario={session}/>
    </div>
  );
}  
  