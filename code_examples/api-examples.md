# CRM Platform API Examples

> This document shows real-world examples of API requests and responses for the CRM platform.

---

## Authentication

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password_123"
  }'
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "Ivan",
    "lastName": "Petrov",
    "role": "sales_rep",
    "organization_id": "550e8400-e29b-41d4-a716-446655440001"
  },
  "expiresIn": 3600
}
```

---

## Contacts

### 1. Create Contact
```bash
curl -X POST http://localhost:3000/api/v1/contacts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "firstName": "Иван",
    "lastName": "Петров",
    "email": "ivan@example.com",
    "phone": "+7 999 123-45-67",
    "position": "Директор",
    "companyId": "550e8400-e29b-41d4-a716-446655440001",
    "notes": "VIP client, high priority"
  }'
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "organization_id": "550e8400-e29b-41d4-a716-446655440001",
  "first_name": "Иван",
  "last_name": "Петров",
  "email": "ivan@example.com",
  "phone": "+7 999 123-45-67",
  "position": "Директор",
  "company_id": "550e8400-e29b-41d4-a716-446655440001",
  "company_name": "ООО Рога и Копыта",
  "notes": "VIP client, high priority",
  "status": "active",
  "tags": [],
  "created_at": "2026-09-19T10:30:00Z",
  "updated_at": "2026-09-19T10:30:00Z",
  "created_by": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 2. List Contacts
```bash
curl -X GET "http://localhost:3000/api/v1/contacts?limit=20&offset=0&search=Ivan" \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "first_name": "Иван",
      "last_name": "Петров",
      "email": "ivan@example.com",
      "phone": "+7 999 123-45-67",
      "position": "Директор",
      "company_name": "ООО Рога и Копыта",
      "status": "active",
      "tags": ["VIP", "2024_Contract"],
      "created_at": "2026-09-19T10:30:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "first_name": "Иван",
      "last_name": "Сидоров",
      "email": "ivan.sidorov@example.com",
      "phone": "+7 999 234-56-78",
      "position": "Менеджер",
      "company_name": "АО Рога и Копыта",
      "status": "active",
      "tags": ["Sales"],
      "created_at": "2026-09-18T14:20:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 20,
    "offset": 0
  }
}
```

---

### 3. Get Single Contact
```bash
curl -X GET http://localhost:3000/api/v1/contacts/550e8400-e29b-41d4-a716-446655440002 \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "organization_id": "550e8400-e29b-41d4-a716-446655440001",
  "first_name": "Иван",
  "last_name": "Петров",
  "email": "ivan@example.com",
  "phone": "+7 999 123-45-67",
  "position": "Директор",
  "department": "Management",
  "company_id": "550e8400-e29b-41d4-a716-446655440001",
  "company_name": "ООО Рога и Копыта",
  "notes": "VIP client, high priority",
  "status": "active",
  "tags": ["VIP", "2024_Contract"],
  "owner": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "User",
    "lastName": "Name"
  },
  "recentActivities": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "activity_type": "email",
      "subject": "Proposal Sent",
      "start_time": "2026-09-19T09:00:00Z",
      "created_at": "2026-09-19T09:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440011",
      "activity_type": "call",
      "subject": "Follow-up Call",
      "start_time": "2026-09-18T15:30:00Z",
      "created_at": "2026-09-18T15:30:00Z"
    }
  ],
  "created_at": "2026-09-19T10:30:00Z",
  "updated_at": "2026-09-19T10:30:00Z"
}
```

---

### 4. Update Contact
```bash
curl -X PUT http://localhost:3000/api/v1/contacts/550e8400-e29b-41d4-a716-446655440002 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "position": "Генеральный директор",
    "phone": "+7 999 987-65-43",
    "notes": "Updated: Now CEO, very important"
  }'
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "first_name": "Иван",
  "last_name": "Петров",
  "email": "ivan@example.com",
  "phone": "+7 999 987-65-43",
  "position": "Генеральный директор",
  "notes": "Updated: Now CEO, very important",
  "updated_at": "2026-09-19T11:00:00Z"
}
```

---

### 5. Delete Contact
```bash
curl -X DELETE http://localhost:3000/api/v1/contacts/550e8400-e29b-41d4-a716-446655440002 \
  -H "Authorization: Bearer <token>"
```

**Response (204 No Content):**
```
(empty body)
```

---

### 6. Add Tag to Contact
```bash
curl -X POST http://localhost:3000/api/v1/contacts/550e8400-e29b-41d4-a716-446655440002/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "tag": "Premium"
  }'
```

**Response (201 Created):**
```json
{
  "message": "Tag added"
}
```

---

### 7. Remove Tag from Contact
```bash
curl -X DELETE http://localhost:3000/api/v1/contacts/550e8400-e29b-41d4-a716-446655440002/tags/Premium \
  -H "Authorization: Bearer <token>"
```

**Response (204 No Content):**
```
(empty body)
```

---

## Deals

### 1. Create Deal
```bash
curl -X POST http://localhost:3000/api/v1/deals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Enterprise Contract - 2026",
    "description": "Annual contract renewal with 25% volume discount",
    "amount": 150000,
    "currency": "RUB",
    "contact_id": "550e8400-e29b-41d4-a716-446655440002",
    "company_id": "550e8400-e29b-41d4-a716-446655440001",
    "stage_id": "550e8400-e29b-41d4-a716-446655440050",
    "close_date": "2026-10-31",
    "probability": 70
  }'
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440100",
  "organization_id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Enterprise Contract - 2026",
  "description": "Annual contract renewal with 25% volume discount",
  "amount": 150000,
  "currency": "RUB",
  "contact_id": "550e8400-e29b-41d4-a716-446655440002",
  "company_id": "550e8400-e29b-41d4-a716-446655440001",
  "stage_id": "550e8400-e29b-41d4-a716-446655440050",
  "stage_name": "Negotiation",
  "probability": 70,
  "close_date": "2026-10-31",
  "owner_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2026-09-19T10:30:00Z",
  "updated_at": "2026-09-19T10:30:00Z"
}
```

---

### 2. List Deals
```bash
curl -X GET "http://localhost:3000/api/v1/deals?limit=20&status=open" \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440100",
      "title": "Enterprise Contract - 2026",
      "amount": 150000,
      "currency": "RUB",
      "stage_name": "Negotiation",
      "probability": 70,
      "close_date": "2026-10-31",
      "contact_name": "Иван Петров",
      "company_name": "ООО Рога и Копыта",
      "owner_name": "User Name",
      "created_at": "2026-09-19T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 20,
    "offset": 0
  }
}
```

---

### 3. Move Deal to Different Stage
```bash
curl -X PATCH http://localhost:3000/api/v1/deals/550e8400-e29b-41d4-a716-446655440100/stage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "stage_id": "550e8400-e29b-41d4-a716-446655440051"
  }'
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440100",
  "title": "Enterprise Contract - 2026",
  "stage_id": "550e8400-e29b-41d4-a716-446655440051",
  "stage_name": "Won",
  "probability": 100,
  "won_at": "2026-09-19T11:00:00Z",
  "updated_at": "2026-09-19T11:00:00Z"
}
```

---

## Analytics

### 1. Get Pipeline Analysis
```bash
curl -X GET http://localhost:3000/api/v1/analytics/pipeline \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "stages": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440050",
      "name": "Lead",
      "position": 1,
      "deal_count": 45,
      "total_amount": 2250000,
      "avg_probability": 25,
      "deals": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440100",
          "title": "Deal 1",
          "amount": 50000
        }
      ]
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440051",
      "name": "Prospect",
      "position": 2,
      "deal_count": 30,
      "total_amount": 1800000,
      "avg_probability": 50
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440052",
      "name": "Negotiation",
      "position": 3,
      "deal_count": 15,
      "total_amount": 1350000,
      "avg_probability": 75
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440053",
      "name": "Won",
      "position": 4,
      "deal_count": 20,
      "total_amount": 3000000,
      "avg_probability": 100
    }
  ],
  "summary": {
    "total_deals": 110,
    "total_pipeline_value": 8400000,
    "weighted_forecast": 5250000,
    "closed_deals": 20,
    "open_deals": 90
  }
}
```

---

### 2. Get Revenue Forecast
```bash
curl -X GET http://localhost:3000/api/v1/analytics/revenue \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "forecast_month": "2026-09",
  "total_forecast": 2500000,
  "by_stage": {
    "Lead": 562500,
    "Prospect": 900000,
    "Negotiation": 1012500
  },
  "by_owner": [
    {
      "owner_id": "550e8400-e29b-41d4-a716-446655440000",
      "owner_name": "User 1",
      "forecast": 1250000
    },
    {
      "owner_id": "550e8400-e29b-41d4-a716-446655440001",
      "owner_name": "User 2",
      "forecast": 1250000
    }
  ],
  "historical": [
    {
      "month": "2026-07",
      "forecast": 1800000,
      "actual": 2100000,
      "variance": 300000
    },
    {
      "month": "2026-08",
      "forecast": 2200000,
      "actual": 1950000,
      "variance": -250000
    }
  ]
}
```

---

### 3. Get Team Performance
```bash
curl -X GET http://localhost:3000/api/v1/analytics/team \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "period": "2026-09",
  "team": [
    {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "User 1",
      "deals_created": 15,
      "deals_closed": 5,
      "deals_won": 4,
      "deals_lost": 1,
      "total_revenue": 450000,
      "pipeline_value": 1250000,
      "avg_deal_size": 90000,
      "close_rate": "33%",
      "win_rate": "80%",
      "activity_count": 128,
      "calls": 32,
      "emails": 56,
      "meetings": 40
    },
    {
      "user_id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "User 2",
      "deals_created": 12,
      "deals_closed": 4,
      "deals_won": 3,
      "deals_lost": 1,
      "total_revenue": 350000,
      "pipeline_value": 1000000,
      "avg_deal_size": 83333,
      "close_rate": "33%",
      "win_rate": "75%",
      "activity_count": 104,
      "calls": 28,
      "emails": 44,
      "meetings": 32
    }
  ],
  "total": {
    "deals_created": 27,
    "deals_closed": 9,
    "total_revenue": 800000,
    "total_pipeline": 2250000
  }
}
```

---

## Tasks

### 1. Create Task
```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Follow-up call with Петров",
    "description": "Call Иван about contract details",
    "priority": "high",
    "status": "open",
    "due_date": "2026-09-25",
    "contact_id": "550e8400-e29b-41d4-a716-446655440002",
    "deal_id": "550e8400-e29b-41d4-a716-446655440100",
    "assigned_to": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440200",
  "title": "Follow-up call with Петров",
  "description": "Call Иван about contract details",
  "priority": "high",
  "status": "open",
  "due_date": "2026-09-25",
  "contact_id": "550e8400-e29b-41d4-a716-446655440002",
  "deal_id": "550e8400-e29b-41d4-a716-446655440100",
  "assigned_to": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2026-09-19T10:30:00Z"
}
```

---

### 2. List My Tasks
```bash
curl -X GET "http://localhost:3000/api/v1/tasks?status=open&assigned_to=me" \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440200",
      "title": "Follow-up call with Петров",
      "priority": "high",
      "status": "open",
      "due_date": "2026-09-25",
      "contact_name": "Иван Петров",
      "deal_name": "Enterprise Contract - 2026",
      "created_at": "2026-09-19T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}
```

---

### 3. Update Task Status
```bash
curl -X PATCH http://localhost:3000/api/v1/tasks/550e8400-e29b-41d4-a716-446655440200/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "status": "completed"
  }'
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440200",
  "title": "Follow-up call with Петров",
  "status": "completed",
  "completed_at": "2026-09-19T11:30:00Z",
  "updated_at": "2026-09-19T11:30:00Z"
}
```

---

## Error Handling

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Contact not found"
}
```

### 400 Bad Request
```json
{
  "error": "Email is required",
  "details": {
    "field": "email",
    "message": "This field is required"
  }
}
```

### 422 Validation Error
```json
{
  "errors": {
    "email": "Invalid email format",
    "phone": "Invalid phone format"
  }
}
```

### 500 Server Error
```json
{
  "error": "Internal server error",
  "requestId": "req_123456"
}
```

---

## Postman Collection

Import this into Postman for easier testing:

```json
{
  "info": {
    "name": "CRM Platform API",
    "version": "1.0"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api/v1"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}",
        "type": "string"
      }
    ]
  }
}
```

---

## Rate Limiting

All API endpoints are rate-limited:
- **Free Plan:** 100 requests/hour
- **Starter Plan:** 1,000 requests/hour
- **Professional Plan:** 10,000 requests/hour
- **Enterprise:** Unlimited

Response headers include:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1695123456
```

---

## Webhooks

Subscribe to events via webhooks:

```bash
curl -X POST http://localhost:3000/api/v1/webhooks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "url": "https://your-app.com/webhooks/crm",
    "events": ["contact.created", "deal.moved", "deal.won"],
    "active": true
  }'
```

**Events:**
- `contact.created`
- `contact.updated`
- `contact.deleted`
- `deal.created`
- `deal.updated`
- `deal.moved`
- `deal.won`
- `deal.lost`
- `activity.created`
- `task.created`
- `task.completed`
