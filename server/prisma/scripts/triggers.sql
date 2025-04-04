-- Drop existing function if it exists
DROP FUNCTION IF EXISTS audit_all_tables CASCADE;

-- Create the audit function without current_user_id
CREATE OR REPLACE FUNCTION audit_all_tables() RETURNS TRIGGER AS $$ 
BEGIN 
    -- Insert into audit_logs (without current_user_id)
    INSERT INTO audit_logs ("id", "action", "tableName", "recordId", "oldData", "timestamp")
    VALUES (
        gen_random_uuid(),
        TG_OP,
        TG_TABLE_NAME,
        CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
        now()
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tracked tables

-- Activities table trigger
DROP TRIGGER IF EXISTS audit_trigger_activities ON activities;
CREATE TRIGGER audit_trigger_activities
AFTER INSERT OR UPDATE OR DELETE ON activities
FOR EACH ROW EXECUTE FUNCTION audit_all_tables();

-- Mentor Feedback table trigger
DROP TRIGGER IF EXISTS audit_trigger_mentorfeedback ON mentorfeedback;
CREATE TRIGGER audit_trigger_mentorfeedback
AFTER INSERT OR UPDATE OR DELETE ON mentorfeedback
FOR EACH ROW EXECUTE FUNCTION audit_all_tables();

-- Mentorship table trigger
DROP TRIGGER IF EXISTS audit_trigger_mentorship ON mentorship;
CREATE TRIGGER audit_trigger_mentorship
AFTER INSERT OR UPDATE OR DELETE ON mentorship
FOR EACH ROW EXECUTE FUNCTION audit_all_tables();

-- Users table trigger
DROP TRIGGER IF EXISTS audit_trigger_users ON users;
CREATE TRIGGER audit_trigger_users
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_all_tables();

-- Mentor Activity table trigger
DROP TRIGGER IF EXISTS audit_trigger_mentoractivities ON mentoractivities;
CREATE TRIGGER audit_trigger_mentoractivities
AFTER INSERT OR UPDATE OR DELETE ON mentoractivities
FOR EACH ROW EXECUTE FUNCTION audit_all_tables();
