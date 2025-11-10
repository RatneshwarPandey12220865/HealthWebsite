# Doctor Appointment Booking System

A full-stack web application for managing doctor appointments with role-based access control for patients, doctors, and administrators.

## Features

### Admin Panel
- View all doctors with approval status
- Approve/reject doctor registrations
- Delete doctors
- View all appointments
- Dashboard statistics

### Doctor Portal
- Create/update profile with image upload
- Set available time slots
- View scheduled appointments
- Update appointment status
- Manage profile information

### Patient Portal
- Browse approved doctors by specialization
- Book appointments with available time slots
- View appointment history
- Cancel appointments

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads
- CORS enabled

### Frontend
- React.js with Hooks
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Axios for API calls

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd doctor-appointment-system/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/doctor-appointment
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd doctor-appointment-system/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Install and configure Tailwind CSS:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

4. Start the frontend development server:
```bash
npm start
```

## Default User Accounts

You can register users with these roles:

### Admin Account
```json
{
  "name": "Admin User",
  "email": "admin@healthcare.com",
  "password": "admin123",
  "phone": "1234567890",
  "role": "admin"
}
```

### Doctor Account
```json
{
  "name": "Dr. John Smith",
  "email": "doctor@healthcare.com",
  "password": "doctor123",
  "phone": "9876543210",
  "role": "doctor"
}
```

### Patient Account
```json
{
  "name": "Jane Patient",
  "email": "patient@healthcare.com",
  "password": "patient123",
  "phone": "5555555555",
  "role": "patient"
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Admin Routes (Protected)
- `GET /api/admin/doctors` - Get all doctors
- `PUT /api/admin/doctors/:id/approve` - Approve doctor
- `DELETE /api/admin/doctors/:id` - Delete doctor
- `GET /api/admin/appointments` - Get all appointments
- `GET /api/admin/stats` - Get dashboard stats

### Doctor Routes (Protected)
- `GET /api/doctor/profile` - Get doctor profile
- `POST /api/doctor/profile` - Update doctor profile
- `PUT /api/doctor/slots` - Set available slots
- `GET /api/doctor/appointments` - Get doctor appointments
- `PUT /api/doctor/appointments/:id` - Update appointment

### Patient Routes (Protected)
- `GET /api/patient/doctors` - Get all approved doctors
- `GET /api/patient/doctors/:id` - Get doctor by ID
- `POST /api/patient/appointments` - Book appointment
- `GET /api/patient/appointments` - Get patient appointments
- `PUT /api/patient/appointments/:id/cancel` - Cancel appointment

## Project Structure

```
doctor-appointment-system/
├── backend/
│   ├── config/
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   └── Appointment.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── doctorController.js
│   │   └── patientController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── doctor.js
│   │   └── patient.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── AdminDashboard.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   └── axios.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Protected routes
- File upload validation
- CORS enabled
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@healthcare.com or create an issue in the repository.