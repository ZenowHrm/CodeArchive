import "../css/contribuir.css"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useSession } from "../../auth/Hooks/checksession"
import { motion } from "motion/react"
import {
    FunctionsFetchError,
    FunctionsHttpError,
    FunctionsRelayError,
} from "@supabase/supabase-js"
import { supabase } from "../../auth/supabaseClient"

export function Contribuir() {
    const { user } = useSession()
    const [tags, setTags] = useState([])
    const [mensaje, setMensaje] = useState("")
    const [cargando, setCargando] = useState(false)

    useEffect(
        () => {
            const fetchTags = async () => {
                const { data, error } = await supabase.from("tags").select("id, name")
                
                if (error) {
                    console.log("Error al cargar la categorias: ", error)
                } else {
                    setTags(data)
                }
            }

            fetchTags()
        }, []
    )

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            }
        }
    };

    const blockVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { type: "spring", stiffness: 400, damping: 20 }
        }
    };

    const enviarContribucion = async (event) => {
        event.preventDefault()
        const respuesta = Object.fromEntries(new FormData(event.target))

        const { error } = await supabase.functions.invoke("codearchive-notificaciones",
            { 
                body: respuesta
            }
        )

        if (error instanceof FunctionsHttpError) {
            let errorE = await error.context.json()
            console.log("Respuesta de la función:", errorE)
            setMensaje(errorE.error)
            setCargando(false)
        } else if (error instanceof FunctionsRelayError) {
            console.log("Error del relay:", error.message)
            setMensaje(error.message)
            setCargando(false)
        } else if (error instanceof FunctionsFetchError) {
            console.log("Error de conexión:", error.message)
            setMensaje("A fallado la conexión")
            setCargando(false)
        } else if (error) {
            console.log("Error al mandar contribución:", error)
            setMensaje("Error al enviar contribución")
            setCargando(false)
        } else {
            setMensaje("Enviado con éxito")
            setCargando(false)
        }
        setTimeout(() => {
            setMensaje("")
        }, 2000);
    }

    let cont = <>
    <motion.section 
        className="section-cabecera"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
        <motion.article variants={blockVariants} className="titulo-principal-container titulo-contribuir-container">
            <p>CONTRIBUIR</p>
            <h1 className="titulo">
                Propón un <span className="code-part">RECURSO</span> 
            </h1>
        </motion.article>
        <motion.article variants={blockVariants} className="info-secundario-container info-contribuir-container">
            <div className="texto-principal-container">
                <h3>
                    Ayúdanos a mejorar nuestra biblioteca.
                </h3>
                <p>
                    ¿Tienes algún curso, libro, web, archivo o guía de programación en mente que te gustaría ver en el sitio web? Llena la ficha y compártenos tu propuesta.
                </p>
            </div>
        </motion.article>
    </motion.section>
    <motion.section 
        className="section-contribuir-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
        <motion.article variants={blockVariants} className="contribuir-form-container">
            <div className="contribuir-from-header">
                <h3>
                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-file-text">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
                        <path d="M9 9l1 0" />
                        <path d="M9 13l6 0" />
                        <path d="M9 17l6 0" />
                    </svg>
                    Ficha de Propuesta 
                </h3>
                <p>
                    Comparte tus recursos favoritos o sugiérelos si aún no están aquí.
                </p>
            </div>
            <form className="contribuir-form" onSubmit={(e) => {setCargando(true); enviarContribucion(e)}}>
                <div className="contribuir-form-section">
                    <h4>Enlace del recurso</h4>
                    <div className="separador" />
                </div>
                <div className="contribuir-form-group">
                    <label htmlFor="link">URL del curso, libro, pagina o guia (Opcional)</label>
                    <motion.input maxLength={500} whileFocus={{ x: -2, y: -2 }} name="url" type="url" id="link" placeholder="https://ejemplo.com/recurso" />
                </div>
                <div className="contribuir-form-section">
                    <h4>Datos del Recurso</h4>
                    <div className="separador" />
                </div>
                <div className="contribuir-form-group">
                    <label htmlFor="nombre">Nombre del recurso</label>
                    <motion.input maxLength={200} whileFocus={{ x: -2, y: -2 }} name="nombre" type="text" id="nombre" placeholder="Ej. Curso definitivo de Python..." required />
                </div>
                <div className="contribuit-form-row">
                    <div className="contribuir-form-group">
                        <label htmlFor="category">Categoría principal</label>
                        <motion.select whileFocus={{ x: -2, y: -2 }} name="categoria" id="category" defaultValue="" required>
                            <option value="" disabled>Selecciona una...</option>
                            {
                                tags?.filter(item => item.name !== "All").map(
                                    (item) => {
                                        return <option key={item.id} value={item.name} >{item.name}</option>
                                    }
                                )
                            }
                            <option value="Otro">Otro</option>
                        </motion.select>
                    </div>
                    <div className="contribuir-form-group">
                        <label htmlFor="type">Tipo</label>
                        <motion.select whileFocus={{ x: -2, y: -2 }} name="tipo" id="type" defaultValue="" required>
                            <option value="" disabled>Selecciona una...</option>
                            <option value="Libro">Libro</option>
                            <option value="Curso">Curso</option>
                            <option value="Programa">Programa</option>
                            <option value="Archivo">Archivo</option>
                        </motion.select>
                    </div>
                </div>
                <div className="contribuir-form-section">
                    <h4>Detalles y Confirmación</h4>
                    <div className="separador" />
                </div>
                <div className="contribuir-form-group">
                    <label htmlFor="razon">¿Por qué debería estar en la web?</label>
                    <motion.textarea maxLength={800} whileFocus={{ x: -2, y: -2 }} name="razon" id="razon" placeholder="Cuéntanos brevemente qué hace que este material valga la pena..." required />
                </div>
                <div className="contribuir-checkbox-group">
                    <motion.input whileTap={{ scale: 0.9 }} name="terminos" type="checkbox" id="terminos" required />
                    <label htmlFor="terminos">Confirmo que este recurso aporta valor real y acepto los <Link to={"/terms-of-service"}>Términos de Uso</Link> de la página.</label>
                </div>
                <div className="contribuir-mensaje-container">
                    {
                        user ? 
                        <span className={`contribuir-mensaje-${mensaje == "Enviado con éxito" ? "pass" : "error"}`}>{mensaje}</span>
                        :
                        <span className="contribuir-mensaje-nouser">Necesitas estar autenticado</span>
                    }
                </div>
                <motion.button 
                    whileHover={{ x: -2, y: -2 }}
                    whileTap={{ x: 2, y: 2, scale: 0.98 }}
                    disabled={user ? (cargando ? true : false) : true} 
                    type="submit" 
                    className="submit-btn"
                >
                    Enviar Recurso
                </motion.button>
            </form>
        </motion.article>
        <article className="contribuir-info-container">
            <motion.div variants={containerVariants} className="contribuir-asides-container">
                <motion.aside variants={blockVariants} className="contribuir-panel-lateral">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-pin">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4" />
                            <path d="M9 15l-4.5 4.5" />
                            <path d="M14.5 4l5.5 5.5" />
                        </svg>
                        Tips para tu aporte
                    </h3>
                    <div className="separador" />
                    <ul className="contribuir-panel-lista">
                        <li><strong>Enlace activo:</strong> Verifica que la URL funcione correctamente.</li>
                        <li><strong>Gratis o de pago:</strong> Aclara si tiene algún costo.</li>
                        <li><strong>Título claro:</strong> Modera el uso de mayúsculas y expresa tus ideas de forma concisa.</li>
                        <li><strong>Aporta valor:</strong> Cuéntanos brevemente qué tiene de especial este recurso.</li>
                    </ul>
                </motion.aside>
                <motion.aside variants={blockVariants} className="contribuir-panel-lateral">
                    <h3>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-settings">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
                            <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                        </svg>
                        ¿Cómo funciona?
                    </h3>
                    <div className="separador" />
                    <div className="contribuir-proceso-container">
                        <div className="contribuir-paso">
                            <span className="contribuir-paso-numero">1</span>
                            <div className="contribuir-paso-contenido">
                                <strong>Envío:</strong>
                                <p>Llenas esta ficha con tu recomendación.</p>
                            </div>
                        </div>
                        <div className="contribuir-paso">
                            <span className="contribuir-paso-numero">2</span>
                            <div className="contribuir-paso-contenido">
                                <strong>Revisión:</strong>
                                <p>Nosotros verificamos el enlace y la calidad del recurso.</p>
                            </div>
                        </div>
                        <div className="contribuir-paso">
                            <span className="contribuir-paso-numero">3</span>
                            <div className="contribuir-paso-contenido">
                                <strong>¡Publicado!</strong>
                                <p>El recurso se añade a CodeArchiver para que todos lo aprovechen.</p>
                            </div>
                        </div>
                    </div>
                </motion.aside>
            </motion.div>
        </article>
    </motion.section>
    </>

    return cont
}