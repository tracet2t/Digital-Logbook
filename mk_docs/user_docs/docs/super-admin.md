# 🛡️ Super Admin Guide

<div class="section-intro">
Welcome, Super Admin! 👋 You are the manager of the whole system. This guide shows you exactly how to invite users, create projects, and see reports — step by step.
</div>

<div class="quick-nav" markdown>
[👥 Invite Users](#user-management)
[📁 Projects](#project-management)
[📊 Reports](#reports-and-exports)
[✅ Onboarding](#onboarding-approval)
</div>

---

## 📋 What Can You Do?

| 🎯 Task | 📝 Description |
|---|---|
| **User Management** | Invite, view, and manage all users |
| **Project Management** | Create and configure projects |
| **Mentor Assignment** | Assign mentors to projects |
| **Student Assignment** | Assign students to projects |
| **Reports** | Generate and export activity reports |

---

## 🖥️ Your Dashboard

<div class="section-intro">
This is what you will see when you log in. The dashboard shows you a summary of everything happening in the system.
</div>

![Admin Super Dashboard (Web)](<assets/myproject/Admin super dashboard web.png>){ .ui-shot }
![Admin Super Dashboard (Mobile)](<assets/myproject/Admin super dashboard mobile full.png>){ .ui-shot }

---

## 👥 User Management

<div class="section-intro">
💡 This is where you invite new users to the system and manage who has access. You can add Mentors and Students by sending them an email invitation.
</div>

### Sending a Single Invitation

1. Open the **Users** or **Invitations** page
2. Click **Invite User**
3. Enter the user's details:
    - Full name
    - Email address
4. Select the appropriate **role** (Super Admin / Mentor / Student)
5. Click **Send Invitation**

The user will receive an email with a registration link.

![Create Invitation (Web)](<assets/myproject/Create Invitation web.png>){ .ui-shot }
![Create Invitation (Mobile)](<assets/myproject/Create Invitation mobile.png>){ .ui-shot }

![Invitation List (Web)](<assets/myproject/Invitation web.png>){ .ui-shot }
![Invitation List (Mobile)](<assets/myproject/Invitation Mobile.png>){ .ui-shot }

---

### Bulk User Invitation

Use bulk invitations to add multiple users at once via a spreadsheet file.

1. Open the **Bulk Upload** section
2. Download the spreadsheet template (if provided)
3. Fill in user details (name, email, role) for each row
4. Upload the completed file
5. Review the validation results

!!! warning "Validation Errors"
    If any rows contain errors (e.g. invalid email, missing role), correct those rows and re-upload the file. Valid rows will not be affected.

![Bulk Upload (Web)](<assets/myproject/Bulk upload web.png>){ .ui-shot }
![Bulk Upload (Mobile)](<assets/myproject/Bulk upload mobile.png>){ .ui-shot }

---

### Invitation Status Reference

| Status | Meaning |
|---|---|
| **Pending** | Invitation sent — user has not registered yet |
| **Accepted** | User successfully completed registration |
| **Expired** | Invitation link has expired — resend required |

!!! tip "Managing Expired Invitations"
    Periodically review invitation statuses and resend expired invitations to ensure all users can access the system.

![User Administration (Web)](<assets/myproject/User Adminsration web.png>){ .ui-shot }
![User Administration (Mobile)](<assets/myproject/User Adminsration Mobile.png>){ .ui-shot }

---

## 📁 Project Management

<div class="section-intro">
💡 Projects are the heart of the system. Create a project, then assign a Mentor and Students to it. Everyone in a project can see each other's work.
</div>

### Creating a New Project

1. Open the **Projects** page
2. Click **Create Project**
3. Fill in project details:
    - Project name
    - Description
    - Start and end dates
4. Click **Save**

![Projects Page (Web)](<assets/myproject/Project web.png>){ .ui-shot }
![Projects Page (Mobile)](<assets/myproject/project mobile.png>){ .ui-shot }
![Create Project Modal (Web)](<assets/myproject/create new project web.png>){ .ui-shot }
![Create Project Modal (Mobile)](<assets/myproject/create new project mobile.png>){ .ui-shot }

---

### Assigning a Mentor to a Project

1. Open the project from the **Projects** page
2. Navigate to the **Mentor Assignment** section
3. Select the mentor from the list
4. Click **Save Changes**

=== "Web View"

    ![Onboarding Mentor Assignment (Web)](<assets/myproject/onboarding mentor web.png>){ .ui-shot }

=== "Mobile View"

    ![Onboarding Mentor Assignment (Mobile)](<assets/myproject/onboarding mentor mobile full.png>){ .ui-shot }

---

### Assigning Students to a Project

1. Open the project from the **Projects** page
2. Navigate to the **Student Assignment** section
3. Search for and select students to add
4. Click **Save Changes**

=== "Web View"

    ![Onboarding Mentee Assignment (Web)](<assets/myproject/onboarding mentee create new project.png>){ .ui-shot }

=== "Mobile View"

    ![Onboarding Mentee Assignment (Mobile)](<assets/myproject/onboarding mentee create new project moble.png>){ .ui-shot }

!!! note
    Assignments can be updated or removed at any time. Removing a student or mentor from a project does not delete their account.

---

## 📊 Reports and Exports

<div class="section-intro">
💡 Reports show you a summary of all team activity. You can filter by project or date, then download a PDF to share with anyone.
</div>

### Generating a Report

1. Open the **Reports** page
2. Apply filters as needed:
    - **Date range** — limit results by time period
    - **Project** — filter by specific project
    - **Status** — filter by activity or progress status
3. Click **Generate Report**
4. Review the results displayed on screen

---

### Exporting a Report

Once a report is generated:

1. Click **Export** or **Download PDF**
2. The report will be saved to your device as a PDF file

PDF reports are useful for sharing with stakeholders or keeping records offline.

![Reports (Web)](<assets/myproject/Reports web.png>){ .ui-shot }
![Reports (Mobile)](<assets/myproject/Report mobile full.png>){ .ui-shot }

![Export Report (Web)](<assets/myproject/Export Dashbord report web.png>){ .ui-shot }
![Export Report (Mobile)](<assets/myproject/Export Dashbord report mobile.png>){ .ui-shot }

---

## ✅ Onboarding Approval

<div class="section-intro">
💡 Before a Mentor or Student can start using the system, you need to approve their account here. Review their details and click Approve.
</div>

1. Navigate to the **Onboarding** page from the sidebar
2. Switch between the **Mentor** and **Mentee** tabs to review applicants
3. Check applicant details and approve or reject as needed
4. Approved users can then be assigned to projects

![Onboarding Approval (Web)](<assets/myproject/Onboarding Approval web.png>){ .ui-shot }
![Onboarding Create New Project (Web)](<assets/myproject/onboarding cratenewproject web.png>){ .ui-shot }
![Onboarding Approval (Mobile)](<assets/myproject/onboarding Approval mobile full.png>){ .ui-shot }
![Onboarding Create New Project (Mobile)](<assets/myproject/onboarding mentee create new project moble.png>){ .ui-shot }

---

## Best Practices for Super Admins

- Monitor invitation statuses regularly and resend expired ones
- Review project assignments to keep them accurate and current
- Periodically audit user roles to ensure correct access levels
- Export reports regularly for record keeping
- Log out after working on shared devices
