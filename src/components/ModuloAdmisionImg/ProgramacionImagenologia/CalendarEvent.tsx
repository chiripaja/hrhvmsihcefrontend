import React from 'react'

export const CalendarEvent = (props: any) => {
   
    return (
        <div>
            <p>{props?.title}</p>
            <p>{props.event?.servicio}</p>
        </div>
    )
}
