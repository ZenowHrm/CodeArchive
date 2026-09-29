import "../css/iniciosesion.css"
import { useState, useEffect } from "react"
import { useSession } from "../../auth/Hooks/checksession"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { supabase } from "../../auth/supabaseClient"

export function InicioSesion() {
    const { user, loading } = useSession()
    const [correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [cargando, setCargando] = useState(false)
    const [mensaje, setMensaje] = useState("")

    const [mode, setMode] = useState("inicio")

    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && user) {
            navigate("/")
        }
    }, [user, loading, navigate])

    const inicioSession = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: correo,
            password: contrasena,
        })

        if (error) {
            console.log("Error login: ", error)
            setCargando(false)
            if (error == "AuthApiError: Invalid login credentials") {
                setMensaje("Error en las credenciales")
                setTimeout(
                    () => {
                        setMensaje("")
                    }, 2000
                )
            } else if (error == "AuthApiError: Email not confirmed") {
                setMensaje("Email no confirmado")
                setTimeout(
                    () => {
                        setMensaje("")
                    }, 2000
                )
            } else {
                setMensaje("Error en el servidor")
                setTimeout(
                    () => {
                        setMensaje("")
                    }, 2000
                )
            }
        } else {
            setMensaje("Sesión Iniciada Correctamente")
            setTimeout(
                () => {
                    setMensaje("")
                    navigate("/")
                }, 1500
            )
        }
    }

    const recuperarContrasena = async () => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(correo,{
            redirectTo: `${window.location.origin}/change-password`
        })

        if (error) {
            console.log("Error al mandar correo", error)
            setMensaje("Error en el servidor")
            setCargando(false)
            setTimeout(
                () => {
                    setMensaje("")
                }, 2000
            )
        } else {
            setMode("inicio")
            setCargando(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 25 } }
    }

    let sesion = <motion.section 
        className="login-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
        <motion.div variants={itemVariants} className="login-logo-container">
            <Link to={"/"} className="menu-titulo">
                <span className="code-login-blue">Code</span>Archiver
            </Link>
        </motion.div>
        <motion.div variants={itemVariants} className="login-inputs-container">
            <motion.div variants={itemVariants} className="login-text-container">
                <h2>
                    Bienvenido de nuevo
                </h2>
                <p>
                    Inicia sesión en tu cuenta
                </p>
            </motion.div>
            {
                mode == "inicio" ?
                <>
                    <form className="login-form" onSubmit={(e) => {e.preventDefault(); setCargando(true); inicioSession()}}>
                        <motion.div variants={itemVariants} className="email-box login-box">
                            <input type="email" name="email" id="correo" required value={correo} onChange={(e) => {setCorreo(e.target.value)}} />
                            <label htmlFor="correo">Correo electrónico</label>
                        </motion.div>
                        <motion.div variants={itemVariants} className="password-box login-box">
                            <input type="password" name="password" id="clave" required value={contrasena} onChange={(e) => {setContrasena(e.target.value)}} />
                            <label htmlFor="clave" >Contraseña</label>
                            <span  className="login-span-password" onClick={() => {setMode("change")}} >¿Olvidaste tu contraseña?</span>
                        </motion.div>
                        <motion.div variants={itemVariants} className="login-error-mesaje">
                            <motion.span 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: mensaje ? 1 : 0, scale: mensaje ? 1 : 0.9 }}
                                transition={{ duration: 0.2 }}
                                className={`${mensaje == "Sesión Iniciada Correctamente" ? "pass" : "error" }`}
                            >
                                {mensaje}
                            </motion.span>
                        </motion.div>
                        <motion.button 
                            variants={itemVariants}
                            type="submit" 
                            disabled={cargando ? true : false}
                            whileHover={!cargando ? { x: -2, y: -2, boxShadow: "4px 4px 0px #000000" } : {}}
                            whileTap={!cargando ? { x: 2, y: 2, boxShadow: "0px 0px 0px #000000" } : {}}
                        >
                            Iniciar sesión
                        </motion.button>
                    </form>
                    <motion.div variants={itemVariants} className="login-register-container">
                        <p>
                            ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
                        </p>
                        <span>
                            Al continuar, aceptas los <Link to="/terms-of-service">Términos de Uso</Link> y la <Link to="/privacy-policy">Política de Privacidad</Link> de CodeArchive.
                        </span>
                    </motion.div>
                </>
                :
                <>
                    <motion.div variants={itemVariants} className="login-change-password">
                        <h3>Recuperar contraseña</h3>
                        <p>Ingresa tu correo para recibir un enlace de recuperación.</p>
                        <motion.div variants={itemVariants} className="login-error-mesaje">
                            <motion.span 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: mensaje ? 1 : 0, scale: mensaje ? 1 : 0.9 }}
                                transition={{ duration: 0.2 }}
                                className={`${mensaje == "Sesión Iniciada Correctamente" ? "pass" : "error" }`}
                            >
                                {mensaje}
                            </motion.span>
                        </motion.div>
                        <div className="login-change-password-inputs">
                            <input value={correo} type="email" placeholder="Correo electrónico" onChange={(e) => {setCorreo(e.target.value)}} />
                            <motion.button disabled={cargando ? true : false} onClick={() => {setCargando(true); recuperarContrasena()}} variants={itemVariants} whileHover={!cargando ? { x: -1, y: -1, boxShadow: "2px 2px 0px #000000" } : {}} whileTap={!cargando ? { x: 1, y: 1, boxShadow: "0px 0px 0px #000000" } : {}}>Enviar</motion.button>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="login-register-container">
                        <p>
                            ¿Tienes una cuenta? <Link to="/inicio-sesion" onClick={() => {setMode("inicio")}}>Iniciar sesión</Link>
                        </p>
                        <span>
                            Al continuar, aceptas los <Link to="/terms-of-service">Términos de Uso</Link> y la <Link to="/privacy-policy">Política de Privacidad</Link> de CodeArchive.
                        </span>
                    </motion.div>
                </>
            }
        </motion.div>

    </motion.section>

    return sesion
}