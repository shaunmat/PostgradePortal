import { Route, Routes } from "react-router-dom";
import { AdminDashboard } from "./AdminDashboard";
//import { Dashboard } from "./Dashboard";
import { Settings } from "./Settings";
import { Sidebar } from "../components/shared/Sidebar";
import { Analytics } from "./Analytics";

export const PageRoutes = () => {
    return (
        <div>
            <Sidebar />
            <main>
            <Routes>
                <Route path="/dashboard" element={< AdminDashboard/>} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/analytics" element={<Analytics />} />
            </Routes>
            </main>
        </div>
    )
}
