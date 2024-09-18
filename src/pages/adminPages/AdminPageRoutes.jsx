import { Route, Routes } from "react-router-dom";
import {AdminDashboard} from "./AdminDashboard"
import  {Settings} from "../Settings"
import {AdminSidebar} from "../../components/AdminComponents/AdminSidebar"
import { Analytics } from "./Analytics";
import { memo } from "react";
import { LogoLoader } from '../../components/LogoLoader'
const MemoizedAdminDashboard=memo(AdminDashboard);
const MemoizedAnalytics=memo(Analytics);
const MemoizedSettings=memo(Settings);
const MemoizedLogoLoader = memo(LogoLoader);
const MemoizedAminSidebar = memo(AdminSidebar);
export const AdminPageRoutes = () => {
    const isLoading=false;
    if(isLoading){
        return <MemoizedLogoLoader/>
    }
    return (
        <div className="flex">
            <MemoizedAminSidebar/>
            <main>
            <Routes>
                <Route path="/dashboard" element={<MemoizedAdminDashboard/>}/>
                <Route path="/Settings" element={<MemoizedSettings/>} />
                <Route path="/Analytics" element={<MemoizedAnalytics/>} />
            </Routes>
            </main>
        </div>
    )
}
