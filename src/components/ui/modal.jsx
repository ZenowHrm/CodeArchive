import "../css/modal.css"
import { useState, useEffect } from "react"
import { motion } from "motion/react"

export function Modal({element, cerrar}) {
    useEffect(
        () => {
            document.body.style.overflow = "hidden"

            return () => {
                document.body.style.overflow = ""
            }
        }, []
    )

    let modal = <motion.div 
        className="modal-background" 
        onMouseDown={() => {cerrar()}}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
    >
        <motion.div 
            className="modal-content-container" 
            onMouseDown={(e) => {e.stopPropagation()}}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {
                element
            }
        </motion.div>
        <motion.div 
            className="modal-button-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 25 }}
        >
            <motion.button 
                onClick={() => {cerrar()}}
                onMouseDown={(e) => {e.stopPropagation()}}
                whileHover={{ x: -2, y: -2, boxShadow: "4px 4px 0px #000000" }}
                whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px #000000" }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x-mark">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 16l3.644 3.644a1.21 1.21 0 0 0 1.712 0l2.288 -2.288a1.21 1.21 0 0 0 0 -1.712l-3.644 -3.644l3.644 -3.644a1.21 1.21 0 0 0 0 -1.712l-2.288 -2.288a1.21 1.21 0 0 0 -1.712 0l-3.644 3.644l-3.644 -3.644a1.21 1.21 0 0 0 -1.712 0l-2.288 2.288a1.21 1.21 0 0 0 0 1.712l3.644 3.644l-3.644 3.644a1.21 1.21 0 0 0 0 1.712l2.288 2.288a1.21 1.21 0 0 0 1.712 0l3.644 -3.644" />
                </svg>
            </motion.button>
        </motion.div>
    </motion.div>

    return modal
}