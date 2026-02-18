# Inceptra API

SvelteKit backend deployed on Cloudflare Workers with D1 (database) and R2 (file storage).

## Development

```bash
npm install
npm run dev           # Local dev server (Vite)
npm run dev:remote    # Build + Wrangler dev with remote D1/R2
```

## Deploying to Cloudflare

```bash
npm run build
npx wrangler deploy
```

---

## API Endpoints

### Base URL

- **Local**: `http://127.0.0.1:8787`
- **Production**: Your Cloudflare Workers domain

---

## 1. Health Check

### `GET /api/hello`

Simple health check endpoint.

**Response** `200 OK`

```json
{
  "message": "Hello from Cloudflare Workers!"
}
```

---

## 2. File Upload

### `POST /api/upload`

Uploads a file to Cloudflare R2 storage. Use this to upload payment screenshots or paper presentation files **before** registering.

**Content-Type**: `multipart/form-data`

| Field  | Type   | Required | Description            |
|--------|--------|----------|------------------------|
| `file` | `File` | ✅ Yes   | The file to upload     |

**Success Response** `200 OK`

```json
{
  "success": true,
  "key": "1708271234567-screenshot.png"
}
```

> ⚠️ Save the returned `key` — you'll need it for the `payment_screenshot_key` or `paperFile` field in the registration request.

**Error Responses**

| Status | Body |
|--------|------|
| `400`  | `{ "error": "No file uploaded" }` |
| `500`  | `{ "error": "Upload failed" }` |

---

## 3. Retrieve Uploaded File

### `GET /api/image/:key`

Retrieves a file from R2 storage by its key.

| Param | Type     | Required | Description                  |
|-------|----------|----------|------------------------------|
| `key` | `string` | ✅ Yes   | The R2 key from upload       |

**Success Response** `200 OK` — Returns the file binary with correct `Content-Type` headers.

**Error Responses**

| Status | Body |
|--------|------|
| `400`  | `Missing key` |
| `404`  | `Not found` |
| `500`  | `Internal Server Error` |

---

## 4. Event Registration

### `POST /api/register`

Single registration endpoint for all event types: **Symposium (Technical)**, **Cultural**, and **Hackathon**. The required fields vary based on `registrationType`.

**Content-Type**: `application/json`

---

### Common Fields (All Registration Types)

| Field                    | Type     | Required | Description                                       |
|--------------------------|----------|----------|---------------------------------------------------|
| `name`                   | `string` | ✅ Yes   | Full name of the participant                      |
| `id`                     | `string` | ✅ Yes   | College ID number                                 |
| `email`                  | `string` | ✅ Yes   | Email address                                     |
| `phone`                  | `string` | ✅ Yes   | Phone number                                      |
| `year`                   | `string` | ✅ Yes   | Year of study (e.g., `"1st"`, `"2nd"`, `"3rd"`, `"4th"`) |
| `college`                | `string` | ✅ Yes   | College name                                      |
| `address`                | `string` | ✅ Yes   | Address                                           |
| `food`                   | `string` | ✅ Yes   | Food preference (e.g., `"veg"`, `"non-veg"`)      |
| `registrationType`       | `string` | ✅ Yes   | One of: `"symposium"`, `"cultural"`, `"hackathon"` |
| `amount`                 | `number` | ✅ Yes   | Registration fee amount                           |
| `transactionId`          | `string` | ❌ No    | Payment transaction ID (if online)                |
| `payment_screenshot_key` | `string` | ❌ No    | R2 key from `/api/upload` (for online payments)   |
| `user_id`                | `string` | ❌ No    | Authenticated user ID for mapping                 |

---

### 4a. Symposium / Technical Event Registration

Set `registrationType` to `"symposium"`.

**Additional Fields**

| Field    | Type     | Required       | Description                                  |
|----------|----------|----------------|----------------------------------------------|
| `studentDept` | `string` | ✅ Yes    | Participant's Department (e.g., `"CSE"`, `"ECE"`) |
| `targetDept`  | `string` | ✅ Yes    | Target/Organizing Department (e.g., `"CSE"`) |
| `events` | `object` | ✅ Yes         | Object containing selected event arrays       |
| `events.technical`    | `string[]` | ✅ Yes | List of technical event names            |
| `events.nonTechnical` | `string[]` | ❌ No  | List of non-technical event names        |

**Paper Presentation Fields** *(only if participating in paper presentation)*

| Field        | Type     | Required | Description                                   |
|--------------|----------|----------|-----------------------------------------------|
| `paperTitle` | `string` | ❌ No    | Title of the paper                            |
| `paperFile`  | `string` | ❌ No    | R2 key of uploaded paper file from `/api/upload` |

**Example Request**

```json
{
  "name": "Sathish Kumar",
  "id": "CS2024001",
  "email": "sathish@college.edu",
  "phone": "9876543210",
  "year": "3rd",
  "college": "ABC Engineering College",
  "address": "Chennai, Tamil Nadu",
  "food": "veg",
  "registrationType": "symposium",
  "studentDept": "CSE",
  "targetDept": "ECE",
  "events": {
    "technical": ["Paper Presentation", "Debugging"],
    "nonTechnical": ["Quiz"]
  },
  "amount": 300,
  "transactionId": "TXN123456789",
  "payment_screenshot_key": "1708271234567-screenshot.png",
  "user_id": "auth_user_123",
  "paperTitle": "AI in Healthcare",
  "paperFile": "1708271234999-paper.pdf"
}
```

---

### 4b. Cultural Event Registration

Set `registrationType` to `"cultural"`.

**Additional Fields**

| Field    | Type     | Required | Description                          |
|----------|----------|----------|--------------------------------------|
| `studentDept` | `string` | ❌ No | Participant's Department |
| `dept`   | `string` | ❌ No    | (Deprecated) |
| `events` | `object` | ✅ Yes   | Object containing cultural events    |
| `events.cultural` | `string[]` | ✅ Yes | List of cultural event names    |

**Example Request**

```json
{
  "name": "Priya Sharma",
  "id": "EC2024015",
  "email": "priya@college.edu",
  "phone": "9123456789",
  "year": "2nd",
  "college": "XYZ Engineering College",
  "address": "Madurai, Tamil Nadu",
  "food": "non-veg",
  "registrationType": "cultural",
  "events": {
    "cultural": ["Dance", "Singing", "Fashion Show"]
  },
  "amount": 200,
  "transactionId": "TXN987654321",
  "payment_screenshot_key": "1708271235000-pay.jpg",
  "user_id": "auth_user_456"
}
```

---

### 4c. Hackathon Registration

Set `registrationType` to `"hackathon"`.

**Additional Fields**

| Field            | Type     | Required | Description                                      |
|------------------|----------|----------|--------------------------------------------------|
| `studentDept`    | `string` | ✅ Yes   | Participant's Department                         |
| `hackathonTopic` | `string` | ✅ Yes   | Topic / project name for the hackathon           |
| `hackathonType`  | `string` | ✅ Yes   | Either `"hardware"` or `"software"`              |

**Example Request**

```json
{
  "name": "Vimal Raj",
  "id": "ME2024010",
  "email": "vimal@college.edu",
  "phone": "9988776655",
  "year": "4th",
  "college": "PQR Engineering College",
  "address": "Coimbatore, Tamil Nadu",
  "food": "veg",
  "registrationType": "hackathon",
  "studentDept": "MECH",
  "events": {},
  "amount": 500,
  "transactionId": "TXN456123789",
  "payment_screenshot_key": "1708271236000-receipt.png",
  "user_id": "auth_user_789",
  "hackathonTopic": "AI-based Crop Disease Detection",
  "hackathonType": "software"
}
```

---

### Registration Success Response `200 OK`

```json
{
  "success": true,
  "id": 42
}
```

### Registration Error Response `500`

```json
{
  "error": "Failed to save registration"
}
```

---

## 5. Get User Registrations

### `GET /api/user/registrations?userId=<userId>`

Fetches all registrations for a specific user.

| Query Param | Type     | Required | Description          |
|-------------|----------|----------|----------------------|
| `userId`    | `string` | ✅ Yes   | The user ID to query |

**Success Response** `200 OK`

```json
{
  "registrations": [
    {
      "id": 1,
      "name": "Sathish Kumar",
      "college_id": "CS2024001",
      "email": "sathish@college.edu",
      "phone": "9876543210",
      "year": "3rd",
      "college": "ABC Engineering College",
      "address": "Chennai, Tamil Nadu",
      "food": "veg",
      "registration_type": "symposium",
      "student_dept": "CSE",
      "target_dept": "ECE",
      "technical_events": ["Paper Presentation", "Debugging"],
      "non_technical_events": ["Quiz"],
      "cultural_events": [],
      "amount": 300,
      "transaction_id": "TXN123456789",
      "payment_screenshot_key": "1708271234567-screenshot.png",
      "payment_mode": "online",
      "payment_status": "pending",
      "user_id": "auth_user_123",
      "paper_title": "AI in Healthcare",
      "paper_file": "1708271234999-paper.pdf",
      "hackathon_topic": null,
      "hackathon_type": null,
      "created_at": "2026-02-18T15:00:00.000Z"
    }
  ]
}
```

**Error Responses**

| Status | Body |
|--------|------|
| `400`  | `{ "error": "Missing userId parameter" }` |
| `500`  | `{ "error": "Database error" }` |

---

## 6. Admin Endpoints

### 6a. Get All Registrations

### `GET /api/admin/registrations`

Fetches ALL registrations (for admin dashboard).

**Success Response** `200 OK`
Returns same structure as User Registrations, but for all users.

### 6b. Verify Payment

### `POST /api/admin/verify-payment`

Updates the payment status of a registration.

**Content-Type**: `application/json`

| Field    | Type     | Required | Description                               |
|----------|----------|----------|-------------------------------------------|
| `id`     | `number` | ✅ Yes   | Registration ID                           |
| `status` | `string` | ✅ Yes   | One of: `"pending"`, `"verified"`, `"rejected"` |

**Example Request**

```json
{
  "id": 42,
  "status": "verified"
}
```

**Success Response** `200 OK`

```json
{
  "success": true,
  "message": "Payment status updated to verified"
}
```


---

## Registration Flow (Step-by-Step)

### For Online Payment:

1. **Upload payment screenshot**
   ```
   POST /api/upload  →  get back { key }
   ```

2. **Upload paper file** *(only for paper presentation)*
   ```
   POST /api/upload  →  get back { key }
   ```

3. **Register**
   ```
   POST /api/register  →  include both keys in the body
   ```

### For Offline Payment:

1. **Upload paper file** *(only if paper presentation)*
   ```
   POST /api/upload  →  get back { key }
   ```

2. **Register** *(skip `payment_screenshot_key`)*
   ```
   POST /api/register
   ```

---

## Database Schema

See [`schema.sql`](./schema.sql) for the full table definition.

| Column                   | Type      | Notes                                |
|--------------------------|-----------|--------------------------------------|
| `id`                     | `INTEGER` | Auto-increment primary key           |
| `name`                   | `TEXT`    | NOT NULL                             |
| `college_id`             | `TEXT`    | NOT NULL                             |
| `email`                  | `TEXT`    | NOT NULL                             |
| `phone`                  | `TEXT`    | NOT NULL                             |
| `year`                   | `TEXT`    | NOT NULL                             |
| `college`                | `TEXT`    | NOT NULL                             |
| `address`                | `TEXT`    | NOT NULL                             |
| `food`                   | `TEXT`    | NOT NULL                             |
| `registration_type`      | `TEXT`    | NOT NULL — `symposium` / `cultural` / `hackathon` |
| `student_dept`           | `TEXT`    | Registrant's department              |
| `target_dept`            | `TEXT`    | Target/Organizing department         |
| `technical_events`       | `TEXT`    | JSON array string, default `[]`      |
| `non_technical_events`   | `TEXT`    | JSON array string, default `[]`      |
| `cultural_events`        | `TEXT`    | JSON array string, default `[]`      |
| `amount`                 | `INTEGER` | NOT NULL                             |
| `payment_screenshot_key` | `TEXT`    | R2 key                               |
| `payment_mode`           | `TEXT`    | Default `online`                     |
| `payment_status`         | `TEXT`    | Default `pending`                    |
| `user_id`                | `TEXT`    | Auth user mapping                    |
| `paper_title`            | `TEXT`    | Paper presentation title             |
| `paper_file`             | `TEXT`    | R2 key of paper file                 |
| `hackathon_topic`        | `TEXT`    | Hackathon project topic              |
| `hackathon_type`         | `TEXT`    | `hardware` or `software`             |
| `created_at`             | `DATETIME`| Auto-set on insert                  |
