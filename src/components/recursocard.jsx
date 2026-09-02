import "./css/recursocard.css"
import { motion } from "motion/react"
import { useMemo } from "react"
import { Link } from "react-router-dom"

export function RecursoCard({ recurso, etiquetas, relaciones, setSelectTag}) {
    const resourceTags = relaciones
        .filter((item) => item.resource_id === recurso.id)
        .map((item) => etiquetas.find((t) => t.id === item.tag_id))
        .filter(Boolean);

    const randomColor = useMemo(() => {
        const colores = ["--accent-purple", "--accent-pink", "--accent-cyan"]
        return colores[Math.floor(Math.random() * 3)]
    }, [])

    return (
        <motion.article 
            className="resource-card" 
            style={{borderBottom: `var(--border-width) solid var(${randomColor})`}}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            whileHover={{ x: -2, y: -2, boxShadow: "4px 4px 0px #000000" }}
        >
            <Link to={`/resource/${recurso.slug}`}>
                <h5 className="card-title">{recurso.title}</h5>
                <p className="card-description">{recurso.description}</p>
                <div className="tag-cards-container" onClick={(e)=>{e.stopPropagation();e.preventDefault()}}>
                    {resourceTags.map((t) => (
                        <p 
                            onClick={() => setSelectTag(t.name)} 
                            key={t.id} 
                            className="tag-card"
                        >
                            #{t.name}
                        </p>
                    ))}
                </div>
            </Link>
        </motion.article>
    )
}