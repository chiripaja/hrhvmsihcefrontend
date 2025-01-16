import React from 'react'

export const LoadingRutas = () => {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
            <div className="w-16 h-16 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
        </div>
    )
}
