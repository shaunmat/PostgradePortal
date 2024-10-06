import { Route, Routes } from "react-router-dom";
import { AdminDashboard } from "../AdminPages/AdminDashboard";
//import { Dashboard } from "./Dashboard";
import { AdminSettings } from "../AdminPages/AdminSettings";
import { AdminAnalytics } from "../AdminPages/AdminAnalytics";

export const AdminPageRoutes = () => {
    return (
        <Routes>
            <Route path="/admin/dashboard" element={< AdminDashboard/>} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Routes>
    )
}
