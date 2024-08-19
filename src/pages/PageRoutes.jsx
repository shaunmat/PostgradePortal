import { memo, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RightSidebar } from '../components/Shared/RightSidebar';
import { SidebarComponent } from '../components/Shared/Sidebar';
import { Dashboard } from '../pages/Dashboard';
import { Courses } from './Courses';
import { Research } from './Research';
import { Course } from './Course';
import { ResearchCourse } from './ResearchCrs';
import { Inbox } from './Inbox';
import { Milestones } from './Milestones';
import { Settings } from './Settings';
import { Tasks } from './Tasks';
import { TopicContent } from './SyllabusPage';
import { LogoLoader } from '../components/LogoLoader';
const MemoizedSidebarComponent = memo(SidebarComponent);
const MemoizedRightSidebar = memo(RightSidebar);
const MemoizedDashboard = memo(Dashboard);
const MemoizedCourses = memo(Courses);
const MemoizedResearch = memo(Research);
const MemoizedCourse = memo(Course);
const MemoizedResearchCourse = memo(ResearchCourse);
const MemoizedInbox = memo(Inbox);
const MemoizedMilestones = memo(Milestones);
const MemoizedSettings = memo(Settings);
const MemoizedTasks = memo(Tasks);
const MemoizedTopicContent = memo(TopicContent);
const MemoizedLogoLoader = memo(LogoLoader);

export const PageRoutes = () => {

    const isLoading = false;

    if (isLoading) {
        return <MemoizedLogoLoader />;
    }
    return (
        <div className="flex">
            <MemoizedSidebarComponent />
            <main>
                <Routes>
                    <Route path="/dashboard" element={<MemoizedDashboard />} />
                    <Route path="/courses/course" element={<MemoizedCourses />} />
                    <Route path="/courses/course/:courseId" element={<MemoizedCourse />} />
                    <Route path="/courses/course/:courseId/topic/:topicId" element={<MemoizedTopicContent />} />
                    <Route path="/courses/research" element={<MemoizedResearch />} />
                    <Route path="/courses/research/:researchId" element={<MemoizedResearchCourse />} />
                    <Route path="/tasks" element={<MemoizedTasks />} />
                    <Route path="/inbox" element={<MemoizedInbox />} />
                    <Route path="/milestones" element={<MemoizedMilestones />} />
                    <Route path="/settings" element={<MemoizedSettings />} />
                </Routes>
            </main>
            <MemoizedRightSidebar />
        </div>
    )
}
