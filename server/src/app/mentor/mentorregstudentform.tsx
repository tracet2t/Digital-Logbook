// app/mentor/mentorregstudentform.tsx
import { prisma } from '@/services/prisma';
import bcrypt from 'bcrypt';
import { useState } from 'react';

export default function MentorRegistrationPage() {
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const email = formData.get('email') as string;

      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: 'STUDENT',
        },
      });

      setSubmissionStatus('Student registered successfully!');
    } catch (error) {
      setSubmissionStatus('An error occurred while registering the student.');
    }
  };

  const handleCancel = () => {
    // router.push('/'); 
  };

  return (
    <div>
      <h1>Register Student</h1>
      <form action={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" required />
        <input type="text" name="lastName" placeholder="Last Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Register</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>

      {submissionStatus && <p>{submissionStatus}</p>}
    </div>
  );
}
