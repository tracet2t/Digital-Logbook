# Bulk Invitation Upload Guide

## Overview

The bulk invitation feature allows administrators to send multiple invitations at once by uploading an Excel file (.xlsx or .xls).

## Excel File Format

### Required Columns

Your Excel file must include the following columns:

1. **Email** (Required)
   - Valid email address
   - Example: `john.doe@example.com`

2. **Role** (Required)
   - Must be one of: `student`, `mentor`, or `superAdmin`
   - Case-insensitive
   - Example: `student`, `Student`, `STUDENT`

3. **Project** (Optional)
   - Project identifier or name
   - Example: `project-123` or `Web Development`

4. **Name** or **Full Name** (Optional but Recommended)
   - Full name of the person to invite
   - Will be split into firstName and lastName
   - Example: `John Doe`
   - If not provided, firstName will be extracted from email

### Sample Excel Structure

| Email                  | Role       | Project         | Full Name  |
| ---------------------- | ---------- | --------------- | ---------- |
| john.doe@example.com   | student    | Web Development | John Doe   |
| jane.smith@example.com | mentor     | Mobile App      | Jane Smith |
| admin@example.com      | superAdmin | System Admin    | Admin User |

## File Requirements

- **Format**: `.xlsx` or `.xls` files only
- **Size Limit**: Maximum 5MB
- **Row Limit**: Maximum 500 rows per upload
- **First Row**: Should contain column headers

## How to Use

### Step 1: Prepare Your Excel File

1. Create an Excel file with the required columns
2. Fill in the invitation data
3. Ensure all email addresses are valid
4. Check that roles are correctly spelled

### Step 2: Upload the File

1. Navigate to the Invitations page
2. Click "Bulk Upload" button
3. Drag and drop your Excel file or click to browse
4. Wait for file validation

### Step 3: Map Fields

1. Map your Excel columns to system fields:
   - Email → Select the column containing email addresses
   - Role → Select the column containing roles
   - Project → Select the column containing project information
2. Review the preview data (first 5 rows)
3. Verify mappings are correct

### Step 4: Send Invitations

1. Click "UPLOAD & SEND INVITATIONS"
2. Monitor the progress bar
3. Review the results summary

### Step 5: Review Results

The results page shows:

- Total invitations processed
- Number successfully sent
- Number failed
- Detailed error list for failed invitations

## Data Processing

### Name Extraction

If a "Name" or "Full Name" column exists:

- The system splits it into firstName and lastName by the first space
- Example: "John Doe" → firstName: "John", lastName: "Doe"

If no name column is provided:

- firstName is extracted from the email username
- Example: "john.doe@example.com" → firstName: "john.doe"
- lastName is left empty

### Field Mapping Enhancement (Optional)

You can modify the `BulkUploadTabs.tsx` file to add dedicated firstName and lastName mapping:

```typescript
// In useBulkUpload.ts, update FieldMapping interface:
interface FieldMapping {
  email: string;
  role: string;
  project: string;
  firstName: string; // Add this
  lastName: string; // Add this
}

// Then users can map these columns separately in Step 2
```

## Error Handling

Common errors and solutions:

1. **Invalid file format**
   - Solution: Use .xlsx or .xls files only

2. **File too large**
   - Solution: Split into multiple files under 5MB each

3. **Too many rows**
   - Solution: Upload in batches of 500 rows or fewer

4. **Missing required fields**
   - Solution: Ensure all rows have email and role

5. **Invalid email format**
   - Solution: Check email addresses are properly formatted

6. **Invalid role**
   - Solution: Use only: student, mentor, or superAdmin

## API Integration

The bulk upload uses the existing `/api/invitations` endpoint:

```typescript
POST /api/invitations
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "projectId": "project-123"
}
```

Each invitation is sent sequentially to avoid overwhelming the server.

## Tips for Success

1. **Test with a small file first** (5-10 rows) before uploading hundreds
2. **Double-check email addresses** to avoid bounces
3. **Use consistent column names** in your Excel files
4. **Keep a backup** of your Excel file in case you need to retry
5. **Review failed invitations** and correct data before retrying

## Troubleshooting

### Invitations not sending

- Check your internet connection
- Verify the API endpoint is responding
- Check browser console for errors

### Progress stuck

- Refresh the page and try again
- Check if the API has rate limiting
- Try uploading fewer rows

### All invitations failing

- Verify your Excel file format matches the requirements
- Check that field mappings are correct
- Ensure the API is accessible

## Next Steps

After successful bulk upload:

1. Recipients receive invitation emails
2. Track invitation status in the Invitations table
3. Follow up on pending invitations
4. Resend expired invitations if needed
