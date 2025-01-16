'use client'
import React, { useState, ChangeEvent, useEffect, useId, useCallback, useRef } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import InputWithHeader from '../ui/InputWithHeader';
import { FaPlus } from 'react-icons/fa';
import { BiSearchAlt } from 'react-icons/bi';
import axios from "axios";
import Swal from "sweetalert2";
import { FaUserAlt } from "react-icons/fa";
import { format, parse } from 'date-fns';
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });

type Form = {
    tipo_doc: string,
    num_doc: string,
    apellido_paterno: string,
    apellido_materno: string,
    primer_nombre: string,
    segundo_nombre: string,
    tercer_nombre: string,
    fch_nac: string,
    email: string,
    nom_pad: string,
    prim_nom_tutor: string,
    seg_nom_tutor: string,
    ape_pat_tutor: string,
    ape_mat_tutor: string,
    pais: string,
    sexo: string,
    etnia: string,
    ubigeo: string,
    civil: string,
    procedencia: string,
    ocupacion: string,
    instruccion: string,
    idioma: string,
    ubigeo_nac: string,
    ubigeo_proc: string,
    tipo_doc_tutor: string,
    celular: string,
    num_doc_tuto: string,
    direccion: string,
    num_hijo: string,
    observacion: string,
    pais_nac: string,
    pais_proc: string,
}

type BusquedaDNI = {
    tipo_doc: string,
    num_doc: string,
}


interface SelectUbigeo {
    value: string;
    label: string;
}



export const FormPacientev2 = ({ usuario }: any) => {

    const UbigeoxCodigo = async (codigo: string) => {
        try {
            const { data } = await axios.get(`${process.env.apiurl}/Publico/UbigeoBuscarReniec/${codigo}`);
            if (Array.isArray(data) && data.length > 0) {
                return data.map((est: any) => ({
                    value: est.idDistrito,
                    label: est.descripcion
                }));
            } else {
                console.log("No hay datos en la respuesta");
            }
            return [];
        } catch (error) {
            console.error("Error en la API:", error);
            return [];
        }
    };

    const UbigeoxNombre = async (nombre: string): Promise<SelectUbigeo[]> => {

        try {
            const response = await axios.get(`${process.env.apiurl}/Publico/UbigeoBuscarDistritoNombre/${nombre}`);
            return response.data.map((est: any) => ({
                value: est.idDistrito,
                label: est.descripcion
            }));
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const UbigeoxCodigoDistrito = async (codigo: string): Promise<SelectUbigeo[]> => {
        try {
            if (codigo != "") {
                const response = await axios.get(`${process.env.apiurl}/Publico/UbigeoBuscarDistrito/${codigo}`);
                return response.data.map((est: any) => ({
                    value: est.idDistrito,
                    label: est.descripcion
                }));
            } else {
                return [];
            }
        } catch (error) {
            console.error(error);
            return [];
        }
    };
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const base64Image = "data:image/png;base64,";
    const selectId = useId();
    const [maxLength, setMaxLength] = useState(8);
    const [maxLengthTutor, setMaxLengthTutor] = useState(8);
    const { control, register, handleSubmit, getValues, setValue, watch, reset, formState: { errors, isValid }, } = useForm<Form>({ mode: 'onChange', })
    const { formState, control: control2, register: register2, handleSubmit: handleSubmit2, setValue: setValue2, watch: watch2, reset: reset2 } = useForm<BusquedaDNI>({ mode: 'onChange', })
    const [tipoDoc, setTipoDoc] = useState<any>("");
    const [tipoDocSelect, setTipoDocSelect] = useState<any>("");
    const [tipoDocTuto, setTipoDocTuto] = useState<any>("");
    const [tipoDocTutoSelect, setTipoDocTutoSelect] = useState<any>("");
    const [sexo, setSexo] = useState<any>("");
    const [etnia, setEtnia] = useState<any>("");
    const [idioma, setIdioma] = useState<any>("");
    const [civil, setCivil] = useState<any>("");
    const [instruccion, setInstruccion] = useState<any>("");
    const [procedencia, setProcedencia] = useState<any>("");
    const [ocupacion, setOcupacion] = useState<any>("");
    const [pais, setPais] = useState<any>("");
    const [paisNac, setPaisNac] = useState<any>("");
    const [paisProc, setPaisProc] = useState<any>("");
    const [img, setImg] = useState<any>("");
    const [distrito, setDistrito] = useState<any>("");

    const [ubigeoDomicilio, setUbigeoDomicilio] = useState<any>([]);
    const [optionsComboDomicilio, setOptionsComboDomicilio] = useState<any[]>([]);
    const [inputValueUbigeo, setInputValueUbigeo] = useState<string>('');


    const [ubigeoProcedencia, setUbigeoProcedencia] = useState<any>([]);
    const [optionsComboProcedencia, setOptionsComboProcedencia] = useState<any[]>([]);
    const [inputValueProcedencia, setInputValueProcedencia] = useState<string>('');


    const [ubigeoNacimiento, setUbigeoNacimiento] = useState<any>([]);
    const [optionsComboNacimiento, setOptionsComboNacimiento] = useState<any[]>([]);
    const [inputValueNacimiento, setInputValueNacimiento] = useState<string>('');


    const [origenDatos, setOrigenDatos] = useState<any>("");
    const [loading, setLoading] = useState(false);

    const tipoDocChange = (option: any) => {
        if (option.target.value == 1) {
            setMaxLength(8);
        } else {
            setMaxLength(10);
        }
    };
    const tipoDocTutoChange = (option: any) => {
        setTipoDocTutoSelect(option.target.value)
        if (option.target.value == 1) {
            setMaxLengthTutor(8);
        } else {
            setMaxLengthTutor(10);
        }
    }

    useEffect(() => {
        tiposDocumento()
        select('sexo')
        select('etnia')
        select('idioma')
        select('civil')
        select('instruccion')
        select('procedencia')
        select('ocupacion')
        select('pais')
    }, [])

    //Tipos Documento    
    const tiposDocumento = async () => {
        try {
            const { data } = await axios.get(`${process.env.apiurl}/Publico/TiposDocumentos`)
      
            setTipoDoc(data)
            setTipoDocTuto(data)
            setValue('tipo_doc', '1')
            setValue('tipo_doc_tutor', '1')
            setTipoDocTutoSelect(1)
        } catch (error) {
            console.log(error)
        }
    }

    // Select    
    const select = async (opt: any) => {
        try {
            const { data } = await axios.get(`${process.env.apiurl}/Publico/Maestros/${opt}`)
            const formattedOptions = data.map((item: any) => ({
                value: item.id,
                label: item.nombre
            }));
            if (opt == 'civil') {
                setCivil(formattedOptions);
            }
            if (opt == 'instruccion') {
                setInstruccion(formattedOptions);
            }
            if (opt == 'procedencia') {
                setProcedencia(formattedOptions);
            }
            if (opt == 'ocupacion') {
                setOcupacion(formattedOptions);
            }
            if (opt == 'sexo') {
                setSexo(formattedOptions);
                /*if (formattedOptions.length > 0) {
                    setValue('sexo', formattedOptions[0])
                }*/
            }
            if (opt == 'etnia') {
                setEtnia(formattedOptions);
            }
            if (opt == 'idioma') {
                setIdioma(formattedOptions);
            }
            if (opt == 'pais') {
                setPais(formattedOptions);
                if (formattedOptions.length > 0) {
                    setValue('pais', formattedOptions[74])
                }
                setPaisNac(formattedOptions);
                if (formattedOptions.length > 0) {
                    setValue('pais_nac', formattedOptions[74])
                }
                setPaisProc(formattedOptions);
                if (formattedOptions.length > 0) {
                    setValue('pais_proc', formattedOptions[74])
                }
            }
        } catch {
            setSexo('')
            setEtnia('')
            setIdioma('')
            setCivil('')
            setInstruccion('')
            setProcedencia('')
            setPais('')
        }
    }

    // PACIENTE
    const buscar_px = async () => {

        const dni = watch('num_doc');
        console.log(dni);
        reset({
            num_doc: dni,
        });
        setLoading(true);
        setOptionsComboDomicilio([]);
        setOptionsComboProcedencia([]);
        setOptionsComboNacimiento([]);
        setUbigeoDomicilio([]);
        setUbigeoNacimiento([]);
        setUbigeoProcedencia([]);
        setOrigenDatos('')
        setUbigeoProcedencia('')
        setUbigeoNacimiento('')
        setImg('')
        const numerodocumentoactual = await watch('num_doc')
        const tipo_doc = await watch('tipo_doc')
        let apellidoPaterno: any = ''
        let apellidoMaterno: any = ''
        let primer_nombre: any = ''
        let segundo_nombre: any = ''
        let tercer_nombre: any = ''
        let direccion: any = ''
        let fch_nac: any = ''
        let celular: any = ''
        let email: any = ''
        let num_doc_tuto: any = ''
        let nom_pad: any = ''
        let prim_nom_tutor: any = ''
        let seg_nom_tutor: any = ''
        let ape_mat_tutor: any = ''
        let ape_pat_tutor: any = ''
        let num_hijo: any = ''
        let observacion: any = ''
        let etnia_p: any = ''
        let idioma_p: any = ''
        let civil_p: any = ''
        let grado_int: any = ''
        let procedencia_p: any = ''
        let ocupacion_p: any = ''
        let sexo_p: any = ''
        let pais_procedencia: any = ''
        let pais_domicilio: any = ''
        let pais_nacimiento: any = ''
        let ubigeo_domicilio_codigo: any = ''
        let ubigeo_procedencia_codigo: any = ''
        let ubigeo_nacimiento_codigo: any = ''
        let foto: any = ''
        let fecha_foto: any = ''
        let tiempo_pasado: any = ''
        if (numerodocumentoactual != '' && tipo_doc != '') {
            //  BASE DE DATOS
            try {

                const dataEnvio = {
                    ip: "string",
                    usuario: usuario.user.id,
                    endPoint: "string",
                    fechaConsulta: "string",
                    tipoDocumento: "string",
                    numeroDocumento: "string"
                }

                const { data } = await axios.post(`${process.env.apiurl}/Publico/BuscarSis/${tipo_doc}/${numerodocumentoactual}?dni=${numerodocumentoactual}&tipo=${tipo_doc}`, dataEnvio)

                if (data !== null && tipo_doc !== "1" && tipo_doc !== "2") {
                    apellidoPaterno = data.apellidoPaterno
                    apellidoMaterno = data.apellidoMaterno
                    primer_nombre = data.primerNombre
                    segundo_nombre = data.segundoNombre
                    tercer_nombre = data.tercerNombre
                    fch_nac = format(data.fechaNacimiento, 'yyyy-dd-MM')
                    celular = data.telefono
                    email = data.email
                    num_doc_tuto = data.madreDocumento
                    nom_pad = data.nombreMadre
                    prim_nom_tutor = data.madrePrimerNombre
                    seg_nom_tutor = data.madreSegundoNombre
                    ape_mat_tutor = data.madreApellidoMaterno
                    ape_pat_tutor = data.madreApellidoPaterno
                    num_hijo = data.nroOrdenHijo
                    observacion = data.observacion
                    direccion = data.direccionDomicilio
                    etnia_p = data.idEtnia
                    idioma_p = data.idIdioma
                    civil_p = data.idEstadoCivil
                    grado_int = data.idGradoInstruccion
                    procedencia_p = data.idProcedencia
                    ocupacion_p = data.idTipoOcupacion
                    sexo_p = data.idTipoSexo
                    pais_domicilio = data.idPaisDomicilio
                    pais_procedencia = data.idPaisProcedencia
                    pais_nacimiento = data.idPaisNacimiento
                    ubigeo_domicilio_codigo = data.idDistritoDomicilio
                    setUbigeoDomicilio(ubigeo_domicilio_codigo)
                    ubigeo_procedencia_codigo = data.idDistritoProcedencia
                    setUbigeoProcedencia(ubigeo_procedencia_codigo)
                    ubigeo_nacimiento_codigo = data.idDistritoNacimiento
                    setUbigeoNacimiento(ubigeo_nacimiento_codigo)
                    setValue('tipo_doc_tutor', data.madreTipoDocumento)
                    setOrigenDatos(1)
                }
                else if (data !== null && data.foto?.mes < 6 && data.foto.mes.trim() !== '') {
                    apellidoPaterno = data.apellidoPaterno
                    apellidoMaterno = data.apellidoMaterno
                    primer_nombre = data.primerNombre
                    segundo_nombre = data.segundoNombre
                    tercer_nombre = data.tercerNombre
                    fch_nac = format(data.fechaNacimiento, 'yyyy-dd-MM')
                    celular = data.telefono
                    email = data.email
                    num_doc_tuto = data.madreDocumento
                    nom_pad = data.nombreMadre
                    prim_nom_tutor = data.madrePrimerNombre
                    seg_nom_tutor = data.madreSegundoNombre
                    ape_mat_tutor = data.madreApellidoMaterno
                    ape_pat_tutor = data.madreApellidoPaterno
                    num_hijo = data.nroOrdenHijo
                    observacion = data.observacion
                    direccion = data.direccionDomicilio
                    etnia_p = data.idEtnia
                    idioma_p = data.idIdioma
                    civil_p = data.idEstadoCivil
                    grado_int = data.idGradoInstruccion
                    procedencia_p = data.idProcedencia
                    ocupacion_p = data.idTipoOcupacion
                    sexo_p = data.idTipoSexo
                    pais_domicilio = data.idPaisDomicilio
                    pais_procedencia = data.idPaisProcedencia
                    pais_nacimiento = data.idPaisNacimiento
                    ubigeo_domicilio_codigo = data.idDistritoDomicilio
                    setUbigeoDomicilio(ubigeo_domicilio_codigo)
                    ubigeo_procedencia_codigo = data.idDistritoProcedencia
                    setUbigeoProcedencia(ubigeo_procedencia_codigo)
                    ubigeo_nacimiento_codigo = data.idDistritoNacimiento
                    setUbigeoNacimiento(ubigeo_nacimiento_codigo)
                    setValue('tipo_doc_tutor', data.madreTipoDocumento)
                    if (data.foto.foto != '') {
                        foto = data.foto.foto
                        setImg(foto)
                    } else {
                        foto = ''
                        setImg('')
                    }
                    fecha_foto = data.foto.fecha
                    tiempo_pasado = data.foto.mes
                    setOrigenDatos(1)
                } else {
                    try {

                        // const datos_reniec = await axios.get(`${process.env.apiurl}/Publico/BuscarReniec/${numerodocumentoactual}`)
                        const dataEnvio = {
                            ip: "string",
                            usuario: usuario.user.id,
                            endPoint: "string",
                            fechaConsulta: "string",
                            tipoDocumento: "string",
                            numeroDocumento: "string"
                        }
                        const datos_reniec = await axios.post(`${process.env.apiurl}/Publico/BuscarReniec/${numerodocumentoactual}`, dataEnvio)
                        if (datos_reniec) {
                            apellidoPaterno = datos_reniec.data.apePaterno
                            apellidoMaterno = datos_reniec.data.apeMaterno
                            const nombre = (datos_reniec.data.nombres).split(' ')
                            const primer_nombre_r = nombre[0]
                            const segundo_nombre_r = nombre[1]
                            const tercer_nombre_r = nombre[2]
                            primer_nombre = primer_nombre_r
                            segundo_nombre = segundo_nombre_r
                            tercer_nombre = tercer_nombre_r
                            const fechaDate = parse(datos_reniec.data.fechaNacimiento, 'dd/MM/yyyy', new Date());
                            const fechaFormateada = format(fechaDate, 'yyyy-MM-dd');
                            fch_nac = fechaFormateada
                            direccion = datos_reniec.data.direccion
                            setImg(datos_reniec.data.foto)
                            ubigeo_domicilio_codigo = datos_reniec.data.ubigeoResidencia
                            setUbigeoDomicilio(ubigeo_domicilio_codigo)
                            ubigeo_nacimiento_codigo = datos_reniec.data.ubigeoNacimiento

                            setUbigeoNacimiento(ubigeo_nacimiento_codigo)
                            ubigeo_procedencia_codigo = null
                            setUbigeoProcedencia([]);
                            setOptionsComboProcedencia([]);
                            if (datos_reniec?.data?.sexo === "M") {
                                const result = sexo.filter((option: any) => option.label === "Masculino");
                                if (result.length > 0) {
                                    setValue('sexo', result[0])
                                }
                            } else if (datos_reniec?.data?.sexo === "F") {
                                const result = sexo.filter((option: any) => option.label === "Femenino");
                                if (result.length > 0) {
                                    setValue('sexo', result[0])
                                }
                            }
                            Swal.fire({
                                title: 'Aviso',
                                text: 'Paciente Nuevo o Actualizando datos!',
                                icon: 'warning',
                                confirmButtonText: 'Aceptar'
                            });
                            setOrigenDatos(2)
                        } else {
                            Swal.fire({
                                title: 'Aviso',
                                text: 'No existe registro de paciente.',
                                icon: 'warning',
                                confirmButtonText: 'Aceptar'
                            });
                        }



                    } catch (error) {
                        Swal.fire({
                            title: 'Aviso',
                            text: 'Fallando servicios RENIEC.',
                            icon: 'warning',
                            confirmButtonText: 'Aceptar'
                        });
                        console.log(error)
                    }
                }
            } catch (error) {
                console.log("consultar administrador")
                console.log(error)
            }


            setValue('apellido_paterno', apellidoPaterno)
            setValue('apellido_materno', apellidoMaterno)
            setValue('primer_nombre', primer_nombre)
            setValue('segundo_nombre', segundo_nombre)
            setValue('tercer_nombre', tercer_nombre)
            setValue('fch_nac', fch_nac)
            setValue('celular', celular)
            setValue('email', email)
            setValue('num_doc_tuto', num_doc_tuto)
            setValue('nom_pad', nom_pad)
            setValue('prim_nom_tutor', prim_nom_tutor)
            setValue('seg_nom_tutor', seg_nom_tutor)
            setValue('ape_mat_tutor', ape_mat_tutor)
            setValue('ape_pat_tutor', ape_pat_tutor)
            setValue('num_hijo', num_hijo)
            setValue('observacion', observacion)
            setValue('direccion', direccion)

            if (sexo_p) {
                const result = sexo.filter((option: any) => option.value === Number(sexo_p));
                if (result.length > 0) {
                    setValue('sexo', result[0])
                }
            }
            if (etnia_p) {
                const result = etnia.filter((option: any) => option.value === Number(etnia_p));
                if (result.length > 0) {
                    setValue('etnia', result[0])
                }
            }
            if (idioma_p) {
                const result = idioma.filter((option: any) => option.value === Number(idioma_p));
                if (result.length > 0) {
                    setValue('idioma', result[0])
                }
            }
            if (civil_p) {
                const result = civil.filter((option: any) => option.value === Number(civil_p));
                if (result.length > 0) {
                    setValue('civil', result[0])
                }
            }
            if (grado_int) {
                const result = instruccion.filter((option: any) => option.value === Number(grado_int));
                if (result.length > 0) {
                    setValue('instruccion', result[0])
                }
            }
            if (procedencia_p) {
                const result = procedencia.filter((option: any) => option.value === Number(procedencia_p));

                if (result.length > 0) {
                    setValue('procedencia', result[0])
                }
            }
            if (ocupacion_p) {
                const result = ocupacion.filter((option: any) => option.value === Number(ocupacion_p));
                if (result.length > 0) {
                    setValue('ocupacion', result[0])
                }
            }
            if (pais_domicilio) {
                const result = pais.filter((option: any) => option.value === Number(pais_domicilio));
                if (result.length > 0) {
                    setValue('pais', result[0])
                }
            }
            if (pais_nacimiento) {
                const result = paisNac.filter((option: any) => option.value === Number(pais_nacimiento));
                if (result.length > 0) {
                    setValue('pais_nac', result[0])
                }
            }
            if (pais_procedencia) {
                const result = paisProc.filter((option: any) => option.value === Number(pais_procedencia));
                if (result.length > 0) {
                    setValue('pais_proc', result[0])
                }
            }
            if (ubigeo_domicilio_codigo != null) {
                await AutoseleccionUbigeoDomicilio(ubigeo_domicilio_codigo)
            }
            if (ubigeo_procedencia_codigo != null) {
                await AutoseleccionUbigeoProcedencia(ubigeo_procedencia_codigo)
            }
            if (ubigeo_nacimiento_codigo != null) {
                await AutoseleccionUbigeoNacimiento(ubigeo_nacimiento_codigo)
            }

        } else {

            Swal.fire({
                title: 'Advertencia',
                text: 'Error porfavor rellene numero documento.',
                icon: 'warning',
            });
        }
        setLoading(false);
    }



    // DOMICILIO
    const AutoseleccionUbigeoDomicilio = async (ubigeo: string) => {
        setOptionsComboDomicilio([])
        let fetchedOptions: any = ''
        if (origenDatos == 2) {
            // RENIEC                     
            fetchedOptions = await UbigeoxCodigo(ubigeo);
        } else if (origenDatos == 1) {
            // BD
            fetchedOptions = await UbigeoxCodigoDistrito(ubigeo);
        }
        setOptionsComboDomicilio(fetchedOptions);
        if (fetchedOptions.length > 0) {
            setValue('ubigeo', fetchedOptions[0]);
        }
    }




    const SeleccionUbigeoDomicilio = useCallback(async (inputValue: string) => {
        setOptionsComboDomicilio([])
        const fetchedOptions = await UbigeoxNombre(inputValue);
        setOptionsComboDomicilio(fetchedOptions);
    }, []);

    // PROCEDENCIA
    const AutoseleccionUbigeoProcedencia = async (ubigeo: string) => {
        setOptionsComboProcedencia([])
        let fetchedOptions: any = ''
        if (origenDatos == 2) {
            // RENIEC                     
            fetchedOptions = await UbigeoxCodigo(ubigeo);
        } else if (origenDatos == 1) {
            // BD
            fetchedOptions = await UbigeoxCodigoDistrito(ubigeo);
        }
        setOptionsComboProcedencia(fetchedOptions);
        if (fetchedOptions.length > 0) {
            setValue('ubigeo_proc', fetchedOptions[0]);
        }
    }



    const SeleccionUbigeoProcedencia = useCallback(async (inputValue: string) => {
        setOptionsComboProcedencia([])
        const fetchedOptions = await UbigeoxNombre(inputValue);
        setOptionsComboProcedencia(fetchedOptions);
    }, []);


    // NACIMIENTO
    const AutoseleccionUbigeoNacimiento = async (ubigeo: string) => {
        setOptionsComboNacimiento([])
        let fetchedOptions: any = ''
        if (origenDatos == 2) {
            // RENIEC                     
            fetchedOptions = await UbigeoxCodigo(ubigeo);
        } else if (origenDatos == 1) {
            // BD
            fetchedOptions = await UbigeoxCodigoDistrito(ubigeo);
        }
        setOptionsComboNacimiento(fetchedOptions);
        if (fetchedOptions.length > 0) {
            setValue('ubigeo_nac', fetchedOptions[0]);
        }
    }

    const SeleccionUbigeoNacimiento = useCallback(async (inputValue: string) => {
        setOptionsComboNacimiento([])
        console.log(inputValue)

        const fetchedOptions = await UbigeoxNombre(inputValue);
        console.log(fetchedOptions)
        setOptionsComboNacimiento(fetchedOptions);
    }, []);


    useEffect(() => {
        if (inputValueUbigeo) {
            SeleccionUbigeoDomicilio(inputValueUbigeo);
        } else {
            setOptionsComboDomicilio([]);
        }
    }, [inputValueUbigeo]);

    useEffect(() => {
        if (inputValueProcedencia) {
            SeleccionUbigeoProcedencia(inputValueProcedencia);
        } else {
            setOptionsComboProcedencia([]);
        }
    }, [inputValueProcedencia]);

    useEffect(() => {
        if (inputValueNacimiento) {
            SeleccionUbigeoNacimiento(inputValueNacimiento);
        } else {
            setOptionsComboNacimiento([]);
        }
    }, [inputValueNacimiento]);

    useEffect(() => {
        if (origenDatos != "") {
            AutoseleccionUbigeoDomicilio(ubigeoDomicilio)
            AutoseleccionUbigeoNacimiento(ubigeoNacimiento)
        }

    }, [origenDatos, ubigeoDomicilio])

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const requiredFields = Object.keys(errors).map(field => {
                // Puedes personalizar la lógica aquí si necesitas mostrar mensajes específicos
                return field;
            });
            Swal.fire({
                title: 'Información',
                text: `Error: llene los campos requeridos (${requiredFields.join(', ')})!`,
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
        }
    }, [errors])
    const onSubmit: SubmitHandler<any> = async (data: any) => {
        if (data.apellido_paterno != '' && data.apellido_materno != '' && data.primer_nombre && data.sexo.value != '') {
            if ((data.tipo_doc == 0 && data.num_doc == '') || (data.tipo_doc != 0 && data.num_doc != '')) {
                const datosEnv = {
                    'idPaciente': 0,
                    'idDocIdentidad': data.tipo_doc,
                    'nroDocumento': data.num_doc,
                    'nroHistoriaClinica': data.num_doc ? data.num_doc : "",
                    'primerNombre': data.primer_nombre,
                    'segundoNombre': data.segundo_nombre ? data.segundo_nombre : "",
                    'tercerNombre': data.tercer_nombre ? data.tercer_nombre : "",
                    'apellidoPaterno': data.apellido_paterno,
                    'apellidoMaterno': data.apellido_materno,
                    'madreTipoDocumento': data.tipo_doc_tutor ? data.tipo_doc_tutor : "",
                    'madreDocumento': data.num_doc_tuto ? data.num_doc_tuto : "",
                    'madrePrimerNombre': data.prim_nom_tutor ? data.prim_nom_tutor : "",
                    'madreSegundoNombre': data.seg_nom_tutor ? data.seg_nom_tutor : "",
                    'madreApellidoPaterno': data.ape_pat_tutor ? data.ape_pat_tutor : "",
                    'madreApellidoMaterno': data.ape_mat_tutor ? data.ape_mat_tutor : "",
                    'telefono': data.celular ? data.celular : "",
                    'fechaNacimiento': data.fch_nac ? data.fch_nac : "",
                    'email': data.email ? data.email : "",
                    'nombrePadre': data.nom_pad ? data.nom_pad : "",
                    'nombreMadre': "",
                    'nroOrdenHijo': data.num_hijo ? data.num_hijo : "",
                    'observacion': data.observacion ? data.observacion : "",
                    'autogenerado': "",
                    'idProcedencia': data.procedencia && data.procedencia.value ? data.procedencia.value : 4,
                    'idTipoSexo': data.sexo.value,
                    'idEstadoCivil': data.civil && data.civil.value ? data.civil.value : "9",
                    'idIdioma': data.idioma && data.idioma.value ? data.idioma.value : "",
                    'idTipoOcupacion': data.ocupacion && data.ocupacion.value ? data.ocupacion.value : "3",
                    'idEtnia': data.etnia && data.etnia.value ? data.etnia.value : "",
                    'idGradoInstruccion': data.instruccion && data.instruccion.value ? data.instruccion.value : "99",
                    'idPaisDomicilio': data.pais && data.pais.value ? data.pais.value : "166",
                    'idDistritoDomicilio': data.ubigeo && data.ubigeo.value ? data.ubigeo.value : "",
                    'direccionDomicilio': data.direccion ? data.direccion : "166",
                    'idPaisProcedencia': data.pais_proc && data.pais_proc.value ? data.pais_proc.value : "166",
                    'idDistritoProcedencia': data.ubigeo_proc && data.ubigeo_proc.value ? data.ubigeo_proc.value : "",
                    'idPaisNacimiento': data.pais_nac ? data.pais_nac.value : "166",
                    'idDistritoNacimiento': data.ubigeo_nac && data.ubigeo_nac.value ? data.ubigeo_nac.value : "",
                    'foto': {
                        'idPaciente': 0,
                        'foto': img,
                        'fecha': ""
                    },
                }
                const datos = await axios.post(`${process.env.apiurl}/Paciente/nuevo`, datosEnv)
                if (datos) {
                    Swal.fire({
                        title: 'Información',
                        text: datos.data.mensaje,
                        icon: datos.data.exito === 1 ? 'success' : 'warning',
                        confirmButtonText: 'Aceptar'
                    });

                    if (datos.data.exito == 1) {

                        reset();
                        setImg('');
                        setOrigenDatos('')
                        setTipoDocTutoSelect(1)
                        setValue('tipo_doc', '1')
                        setValue('tipo_doc_tutor', '1')
                    }
                }
            } else {
                Swal.fire({
                    title: 'Información',
                    text: 'Error llene los campos requeridos (*)!',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar'
                });
            }
        } else {
            Swal.fire({
                title: 'Información',
                text: 'Error llene los campos requeridos (*)!',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
        }
    }

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            buscar_px();
        }
    };

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            buscar_px();
        }
    };

    useEffect(() => {
        if (usuario) {
   
          setValue('tipo_doc', '1'); 
        }
      }, [usuario, setValue]);




    return (
        <div className='bg-white p-10'>

            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <div className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4'>

                        {origenDatos ? (
                            origenDatos == 2 ? (
                                <span className="text-blue-600">Información Actualizada de RENIEC 2  {/*origenDatos*/} </span>
                            ) : (
                                <span className="text-blue-600">Información de Sistema 1 {/*origenDatos*/} </span>
                            )
                        ) : null}
                    </div>
                    <div className='col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 bg-gray-100 p-2'>
                        <span className='font-semibold'>Información Personal</span>
                    </div>
                    <div className='row-span-3 bg-slate-400 flex items-center justify-center'>
                        {img ? (
                            <img src={`${base64Image}${img}`} alt="Imagen decodificada" width={173} height={75} />
                        ) : (
                            <FaUserAlt size={172} />
                        )}
                    </div>
                    <div>
                    <Controller
  name="tipo_doc"
  control={control}  // Asegúrate de que control esté pasando desde useForm
  defaultValue="1"  // Establece un valor predeterminado (por ejemplo, "1")
  render={({ field }) => (
    <select
      {...field}  // Es importante pasar las propiedades de field aquí
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {tipoDoc && tipoDoc.map((td: any) => (
        <option key={td.idDocIdentidad} value={td.idDocIdentidad}>
          {td.descripcion}
        </option>
      ))}
    </select>
  )}
/>
                    </div>
                    <div>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder=""
                            autoComplete="off"
                            autoFocus={true}
                            {...register('num_doc')}

                            onChange={(e) => {
                                const value = e.target.value;
                                if (value.length > maxLength) {
                                    e.target.value = value.slice(0, maxLength);
                                }
                            }}
                        />

                    </div>

                    <div className=''>
                        {loading ? (
                            <>
                                <div className="flex items-center mb-4">
                                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-blue-600"></div>
                                    <span className="ml-2 text-blue-600">Cargando...</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={buscar_px}
                                    className="w-fit h-fit mt-2 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    Buscar
                                    <BiSearchAlt />
                                </button>
                            </>
                        )}


                    </div>
                    <div className='col-span-1 sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6'>
                        <InputWithHeader label="Apellido Paterno" requerido={true} deshabilitado={false} {...register('apellido_paterno', { required: 'Este campo es requerido' })} error={errors.apellido_paterno || null} />
                        <InputWithHeader label="Apellido Materno" requerido={true} deshabilitado={false} {...register('apellido_materno', { required: 'Este campo es requerido' })} error={errors.apellido_materno || null} />
                        <div>
                            <span>
                                Sexo <span className='text-red-500'>(*)</span>
                            </span>

                            <Controller
                                name="sexo"
                                control={control}
                                rules={{ required: "Este campo es requerido" }}
                                render={({ field, fieldState: { error } }) => {
                                    const { ref, ...rest } = field; // Excluir la referencia (ref) del field
                                    return (
                                        <>
                                            <Select
                                                inputId={selectId}
                                                options={sexo}
                                                isSearchable={true}
                                                {...rest} // Pasar el resto de las propiedades sin el ref
                                            />
                                            {error && <span className="text-red-500">{error.message}</span>} {/* Mostrar mensaje de error */}
                                        </>
                                    );
                                }}
                            />


                        </div>
                    </div>
                    <div className='col-span-1 sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6'>
                        <InputWithHeader label="Primer Nombre" requerido={true} deshabilitado={false} {...register('primer_nombre', { required: 'Este campo es requerido' })} error={errors.primer_nombre || null} />
                        <InputWithHeader label="Segundo Nombre" deshabilitado={false} {...register('segundo_nombre')} />
                        <InputWithHeader type="date" label="Fecha de Nacimiento" requerido={true} deshabilitado={false} {...register('fch_nac', { required: 'Este campo es requerido' })} error={errors.fch_nac || null} />
                    </div>
                    <div className='col-span-1 sm:col-span-2 md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-3'>
                     
                        <div className='col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            {/*  <InputWithHeader label="Tercer Nombre" deshabilitado={false} {...register('tercer_nombre')} />*/}
                        
                           
                        </div>
                    </div>

                    <div className='col-span-1 sm:col-span-2 md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-3'>
                        <div className="flex flex-col">
                            <label className="mb-1 text-gray-700">Celular :  </label>
                            <input
                                type="number"
                                className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder=""
                                autoComplete="off"
                                {...register('celular')}
                                onKeyDown={handleKeyPress}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length > 8) {
                                        e.target.value = value.slice(0, 8);
                                    }
                                }}
                            />
                        </div>

                        <div className='col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div>
                                <span className=''>
                                    Etnia
                                </span>
                                <Controller
                                    name="etnia"
                                    control={control}
                                    render={({ field }) => {
                                        const { ref, ...rest } = field;
                                        return (
                                            <Select
                                                options={etnia}
                                                isSearchable={true}
                                                {...rest}
                                            />)
                                    }}
                                />
                            </div>
                            <div>
                                <span className=''>
                                    Idioma
                                </span>
                                <Controller
                                    name="idioma"
                                    control={control}
                                    render={({ field }) => {
                                        const { ref, ...rest } = field;
                                        return (
                                            <Select
                                                options={idioma}
                                                isSearchable={true}
                                                {...rest}
                                            />)
                                    }}
                                />
                            </div>
                        </div>
                    </div>




                </div>




                <div className="grid grid-cols-1 md:grid-cols-3  gap-3 mt-2">
                    <div className='col-span-1  md:col-span-3  bg-gray-100 p-2'>
                        <span className='font-semibold'>Datos de Domicilio</span>
                    </div>
                    <div>
                        <span className=''>
                            País
                        </span>
                        <Controller
                            name="pais"
                            control={control}
                            render={({ field }) => {
                                const { ref, ...rest } = field;
                                return (
                                    <Select
                                        options={paisNac}
                                        isSearchable={true}
                                        {...rest}
                                    />)
                            }}
                        />
                    </div>
                    <div>
                        <span className=''>
                            Ubigeo :
                        </span>
                        <Controller
                            name="ubigeo"
                            control={control}
                            render={({ field }) => {
                                const { ref, ...rest } = field;
                                return (
                                    <Select
                                        options={optionsComboDomicilio}
                                        isSearchable={true}
                                        {...rest}
                                        onInputChange={setInputValueUbigeo}
                                    />)
                            }}
                        />
                    </div>
                    <InputWithHeader label="Dirección" deshabilitado={false} {...register('direccion')} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3  gap-3">
                    <div className='col-span-1  md:col-span-3  bg-gray-100 p-2'>
                        <span className='font-semibold'>Datos de Procedencia</span>
                    </div>
                    <div>
                        <span className=''>
                            País
                        </span>
                        <Controller
                            name="pais_proc"
                            control={control}
                            render={({ field }) => {
                                const { ref, ...rest } = field;
                                return (
                                    <Select
                                        options={paisProc}
                                        isSearchable={true}
                                        {...rest}
                                    />)
                            }}
                        />
                    </div>
                    <div>
                        <span className=''>
                            Ubigeo :
                        </span>

                        <Controller
                            name="ubigeo_proc"
                            control={control}
                            render={({ field }) => {
                                const { ref, ...rest } = field;
                                return (
                                    <Select
                                        options={optionsComboProcedencia}
                                        isSearchable={true}
                                        {...rest}
                                        onInputChange={setInputValueProcedencia}
                                    />
                                )
                            }}
                        />
                    </div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3  gap-3">
                    <div className='col-span-1  md:col-span-3  bg-gray-100 p-2'>
                        <span className='font-semibold'>Datos de Nacimiento</span>
                    </div>
                    <div>
                        <span className=''>
                            País
                        </span>
                        <Controller
                            name="pais_nac"
                            control={control}
                            render={({ field }) => {
                                const { ref, ...rest } = field;
                                return (
                                    <Select
                                        options={paisProc}
                                        isSearchable={true}
                                        {...rest}
                                    />
                                )
                            }}
                        />
                    </div>
                    <div>
                        <span className=''>
                            Ubigeo :
                        </span>
                        <Controller
                            name="ubigeo_nac"
                            control={control}
                            render={({ field }) => {
                                const { ref, ...rest } = field;
                                return (
                                    <Select
                                        options={optionsComboNacimiento}
                                        isSearchable={true}
                                        {...rest}
                                        onInputChange={setInputValueNacimiento}
                                    />
                                )
                            }}
                        />
                    </div>
                </div>


                <div className=' grid grid-cols-2 gap-3'>
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit(onSubmit)}
                            type="button"
                            className="w-fit h-fit mt-2 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"

                        >
                            Guardar
                            <FaPlus />
                        </button>
                    </div>

                </div>

            </form>
        </div>
    )
}
