import "./css/footer.css"
import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"

export function Footer() {
    let footer = <footer className="ca-footer">
        <article className="ca-footer__content">
            <div className="ca-footer__brand-col">
                <div className="ca-footer__logo">
                    <p className="ca-footer__logo-text">
                        <span className="ca-footer__logo-highlight">C</span>A
                    </p>
                </div>
                <p className="ca-footer__disclaimer">
                    CodeArchiver es un directorio comunitario con fines educativos y de archivo que no posee ni distribuye el material indexado. Todos los derechos de propiedad intelectual pertenecen a sus autores originales.<br></br>
                    Si eres el propietario de algún contenido y deseas que sea retirado, por favor contáctanos.
                </p>
            </div>
            <div className="ca-footer__info-cont">
                <div className="ca-footer__nav-col">
                    <p className="ca-footer__col-title">Políticas</p>
                    <div className="ca-footer__link-group">
                        <Link className="ca-footer__link" to={"/report-content-us"}>
                            DMCA / Reportar contenido
                        </Link>
                        <Link className="ca-footer__link" to={"/terms-of-service"}>
                            Términos de Uso
                        </Link>
                        <Link className="ca-footer__link" to={"/privacy-policy"}>
                            Política de Privacidad
                        </Link>
                        <Link className="ca-footer__link" to={"/contact"}>
                            Contacto
                        </Link>
                    </div>
                </div>
                
                <div className="ca-footer__nav-col">
                    <p className="ca-footer__col-title">Navegación y Comunidad</p>
                    <div className="ca-footer__link-group">
                        <Link className="ca-footer__link" to={"/community"}>
                            Únete a la Comunidad
                        </Link>
                        <Link className="ca-footer__link" to={"/contribuir"}>
                            Aportar recursos
                        </Link>
                        <Link className="ca-footer__link" to={"/"}>
                            Inicio
                        </Link>
                    </div>
                </div>
            </div>
        </article>
        <div className="separador ca-footer__separador" />
        <article className="ca-footer__bottom">
            <p className="ca-footer__copyright">
                © 2026 CodeArchiver. Todos los derechos reservados sobre el diseño y la estructura de la plataforma.
            </p>
        </article>
    </footer>

    return footer
}