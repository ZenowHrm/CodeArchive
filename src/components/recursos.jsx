import "./css/recursos.css"
import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { supabase } from "../auth/supabaseClient"
import ReactMarkdown from "react-markdown"

export function Recurso() {
    const { slug } = useParams()
    const [ recurso, setRecurso ] = useState([])
    const [ tag, setTag ] = useState([]);
    const [ relacionesTags, setRelacionesTags ] = useState([])
    const [ descargas, setDescargas ] = useState([])
    const [ user, setUser ] = useState([])

    useEffect(
        () => {
            const fetchRecurso = async () => {
                const {data, error} = await supabase.from("resources").select("*").eq("slug", slug).single()
                if (error) {
                    console.log("Error fetching Recursos:", error)
                } else {
                    setRecurso(data)
                }
            }

            const fetchRTags = async () => {
                const {data, error} = await supabase.from("resource_tags").select("*")
                if (error) {
                    console.error("Error fetching card relaciones tags:", error)
                } else {
                    setRelacionesTags(data)
                }
            } 

            const fetchTags = async () => {
                const { data, error } = await supabase.from("tags").select("*");
                if (error) {
                    console.error("Error fetching tags:", error);
                } else {
                    setTag(data)
                }
            }

            const fethDownload = async () => {
                const { data, error } = await supabase.from("download_links").select("*")
                if (error) {
                    console.error("Error fetching downloads:", error);
                } else {
                    setDescargas(data)
                }
            }

            const fethUsers = async () => {
                const { data, error } = await supabase.from("users").select("*")
                if (error) {
                    console.error("Error fetching Users:", error);
                } else {
                    setUser(data)
                }
            }

            fetchRecurso()
            fetchRTags()
            fetchTags()
            fethDownload()
            fethUsers()
        }, [slug]
    )

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 25 } }
    }

    const TagsCard = () => {
        const etiquetas = relacionesTags.filter((item) => item.resource_id === recurso.id)
                                        .map((item) => tag.find((t) => t.id === item.tag_id))
                                        .filter(Boolean)

        let tags = etiquetas.map(
            (item, index) => {
                return <motion.p 
                    key={item.id}
                    whileHover={{ x: -2, y: -2, boxShadow: "2px 2px 0px #000000" }}
                    whileTap={{ x: 1, y: 1, boxShadow: "0px 0px 0px #000000" }}
                >
                    #{item.name}
                </motion.p>
            }
        )

        return tags
    }

    const PasswordDownload = ({ item }) => {
        let [copiar, setCopiar] = useState(false)

        const copiarTexto = async (texto) => {
            try {
                await navigator.clipboard.writeText(texto)
                setCopiar(true)
                
                setTimeout(
                    () => {
                        setCopiar(false)
                    }, 2000
                )
            } catch (error) {
                console.log("error al copiar", error)
            }
        }

        const Icono = () => {
            if (!copiar) {
                return <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-clipboard">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                    <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
                </svg>
            } else {
                return <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-check">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                    <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
                    <path d="M9 14l2 2l4 -4" />
                </svg>
            }
        }

        if (item.extract_password != null) {
            return <div className="resource-password-container">
                <p>
                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-key">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0" />
                        <path d="M15 9h.01" />
                    </svg>
                    {item.extract_password}
                </p>
                <motion.button 
                    onClick={() => {copiarTexto(item.extract_password)}}
                    whileHover={{ x: -2, y: -2, boxShadow: "2px 2px 0px #000000" }}
                    whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px #000000" }}
                >
                    <Icono />
                </motion.button>
            </div>
        }
    }

    let rec = <motion.section 
        className="resource-page-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
        <motion.p variants={itemVariants} className="resource-slug"><Link to={"/"}>codearchive</Link>/{slug}</motion.p>
        <article className="resource-info">
            <div className="resource-left-container">
                <motion.div variants={itemVariants} className="resource-info-container">
                    <div className="resouce-img-container">
                        <img src={recurso.cover_image} alt="Imagen del recurso" />
                    </div>
                    <div className="resource-text-container">
                        <p className="resource-type">
                            {recurso.type}
                        </p>
                        <h2>
                            {recurso.title}
                        </h2>
                        <div className="resouce-tags-container">
                            <TagsCard />
                        </div>
                        <p className="resource-description-container">
                            {recurso.description}
                        </p>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="resource-content-container">
                    <h2 className="resource-content-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-menu-3">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 6h10" />
                            <path d="M4 12h16" />
                            <path d="M7 12h13" />
                            <path d="M4 18h10" />
                        </svg>
                        Sobre este recurso:
                    </h2>
                    <motion.div 
                        className="separador" 
                        initial={{ scaleX: 0 }} 
                        whileInView={{ scaleX: 1 }} 
                        transition={{ type: "spring", stiffness: 200, damping: 25 }} 
                        style={{ originX: 0 }} 
                    />
                    <div className="resource-content-markdown">
                        <ReactMarkdown>
                            {recurso.content}
                        </ReactMarkdown>
                    </div>
                </motion.div>
            </div>
            <div className="resource-right-container">
                <motion.div variants={itemVariants} className="resource-download-container">
                    <h2>
                        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-download">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                            <path d="M7 11l5 5l5 -5" />
                            <path d="M12 4l0 12" />
                        </svg>
                        Descargas:
                    </h2>
                    <motion.div 
                        className="separador" 
                        initial={{ scaleX: 0 }} 
                        whileInView={{ scaleX: 1 }} 
                        transition={{ type: "spring", stiffness: 200, damping: 25 }} 
                        style={{ originX: 0 }} 
                    />
                    <div className="resource-downloads">
                        {descargas.filter(item => item.resource_id == recurso.id).map(
                            (item) => {
                                return <div key={item.id}>
                                    <div className="resource-item-download">
                                        <div className="download-server-info">
                                            <h4>
                                                {item.server_name}
                                            </h4>
                                            <p className={`item-${item.status} item-status`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-sphere">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                                </svg>
                                                {item.status}
                                            </p>
                                        </div>
                                        <motion.div
                                            whileHover={{ x: -2, y: -2, boxShadow: "3px 3px 0px #000000" }}
                                            whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px #000000" }}
                                            style={{ display: "inline-flex" }}
                                        >
                                            <Link to={item.url}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-download">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                                    <path d="M7 11l5 5l5 -5" />
                                                    <path d="M12 4l0 12" />
                                                </svg>
                                                Descargar
                                            </Link>
                                        </motion.div>
                                    </div>
                                    <PasswordDownload item={item} />
                                </div>
                            }
                        )}
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="resouce-detail-container">
                    <h2>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-prompt">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 7l5 5l-5 5" />
                            <path d="M13 17l6 0" />
                        </svg>
                        Detalles técnicos
                    </h2>
                    <motion.div 
                        className="separador" 
                        initial={{ scaleX: 0 }} 
                        whileInView={{ scaleX: 1 }} 
                        transition={{ type: "spring", stiffness: 200, damping: 25 }} 
                        style={{ originX: 0 }} 
                    />
                    <div className="resource-data-container">
                        <div className="autor-resource">
                            <p>
                                Subido por:
                            </p>
                            <p>
                                {user.filter(item => item.id == recurso.uploader_id).map(item => item.username)}
                            </p>
                        </div>
                        <div className="actual-resouce">
                            <p>
                                Ultima actualizacion:
                            </p>
                            <p>
                                {new Date(recurso.updated_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="creacion-resouce">
                            <p>
                                Creado:
                            </p>
                            <p>
                                {new Date(recurso.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </article>
        <motion.article variants={itemVariants} className="resource-community">
                {`...`}
        </motion.article>
    </motion.section>

    return rec
}