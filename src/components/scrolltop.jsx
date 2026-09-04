import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Sube el scroll a la coordenada X:0, Y:0
        window.scrollTo(0, 0);
    }, [pathname]); // Se ejecuta cada vez que cambia la ruta

    return null; // Este componente no renderiza nada visualmente
}