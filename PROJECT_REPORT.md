# SCSP Project Report

## 1. Executive Summary

SCSP is a student scholarship platform prototype. Its goal is to help students discover, register for, and apply for scholarship opportunities through a guided web experience.

The project currently contains:

- A React and Vite frontend for public pages, authentication screens, and a multi-step scholarship application form.
- A Django REST Framework backend for student registration, JWT login, and profile access.
- A local SQLite database and Django migrations for a basic `Student` profile model.
- Static institute, district, taluka, qualification, and stream data used by the scholarship application form.
- GitHub Actions workflows for frontend build checks, backend Django checks, and GitHub Pages frontend deployment.
- Debugging scripts and documentation related to a previously fixed registration/login issue.

At its current stage, the project is best described as an early full-stack scholarship portal prototype. Authentication is partly implemented end to end, while the scholarship application flow is mostly frontend-only and not yet persisted to the backend.

## 2. Product Purpose

The project presents SCSP as "A Smarter Scholarship Platform That Solves Real Problems." The product intent is to reduce confusion around scholarship discovery and application by giving students a guided, profile-based application experience.

The homepage positions the platform around three main promises:

- Accurate matching: scholarship results tailored to a student's profile.
- AI guidance: step-by-step help through eligibility and application requirements.
- Verified data: updated scholarship data from trusted government and private sources.

The current codebase does not yet implement AI matching or scholarship recommendation logic. Those are product goals expressed in the UI copy and future-facing project direction.

## 3. User-Facing Scope

The frontend currently supports these user-visible areas:

- Home page
- Register page
- Login page
- Forgot password page
- Scholarship application form at `/apply`
- Navigation bar with authentication-aware login/register/logout display

There are also component files for:

- Dashboard
- About page
- Contact page
- Login test page

However, `Dashboard`, `About`, `Contact`, and `Login_test` are not currently registered in the main React route table.

## 4. Technology Stack

### Frontend

- React 19
- Vite 7
- React Router DOM 7
- Axios
- Vitest and Testing Library listed for tests
- CSS modules/files for page-specific styling

Primary frontend location:

```text
Frontend/
```

### Backend

- Django
- Django REST Framework
- django-cors-headers
- SimpleJWT is used by the code, but missing from `Backend/requirements.txt`
- SQLite database

Primary backend location:

```text
Backend/
```

### Other

The repository also includes a small C++/SFML scaffold:

```text
main.cpp
CMakeLists.txt
```

This appears unrelated to the scholarship platform and is likely leftover or experimental code.

## 5. Repository Structure

```text
SCSP/
├── Backend/
│   ├── accounts/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── migrations/
│   │   └── tests/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── manage.py
│   ├── requirements.txt
│   ├── pytest.ini
│   ├── db.sqlite3
│   └── log files
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── components/
│   │   ├── institute/
│   │   ├── pages/
│   │   ├── test/
│   │   └── utils/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── vitest.config.js
├── .github/workflows/
├── PLAN.md
├── TODO.md
├── test_login.js
├── fixed_login_test.js
├── comprehensive_login_test.js
├── main.cpp
└── CMakeLists.txt
```

## 6. Frontend Architecture

The React app is initialized in:

```text
Frontend/src/main.jsx
```

The main app shell is in:

```text
Frontend/src/App.jsx
```

`App.jsx` wraps the application in `AuthProvider`, mounts a shared `Navbar`, and defines these routes:

| Route | Component | Purpose |
| --- | --- | --- |
| `/` | `Home` | Landing/home page |
| `/login` | `Login` | User login |
| `/register` | `Register` | User registration |
| `/forgot-password` | `ForgotPassword` | Placeholder password reset screen |
| `/apply` | `ScholarshipForm` | Multi-step scholarship application form |

### Authentication State

Authentication is handled in:

```text
Frontend/src/auth/AuthContext.jsx
```

It stores JWTs in local storage under:

```text
scsp_access
scsp_refresh
```

It also attaches the access token to Axios requests through:

```text
Frontend/src/api/axios.js
```

The Axios client currently uses a hardcoded backend URL:

```text
http://127.0.0.1:8000
```

This works for local development but will not work for a static GitHub Pages deployment unless the backend is separately hosted and the frontend is reconfigured.

### Navigation

The navigation bar is in:

```text
Frontend/src/components/NavBar.jsx
```

It shows:

- Home link
- Register/Login links for anonymous users
- User email and Logout button for authenticated users

The displayed user email comes from the `/api/accounts/profile/` backend endpoint.

## 7. Scholarship Application Flow

The scholarship form lives in:

```text
Frontend/src/pages/scholarship/
```

The main coordinator is:

```text
ScholarshipForm.jsx
```

It renders a three-step flow:

| Step | Component | Purpose |
| --- | --- | --- |
| 1 | `Step1Personal.jsx` | Personal, address, social, income, domicile, and bank details |
| 2 | `Step2Eligibility.jsx` | Caste, disability, and certificate eligibility details |
| 3 | `Step3Course.jsx` | Current course, institute, stream, merit, and document details |

### Step 1: Personal Details

Step 1 collects:

- Applicant name
- Name as per SSC/LC
- Email
- Mobile number
- Parent/guardian mobile
- Aadhaar number
- Aadhaar upload
- Address, city, state, district
- Marital status
- Religion
- Caste category
- Family annual income
- Caste certificate when applicable
- Income certificate details
- Domicile certificate details
- Bank name, account number, and IFSC

Most Step 1 fields are currently uncontrolled inputs and are not persisted into the shared `formData` state.

### Step 2: Eligibility Verification

Step 2 collects:

- Caste category
- Disability status
- Disability certificate when applicable
- Caste certificate information when applicable
- Non-creamy layer certificate for selected categories
- Caste validity certificate for SC/ST
- EWS and income certificates for EWS

Some Step 2 values are stored in `formData`, but many supporting certificate fields remain uncontrolled.

### Step 3: Course Details

Step 3 collects:

- Admission year
- Institute state
- Institute district
- Institute taluka
- Qualification level
- Stream
- College/school name
- Course name
- CET/merit percentage
- Merit document upload

It filters institute options from the local institute JSON dataset based on district.

### File Upload Validation

File validation appears in:

```text
Frontend/src/utils/fileValidator.js
```

The shared validator allows only files between 100 KB and 200 KB. The UI copy indicates accepted file types are JPEG, JPG, and PDF. The actual file type restriction is handled by input `accept` attributes rather than a central validator.

## 8. Local Data

The form uses several local datasets:

```text
Frontend/src/utils/stateDistrictTaluka.js
Frontend/src/utils/qualificationLevels.js
Frontend/src/utils/streams.js
Frontend/src/institute/*.json
```

The institute dataset is split across nine JSON files and is combined in:

```text
Frontend/src/institute/index.js
```

Current institute data scale:

- 9 JSON files
- 154 institute records total
- Records include institute name, code, state, district, taluka, streams, and qualification levels

There is also a smaller sample file:

```text
Frontend/src/utils/institutesData.js
```

That file contains a small hardcoded sample and does not appear to be the dataset used by `Step3Course`.

## 9. Backend Architecture

The Django project is under:

```text
Backend/
```

The main project config is:

```text
Backend/config/
```

The main app is:

```text
Backend/accounts/
```

### Backend Apps

Installed apps include:

- Django admin/auth/session/static apps
- `rest_framework`
- `corsheaders`
- `accounts`

### Database

The backend uses SQLite:

```text
Backend/db.sqlite3
```

The database file is currently tracked by Git.

### CORS

CORS is configured for local frontend origins:

```text
http://localhost:5173
http://127.0.0.1:5173
http://localhost:5174
http://127.0.0.1:5174
http://localhost:3000
http://127.0.0.1:3000
```

### Authentication

The backend uses JWT authentication through SimpleJWT:

```text
rest_framework_simplejwt.authentication.JWTAuthentication
```

Access tokens are configured for 30 minutes. Refresh tokens are configured for 7 days.

Important dependency issue:

```text
djangorestframework-simplejwt
```

is imported and used by the code, but is not listed in `Backend/requirements.txt`.

## 10. Backend Data Model

The main custom model is:

```text
Backend/accounts/models.py
```

### Student

The `Student` model extends Django's built-in `User` through a one-to-one relationship.

Fields:

- `user`
- `full_name`
- `mobile`
- `date_of_birth`
- `gender`
- `address`
- `category`
- `caste`
- `annual_income`
- `created_at`

Registration creates both:

- a Django `User`
- a linked `Student`

## 11. Backend API

Main URL registration:

```text
Backend/config/urls.py
```

Accounts URLs:

```text
Backend/accounts/urls.py
```

### API Endpoints

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/` | Public | Backend health/status response |
| POST | `/api/accounts/register/` | Public | Register a new user/student |
| POST | `/api/accounts/login/` | Public | Authenticate user and return JWT tokens |
| GET | `/api/accounts/profile/` | Required | Return current student's profile |
| PUT | `/api/accounts/profile/update/` | Required | Update current student's profile |

### Register Request

Expected fields:

- `full_name`
- `username`
- `email`
- `mobile`
- `password`

The serializer validates unique username and unique email.

### Login Request

Expected fields:

- `username`
- `password`

Successful response includes:

- `access`
- `refresh`
- `username`
- `email`

### Profile Response

The current serializer returns:

- `id`
- `username`
- `email`
- `full_name`
- `mobile`

Although the `Student` model contains more profile fields, the serializer does not currently expose them.

## 12. Testing

### Frontend Tests

Frontend test config:

```text
Frontend/vitest.config.js
Frontend/src/test/setup.js
Frontend/src/test/App.test.jsx
```

The current test checks that the home page renders "Explore Scholarships".

Command attempted:

```text
npm test
```

Result:

```text
vitest: command not found
```

Reason: local frontend dependencies are not currently installed in `Frontend/node_modules`, or the local install is incomplete. `vitest` is listed in `package.json`.

### Backend Tests

Backend currently has a placeholder pytest test:

```text
Backend/accounts/tests/test_basic.py
```

It only asserts:

```python
assert 1 == 1
```

Django system check was run successfully:

```text
python3 manage.py check
```

Result:

```text
System check identified no issues (0 silenced).
```

### Manual Debug Scripts

The repository includes manual Node scripts for login testing:

```text
test_login.js
fixed_login_test.js
comprehensive_login_test.js
```

These scripts test login, token generation, profile access, wrong credentials, and CORS behavior against a locally running backend.

## 13. CI/CD

GitHub Actions workflows live in:

```text
.github/workflows/
```

### `scsp-ci.yml`

Runs on pushes and pull requests to `main`.

Frontend job:

- Checkout
- Setup Node 20
- `npm install`
- `npm run build`

Backend job:

- Checkout
- Setup Python 3.11
- Install `Backend/requirements.txt`
- Run `python manage.py check`

Potential issue: backend CI may fail unless `djangorestframework-simplejwt` is added to `Backend/requirements.txt`.

### `scsp-deploy-frontend.yml`

Runs on pushes to `main`.

It builds the frontend and deploys `Frontend/dist` to GitHub Pages.

The Vite config sets:

```js
base: "/SCSP/"
```

This is appropriate for a GitHub Pages project site at `/SCSP/`.

## 14. Current Implementation Status

### Implemented

- React application shell
- Main navigation
- Home page
- Registration UI
- Login UI
- Forgot password placeholder UI
- Authentication context with token storage
- Axios API client with JWT authorization header support
- Django registration endpoint
- Django login endpoint returning JWT tokens
- Django authenticated profile endpoint
- Student profile model
- Admin registration for Student
- Three-step scholarship form UI
- Local institute/district/taluka/stream/qualification data
- GitHub Actions for frontend/backend checks
- GitHub Pages deployment workflow

### Partially Implemented

- Scholarship application data entry: UI exists, but most fields are not persisted or submitted.
- Profile update endpoint: backend endpoint exists, but serializer exposes only a limited subset of profile fields.
- Protected routes: helper exists, but `/apply` is not wrapped with it.
- Forgot password: UI exists, but no backend reset flow exists.
- Dashboard: component exists, but it is not routed.
- Contact/About pages: components exist, but they are not routed.
- File upload: UI and size checks exist, but files are not uploaded to the backend.

### Not Yet Implemented

- Scholarship listing/search page
- Scholarship matching engine
- AI guidance functionality
- Application submission API
- Application status tracking
- Notification system
- Persistent document storage
- Password reset email flow
- Production backend configuration
- Environment-based frontend API URL
- Real backend-hosted scholarship/institute data management

## 15. Notable Issues and Risks

### Dependency Gap

`rest_framework_simplejwt` is required by the code but missing from `Backend/requirements.txt`.

Recommended fix:

```text
djangorestframework-simplejwt
```

### Hardcoded API URL

The frontend hardcodes:

```text
http://127.0.0.1:8000
```

This will break outside local development. Use an environment variable such as:

```text
VITE_API_BASE_URL
```

### Scholarship Form Does Not Submit

The `/apply` flow does not currently send data to the backend. It is mostly a frontend prototype.

### Step 3 Back Button Prop Mismatch

`ScholarshipForm.jsx` passes `prev` to `Step3Course`, but `Step3Course.jsx` expects `prevStep`.

Current result: the Step 3 Back button receives `undefined`.

### Step 3 Next Button Goes to Missing Step

Step 3 calls:

```js
setStep(4)
```

No Step 4 is currently rendered.

### Protected Route Not Applied

`ProtectedRoute.jsx` exists, but `/apply` is currently public.

### Debug Logging and Sensitive Data

Login flow logs request details and credentials in the browser console and backend logs. This is useful during debugging but should be removed or reduced before production.

### Tracked Database and Logs

The repository currently tracks:

```text
Backend/db.sqlite3
Backend/*.log
```

For a production-ready repository, these should usually be ignored unless intentionally committed as seed/demo artifacts.

### Incomplete Test Coverage

The backend test is only a placeholder, and the frontend test suite cannot run until dependencies are installed.

### Production Security

`SECRET_KEY` is hardcoded and `DEBUG = True`. These are acceptable for local development but not production.

## 16. Recommended Next Steps

1. Add missing backend dependency: `djangorestframework-simplejwt`.
2. Move backend URL into `VITE_API_BASE_URL`.
3. Wire `/apply` through `ProtectedRoute` if only logged-in students should apply.
4. Fix the `Step3Course` `prev`/`prevStep` mismatch.
5. Decide what Step 4 should be, or make Step 3 the final review/submit step.
6. Convert all scholarship form fields into controlled state.
7. Add backend models for scholarship applications and uploaded documents.
8. Add API endpoints for draft save, final submit, document upload, and application status.
9. Expand `StudentSerializer` or add a dedicated profile serializer for all profile fields.
10. Remove credential/request debug logging before production use.
11. Add root `.gitignore` entries for SQLite databases, logs, local env files, and generated artifacts.
12. Add meaningful backend API tests for register, login, profile, and application submission.
13. Install frontend dependencies and run `npm test` and `npm run build`.
14. Configure a hosted backend before relying on the GitHub Pages frontend deployment.

## 17. How to Run Locally

### Backend

```bash
cd Backend
python3 -m pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver 127.0.0.1:8000
```

Add this dependency first if it is not already installed in the Python environment:

```bash
python3 -m pip install djangorestframework-simplejwt
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend expects the backend at:

```text
http://127.0.0.1:8000
```

## 18. Overall Assessment

SCSP is a promising early-stage scholarship platform with a clear product direction and the beginnings of a full-stack architecture. The strongest implemented area is registration/login with JWT-based authentication. The most developed user-facing area is the scholarship application form UI, especially eligibility and institute/course selection.

The main gap is that the scholarship workflow has not yet crossed from frontend prototype into backend-backed application processing. To become a functional scholarship platform, the next major milestone should be persistence: application models, document upload handling, form submission APIs, and status tracking. After that, the product can move toward its stated vision of scholarship matching, verified data, and AI-guided application support.
