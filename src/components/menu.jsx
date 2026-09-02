import "./css/menu.css"
import { useState, useEffect } from "react";
import { motion } from "motion/react"
import { Link } from "react-router-dom";

export function Menu() {
    const neoHover = { x: -2, y: -2, boxShadow: "4px 4px 0px #000000" };
    const neoTap = { x: 2, y: 2, boxShadow: "0px 0px 0px #000000" };
    const neoTransition = { type: "spring", stiffness: 400, damping: 17 };

    let menu = (
        <motion.nav 
            className="menu-container"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
            <ul className="menu-principal-container">
                <motion.li 
                    className="menu-item home-item"
                    whileHover={neoHover}
                    whileTap={neoTap}
                    transition={neoTransition}
                >
                    <Link to={"/"} >
                        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-code">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M7 8l-4 4l4 4" />
                            <path d="M17 8l4 4l-4 4" />
                            <path d="M14 4l-4 16" />
                        </svg>
                    </Link>
                </motion.li>
                
                <li className="menu-titulo-container">
                    <p className="menu-titulo">
                        CodeArchiver
                    </p>
                </li>
            </ul>
            
            <ul className="menu-lista-container">
                <motion.li 
                    className="menu-item apoyar-item"
                    whileHover={neoHover}
                    whileTap={neoTap}
                    transition={neoTransition}
                >
                    <Link to={"#"} >
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-heart">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                        </svg>
                        Apoyar
                    </Link>
                </motion.li>
                
                <motion.li 
                    className="menu-item favoritos-item"
                    whileHover={neoHover}
                    whileTap={neoTap}
                    transition={neoTransition}
                >
                    <Link to={"https://github.com/ZenowHrm/CodeArchive"} target="_blank" >
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-github">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
                        </svg>
                        Github
                    </Link>
                </motion.li>
                
                <motion.li 
                    className="menu-item contribuir-item"
                    whileHover={{ x: -2, y: -2, boxShadow: "4px 4px 0px var(--border-color)" }}
                    whileTap={{ x: 2, y: 2, boxShadow: "0px 0px 0px var(--bg-main)" }}
                    transition={neoTransition}
                >
                    <Link to={"/contribuir"} >
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-list">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                            <path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2" />
                            <path d="M9 12l.01 0" />
                            <path d="M13 12l2 0" />
                            <path d="M9 16l.01 0" />
                            <path d="M13 16l2 0" />
                        </svg>
                        Contribuir
                    </Link>
                </motion.li>
            </ul>
        </motion.nav>
    );

    return menu;
}