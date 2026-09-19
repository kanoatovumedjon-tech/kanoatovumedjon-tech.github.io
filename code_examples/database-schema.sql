-- ============================================
-- CRM PLATFORM - DATABASE SCHEMA (PostgreSQL)
-- ============================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- ORGANIZATIONS & USERS
-- ============================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    logo_url VARCHAR(512),
    website VARCHAR(255),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'ru',
    currency VARCHAR(3) DEFAULT 'RUB',
    subscription_plan VARCHAR(50) DEFAULT 'starter',
    subscription_status VARCHAR(50) DEFAULT 'active',
    billing_email VARCHAR(255),
    max_users INT DEFAULT 50,
    max_contacts INT DEFAULT 10000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT valid_company_size CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '500+')),
    CONSTRAINT valid_plan CHECK (subscription_plan IN ('free', 'starter', 'professional', 'enterprise'))
);

CREATE INDEX idx_org_deleted ON organizations(deleted_at);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'sales_rep',
    department VARCHAR(100),
    avatar_url VARCHAR(512),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    UNIQUE (organization_id, email),
    CONSTRAINT valid_role CHECK (role IN ('admin', 'manager', 'sales_rep', 'support_agent', 'analyst', 'client')),
    CONSTRAINT password_required CHECK (password_hash IS NOT NULL)
);

CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- ============================================
-- CONTACTS & COMPANIES
-- ============================================

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(512),
    website VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    annual_revenue DECIMAL(15, 2),
    country VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    description TEXT,
    linkedin_url VARCHAR(512),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT unique_company_per_org UNIQUE (organization_id, name)
);

CREATE INDEX idx_companies_org ON companies(organization_id);
CREATE INDEX idx_companies_created_by ON companies(created_by);
CREATE INDEX idx_companies_name ON companies USING GIN (name gin_trgm_ops);

CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile_phone VARCHAR(20),
    position VARCHAR(100),
    department VARCHAR(100),
    birthday DATE,
    linkedin_url VARCHAR(512),
    avatar_url VARCHAR(512),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'active',
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_duplicate BOOLEAN DEFAULT FALSE,
    original_contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'archived'))
);

CREATE INDEX idx_contacts_org ON contacts(organization_id);
CREATE INDEX idx_contacts_company ON contacts(company_id);
CREATE INDEX idx_contacts_owner ON contacts(owner_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_name ON contacts USING GIN (first_name gin_trgm_ops, last_name gin_trgm_ops);
CREATE INDEX idx_contacts_duplicate ON contacts(is_duplicate);

CREATE TABLE contact_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    color VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (contact_id, tag)
);

CREATE INDEX idx_tags_contact ON contact_tags(contact_id);
CREATE INDEX idx_tags_value ON contact_tags(tag);

CREATE TABLE contact_custom_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    field_key VARCHAR(100) NOT NULL,
    field_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    UNIQUE (contact_id, field_key)
);

-- ============================================
-- DEALS & PIPELINE
-- ============================================

CREATE TABLE deal_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    position INT NOT NULL,
    probability INT DEFAULT 0,
    is_closed BOOLEAN DEFAULT FALSE,
    is_won BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    UNIQUE (organization_id, name),
    CONSTRAINT valid_probability CHECK (probability >= 0 AND probability <= 100)
);

CREATE INDEX idx_stages_org ON deal_stages(organization_id);

CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'RUB',
    stage_id UUID NOT NULL REFERENCES deal_stages(id) ON DELETE RESTRICT,
    probability INT DEFAULT 0,
    close_date DATE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lost_reason VARCHAR(255),
    lost_at TIMESTAMP,
    won_at TIMESTAMP,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT valid_probability CHECK (probability >= 0 AND probability <= 100),
    CONSTRAINT valid_amount CHECK (amount >= 0),
    CONSTRAINT valid_lost_reason CHECK (lost_reason IS NOT NULL OR lost_at IS NULL)
);

CREATE INDEX idx_deals_org ON deals(organization_id);
CREATE INDEX idx_deals_contact ON deals(contact_id);
CREATE INDEX idx_deals_company ON deals(company_id);
CREATE INDEX idx_deals_owner ON deals(owner_id);
CREATE INDEX idx_deals_stage ON deals(stage_id);
CREATE INDEX idx_deals_close_date ON deals(close_date);
CREATE INDEX idx_deals_won ON deals(won_at);
CREATE INDEX idx_deals_lost ON deals(lost_at);

-- ============================================
-- ACTIVITIES
-- ============================================

CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    description TEXT,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    location VARCHAR(255),
    participants JSONB,
    attachments JSONB,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT valid_activity_type CHECK (activity_type IN ('email', 'call', 'meeting', 'note', 'custom'))
);

CREATE INDEX idx_activities_org ON activities(organization_id);
CREATE INDEX idx_activities_contact ON activities(contact_id);
CREATE INDEX idx_activities_deal ON activities(deal_id);
CREATE INDEX idx_activities_created_by ON activities(created_by);
CREATE INDEX idx_activities_type ON activities(activity_type);
CREATE INDEX idx_activities_date ON activities(created_at);

-- ============================================
-- TASKS
-- ============================================

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'open',
    due_date DATE,
    reminder_time TIMESTAMP,
    assigned_to UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CONSTRAINT valid_status CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled'))
);

CREATE INDEX idx_tasks_org ON tasks(organization_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_contact ON tasks(contact_id);
CREATE INDEX idx_tasks_deal ON tasks(deal_id);

-- ============================================
-- AUDIT LOG
-- ============================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_action CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'VIEW'))
);

CREATE INDEX idx_audit_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
CREATE INDEX idx_audit_user ON audit_logs(user_id);

-- ============================================
-- VIEWS
-- ============================================

CREATE VIEW pipeline_summary AS
SELECT
    ds.id,
    ds.organization_id,
    ds.name as stage_name,
    ds.position,
    COUNT(d.id) as deal_count,
    COALESCE(SUM(d.amount), 0) as total_amount,
    COALESCE(AVG(d.probability), 0) as avg_probability
FROM deal_stages ds
LEFT JOIN deals d ON ds.id = d.stage_id AND d.deleted_at IS NULL
GROUP BY ds.id, ds.organization_id, ds.name, ds.position;

CREATE VIEW activity_summary AS
SELECT
    a.organization_id,
    a.activity_type,
    COUNT(a.id) as activity_count,
    COUNT(DISTINCT a.contact_id) as unique_contacts,
    COUNT(DISTINCT a.created_by) as participating_users,
    DATE(a.created_at) as activity_date
FROM activities a
GROUP BY a.organization_id, a.activity_type, DATE(a.created_at);

-- ============================================
-- FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_timestamp
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_contacts_timestamp
BEFORE UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_deals_timestamp
BEFORE UPDATE ON deals
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_activities_timestamp
BEFORE UPDATE ON activities
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_tasks_timestamp
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================
-- GRANTS (for application user)
-- ============================================

CREATE ROLE crm_app_user WITH LOGIN PASSWORD 'secure_password_here';

GRANT CONNECT ON DATABASE crm_db TO crm_app_user;
GRANT USAGE ON SCHEMA public TO crm_app_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO crm_app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO crm_app_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO crm_app_user;
