import "../../css/comments.css"
import { useState} from "react"
import { useSession } from "../../../auth/Hooks/checksession"
import { motion } from "motion/react"
import { supabase } from "../../../auth/supabaseClient"

import { TextBox } from "./textbox"
import { Link } from "react-router-dom"

export function Comentario({mensaje, mensajes, nivel = 0, onCommentAdded}) {
    const { user: userSession, loading } = useSession()
    const user = mensaje.users
    const [textbox, setTextbox] = useState(false)
    const [display, setDisplay] = useState("none")
    const [cargando, setCargando] = useState(false)

    const [mode, setMode] = useState("view")
    const [editText, setEditText] = useState(mensaje.content)

    const actualizarMensaje = async () => {
        if (editText.trim() !== '' && userSession?.id === mensaje.user_id && editText != mensaje.content) {
            const { error } = await supabase.from("comments").update(
                {
                    content: editText
                }
            ).eq("id", mensaje.id)
            if (error) {
                console.log("Error al actualizar comentario: ", error)
            } else {
                setMode("view")
                if (onCommentAdded) {
                    onCommentAdded()
                }
            }
        }
        setCargando(false)
    }

    const borrarMensaje = async () => {
        if (userSession?.id === mensaje.user_id) {
            const { error } = await supabase.from("comments").delete().eq("id", mensaje.id)
            if (error) {
                console.log("Error al borrar mensaje: ", error)
                setCargando(false)
            } else {
                setCargando(false)
                if (onCommentAdded) {
                    onCommentAdded()
                }
            }
        }
    }

    let msj = <motion.div 
        className="comment-container"
        initial={{ opacity: 0, y: 12, x: -4 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ 
            delay: nivel * 0.06, 
            type: "spring", 
            stiffness: 350, 
            damping: 22 
        }}
    >
        <div className="comment-msj-container">
            <Link to={`/usuario/${user.id}`} >
                <motion.div 
                    className="comment-img-container"
                    whileHover={{ scale: 1.06, rotate: -3 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    <img src={user.avatar_url} alt="Avatar del usuario" />
                </motion.div>
            </Link>
            <div className="comment-content-container">
                <div className="comment-user-info">
                    <p style={{color: `${user.role == "user" ? "var(--accent-cyan)" : (user.role == "admin" ? "var(--accent-pink)" : "var(--accent-purple)")}`}}>{user.username}</p>
                    <span>{new Date(mensaje.created_at).toLocaleDateString()}</span>
                </div>
                <div className="comment-msj-content">
                    {
                        mode == "view" ?
                        <p>
                            {mensaje.content}
                        </p>
                        :
                        <motion.form 
                            className="comment-edit-container" 
                            onSubmit={(e) => {setCargando(true); e.preventDefault(); actualizarMensaje()}}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 350, damping: 20 }}
                        >
                            <textarea required value={editText} onChange={(e) => {setEditText(e.target.value)}} />
                            <div className="comment-edit-buttons-container">
                                <motion.button 
                                    type="submit" 
                                    disabled={cargando ? true : false}
                                    whileHover={!cargando ? { scale: 1.03, x: -2, y: -2 } : {}}
                                    whileTap={!cargando ? { scale: 0.96, x: 0, y: 0 } : {}}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    Editar
                                </motion.button>
                                <motion.button 
                                    type="button"
                                    onClick={() => {setMode("view")}}
                                    whileHover={{ scale: 1.03, x: -2, y: -2 }}
                                    whileTap={{ scale: 0.96, x: 0, y: 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    Cancelar
                                </motion.button>
                            </div>
                        </motion.form>
                    }
                        
                </div>
                <div className="comment-buttons-container">
                    {
                        userSession?.id == mensaje.user_id ?
                        <>
                        {
                            mode == "view" ?
                            <motion.button 
                                onClick={() => {setMode("edit")}}
                                whileHover={{ scale: 1.04, x: -2, y: -2 }}
                                whileTap={{ scale: 0.95, x: 0, y: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                Editar
                            </motion.button>
                            :
                            null
                        }
                        <motion.button 
                            onClick={() => {setCargando(true); borrarMensaje()}} 
                            disabled={cargando ? true : false}
                            whileHover={!cargando ? { scale: 1.04, x: -2, y: -2 } : {}}
                            whileTap={!cargando ? { scale: 0.95, x: 0, y: 0 } : {}}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                            Eliminar
                        </motion.button>
                        </>
                        :
                        null
                    }
                    <motion.button 
                        onClick={() => {textbox ? setTextbox(false) : setTextbox(true)}}
                        whileHover={{ scale: 1.04, x: -2, y: -2 }}
                        whileTap={{ scale: 0.95, x: 0, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        {
                            textbox ?
                            <>
                            <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M18 6l-12 12" />
                                <path d="M6 6l12 12" />
                            </svg>
                            Cancelar
                            </>
                            :
                            <>
                            <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-corner-down-right">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M6 6v6a3 3 0 0 0 3 3h10l-4 -4m0 8l4 -4" />
                            </svg>
                            Responder
                            </>
                        }
                    </motion.button>
                </div>
            </div>
        </div>
        {
            textbox ?
            <motion.div 
                className="comment-response-container"
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
            >
                <TextBox resourceId={mensaje.resource_id} parendId={mensaje.id} onCommentAdded={onCommentAdded} />
            </motion.div>
            :
            null
        }
        {
            mensajes?.filter(item => item.parent_id === mensaje.id && item.content).length > 0 && !mensaje.parent_id ?
            <div className="comment-more-button">
                <motion.button 
                    onClick={() => {if (display == "none") {setDisplay("block")} else {setDisplay("none")}}}
                    whileHover={{ scale: 1.02, x: -2, y: -2 }}
                    whileTap={{ scale: 0.96, x: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    {
                        display == "none" ?
                        <>
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M6 9l6 6l6 -6" />
                        </svg>
                        Ver respuestas
                        </>
                        :
                        <>
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-up">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M6 15l6 -6l6 6" />
                        </svg>
                        Esconder respuestas
                        </>
                    }
                </motion.button>
            </div>
            :
            null
        }
        {
            mensajes?.filter(item => item.parent_id === mensaje.id).sort((a,b) => new Date(a.created_at) - new Date(a.created_at)).map(
                (item, idx) => {
                    return <motion.div 
                        className="comment-reply" 
                        key={item.id} 
                        style={{paddingLeft: nivel < 2 ? "clamp(15px, 2vw, 25px)" : "0px", width: "100%", display: !mensaje.parent_id ? display : "block"}}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 + 0.05, type: "spring", stiffness: 350, damping: 22 }}
                    >
                        <div className="comment-reply-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-corner-up-right">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M6 18v-6a3 3 0 0 1 3 -3h10l-4 -4m0 8l4 -4" />
                            </svg>
                            <p>{mensaje.content}</p>
                        </div>
                        <Comentario mensaje={item} mensajes={mensajes} nivel={nivel + 1} onCommentAdded={onCommentAdded} />
                    </motion.div>
                }
            )
        }
    </motion.div>

    return msj
}