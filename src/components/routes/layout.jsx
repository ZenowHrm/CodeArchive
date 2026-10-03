import { Outlet } from "react-router-dom";

// Componentes
import { Menu } from "../ui/menu";
import { Footer } from "../ui/footer";

export function Layout({loading}) {
    let layout = <>
        { loading ? null : <Menu /> }
        <main>
            <Outlet />
        </main>
        { loading ? null : <Footer /> }
    </>

    return layout
}