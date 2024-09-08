import { AllMilestones } from "../components/AllMilestones";
import { ViewMilestoneModal } from "../components/ViewMilestoneModal";
import { useState } from "react";
import { Footer } from "../components/Footer";

export const Milestones = () => {
    const [selectedMilestone, setSelectedMilestone] = useState(null);

    const moduleColors = {
        'Software Development': 'bg-[#00ad43]',
        'Software Project': 'bg-[#00bfff]',
        'Software Testing': 'bg-[#590098]',
        'Business Analysis': 'bg-[#FF8503]'
    };

    const milestones = [
        {
            title: 'Research Proposal Due',
            date: 'Due Date: August 15th, 2024',
            description: 'Submit your research proposal outlining your planned study and methodology.',
            module: 'Software Development',
            objectives: `1. Define research objectives\n2. Identify research questions\n3. Justify research methodology\n4. Define research scope`,
            latest: true
        },
        {
            title: 'Methodology Presentation',
            date: 'Presentation Date: September 10th, 2024',
            description: 'Prepare and present your research methodology to the committee.',
            module: 'Software Development',
            resources: 'Research Methodology Textbook',

        },
        {
            title: 'Data Collection Completion',
            date: 'Completion Date: October 5th, 2024',
            description: 'Finish collecting all necessary data for your research.',
            module: 'Software Project',
            objectives: `1. Collect primary data\n2. Collect secondary data\n3. Organize data\n4. Analyze data`,
            resources: 'Data Collection Template\nData Analysis Textbook'
        },
        {
            title: 'Chapter 1 Thesis Due',
            date: 'Due Date: November 1st, 2024',
            description: 'Submit the first chapter of your thesis for review.',
            module: 'Software Testing',
            objectives: `1. Introduction\n2. Background\n3. Problem Statement\n4. Research Objectives`,
            resources: 'Thesis Template\nThesis Guidelines'
        },
        {
            title: 'Business Analysis Test',
            date: 'Test Date: December 1st, 2024',
            description: 'Prepare for and complete the Business Analysis test.',
            module: 'Business Analysis',
        },
        {
            title: 'Final Thesis Submission',
            date: 'Due Date: December 15th, 2024',
            description: 'Submit your completed thesis for final review and grading.',
            module: 'Software Development',
            linkText: 'Submit Thesis',
            linkHref: '/submit-thesis'
        },
        {
            title: 'Software Testing Exam',
            date: 'Exam Date: January 5th, 2025',
            description: 'Prepare for and complete the Software Testing final exam.',
            module: 'Software Testing',
        },
        {
            title: 'Research Presentation',
            date: 'Presentation Date: January 15th, 2025',
            description: 'Prepare and present your research findings to the committee.',
            module: 'Software Project',
        },
        {
            title: 'Business Analysis Project',
            date: 'Due Date: February 1st, 2025',
            description: 'Complete the Business Analysis project and submit for grading.',
            module: 'Business Analysis',
        },
        {
            title: 'Software Development Final Exam',
            date: 'Exam Date: February 15th, 2025',
            description: 'Prepare for and complete the Software Development final exam.',
            module: 'Software Development',
        }
    ];

    const handleViewMilestone = (milestone) => {
        setSelectedMilestone(milestone);
    };

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 dark:bg-gray-800">
                <section className="mb-6">
                    <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">Milestones</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-6">Track your progress and stay on top of your studies</p>
                </section>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <AllMilestones
                        milestones={milestones}
                        moduleColors={moduleColors}
                        onViewMilestone={handleViewMilestone}
                    />
                </div>

                <ViewMilestoneModal
                    isOpen={!!selectedMilestone}
                    onClose={() => setSelectedMilestone(null)}
                    milestone={selectedMilestone}
                />

                <Footer />
            </div>
        </div>
    );
};
