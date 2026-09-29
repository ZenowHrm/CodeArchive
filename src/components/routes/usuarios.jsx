import "../css/usuarios.css"
import { useState, useEffect, useMemo} from "react"
import { useSession } from "../../auth/Hooks/checksession"
import { Link, useParams } from "react-router-dom"
import { motion } from "motion/react"
import { supabase } from "../../auth/supabaseClient"

import { Modal } from "../ui/modal"
import { EditarM } from "../ui/modales/editar"
import { Contrasena } from "../ui/modales/contrasena"

export function Usuarios() {
    const { user, loading } = useSession()
    const { slug } = useParams()
    const [usuario, setUsuario] = useState("")
    const [cargando, setCargando] = useState(true)
    const [index, setIndex] = useState(0)
    const [recursos, setRecursos] = useState("")

    const randomColor = useMemo(() => {
        const colores = ["--accent-purple", "--accent-pink", "--accent-cyan"]
        return colores[Math.floor(Math.random() * 3)]
    }, [])

    const [activo, setActivo] = useState(false)
    const [content, setContent] = useState(null)

    useEffect(
        () => {
            const fetchUser = async () => {
                const { data, error } = await supabase.from("users").select("*").eq("id", slug).single()

                if (error) {
                    console.log("Error fetch usuario: ", error)
                } else {
                    setUsuario(data)
                    setCargando(false)
                }
            }
            const fetchRecursos = async () => {
                const { data, error } = await supabase.from("resources").select("*").eq("uploader_id", slug)

                if (error) {
                    console.log("Error fetch recurso usuario: ", error)
                } else {
                    setRecursos(data)
                    setCargando(false)
                }
            }

            fetchUser()
            fetchRecursos()
        }, [user, loading, slug, activo]
    )

    const cerrarModal = () => {
        setActivo(false)
    }

    const cerrarSesion = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) console.error("Error al salir:", error)
    }

    let usu = <>
    <motion.section 
        className="users-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
        <article className="user-profile">
            <div className="user-info">
                <motion.div 
                    className="user-logo-container"
                    whileHover={{ scale: 1.05, rotate: -4 }}
                    whileTap={{ scale: 0.95, rotate: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    <img src={cargando ? undefined : usuario?.avatar_url} alt="Foto de perfil del usuario" />
                </motion.div>
                <motion.div 
                    className="user-info-container"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                >
                    <h1>
                        {cargando ? "" : usuario?.username}
                    </h1>
                    <span className={`user-rol user-rol-${cargando ? "" : usuario.role}`} >
                        <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                        </svg>
                        {cargando ? "" : usuario?.role?.charAt(0).toUpperCase() + usuario?.role?.slice(1)}
                    </span>
                </motion.div>
                {
                    user && user.id == slug ?
                    <>
                    <motion.div 
                        className="user-edit-buttons-container"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <motion.button 
                            className="edit-button" 
                            onClick={() => {setActivo(true); setContent(<EditarM user={user} />)}}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95, y: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                            Editar Perfil
                        </motion.button>
                        <motion.button 
                            className="edit-button" 
                            onClick={() => {setActivo(true); setContent(<Contrasena />)}}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95, y: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                            Cambiar Contraseña
                        </motion.button>
                        <motion.button 
                            className="edit-button" 
                            onClick={() => {cerrarSesion()}}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95, y: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                            Cerrar Sesión
                        </motion.button>
                    </motion.div>
                    </>
                    :
                    null
                }
            </div>
            <div className="separador"></div>
            <div className="user-button-container">
                <motion.button 
                    className="user-button" 
                    disabled={index == 0 ? true : false} 
                    onClick={() => {setIndex(0)}}
                    whileHover={index != 0 ? { scale: 1.02, y: -2 } : {}}
                    whileTap={index != 0 ? { scale: 0.95, y: 0 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-files">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M15 3v4a1 1 0 0 0 1 1h4" />
                        <path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2" />
                        <path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
                    </svg>
                    Recursos
                </motion.button>
                <motion.button 
                    className="user-button" 
                    disabled={index == 1 ? true : false} 
                    onClick={() => {setIndex(1)}}
                    whileHover={index != 1 ? { scale: 1.02, y: -2 } : {}}
                    whileTap={index != 1 ? { scale: 0.95, y: 0 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-message-dots">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 11v.01" />
                        <path d="M8 11v.01" />
                        <path d="M16 11v.01" />
                        <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3l12 0" />
                    </svg>
                    Comentarios
                </motion.button>
            </div>
        </article>
        <article className="user-actions">
            {
                index == 0 ? 
                <motion.div 
                    key="resources"
                    className="user-resources" 
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    {
                        recursos.length <= 0 ?
                        <div className="user-no-contont-text">
                            <h2>No hay recursos para mostrar</h2>
                        </div>
                        :
                        recursos?.map(
                            (item, i) => {
                                return <motion.div 
                                    key={item.id} 
                                    className="resource-card user-resource-card" 
                                    style={{borderLeft: `var(--border-width) solid var(${randomColor})`}}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 20 }}
                                    whileHover={{ scale: 1.01, x: -2, y: -2 }}
                                    whileTap={{ scale: 0.98, x: 0, y: 0 }}
                                >
                                    <Link to={`/recurso/${item.slug}`}>
                                        <h5 className="card-title">{item.title}</h5>
                                        <p className="card-description">{item.description}</p>
                                        <motion.div 
                                            className="user-svg-resourse-container"
                                            whileHover={{ rotate: 15, scale: 1.1 }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-external-link">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
                                                <path d="M11 13l9 -9" />
                                                <path d="M15 4h5v5" />
                                            </svg>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            }
                        )
                    }
                </motion.div>
                :
                <motion.div 
                    key="comments"
                    className="user-messages"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <div className="user-no-contont-text">
                        <h2>No hay comentarios para mostrar</h2>
                    </div>
                </motion.div>
            }
        </article>
    </motion.section>
    {
        activo ?
        <Modal cerrar={cerrarModal} element={content} />
        :
        null
    }
    </>

    return usu
}