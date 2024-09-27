import { useState, useEffect, useMemo, memo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { RightSidebar } from '../components/Shared/RightSidebar';
import { SidebarComponent } from '../components/Shared/Sidebar';
import { Dashboard } from '../pages/Dashboard';
import { Courses } from './Courses';
import { Masters } from './Masters';
import { PhD } from './PhD';
import { Honours } from './Honours';
import { Research } from './Research';
import { Course } from './Course';
import { Assignments } from './Assignments';
import { ResearchCourse } from './ResearchCrs';
import { Inbox } from './Inbox';
import { Milestones } from './Milestones';
import { Settings } from './Settings';
import { Tasks } from './Tasks';
import { TopicContent } from './SyllabusPage';
import { LogoLoader } from '../components/LogoLoader';
import { Review } from './Reviews';
import { motion } from 'framer-motion';

// Memoize the Sidebar and RightSidebar components to prevent re-renders
const MemoizedSidebarComponent = memo(SidebarComponent);
const MemoizedRightSidebar = memo(RightSidebar);

export const PageRoutes = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Memoize the routes only once since these don't change
  const routes = useMemo(
    () => (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/course/:courseId" element={<Course />} />
        <Route path="/honours/:courseId/assignments/:assignmentId" element={<Assignments />} />
        <Route path="/courses/course/:courseId/topic/:topicId" element={<TopicContent />} />
        <Route path="/research" element={<Research />} />
        <Route path="/research/:researchId" element={<ResearchCourse />} />
        <Route path="/honours" element={<Honours />} />
        <Route path="/honours/:studentID" element={<ResearchCourse />} />
        <Route path="/honours/:courseId/assignments/:assignmentId" element={<Assignments />} />
        <Route path="/phd" element={<PhD />} />
        <Route path="/phd/:studentID" element={<ResearchCourse />} />
        <Route path="/phd/:courseId/assignments/:assignmentId" element={<Assignments />} />
        <Route path="/masters" element={<Masters />} />
        <Route path="/masters/:studentID" element={<ResearchCourse />} />
        <Route path="/masters/:courseId/assignments/:assignmentId" element={<Assignments />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/milestones" element={<Milestones />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/review-submissions" element={<Review />} />
      </Routes>
    ),
    [] // Empty dependencies as routes don't change
  );

  // Effect to manage loading based on location change
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    handleStart(); // Start loading

    const timer = setTimeout(() => {
      handleComplete(); // Stop loading after a short delay
    }, 3000); // Adjust the duration to match your actual loading times

    return () => clearTimeout(timer); // Cleanup timer
  }, [location]); // Re-run effect only when location changes

  return (
    <div className="flex">
      <MemoizedSidebarComponent />
      <main className="flex-1 relative">
        {loading ? (
          <LogoLoader />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {routes}
          </motion.div>
        )}
      </main>
      <MemoizedRightSidebar />
    </div>
  );
};
