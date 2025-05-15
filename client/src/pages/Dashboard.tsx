import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import MotionTrackingSection from '@/components/dashboard/MotionTrackingSection';
import ProgressDashboardSection from '@/components/dashboard/ProgressDashboardSection';
import TherapistFeedbackSection from '@/components/dashboard/TherapistFeedbackSection';
import GutRehaBSection from '@/components/dashboard/GutRehaBSection';
import EngagementTrackerSection from '@/components/dashboard/EngagementTrackerSection';
import PaymentSection from '@/components/dashboard/PaymentSection';
import ImmersiveTherapySection from '@/components/dashboard/ImmersiveTherapySection';

const Dashboard: React.FC = () => {
  // We're getting user with ID 1 (John Doe) for demonstration purposes
  // In a real application, this would come from authentication
  const userId = 1;

  return (
    <DashboardLayout>
      <WelcomeSection userId={userId} />
      <MotionTrackingSection userId={userId} />
      <ProgressDashboardSection userId={userId} />
      <TherapistFeedbackSection userId={userId} />
      <ImmersiveTherapySection />
      <GutRehaBSection />
      <EngagementTrackerSection userId={userId} />
      <PaymentSection userId={userId} />
    </DashboardLayout>
  );
};

export default Dashboard;
