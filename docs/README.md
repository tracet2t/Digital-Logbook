Entities and Attributes
Student
•	StudentID (Primary Key) 
•	Name - Full name of the student.
•	PhoneNumber 
•	Email 
•	Password
Mentor
•	MentorID (Primary Key)
•	Name: Full name of the mentor.
•	PhoneNumber 
•	Email
•	Password
Activity Log
•	LogID (Primary Key)
•	StudentID (Foreign Key)
•	MentorID (Foreign Key)
•	Date
•	ActivityDescription
•	Time
•	Notes
•	MentorApproval
•	MentorNotes
Feedback
•	FeedbackID (Primary Key)
•	StudentID (Foreign Key)
•	MentorID (Foreign Key)
•	FeedbackDate
•	Comment
Report
•	ReportID (Primary Key)
•	MentorID (Foreign Key)
•	ReportDate
•	ReportContent
•	ReportType
Mentorship
•	StudentID (Foreign Key)
•	MentorID (Foreign Key)

