import { Route, Routes } from "react-router-dom";
import {AdminDashboard} from "./AdminDashboard"
import  {Settings} from "../Settings"
import {AdminSidebar} from "../../components/AdminComponents/AdminSidebar"
import { Analytics } from "./Analytics";

export const PageRoutes = () => {
    return (
        <div>
            <AdminSidebar/>
            <main>
            <Routes>
                <Route path="/Admindashboard" element={<AdminDashboard/>}/>
                <Route path="/settings" element={<Settings />} />
                <Route path="/analytics" element={<Analytics />} />
            </Routes>
            </main>
        </div>
    )
}
