// components/MentorRegStudentForm.tsx
'use client'; // This component is a client component

import { useState } from 'react';
import { registerStudent } from '@/services/registerstudent';

export default function MentorRegStudentForm() {
  const [isVisible, setIsVisible] = useState(true); // Manage visibility state internally

  const handleSubmit = async (formData: FormData) => {
    try {
      await registerStudent(formData); // Call the server action to register the student
      alert('Student registered successfully!'); // Show success message
      setIsVisible(false); // Hide the form on successful registration
    } catch (error) {
      alert('Error registering student. Please try again.'); // Show error message
    }
  };

  const handleClose = () => {
    setIsVisible(false); // Hide the form on cancel
  };

  if (!isVisible) return null; // Don't render the form if it's not visible

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Register Student</h2>
        <form action={handleSubmit}>
          <div>
            <label>
              First Name
              <input type="text" name="firstName" placeholder="First Name" required />
            </label>
          </div>
          <div>
            <label>
              Last Name
              <input type="text" name="lastName" placeholder="Last Name" required />
            </label>
          </div>
          <div>
            <label>
              Email
              <input type="email" name="email" placeholder="Email" required />
            </label>
          </div>
          <div>
            <button type="submit">Register</button>
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
