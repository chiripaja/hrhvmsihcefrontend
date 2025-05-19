import React, { useState } from 'react'
import { ModalProps } from '../ui/ModalProps/ModalProps'
import { useForm } from 'react-hook-form';
import { Tooltip } from '../ui/Tooltip';
import { FiFile } from 'react-icons/fi';

export const FormReprogramacion = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { handleSubmit, control, register, formState: { errors }, reset } = useForm();
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <ModalProps isOpen={isModalOpen} onClose={closeModal} width="40vw" height="55vh">
                viendo
            </ModalProps>

            <Tooltip text="Hoja Filiación">
                <a
                    onClick={openModal}
                    target="_blank"
                    className="ml-3 py-2 px-3 inline-flex items-center gap-x-1 text-xs font-medium rounded border border-transparent bg-blue-400 text-gray-700 hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                    <FiFile size={18} className="text-white" />
                </a>
            </Tooltip>
        </>



    )
}
