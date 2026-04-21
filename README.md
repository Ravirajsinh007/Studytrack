<<<<<<< HEAD
# EduTrack - Learning Management System

A complete, fully functional Learning Management System (LMS) built with Django (backend) and AngularJS (frontend). Features JWT authentication, course management, assignments, grading, and announcements.

## 🎯 Features

### ✅ Student Features
- **Dashboard**: View enrolled courses, progress tracking, upcoming deadlines, recent activity, and announcements
- **Assignments Page**: Browse courses, view all assignments with due dates, submit files with status tracking
- **Grades Page**: View all submissions with marks, feedback, and submission status
- **Search & Filter**: Search courses by title/instructor, filter assignments by status
- **Real-time API Integration**: All data fetched from backend API (no dummy data)

### ✅ Instructor Features
- **Dashboard**: Overview of all courses, pending grading count, recent announcements, course metrics
- **Grading Page**: 
  - Select courses and view all submissions
  - Filter submissions by status (pending, graded, all)
  - Grade submissions with marks and feedback
  - Track grading progress
- **Announcements Management**: 
  - Create announcements for courses
  - View all announcements for managed courses
  - Real-time updates

### ✅ Authentication & Security
- JWT-based authentication with Simple JWT
- Token storage in localStorage
- Auto logout on token expiration
- Protected routes for students and instructors
- Separate role-based access (is_staff flag)

### ✅ Backend API (Django REST Framework)
- Complete REST API with proper error handling
- All endpoints protected with JWT authentication
- Proper serialization and validation
- CORS support for frontend

## 📊 Database Models

```
User (Django default)
├── Groups: Instructor, Student

Course
├── title
├── description
├── instructor (FK to User)
├── created_at

Enrollment
├── student (FK to User)
├── course (FK to Course)
├── enrolled_at

Module
├── course (FK to Course)
├── title
├── content
├── resource_link
├── order

Assignment
├── course (FK to Course)
├── title
├── description
├── due_date
├── max_marks

Submission
├── assignment (FK to Assignment)
├── student (FK to User)
├── file
├── submitted_at
├── status (submitted, under_review, graded)
├── marks_obtained
├── feedback
├── graded_at

Announcement
├── course (FK to Course)
├── title
├── message
├── created_at
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip
- Node.js (optional, for frontend server)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

4. **Create sample data:**
   ```bash
   python manage.py shell -c "exec(open('populate_data.py').read())"
   ```

5. **Start the Django server:**
   ```bash
   python manage.py runserver 8000
   ```

   Server will run at: `http://127.0.0.1:8000/`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Start a simple HTTP server:**
   ```bash
   python -m http.server 4200
   ```
   
   OR using Node:
   ```bash
   npx http-server -p 4200
   ```

   Frontend will be available at: `http://localhost:4200/`

### Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://127.0.0.1:8000
- **Django Admin**: http://127.0.0.1:8000/admin

## 👥 Sample Users

### Login Credentials

**Admin Dashboard:**
- Username: `admin`
- Password: `admin123`
- Role: Administrator
- Access: Django admin panel

**Instructor:**
- Username: `instructor`
- Password: `pass123`
- Role: Faculty/Instructor
- Access: Dashboard, Grading, Announcements

**Student 1:**
- Username: `student1`
- Password: `pass123`
- Role: Student
- Access: Dashboard, Assignments, Grades

**Student 2:**
- Username: `student2`
- Password: `pass123`
- Role: Student
- Access: Dashboard, Assignments, Grades

## 📡 API Endpoints

### Authentication
```
POST /api/auth/login/
- Request: { "username": "...", "password": "..." }
- Response: { "access": "jwt_token", "refresh": "refresh_token" }

POST /api/auth/refresh/
- Request: { "refresh": "refresh_token" }
- Response: { "access": "new_jwt_token" }
```

### Courses
```
GET /api/courses/
- Authorization: Bearer {token}
- Response: [{ id, title, description, instructor_name, module_count }, ...]

GET /api/courses/announcements/
- Authorization: Bearer {token}
- Response: [{ id, title, message, course_title, course_id, created_at }, ...]

POST /api/courses/announcements/create/
- Authorization: Bearer {token}
- Request: { "course_id": 1, "title": "...", "message": "..." }
- Response: { id, title, message, course_title, created_at, message: "success" }
```

### Assignments
```
GET /api/assignments/course/<id>/
- Authorization: Bearer {token}
- Response: [{ id, title, description, due_date, max_marks, submitted }, ...]

POST /api/assignments/submit/<id>/
- Authorization: Bearer {token}
- Multipart Form: file
- Response: { "message": "Submitted successfully" }

GET /api/assignments/submissions/
- Authorization: Bearer {token}
- Response: [{ id, assignment_title, course_title, status, marks_obtained, feedback, ... }, ...]

GET /api/assignments/instructor/course/<id>/
- Authorization: Bearer {token}
- Response: [{ id, assignment_id, assignment_title, student_name, student_id, status, marks_obtained, feedback, ... }, ...]

PATCH /api/assignments/grade/<id>/
- Authorization: Bearer {token}
- Request: { "marks_obtained": 85, "feedback": "..." }
- Response: { id, marks_obtained, status: "graded" }
```

## 🎨 UI Design

### Color Scheme
- **Primary Blue**: #4f7cff
- **Secondary Colors**: Teal, Amber, Purple, Green
- **Background**: Dark modern theme (#0a0e27)
- **Cards**: Soft dark (#111633)
- **Borders**: Subtle (#1f2544)

### Typography
- **Font**: Sora (Google Fonts)
- **Monospace**: DM Mono

### Layout
- **Sidebar Navigation**: 240px fixed left sidebar
- **Main Content**: Responsive grid layout
- **Cards & Panels**: Rounded corners, hover effects
- **Grid System**: CSS Grid with flexbox
- **Responsive**: Mobile-friendly design

## 📁 Project Structure

```
edutrack/
├── backend/
│   ├── edutrack/              # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── courses/               # Courses & announcements app
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── assignments/           # Assignments & submissions app
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── users/                 # User management
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── announcements/         # Announcements app
│   │   ├── models.py
│   │   └── admin.py
│   ├── db.sqlite3
│   ├── manage.py
│   ├── populate_data.py       # Sample data generator
│   └── requirements.txt
├── frontend/
│   ├── index.html             # Main file with CSS
│   ├── app.js                 # AngularJS app configuration
│   ├── controllers/
│   │   ├── loginController.js
│   │   ├── studentController.js
│   │   └── instructorController.js
│   └── views/
│       ├── login.html
│       ├── student-dashboard.html
│       ├── student-assignments.html
│       ├── student-grades.html
│       ├── instructor-dashboard.html
│       └── instructor-grading.html
├── media/
│   └── submissions/           # Uploaded assignment files
└── README.md
```

## 🔧 Technologies Used

### Backend
- **Django 6.0.4** - Web framework
- **Django REST Framework 3.17.1** - REST API
- **Simple JWT 5.5.1** - JWT authentication
- **django-cors-headers 4.9.0** - CORS support
- **Pillow 12.2.0** - Image handling
- **SQLite3** - Database

### Frontend
- **AngularJS 1.8** - Frontend framework
- **HTML5** - Markup
- **CSS3** - Styling
- **JavaScript** - Logic

## ✨ Key Features Implemented

### ✅ Complete Authentication
- JWT-based login/logout
- Token refresh mechanism
- Auto-redirect on unauthorized access
- Role-based access control

### ✅ Dashboard Analytics
- Course overview with progress
- Recent activity stream
- Upcoming deadlines
- Announcements feed
- Pending grading count

### ✅ Assignment Management
- Create assignments with due dates
- Submit assignments with file upload
- Track submission status
- View submission history
- Time-left calculation

### ✅ Grading System
- View all pending submissions
- Grade submissions with marks and feedback
- Filter by status
- Real-time updates
- Marks validation (0-100)

### ✅ Announcement System
- Create course announcements
- View announcements for enrolled courses
- Instructor-only announcement creation
- Real-time updates

### ✅ Responsive UI
- Modern dark theme
- Smooth animations
- Hover effects
- Mobile-friendly
- Clean typography

## 🧪 Testing

### Test Login Credentials
1. **Student Login**:
   - Go to: http://localhost:4200
   - Username: `student1`
   - Password: `pass123`
   - Redirects to: `/student/dashboard`

2. **Instructor Login**:
   - Go to: http://localhost:4200
   - Username: `instructor`
   - Password: `pass123`
   - Redirects to: `/instructor/dashboard`

### Test Flows

**Student Flow:**
1. Login as student1
2. View dashboard with courses and deadlines
3. Click on "View Assignments" quick action
4. Select a course
5. View assignments and submit a file
6. Go to Grades to see submissions

**Instructor Flow:**
1. Login as instructor
2. View dashboard with course overview
3. Click on "Grade Submissions" in sidebar
4. Select a course
5. Grade pending submissions
6. Create announcements

## 📝 Sample Data

The `populate_data.py` script creates:
- 4 sample courses
- 2 sample students
- 1 instructor
- 8 sample assignments
- 20 course modules
- 5 sample announcements
- 4 sample submissions (some graded, some pending)

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with Django
- ✅ CORS protection
- ✅ Protected API endpoints
- ✅ Role-based access control
- ✅ Token expiration handling

## 🚨 Error Handling

- ✅ Invalid login credentials
- ✅ Token expiration auto-logout
- ✅ File upload validation
- ✅ Required field validation
- ✅ Unauthorized access prevention
- ✅ API error messages displayed to user

## 📱 Browser Support

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

## 🎓 Features Ready for Demo/Viva

✅ Complete authentication system
✅ Full student dashboard with real API data
✅ Assignment submission and tracking
✅ Grade viewing with feedback
✅ Instructor grading interface
✅ Announcement management
✅ Modern UI with animations
✅ Error handling and validation
✅ Sample data with realistic course content
✅ Clean, documented code

## 🐛 Known Limitations

- Single instructor per course
- File size limit for uploads (handled by Django)
- No email notifications (can be added)
- No video streaming (can be extended)

## 🔮 Future Enhancements

- [ ] Email notifications
- [ ] Video hosting for modules
- [ ] Discussion forums
- [ ] Quiz system
- [ ] Certificate generation
- [ ] Advanced analytics
- [ ] Real-time notifications
- [ ] Two-factor authentication
- [ ] Plagiarism detection
- [ ] Mobile app

## 📞 Support & Issues

For issues or questions:
1. Check the sample credentials
2. Ensure backend is running on port 8000
3. Check browser console for errors
4. Verify database migrations are applied

## 📄 License

This project is created for educational purposes.

---

**Status**: ✅ **PRODUCTION READY**

The system is fully functional and ready for demonstration, testing, and deployment.

   ```bash
   npx http-server -p 4200
   ```

   Frontend will be available at: `http://localhost:4200/`

### Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://127.0.0.1:8000
- **Django Admin**: http://127.0.0.1:8000/admin

## 👥 Sample Users

### Login Credentials

**Admin Dashboard:**
- Username: `admin`
- Password: `admin123`
- Role: Administrator
- Access: Django admin panel

**Instructor:**
- Username: `instructor`
- Password: `pass123`
- Role: Faculty/Instructor
- Access: Dashboard, Grading, Announcements

**Student 1:**
- Username: `student1`
- Password: `pass123`
- Role: Student
- Access: Dashboard, Assignments, Grades

**Student 2:**
- Username: `student2`
- Password: `pass123`
- Role: Student
- Access: Dashboard, Assignments, Grades

## 📡 API Endpoints

### Authentication
```
POST /api/auth/login/
- Request: { "username": "...", "password": "..." }
- Response: { "access": "jwt_token", "refresh": "refresh_token" }

POST /api/auth/refresh/
- Request: { "refresh": "refresh_token" }
- Response: { "access": "new_jwt_token" }
```

### Courses
```
GET /api/courses/
- Authorization: Bearer {token}
- Response: [{ id, title, description, instructor_name, module_count }, ...]

GET /api/courses/announcements/
- Authorization: Bearer {token}
- Response: [{ id, title, message, course_title, course_id, created_at }, ...]

POST /api/courses/announcements/create/
- Authorization: Bearer {token}
- Request: { "course_id": 1, "title": "...", "message": "..." }
- Response: { id, title, message, course_title, created_at, message: "success" }
```

### Assignments
```
GET /api/assignments/course/<id>/
- Authorization: Bearer {token}
- Response: [{ id, title, description, due_date, max_marks, submitted }, ...]

POST /api/assignments/submit/<id>/
- Authorization: Bearer {token}
- Multipart Form: file
- Response: { "message": "Submitted successfully" }

GET /api/assignments/submissions/
- Authorization: Bearer {token}
- Response: [{ id, assignment_title, course_title, status, marks_obtained, feedback, ... }, ...]

GET /api/assignments/instructor/course/<id>/
- Authorization: Bearer {token}
- Response: [{ id, assignment_id, assignment_title, student_name, student_id, status, marks_obtained, feedback, ... }, ...]

PATCH /api/assignments/grade/<id>/
- Authorization: Bearer {token}
- Request: { "marks_obtained": 85, "feedback": "..." }
- Response: { id, marks_obtained, status: "graded" }
```

## 🎨 UI Design

### Color Scheme
- **Primary Blue**: #4f7cff
- **Secondary Colors**: Teal, Amber, Purple, Green
- **Background**: Dark modern theme (#0a0e27)
- **Cards**: Soft dark (#111633)
- **Borders**: Subtle (#1f2544)

### Typography
- **Font**: Sora (Google Fonts)
- **Monospace**: DM Mono

### Layout
- **Sidebar Navigation**: 240px fixed left sidebar
- **Main Content**: Responsive grid layout
- **Cards & Panels**: Rounded corners, hover effects
- **Grid System**: CSS Grid with flexbox
- **Responsive**: Mobile-friendly design

## 📁 Project Structure

```
edutrack/
├── backend/
│   ├── edutrack/              # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── courses/               # Courses & announcements app
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── assignments/           # Assignments & submissions app
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── users/                 # User management
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── announcements/         # Announcements app
│   │   ├── models.py
│   │   └── admin.py
│   ├── db.sqlite3
│   ├── manage.py
│   ├── populate_data.py       # Sample data generator
│   └── requirements.txt
├── frontend/
│   ├── index.html             # Main file with CSS
│   ├── app.js                 # AngularJS app configuration
│   ├── controllers/
│   │   ├── loginController.js
│   │   ├── studentController.js
│   │   └── instructorController.js
│   └── views/
│       ├── login.html
│       ├── student-dashboard.html
│       ├── student-assignments.html
│       ├── student-grades.html
│       ├── instructor-dashboard.html
│       └── instructor-grading.html
├── media/
│   └── submissions/           # Uploaded assignment files
└── README.md
```

## 🔧 Technologies Used

### Backend
- **Django 6.0.4** - Web framework
- **Django REST Framework 3.17.1** - REST API
- **Simple JWT 5.5.1** - JWT authentication
- **django-cors-headers 4.9.0** - CORS support
- **Pillow 12.2.0** - Image handling
- **SQLite3** - Database

### Frontend
- **AngularJS 1.8** - Frontend framework
- **HTML5** - Markup
- **CSS3** - Styling
- **JavaScript** - Logic

## ✨ Key Features Implemented

### ✅ Complete Authentication
- JWT-based login/logout
- Token refresh mechanism
- Auto-redirect on unauthorized access
- Role-based access control

### ✅ Dashboard Analytics
- Course overview with progress
- Recent activity stream
- Upcoming deadlines
- Announcements feed
- Pending grading count

### ✅ Assignment Management
- Create assignments with due dates
- Submit assignments with file upload
- Track submission status
- View submission history
- Time-left calculation

### ✅ Grading System
- View all pending submissions
- Grade submissions with marks and feedback
- Filter by status
- Real-time updates
- Marks validation (0-100)

### ✅ Announcement System
- Create course announcements
- View announcements for enrolled courses
- Instructor-only announcement creation
- Real-time updates

### ✅ Responsive UI
- Modern dark theme
- Smooth animations
- Hover effects
- Mobile-friendly
- Clean typography

## 🧪 Testing

### Test Login Credentials
1. **Student Login**:
   - Go to: http://localhost:4200
   - Username: `student1`
   - Password: `pass123`
   - Redirects to: `/student/dashboard`

2. **Instructor Login**:
   - Go to: http://localhost:4200
   - Username: `instructor`
   - Password: `pass123`
   - Redirects to: `/instructor/dashboard`

### Test Flows

**Student Flow:**
1. Login as student1
2. View dashboard with courses and deadlines
3. Click on "View Assignments" quick action
4. Select a course
5. View assignments and submit a file
6. Go to Grades to see submissions

**Instructor Flow:**
1. Login as instructor
2. View dashboard with course overview
3. Click on "Grade Submissions" in sidebar
4. Select a course
5. Grade pending submissions
6. Create announcements

## 📝 Sample Data

The `populate_data.py` script creates:
- 4 sample courses
- 2 sample students
- 1 instructor
- 8 sample assignments
- 20 course modules
- 5 sample announcements
- 4 sample submissions (some graded, some pending)

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with Django
- ✅ CORS protection
- ✅ Protected API endpoints
- ✅ Role-based access control
- ✅ Token expiration handling

## 🚨 Error Handling

- ✅ Invalid login credentials
- ✅ Token expiration auto-logout
- ✅ File upload validation
- ✅ Required field validation
- ✅ Unauthorized access prevention
- ✅ API error messages displayed to user

## 📱 Browser Support

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

## 🎓 Features Ready for Demo/Viva

✅ Complete authentication system
✅ Full student dashboard with real API data
✅ Assignment submission and tracking
✅ Grade viewing with feedback
✅ Instructor grading interface
✅ Announcement management
✅ Modern UI with animations
✅ Error handling and validation
✅ Sample data with realistic course content
✅ Clean, documented code

## 🐛 Known Limitations

- Single instructor per course
- File size limit for uploads (handled by Django)
- No email notifications (can be added)
- No video streaming (can be extended)

## 🔮 Future Enhancements

- [ ] Email notifications
- [ ] Video hosting for modules
- [ ] Discussion forums
- [ ] Quiz system
- [ ] Certificate generation
- [ ] Advanced analytics
- [ ] Real-time notifications
- [ ] Two-factor authentication
- [ ] Plagiarism detection
- [ ] Mobile app

## 📞 Support & Issues

For issues or questions:
1. Check the sample credentials
2. Ensure backend is running on port 8000
3. Check browser console for errors
4. Verify database migrations are applied

## 📄 License

This project is created for educational purposes.

---

**Status**: ✅ **PRODUCTION READY**

The system is fully functional and ready for demonstration, testing, and deployment.
=======
# Studytrack
>>>>>>> 0ca80be18d683c3d052ca9b1fc239a141a7cfd35
