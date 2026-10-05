import "../../css/textbox.css"
import { useState} from "react"
import { useSession } from "../../../auth/Hooks/checksession"
import { motion } from "motion/react"
import { supabase } from "../../../auth/supabaseClient"

export function TextBox({resourceId, parendId = null, onCommentAdded}) {
    const { user, loading } = useSession()
    const [text, setText] = useState("")
    const [mensaje, setMensaje] = useState("")
    const [cargando, setCargando] = useState(false)

    const comentar = async () => {
        if (text.trim() === '') {
            setMensaje("El mensaje no puede estar vacio")
        } else if (!user) {
            setMensaje("Debes estar Autenticado")
        } else {
            const { error } = await supabase.from("comments").insert(
                {
                    resource_id: resourceId,
                    parent_id: parendId,
                    user_id: user.id,
                    content: text,
                }
            )

            if (error) {
                console.log("Error agregar comentario: ", error)
                setMensaje("Error al agregar comentario")
            } else {
                setText("")
                setMensaje("Comentario agregado")
                if (onCommentAdded) {
                    onCommentAdded()
                }
            }
        }

        setTimeout(
            () => {
                setCargando(false)
                setMensaje("")
            }, 2000
        )
    }

    let textbox = <>
    <motion.form 
        className="textbox-container" 
        onSubmit={(e) => {setCargando(true); e.preventDefault(); comentar()}}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
    >
        <textarea required placeholder="Escribe un comentario aquí..." value={text} onChange={(e) => {setText(e.target.value)}} />
        <motion.button 
            type="submit" 
            disabled={user ? (cargando ? true : false) : true}
            whileHover={user && !cargando ? { scale: 1.02, x: -2, y: -2 } : {}}
            whileTap={user && !cargando ? { scale: 0.96, x: 0, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-send-2">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124" />
                <path d="M6.5 12h14.5" />
            </svg>
            Comentar
        </motion.button>
    </motion.form>
    {
        !user ?
        <motion.span 
            className="textbox-no-acount"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        >
            Debes estar Autenticado para poder comentar
        </motion.span>
        :
        <motion.span 
            className={`textbox-${mensaje == "Comentario agregado" ? "pass" : "error"}`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        >
            {mensaje}
        </motion.span>
    }
    </>

    return textbox
}