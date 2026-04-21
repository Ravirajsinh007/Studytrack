app.controller('StudentController', function($scope, $http, $location) {
  var token = localStorage.getItem('access_token');

  if (!token) {
    $location.path('/login');
    return;
  }

  $scope.username = localStorage.getItem('username') || 'Student';
  $scope.statusFilter = '';
  $scope.searchQuery = '';
  $scope.showSearch = false;

  $scope.logout = function() {
    localStorage.clear();
    $location.path('/login');
  };

  // Toggle search
  $scope.toggleSearch = function() {
    $scope.showSearch = !$scope.showSearch;
    if ($scope.showSearch) {
      setTimeout(function() {
        document.getElementById('search-input').focus();
      }, 100);
    }
  };

  // Filter courses based on search
  $scope.filteredCourses = function() {
    if (!$scope.searchQuery) return $scope.courses;
    return $scope.courses.filter(function(course) {
      return course.title.toLowerCase().includes($scope.searchQuery.toLowerCase()) ||
             course.instructor.toLowerCase().includes($scope.searchQuery.toLowerCase());
    });
  };

  // Quick actions
  $scope.quickActions = [
    { title: 'View Assignments', icon: '📝', action: 'assignments', color: 'blue' },
    { title: 'Check Grades', icon: '📊', action: 'grades', color: 'green' },
    { title: 'View Announcements', icon: '📢', action: 'announcements', color: 'amber' },
    { title: 'Browse Courses', icon: '📚', action: 'courses', color: 'purple' }
  ];

  $scope.performAction = function(action) {
    switch(action) {
      case 'assignments':
        $location.path('/student/assignments');
        break;
      case 'grades':
        $location.path('/student/grades');
        break;
      case 'announcements':
        // Could add announcements page
        break;
      case 'courses':
        // Could add courses page
        break;
    }
  };

  // Fetch real courses from API
  $http.get('http://127.0.0.1:8000/api/courses/', {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(function(response) {
    if (response.data && response.data.length > 0) {
      var colors = ['blue', 'teal', 'amber', 'purple', 'green', 'red'];
      var icons = ['📘', '🌐', '🗄️', '🔧', '📊', '🧪', '⚙️', '💻'];
      $scope.courses = response.data.map(function(c, i) {
        return {
          id: c.id,
          title: c.title,
          instructor: c.instructor_name || 'Instructor',
          modules: c.module_count || 0,
          progress: Math.floor(Math.random() * 60) + 30, // Could be calculated from actual progress
          color: colors[i % colors.length],
          icon: icons[i % icons.length],
          description: c.description
        };
      });

      // Calculate metrics
      $scope.metrics = {
        enrolledCourses: $scope.courses.length,
        assignmentsDone: 0,
        pendingDeadlines: 0,
        avgGrade: 0
      };

      // If on assignments page, load assignments for first course
      if ($location.path() === '/student/assignments' && $scope.courses.length > 0) {
        $scope.selectedCourse = $scope.courses[0].id;
        $scope.loadAssignments($scope.courses[0].id);
      }
    } else {
      // Demo data if API fails
      $scope.courses = [
        { id: 1, title: 'Data Structures & Algorithms', instructor: 'Dr. Patel', modules: 8, progress: 75, color: 'blue', icon: '⚙️', description: 'Learn fundamental data structures' },
        { id: 2, title: 'Web Technologies', instructor: 'Prof. Shah', modules: 6, progress: 60, color: 'teal', icon: '🌐', description: 'Modern web development' },
        { id: 3, title: 'Database Management', instructor: 'Dr. Mehta', modules: 5, progress: 90, color: 'amber', icon: '🗄️', description: 'Database design and management' },
        { id: 4, title: 'Software Engineering', instructor: 'Prof. Desai', modules: 7, progress: 40, color: 'purple', icon: '🔧', description: 'Software development practices' }
      ];
      $scope.metrics = {
        enrolledCourses: 4,
        assignmentsDone: 7,
        pendingDeadlines: 3,
        avgGrade: 84
      };
    }
  }, function() {
    // Demo data if API fails
    $scope.courses = [
      { id: 1, title: 'Data Structures & Algorithms', instructor: 'Dr. Patel', modules: 8, progress: 75, color: 'blue', icon: '⚙️', description: 'Learn fundamental data structures' },
      { id: 2, title: 'Web Technologies', instructor: 'Prof. Shah', modules: 6, progress: 60, color: 'teal', icon: '🌐', description: 'Modern web development' },
      { id: 3, title: 'Database Management', instructor: 'Dr. Mehta', modules: 5, progress: 90, color: 'amber', icon: '🗄️', description: 'Database design and management' },
      { id: 4, title: 'Software Engineering', instructor: 'Prof. Desai', modules: 7, progress: 40, color: 'purple', icon: '🔧', description: 'Software development practices' }
    ];
    $scope.metrics = {
      enrolledCourses: 4,
      assignmentsDone: 7,
      pendingDeadlines: 3,
      avgGrade: 84
    };
    // If on assignments page, load assignments for first course
    if ($location.path() === '/student/assignments' && $scope.courses.length > 0) {
      $scope.selectedCourse = $scope.courses[0].id;
      $scope.loadAssignments($scope.courses[0].id);
    }
  });

  // Fetch submissions for grades page
  if ($location.path() === '/student/grades') {
    $http.get('http://127.0.0.1:8000/api/assignments/submissions/', {
      headers: { 'Authorization': 'Bearer ' + token }
    }).then(function(response) {
      $scope.submissions = response.data;
    }, function() {
      // Demo data
      $scope.submissions = [
        { assignment_title: 'Binary Tree Implementation', course_title: 'DSA', submitted_at: '2025-04-10', status: 'Graded', marks_obtained: 88, feedback: 'Good work' },
        { assignment_title: 'Responsive Portfolio', course_title: 'Web Tech', submitted_at: '2025-04-08', status: 'Under Review', marks_obtained: null, feedback: '' },
        { assignment_title: 'ER Diagram Phase 1', course_title: 'DBMS', submitted_at: '2025-04-05', status: 'Graded', marks_obtained: 92, feedback: 'Excellent' },
      ];
    });
  }

  // Fetch announcements
  $http.get('http://127.0.0.1:8000/api/courses/announcements/', {
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(function(response) {
    $scope.announcements = response.data.slice(0, 3); // Show only 3 latest
    $scope.allAnnouncements = response.data;
  }, function() {
    // Demo data
    $scope.announcements = [
      { title: 'Assignment 3 Extended', message: 'Due date extended to next week', course_title: 'DSA', created_at: '2025-04-15' },
      { title: 'Mid-term Exam', message: 'Scheduled for next Monday', course_title: 'Web Tech', created_at: '2025-04-14' },
    ];
  });

  // Recent activity (mock data for now)
  $scope.recentActivity = [
    { type: 'assignment', title: 'Submitted "Binary Tree Implementation"', course: 'DSA', time: '2 hours ago', icon: '📝' },
    { type: 'grade', title: 'Grade posted for "ER Diagram"', course: 'DBMS', time: '1 day ago', icon: '📊' },
    { type: 'announcement', title: 'New announcement in Web Tech', course: 'Web Tech', time: '2 days ago', icon: '📢' },
    { type: 'assignment', title: 'Assignment "Sorting Algorithms" due soon', course: 'DSA', time: '3 days ago', icon: '⏰' }
  ];

  // Upcoming deadlines (mock data for now)
  $scope.deadlines = [
    { title: 'Sorting Algorithms Assignment', course: 'DSA', due: '2 days', urgency: 'urgent' },
    { title: 'Database Design Project', course: 'DBMS', due: '5 days', urgency: 'normal' },
    { title: 'Web Portfolio Review', course: 'Web Tech', due: '1 week', urgency: 'normal' }
  ];
  // ================= ASSIGNMENT FEATURE =================
$scope.assignments = [];

$scope.loadAssignments = function(courseId) {
    $http.get('http://127.0.0.1:8000/api/assignments/course/' + courseId + '/', {
      headers: { Authorization: 'Bearer ' + token }
    })
    .then(function(res) {
      $scope.assignments = res.data;
    }, function() {
      // Demo data
      $scope.assignments = [
        { id: 1, title: 'Assignment 1', due_date: '2025-04-20T23:59:00Z', submitted: false },
        { id: 2, title: 'Assignment 2', due_date: '2025-04-25T23:59:00Z', submitted: true },
      ];
    });
  };

$scope.submitAssignment = function(a) {
    if (!a.file) {
      alert('Please select a file');
      return;
    }

    var formData = new FormData();
    formData.append('file', a.file);

    $http.post('http://127.0.0.1:8000/api/assignments/submit/' + a.id + '/', formData, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': undefined
      }
    })
    .then(function() {
      a.submitted = true;
      alert('Submitted successfully');
    }, function(err) {
      alert('Error: ' + (err.data.error || 'Submission failed'));
    });
  };

$scope.getTimeLeft = function(dueDate) {
  var now = new Date();
  var due = new Date(dueDate);

  var diff = due - now;

  if (diff <= 0) return "Expired";

  var days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days + " days left";
};

// New functions for enhanced assignment page
$scope.getStatusClass = function(assignment) {
  if (assignment.submitted) {
    return 'submitted';
  }

  var now = new Date();
  var due = new Date(assignment.due_date);

  if (now > due) {
    return 'overdue';
  }

  return 'pending';
};

$scope.getStatusText = function(assignment) {
  if (assignment.submitted) {
    return 'Submitted';
  }

  var now = new Date();
  var due = new Date(assignment.due_date);

  if (now > due) {
    return 'Overdue';
  }

  return 'Pending';
};

  // Filter submissions
  $scope.filterSubmissions = function(sub) {
    if (!$scope.statusFilter) return true;
    return sub.status === $scope.statusFilter;
  };

  // Grade-related functions
  $scope.getGradedCount = function() {
    if (!$scope.submissions) return 0;
    return $scope.submissions.filter(sub => sub.status === 'graded').length;
  };

  $scope.getAverageGrade = function() {
    if (!$scope.submissions) return 0;
    var gradedSubs = $scope.submissions.filter(sub => sub.marks_obtained !== null);
    if (gradedSubs.length === 0) return 0;
    var total = gradedSubs.reduce((sum, sub) => sum + $scope.getPercentage(sub), 0);
    return Math.round(total / gradedSubs.length);
  };

  $scope.getGradeLetter = function() {
    var avg = $scope.getAverageGrade();
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
  };

  $scope.getPendingCount = function() {
    if (!$scope.submissions) return 0;
    return $scope.submissions.filter(sub => sub.status === 'submitted' || sub.status === 'under_review').length;
  };

  $scope.getGradeCardClass = function(sub) {
    if (sub.status === 'graded') return 'graded';
    if (sub.status === 'resubmit') return 'resubmit';
    return 'pending';
  };

  $scope.getStatusClass = function(status) {
    switch(status) {
      case 'submitted': return 'submitted';
      case 'under_review': return 'review';
      case 'graded': return 'graded';
      case 'resubmit': return 'resubmit';
      default: return 'submitted';
    }
  };

  $scope.getStatusText = function(status) {
    switch(status) {
      case 'submitted': return 'Submitted';
      case 'under_review': return 'Under Review';
      case 'graded': return 'Graded';
      case 'resubmit': return 'Resubmit Requested';
      default: return status;
    }
  };

  $scope.getPercentage = function(sub) {
    if (!sub.marks_obtained || !sub.max_marks) return 0;
    return Math.round((sub.marks_obtained / sub.max_marks) * 100);
  };

  $scope.getProgressStyle = function(sub) {
    var percentage = $scope.getPercentage(sub);
    var color = percentage >= 80 ? '#34d98e' : percentage >= 60 ? '#f5a623' : '#ff5b6b';
    return { 'width': percentage + '%', 'background-color': color };
  };

  $scope.getGradeLetterForScore = function(marks, maxMarks) {
    if (!marks || !maxMarks) return '-';
    var percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };
});