import "../css/loading.css"
import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function LoadingPage() {

    let cargando = <div className="load-container">
        <div id="load">
            <div>G</div>
            <div>N</div>
            <div>I</div>
            <div>D</div>
            <div>A</div>
            <div>O</div>
            <div>L</div>
        </div>
    </div>

    return cargando
}