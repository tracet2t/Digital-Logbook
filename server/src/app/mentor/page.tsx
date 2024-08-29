// app/mentor/page.tsx

import Link from 'next/link';

export default function MentorPage() {
  return (
    <div>
      <h1>Mentor Dashboard</h1>
      <Link href="/mentor-register"><button>Register Student</button></Link>
    </div>
  );
}
