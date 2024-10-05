import { Route, Routes } from "react-router-dom";
import { AdminDashboard } from "../AdminPages/AdminDashboard";
//import { Dashboard } from "./Dashboard";
import { AdminSettings } from "../AdminPages/AdminSettings";
import { Sidebar } from "../../components/AdminComponents/SideBar";
import { AdminAnalytics } from "../AdminPages/AdminAnalytics";

export const AdminPageRoutes = () => {
    return (
        <div>
            <Sidebar />
            <main>
            <Routes>
                <Route path="/dashboard" element={< AdminDashboard/>} />
                <Route path="/settings" element={<AdminSettings />} />
                <Route path="/analytics" element={<AdminAnalytics />} />
            </Routes>
            </main>
        </div>
    )
}
