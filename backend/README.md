# Richz HR Backend API

Backend API untuk aplikasi HR Dashboard menggunakan Next.js, Sequelize ORM, dan PostgreSQL.

## 🚀 Fitur

- **Authentication & Authorization**: JWT-based authentication dengan role-based access control
- **Employee Management**: CRUD operations untuk data karyawan
- **Contract Management**: Manajemen kontrak kerja (PKWT/PKWTT)
- **KPI Assessment**: Sistem penilaian kinerja karyawan
- **Salary Management**: Manajemen gaji dan komponen tunjangan
- **Department & Position**: Manajemen departemen dan posisi jabatan
- **Dashboard Statistics**: API untuk statistik dashboard

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm atau yarn

## 🔧 Installation

1. **Clone repository dan masuk ke folder backend**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit file `.env` sesuai konfigurasi database Anda:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=richz_hr_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key
```

4. **Setup database**
```bash
# Buat database PostgreSQL
createdb richz_hr_db

# Jalankan migrasi
npm run db:migrate

# Jalankan seeder (data demo)
npm run db:seed
```

5. **Jalankan development server**
```bash
npm run dev
```

API akan berjalan di `http://localhost:3001`

## 📚 API Documentation

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "role": "employee"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Employees

#### Get All Employees
```http
GET /api/employees?page=1&limit=10&search=john&department=Design&status=active
Authorization: Bearer <token>
```

#### Get Employee by ID
```http
GET /api/employees/1
Authorization: Bearer <token>
```

#### Create Employee
```http
POST /api/employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "departmentId": 1,
  "positionId": 1,
  "hireDate": "2024-01-15"
}
```

#### Update Employee
```http
PUT /api/employees/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John Updated",
  "status": "active"
}
```

#### Delete Employee
```http
DELETE /api/employees/1
Authorization: Bearer <token>
```

### Departments

#### Get All Departments
```http
GET /api/departments
Authorization: Bearer <token>
```

#### Create Department
```http
POST /api/departments
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Engineering",
  "description": "Software Engineering Department"
}
```

### KPI

#### Get All KPIs
```http
GET /api/kpi?page=1&limit=10&employeeId=1&quarter=1&year=2024&status=approved
Authorization: Bearer <token>
```

#### Get KPI by ID
```http
GET /api/kpi/1
Authorization: Bearer <token>
```

#### Create KPI
```http
POST /api/kpi
Authorization: Bearer <token>
Content-Type: application/json

{
  "employeeId": 1,
  "evaluatorId": 2,
  "period": "Q1-2024",
  "quarter": 1,
  "year": 2024,
  "overallScore": 4.2,
  "percentage": 84,
  "grade": "B+",
  "evaluationDate": "2024-04-15",
  "metrics": [
    {
      "category": "Productivity",
      "title": "Task Completion",
      "description": "Ability to complete tasks on time",
      "weight": 30,
      "target": 95,
      "achievement": 90,
      "score": 4.5,
      "status": "excellent"
    }
  ]
}
```

### Contracts

#### Get All Contracts
```http
GET /api/contracts?page=1&limit=10&status=active&type=PKWT&search=john
Authorization: Bearer <token>
```

#### Create Contract
```http
POST /api/contracts
Authorization: Bearer <token>
Content-Type: application/json

{
  "employeeId": 1,
  "contractType": "PKWT",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "duration": 12,
  "baseSalary": 8000000,
  "status": "active"
}
```

### Salaries

#### Get All Salaries
```http
GET /api/salaries?page=1&limit=10&search=john&department=Design
Authorization: Bearer <token>
```

#### Create Salary
```http
POST /api/salaries
Authorization: Bearer <token>
Content-Type: application/json

{
  "employeeId": 1,
  "baseSalary": 8000000,
  "totalSalary": 10000000,
  "effectiveDate": "2024-01-01",
  "components": [
    {
      "name": "Tunjangan Jabatan",
      "type": "percentage",
      "amount": 800000,
      "percentage": 10,
      "description": "10% dari gaji pokok"
    },
    {
      "name": "Tunjangan Transport",
      "type": "fixed",
      "amount": 500000,
      "description": "Tunjangan transport tetap"
    }
  ]
}
```

### Dashboard

#### Get Dashboard Statistics
```http
GET /api/dashboard/stats
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### Users
- id, username, email, password, role, isActive, lastLogin

### Employees  
- id, employeeId, userId, firstName, lastName, email, phone, dateOfBirth, gender, address, departmentId, positionId, managerId, hireDate, status, avatar

### Departments
- id, name, description, managerId, isActive

### Positions
- id, title, description, departmentId, level, isActive

### Contracts
- id, employeeId, contractType, startDate, endDate, duration, baseSalary, status, documentPath, notes, createdBy

### KPIs
- id, employeeId, evaluatorId, period, quarter, year, overallScore, maxScore, percentage, grade, status, notes, recommendations, actionPlan, nextReviewDate, evaluationDate

### KPI Metrics
- id, kpiId, category, title, description, weight, target, achievement, score, maxScore, status

### Salaries
- id, employeeId, baseSalary, totalSalary, effectiveDate, isActive, createdBy

### Salary Components
- id, salaryId, name, type, amount, percentage, description, isActive

## 🔐 Authentication & Authorization

API menggunakan JWT untuk authentication. Setiap request ke protected endpoint harus menyertakan header:

```
Authorization: Bearer <your-jwt-token>
```

### Roles:
- **admin**: Full access ke semua endpoint
- **manager**: Access ke employee management dan KPI
- **hr_staff**: Access ke employee, contract, dan salary management  
- **employee**: Read-only access ke data pribadi

## 🧪 Testing

### Demo Credentials:
- **Admin**: username: `admin`, password: `admin123`
- **HR Staff**: username: `hr_staff`, password: `admin123`
- **Manager**: username: `manager`, password: `admin123`

## 📝 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Database
npm run db:migrate      # Jalankan migrasi
npm run db:seed        # Jalankan seeder
npm run db:reset       # Reset database (undo migrations, migrate, seed)
```

## 🚀 Deployment

1. **Setup production database**
2. **Set environment variables**
3. **Run migrations**
```bash
npm run db:migrate
```
4. **Build and start**
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.