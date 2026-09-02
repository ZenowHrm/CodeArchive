import "./css/principal.css"
import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { supabase } from "../auth/supabaseClient"

// Componentes
import { RecursoCard } from "./recursocard"

export function Principal() {
    const [resources, setResources] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [tag, setTag] = useState([]);
    const [selectTag, setSelectTag] = useState("All");
    const [relacionesTags, setRelacionesTags] = useState([])

    useEffect(
        () => {
            const fetchTags = async () => {
                const { data, error } = await supabase.from("tags").select("*");
                if (error) {
                    console.error("Error fetching tags:", error);
                } else {
                    setTag(data);
                }
            }

            const fetchResources = async () => {
                const { data, error } = await supabase.from("resources").select("*");
                if (error) {
                    console.error("Error fetching resources:", error);
                } else {
                    setResources(data);
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
            
            fetchResources();
            fetchTags();
            fetchRTags();
        }, []
    )

    const recursosFiltrados = resources.filter((item) => {
        const coincideTexto = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());

        let coincideEtiqueta = true;
        if (selectTag !== "All") {
            coincideEtiqueta = relacionesTags.some((rt) => {
                const tagInfo = tag.find((t) => t.id === rt.tag_id);
                return rt.resource_id === item.id && tagInfo?.name === selectTag;
            });
        }

        return coincideTexto && coincideEtiqueta;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15, // Retardo de 0.15s entre cada elemento
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

    const ButtonsTags = () => {
        let activo

        if (tag && tag.length > 0) {
            let buttonTag = tag.map(
                    (item, index) => {
                        if (item.name === selectTag) {
                            activo = "-activo"
                        } else {
                            activo = ""
                        }
                        return <button key={item.id} className={`btn-tag${activo} btn-${item.name}`} onClick={() => setSelectTag(item.name)}>
                            {item.name}
                        </button>
                    }
                )

            return buttonTag
        }

        return <></>
    }

    const FiltroResources = () => {
        const libros = recursosFiltrados.filter((item) => item.type === "book");
        const cursos = recursosFiltrados.filter((item) => item.type === "course");
        const programas = recursosFiltrados.filter((item) => item.type === "software");
        const archivos = recursosFiltrados.filter((item) => item.type === "resource");

        const renderSeccion = (titulo, texto, lista) => {
            if (lista.length === 0) return null;

            return <>
                <motion.article 
                    className="resources-article"
                    // 1. Configuramos para que se anime al hacer scroll
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }} // once: true evita que se repita si subes y bajas
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.15 } // Retraso en cascada para los elementos hijos
                        }
                    }}
                >
                    <motion.div 
                        className="text-section-resources-container"
                        variants={{
                            hidden: { opacity: 0, x: -20 }, // Entra ligeramente desde la izquierda
                            visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 400, damping: 25 } }
                        }}
                    >
                        <h2>{titulo}</h2>
                        <p>{texto}</p>
                    </motion.div>
                    
                    <motion.div 
                        className="resources-conteiner"
                        variants={{
                            hidden: { opacity: 0, y: 20 }, // Sube ligeramente
                            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 25 } }
                        }}
                    >
                        {lista.map((item) => (
                            <RecursoCard 
                                key={item.id} 
                                recurso={item} 
                                relaciones={relacionesTags} 
                                etiquetas={tag} 
                                setSelectTag={setSelectTag} 
                            />
                        ))}
                    </motion.div>
                    
                    <motion.div 
                        className="separador"
                        style={{ originX: 0 }} // Asegura que se dibuje de izquierda a derecha
                        variants={{
                            hidden: { scaleX: 0 },
                            visible: { scaleX: 1, transition: { type: "spring", stiffness: 200, damping: 25 } }
                        }}
                    ></motion.div>
                </motion.article>
            </>
        };

        if (recursosFiltrados.length === 0) {
            return (
                <motion.article 
                    className="resources-article"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                >
                    <motion.div 
                        className="coincidencias-container"
                        variants={{
                            // Un pequeño desplazamiento en Y para que caiga de forma sólida
                            hidden: { opacity: 0, y: 20, scale: 0.98 }, 
                            visible: { 
                                opacity: 1, 
                                y: 0, 
                                scale: 1,
                                transition: { type: "spring", stiffness: 400, damping: 25 } 
                            }
                        }}
                    >
                        <h2>NO SE HAN ENCONTRADO COINCIDENCIAS</h2>
                        <p>Prueba con otro término de búsqueda o categoría.</p>
                    </motion.div>
                </motion.article>
            );
        }

        return (
            <>
                {renderSeccion("Libros", "Colección de libros, guías y manuales esenciales para aprender y dominar cualquier lenguaje de programación.", libros)}
                {renderSeccion("Cursos", "Mejora tus habilidades con cursos estructurados y tutoriales paso a paso para todos los niveles.", cursos)}
                {renderSeccion("Programas", "Encuentra el software, entornos de desarrollo y herramientas necesarias para potenciar tu flujo de trabajo.", programas)}
                {renderSeccion("Archivos", "Explora repositorios de scripts, plantillas y recursos útiles listos para integrar en tus proyectos.", archivos)}
            </>
        );
    };

    let pag = <>
        <motion.section
            className="section-cabecera"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.article variants={blockVariants} className="titulo-principal-container">
                <p>COLLECTIVE / REPOSITORY</p>
                <h1 className="titulo">
                    <span className="code-part">Code</span>Archiver
                </h1>
            </motion.article>
            <motion.article variants={blockVariants} className="info-secundario-container">
                <div className="texto-principal-container">
                    <h3>
                        Todo el software, cursos y libros que necesitas, al alcance de un clic.
                    </h3>
                    <p>
                        Una plataforma digital comunitaria diseñada para descubrir, compartir y descargar una gran variedad de recursos, incluyendo programas, cursos especializados, libros y herramientas. Permitiendo conectar a estudiantes, profesionales y entusiastas en un solo espacio colaborativo.
                    </p>
                </div>
            </motion.article>
            <motion.div className="separador" />
            <motion.article 
                variants={blockVariants} 
                className="filtro-container"
                whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0px #000000" }}
                whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px #000000" }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-search">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                    <path d="M21 21l-6 -6" />
                </svg>
                <input 
                    type="search" 
                    placeholder="Buscar por nombre, etiqueta, descripción..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
            </motion.article>
            <motion.div variants={blockVariants} className="tags-container">
                <ButtonsTags />
            </motion.div>
            <motion.div variants={blockVariants} className="count-container">
                <p>Mostrando <span>{recursosFiltrados.length}</span> de <span>{resources.length}</span> elementos</p>
            </motion.div>
        </motion.section>
        <section >
            <FiltroResources />
        </section>
    </>

    return pag
}