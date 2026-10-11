import "../../css/reportar.css"
import { useState } from "react"
import { useSession } from "../../../auth/Hooks/checksession"
import { motion } from "motion/react"
import { supabase } from "../../../auth/supabaseClient"

export function Report({url, closed}) {
    const { user } = useSession()
    const [mensaje, setMensaje] = useState("")
    const [cargando, setCargando] = useState(false)

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.05,
            }
        }
    };

    const blockVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { type: "spring", stiffness: 400, damping: 20 }
        }
    };

    const subirReporte = async (event) => {
        event.preventDefault()
        const respuesta = Object.fromEntries(new FormData(event.target))
        if (user) {
            const { error } = await supabase.from("link_reports").insert(
                {
                    link_id: url.id,
                    user_id: user.id,
                    details: respuesta.details?.trim() ? respuesta.details : "Null",
                    resolved: false,
                    report_type: respuesta.report_type,
                }
            )
            if (error) {
                console.log("Erro al mandar reporte: ", error)
                setMensaje("Error al mandar reporte")
                setCargando(false)
            } else {
                setMensaje("Reporte enviado")
                setCargando(false)
            }
        }
        setTimeout(() => {
            setMensaje("")
        }, 2000)
    }

    let report = <>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.h3 variants={blockVariants} className="report-titulo">
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 9v4" />
                    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
                    <path d="M12 16h.01" />
                </svg>
                Reportar enlace caído
            </motion.h3>
            <motion.p variants={blockVariants} className="report-parrafo">
                Ayúdanos a mantener el sitio activo. Reportando los enlaces que ya no esten activos
            </motion.p>
            <motion.form variants={blockVariants} className="report-form" onSubmit={(e) => {setCargando(true); subirReporte(e)}}>
                <div className="report-options">
                    <motion.label whileTap={{ scale: 0.95 }} className="report-radio">
                        <input type="radio" name="report_type" value="broken_link" />
                        El enlace está roto o da error (ej. Error 404)
                    </motion.label>
                    <motion.label whileTap={{ scale: 0.95 }} className="report-radio">
                        <input type="radio" name="report_type" value="deleted_file" />
                        El archivo fue borrado o no existe
                    </motion.label>
                    <motion.label whileTap={{ scale: 0.95 }} className="report-radio">
                        <input type="radio" name="report_type" value="private_access" />
                        Requiere permisos de acceso (ej. Google Drive privado)
                    </motion.label>
                    <motion.label whileTap={{ scale: 0.95 }} className="report-radio">
                        <input type="radio" name="report_type" value="wrong_file" defaultChecked />
                        El archivo es incorrecto o está dañado
                    </motion.label>
                    <motion.label whileTap={{ scale: 0.95 }} className="report-radio">
                        <input type="radio" name="report_type" value="other" />
                        Otro motivo
                    </motion.label>
                </div>
                <div className="separador" />
                <div className="report-detail-container">
                    <p>
                        Detalles adicionales <span>(opcional)</span>
                    </p>
                    <motion.textarea whileFocus={{ x: -2, y: -2 }} maxLength={500} name="details" placeholder="Escribe aquí más detalles sobre el problema..."></motion.textarea>
                </div>
                <div className="report-buttons-container">
                    {
                        user ?
                        <span className={`report-mensaje-${mensaje == "Reporte enviado" ? "pass" : "error"}`} >{mensaje}</span>
                        :
                        <span className="report-mensaje-nouser">Necesitas estar autenticado</span>
                    }
                    <div>
                        <motion.button whileHover={{ x: -2, y: -2 }} whileTap={{ x: 2, y: 2, scale: 0.98 }} type="button" onClick={() => {closed(false)}}>
                            Cancelar
                        </motion.button>
                        <motion.button whileHover={{ x: -2, y: -2 }} whileTap={{ x: 2, y: 2, scale: 0.98 }} disabled={user ? (cargando ? true : false) : true} className="report-button-sumit" type="submit">
                            Enviar reporte
                        </motion.button>
                    </div>
                </div>
            </motion.form>
        </motion.div>
    </>

    return report
}