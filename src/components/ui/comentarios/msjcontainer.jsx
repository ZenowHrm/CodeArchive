import "../../css/msjcontainer.css"
import { motion } from "motion/react"

import { Comentario } from "./comments"
import { TextBox } from "./textbox"

export function MsjContainer({comments, resourceId, onCommentAdded}) {
    let msjc = <>
        <motion.div 
            className="resource-textbox-container"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <TextBox resourceId={resourceId} onCommentAdded={onCommentAdded} />
        </motion.div>

        <div className="separador" />

        {
            comments?.length > 0 ?
            <motion.div 
                className="resource-msj-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                {
                    comments
                        .filter(item => !item.parent_id && item.content)
                        .sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
                        .map((comment, index) => {
                            return (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 15, x: -4 }}
                                    animate={{ opacity: 1, y: 0, x: 0 }}
                                    transition={{ 
                                        delay: index * 0.04, 
                                        type: "spring", 
                                        stiffness: 350, 
                                        damping: 22 
                                    }}
                                    style={{width: "100%"}}
                                >
                                    <Comentario mensaje={comment} mensajes={comments} onCommentAdded={onCommentAdded} />
                                </motion.div>
                            )
                        })
                }
            </motion.div>
            :
            <motion.div 
                className="resource-nomsj-container"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <h2>No hay comentarios para mostrar</h2>
            </motion.div>
        }
    </>

    return msjc
}