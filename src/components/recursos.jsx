import "./css/recursos.css"
import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { supabase } from "../auth/supabaseClient"
import { section } from "motion/react-client"

const MotionLink = motion(Link)

export function Recurso() {
    const { slug } = useParams()
    const [ recurso, setRecurso ] = useState([])
    const [ tag, setTag ] = useState([]);
    const [ relacionesTags, setRelacionesTags ] = useState([])
    const [descargas, setDescargas ] = useState([])

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

            fetchRecurso()
            fetchRTags()
            fetchTags()
            fethDownload()
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
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20, delay: index * 0.08 }}
                >
                    #{item.name}
                </motion.p>
            }
        )

        return tags
    }

    let rec = <motion.section 
        className="resource-page-section"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
    >
        <motion.div variants={itemVariants} className="resource-breadcrumb">
            <p><Link to={"/"}>codearchiver</Link>/{slug}</p>
        </motion.div>
        
        <motion.article variants={itemVariants} className="resource-header">
            <div className="resource-header-info">
                <p className="resource-type">
                    {recurso.type?.toUpperCase()}
                </p>
                <h2 className="resource-title">
                    {recurso.title}
                </h2>
                <div className="resource-tags-wrapper">
                    <TagsCard />
                </div>
            </div>
            
            <div className="resource-header-media">
                <motion.div 
                    className="img-resource-container"
                    whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0px #000000" }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                    <img src={recurso.cover_image} alt="imagen referencia del recurso" />
                </motion.div>
            </div>
        </motion.article>

        <motion.article variants={itemVariants} className="resource-downloads">
            <p>Descargas:</p>
            <div className="resource-downloads-container">
                {descargas.filter(
                    (item) => {
                        if (item.resource_id === recurso.id) {
                            return item
                        } else {
                            return null
                        }
                    }
                ).map(
                    (item) => {
                        if (item.extract_password === null) {
                            return (
                                <MotionLink 
                                    key={item.id} 
                                    className="download-link" 
                                    to={item.url} 
                                    target="_blank"
                                    whileHover={{ x: -2, y: -2, boxShadow: "4px 4px 0px #000000" }}
                                    whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px #000000" }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-download">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                        <path d="M7 11l5 5l5 -5" />
                                        <path d="M12 4l0 12" />
                                    </svg>
                                    {item.server_name}
                                </MotionLink>
                            )
                        } else {
                            return (
                                <motion.div key={item.id} className="download-card" >
                                    <div className="download-password-info">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-key">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0" />
                                            <path d="M15 9h.01" />
                                        </svg>
                                        <span className="password-text">{item.extract_password}</span>
                                    </div>
                                    <motion.Link className="download-link" to={item.url} target="_blank"
                                        whileHover={{ x: -2, y: -2, boxShadow: "4px 4px 0px #000000" }}
                                        whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px #000000" }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-download">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                            <path d="M7 11l5 5l5 -5" />
                                            <path d="M12 4l0 12" />
                                        </svg>
                                        {item.server_name}
                                    </motion.Link>
                                </motion.div>
                            )
                        }
                    }
                )}
            </div>
        </motion.article>

        <motion.div 
            className="separador" 
            style={{ originX: 0 }}
            variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { type: "spring", stiffness: 200, damping: 25 } }
            }}
        />

        <motion.article variants={itemVariants} className="resource-body">
            <p className="resource-description">
                {recurso.description}
            </p>
            <p className="resource-content">
                {recurso.content}
            </p>
        </motion.article>
    </motion.section>

    return rec
}