import { GetServerSideProps } from 'next';
import StudentPage from './student';
import MentorPage from './mentor';
import UnauthorizedPage from '../components/unauthorized';

interface DashboardProps {
  userRole: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  return (
    <div>
      {userRole === 'mentor' && <MentorPage />}
      {userRole === 'student' && <StudentPage />}
      {userRole !== 'mentor' && userRole !== 'student' && <UnauthorizedPage />}
    </div>
  );
};


// i am assuming that during the login phase the user role and id is stored in cookies
export const getServerSideProps: GetServerSideProps = async (context) => {
  const userRole = context.req.cookies['userRole'] || 'guest';

  return {
    props: {
      userRole,
    },
  };
};

export default Dashboard;
