import { Route, Routes } from "react-router-dom";
import {AdminDashboard} from "../adminPages/AdminDashboard"
import  {Settings} from "../Settings"
import {AdminSidebar} from "../../components/AdminComponents/AdminSidebar"
import { Analytics } from "./Analytics";

export const AdminPageRoutes = () => {
    return (
        <div>
            <AdminSidebar/>
            <main>
            <Routes>
                <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
                <Route path="/Settings" element={<Settings />} />
                <Route path="/Analytics" element={<Analytics />} />
            </Routes>
            </main>
        </div>
    )
}
