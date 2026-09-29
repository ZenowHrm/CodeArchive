import "../../css/contrasena.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { supabase } from "../../../auth/supabaseClient"

export function Contrasena() {
    const [contrasena1, setContrasena1] = useState("")
    const [contrasena2, setContrasena2] = useState("")
    const [mensaje, setMensaje] = useState("")
    const [valido, setValido] = useState(false)
    const [cargando, setCargando] = useState(false)

    const navigate = useNavigate()

    useEffect(
        () => {
            const verificarParentesco = () => {
                setValido(false)
                if (contrasena1 && contrasena2 && contrasena1.length >= 6 && contrasena1 === contrasena2) {
                    setValido(true);
                }
            }

            verificarParentesco()
        }, [contrasena1, contrasena2]
    )

    const changePassword = async () => {
        const { data, error } = await supabase.auth.updateUser(
            {
                password: contrasena1
            }
        )

        if (error == "AuthWeakPasswordError: Password should be at least 6 characters.") {
            setCargando(false)
            console.log("Error password update: ", error)
            setMensaje("La contraseña es muy corta")
            setTimeout(() => {
                setMensaje("")
            }, 2000);
        } else if (error == "AuthApiError: New password should be different from the old password.") {
            setCargando(false)
            console.log("Error password update: ", error)
            setMensaje("La contraseña nueva no debe ser igual a la anterior")
            setTimeout(() => {
                setMensaje("")
            }, 2000);
        } else if (error) {
            setCargando(false)
            console.log("Error password update: ", error)
            setMensaje("Error al cambiar la contraseña")
            setTimeout(() => {
                setMensaje("")
            }, 2000);
        } else {
            setCargando(false)
            setMensaje("Datos actualizados correctamente")
            setTimeout(() => {
                setMensaje("")
                if (window.location.href == window.location.href) {
                    navigate("/")
                }
            }, 2000);
        }
    }

    let cont = <div className="cont-container-form">
        <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
            Cambiar contraseña
        </motion.h2>
        <motion.form 
            className="cont-form" 
            onSubmit={(e) => {e.preventDefault(); }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <p>
                Contraseña nueva
            </p>
            <motion.input 
                required 
                minLength={6} 
                type="password" 
                value={contrasena1} 
                onChange={(e) => {setContrasena1(e.target.value)}} 
                whileFocus={{ scale: 1.01, x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
            <p>
                Confirma la contraseña nueva
            </p>
            <motion.input 
                required 
                minLength={6} 
                type="password" 
                value={contrasena2} 
                onChange={(e) => {setContrasena2(e.target.value)}} 
                whileFocus={{ scale: 1.01, x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
            <div className="separador" />
            <div className="cont-form-message">
                {mensaje && (
                    <motion.span 
                        style={{color: mensaje == "Datos actualizados correctamente" ? "var(--accent-cyan)" : "var(--accent-pink)" }}
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        {mensaje}
                    </motion.span>
                )}
            </div>
            <motion.button 
                disabled={valido ? (cargando ? true : false) : true} 
                onClick={() => {setCargando(true); changePassword()}}
                whileHover={valido && !cargando ? { scale: 1.02, y: -2 } : {}}
                whileTap={valido && !cargando ? { scale: 0.95, y: 0 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
                Cambiar la contraseña
            </motion.button>
        </motion.form>
    </div>

    return cont
}