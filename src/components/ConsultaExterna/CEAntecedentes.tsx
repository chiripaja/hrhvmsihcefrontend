import React from 'react'
import { TableRadiusBorder } from '../ui/TableRadiusBorder';
import { SelectOptions } from '../ui/SelectOptions';

export const CEAntecedentes = () => {
  return (
    <div className='grid grid-cols-2'>

        <div>Quirurgicos</div>
        <SelectOptions/>

        <div className='col-span-2 '>
            <TableRadiusBorder/>
        </div>



    </div>
  )
}
