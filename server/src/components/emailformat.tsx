import React from 'react';

type EmailTemplateProps = {
  name: string;
  password: string;
  loginUrl: string;
};

export const WelcomeEmail = ({ name, password, loginUrl }: EmailTemplateProps) => {
  return (
    <div
      style={{
        backgroundColor: '#f3f4f6',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          padding: '1rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: '96px', width: 'auto', objectFit: 'contain' }}
          />
        </div>
        <div>
          <h1 style={{ color: '#1f2937', marginBottom: '1rem' }}>Welcome to Our Digital Logbook!</h1>
          <p style={{ color: '#4b5563', marginBottom: '1rem' }}>Dear {name},</p>
          <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
            Thank you for joining us! We're excited to have you on board and look forward to working together.
          </p>
          <p style={{ color: '#4b5563', marginBottom: '0.5rem' }}>Your temporary password is:</p>
          <p
            style={{
              backgroundColor: '#e5e7eb',
              color: '#dc2626',
              fontFamily: 'monospace',
              fontSize: '1.125rem',
              padding: '0.5rem',
              borderRadius: '4px',
              marginBottom: '1rem',
            }}
          >
            {password}
          </p>
          <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
            Use this password to log in to your account. We recommend changing it once you have successfully logged in.
          </p>
          <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
            To access the application, please use the following link:
          </p>
          <a
            href={loginUrl}
            style={{ color: '#3b82f6', textDecoration: 'underline' }}
          >
            Go to Application
          </a>
        </div>
        <div style={{ color: '#6b7280', marginTop: '1rem', fontSize: '0.875rem' }}>
          If you have any questions, feel free to contact our support team.
        </div>
      </div>
    </div>
  );
};
