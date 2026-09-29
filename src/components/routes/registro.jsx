import "../css/registro.css"
import { useState, useEffect } from "react"
import { useSession } from "../../auth/Hooks/checksession"
import { motion } from "motion/react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../../auth/supabaseClient"

export function Registro() {
    const { user, loading } = useSession()
    const [correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [cargando, setCargando] = useState(false)
    const [mensaje, setMensaje] = useState("")

    const [mode, setMode] = useState("registro")

    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && user) {
            navigate("/")
        }
    }, [user, loading, navigate])

    const register = async () => {
        for (let i = 0; i < 100; i++) {
            const username = `usuario${Math.round(Math.random()*10000)}`

            const { data: existingUser, error: searchError } = await supabase.from('users').select('username').eq('username', username).maybeSingle()

            if (searchError) {
                console.log("Error en buscar nombres de usuarios: ", searchError)
                setCargando(false)
                setMensaje("Error en el servidor")
                setTimeout(
                    () => {
                        setMensaje("")
                    }, 2000
                )
                return
            }

            if (!existingUser) {
                const { data, error } = await supabase.auth.signUp({
                    email: correo,
                    password: contrasena,
                    options: {
                        data: {
                        username: username,
                        avatar_url: `https://api.dicebear.com/10.x/pixelbot/svg?seed=${username}`,
                        }
                    }
                })

                if (error == "AuthWeakPasswordError: Password should be at least 6 characters.") {
                    console.log("Error en el Registro: ", error)
                    setCargando(false)
                    setMensaje("La contraseña es muy corta")
                    setTimeout(
                        () => {
                            setMensaje("")
                        }, 2000
                    )
                } else if (error) {
                    console.log("Error en el Registro: ", error)
                    setCargando(false)
                    setMensaje("Error en el servidor")
                    setTimeout(
                        () => {
                            setMensaje("")
                        }, 2000
                    )
                } else {
                    setMode("success")
                }
                return
            }
        }
        console.log("Error de intentos")
        setCargando(false)
        setMensaje("Sistema saturado. Intenta de nuevo.")
        setTimeout(
            () => {
                setMensaje("")
            }, 2000
        )
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

    let registro = <motion.section 
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
                    Empieza
                </h2>
                <p>
                    Crea una cuenta nueva
                </p>
            </motion.div>
            {
                (mode == "registro") ?
                <form className="login-form" onSubmit={(e) => {e.preventDefault(); setCargando(true); register()}}>
                    <motion.div variants={itemVariants} className="email-box login-box">
                        <input type="email" name="email" id="correo" required value={correo} onChange={(e) => {setCorreo(e.target.value)}} />
                        <label htmlFor="correo">Correo electrónico</label>
                    </motion.div>
                    <motion.div variants={itemVariants} className="password-box login-box">
                        <input type="password" name="password" id="clave" required value={contrasena} onChange={(e) => {setContrasena(e.target.value)}} />
                        <label htmlFor="clave" >Contraseña</label>
                    </motion.div>
                    <motion.div variants={itemVariants} className="login-error-mesaje">
                        <motion.span 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: mensaje ? 1 : 0, scale: mensaje ? 1 : 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="error" 
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
                        Regístrate
                    </motion.button>
                </form>
                :
                <motion.div 
                    className="register-box-success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    <h4>
                        Revisa tu correo electrónico
                    </h4>
                    <p>
                        Te enviamos un enlace para terminar de registrarte. Caduca en 1 hora.
                    </p>
                </motion.div>
            }
            <motion.div variants={itemVariants} className="login-register-container">
                <p>
                    ¿Tienes una cuenta? <Link to="/inicio-sesion">Iniciar sesión</Link>
                </p>
                <span>
                    Al continuar, aceptas los <Link to="/terms-of-service">Términos de Uso</Link> y la <Link to="/privacy-policy">Política de Privacidad</Link> de CodeArchive.
                </span>
            </motion.div>
        </motion.div>

    </motion.section>

    return registro
}