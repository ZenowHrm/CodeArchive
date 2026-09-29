import "../../css/editar.css"
import { useState, useEffect, useRef } from "react"
import { motion } from "motion/react"
import { supabase } from "../../../auth/supabaseClient"

export function EditarM({ user }) {
    const [userName, setUserName] = useState("")
    const [initialUserName, setInitialUserName] = useState("")
    const [imgUrl, setImgUrl] = useState("")
    const [mensaje, setMensaje] = useState({ texto: "", error: false })
    const [valido, setValido] = useState(true)
    const [buscando, setBuscando] = useState(false)
    const [guardando, setGuardando] = useState(false)

    const messageTimeoutRef = useRef(null)

    const mostrarMensaje = (texto, error = false, tiempo = 3000) => {
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current)
        setMensaje({ texto, error })
        messageTimeoutRef.current = setTimeout(() => {
            setMensaje({ texto: "", error: false })
        }, tiempo)
    }

    useEffect(() => {
        return () => {
            if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current)
        }
    }, [])

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase
                .from("users")
                .select("username, avatar_url")
                .eq("id", user.id)
                .maybeSingle()

            if (error) {
                console.error("Error al obtener usuario:", error)
            } else if (data) {
                const currentName = data.username || ""
                setUserName(currentName)
                setInitialUserName(currentName)
                setImgUrl(data.avatar_url || "")
            }
        }

        if (user?.id) {
            fetchUser()
        }
    }, [user])

    useEffect(() => {
        const nameToTest = userName.trim()

        if (nameToTest === initialUserName) {
            setValido(true)
            setBuscando(false)
            return
        }

        if (nameToTest.length < 4 || nameToTest.length > 12) {
            setValido(false)
            setBuscando(false)
            return
        }

        setBuscando(true)
        const timer = setTimeout(async () => {
            const { data: existingUser, error: searchError } = await supabase
                .from("users")
                .select("username")
                .eq("username", nameToTest)
                .maybeSingle()

            if (searchError) {
                console.error("Error al comprobar usuario:", searchError)
                setValido(false)
            } else {
                setValido(!existingUser)
            }
            setBuscando(false)
        }, 400)

        return () => clearTimeout(timer)
    }, [userName, initialUserName])

    const esUrlValida = (url) => {
        if (!url) return true
        try {
            const parsed = new URL(url)
            return parsed.protocol === "http:" || parsed.protocol === "https:"
        } catch {
            return false
        }
    }

    const actualizarPerfil = async (e) => {
        e.preventDefault()

        if (!valido) {
            mostrarMensaje("El nombre no es válido", true)
            return
        }

        if (imgUrl && !esUrlValida(imgUrl)) {
            mostrarMensaje("La URL no es válida", true)
            return
        }

        setGuardando(true)

        const updates = {
            username: userName.trim(),
            avatar_url: imgUrl.trim()
        }

        const { error } = await supabase
            .from("users")
            .update(updates)
            .eq("id", user.id)

        setGuardando(false)

        if (error) {
            console.error("Error al actualizar perfil:", error)
            mostrarMensaje("Error al actualizar", true)
        } else {
            setInitialUserName(userName.trim())
            mostrarMensaje("Datos actualizados correctamente", false)
        }
    }

    const handleDefaultAvatar = () => {
        const seed = userName.trim() || user.id
        setImgUrl(`https://api.dicebear.com/10.x/pixelbot/svg?seed=${encodeURIComponent(seed)}`)
    }

    const estadoNombreColor = buscando
        ? "var(--text-muted)"
        : valido
        ? "var(--accent-cyan)"
        : "var(--accent-pink)"

    const estadoNombreTexto = buscando
        ? "Buscando..."
        : valido
        ? "Disponible"
        : "No disponible"

    let edit = <>
        <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
            Actualizar perfil
        </motion.h2>
        <motion.form 
            className="edit-form" 
            onSubmit={actualizarPerfil}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="edit-inputs-container">
                <motion.div 
                    className="user-logo-container"
                    whileHover={{ scale: 1.05, rotate: -4 }}
                    whileTap={{ scale: 0.95, rotate: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    <img src={imgUrl || undefined} alt="Foto de perfil del usuario" />
                </motion.div>

                <div className="edit-name-container">
                    <label htmlFor="username">Nombre</label>
                    <motion.span 
                        style={{ color: estadoNombreColor }}
                        animate={{ scale: buscando ? 0.95 : 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {estadoNombreTexto}
                    </motion.span>
                </div>
                <motion.input
                    id="username"
                    required
                    minLength={4}
                    maxLength={12}
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    whileFocus={{ scale: 1.01, x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />

                <label htmlFor="avatar">Avatar URL</label>
                <div className="edit-input-img">
                    <motion.input
                        id="avatar"
                        type="url"
                        value={imgUrl}
                        onChange={(e) => setImgUrl(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.png"
                        whileFocus={{ scale: 1.01, x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                    <motion.button 
                        type="button" 
                        onClick={handleDefaultAvatar}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.9, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        Default
                    </motion.button>
                </div>
            </div>
            <div className="edit-message-container">
                {mensaje.texto && (
                    <motion.span
                        className="edit-message"
                        style={{
                            color: mensaje.error ? "var(--accent-pink)" : "var(--accent-cyan)"
                        }}
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        {mensaje.texto}
                    </motion.span>
                )}
            </div>
            <motion.button
                type="submit"
                className="edit-send-button"
                disabled={guardando || buscando || !valido}
                whileHover={!(guardando || buscando || !valido) ? { scale: 1.02, y: -2 } : {}}
                whileTap={!(guardando || buscando || !valido) ? { scale: 0.95, y: 0 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                {guardando ? "Guardando..." : "Enviar"}
            </motion.button>
        </motion.form>
    </>

    return edit
}