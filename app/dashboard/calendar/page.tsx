//dashboard/qyestionnaire
'use client'
import { Breadcrumbs } from '@/components/breadcrumbs';
import CalendarBody from '@/components/calendar/calendar_body';
import PageContainer from '@/components/layout/page-container';



const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Calendar', link: '/dashboard/calendar' }
];
export default function Calendar() {
  
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <CalendarBody />
      </div>
    </PageContainer>
  );
}
