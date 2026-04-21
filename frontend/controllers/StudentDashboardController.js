app.controller('StudentDashboardController', function($scope, $http, $location, Auth) {
  if (!Auth.guard()) return;
  $scope.username = Auth.getUser();
  $scope.logout = function() { Auth.logout(); };
  $scope.courses = [];
  $scope.allSubmissions = [];  // ALL submissions for progress calculation
  $scope.pendingAssignments = [];
  $scope.recentSubmissions = [];  // ONLY first 5 for display
  $scope.avgGrade = 0;
  $scope.pendingCount = 0;
  $scope.submissionCount = 0;

  var user = Auth.getUser();
  console.log('[Dashboard-Init] User:', user);

  function formatDate(value) {
    var date = new Date(value);
    var today = new Date();
    var diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Overdue';
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff <= 7) return diff + ' days';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function calculateCourseProgress() {
    console.log('[Dashboard] Calculating course progress with ALL submissions...');
    $scope.courses.forEach(function(course) {
      // Get all assignments in this course
      var allAssignmentsInCourse = $scope.allAssignments.filter(function(a) { return a.course_title === course.title; });
      
      // Get all submitted assignments in this course (not just recent 5)
      var submittedInCourse = $scope.allSubmissions.filter(function(s) { return s.course === course.title; });
      
      var total = allAssignmentsInCourse.length;
      var completed = submittedInCourse.length;
      course.progress = total ? Math.round((completed / total) * 100) : 0;
      console.log('[Dashboard]', course.title, '- Total Assignments:', total, 'Submitted:', completed, 'Progress:', course.progress + '%');
    });
  }

  // Fetch courses
  $http.get('http://127.0.0.1:8000/api/courses/', { headers: Auth.headers() }).then(function(response) {
    if (response.data && response.data.length) {
      var colors = ['blue', 'teal', 'amber', 'purple', 'green', 'red'];
      var icons = ['⚙️', '🌐', '🗄️', '🔧', '📊', '🧪'];
      $scope.courses = response.data.map(function(course, index) {
        return {
          id: course.id,
          title: course.title,
          modules: course.module_count || 0,
          progress: 0,
          color: colors[index % colors.length],
          icon: icons[index % icons.length]
        };
      });
      console.log('[Dashboard] Loaded courses:', $scope.courses.length);
    }
  }, function() {});

  // Fetch all assignments to calculate course progress
  $http.get('http://127.0.0.1:8000/api/assignments/', { headers: Auth.headers() }).then(function(response) {
    if (response.data && response.data.length) {
      $scope.allAssignments = response.data;
      console.log('[Dashboard] Loaded all assignments:', $scope.allAssignments.length);
      calculateCourseProgress();
    }
  }, function() {});

  // Fetch submissions to filter pending assignments and calculate progress
  $http.get('http://127.0.0.1:8000/api/students/submissions/', { headers: Auth.headers() }).then(function(response) {
    var submissions = response.data || [];
    console.log('[Dashboard] Loaded submissions:', submissions.length);
    
    var submissionMap = {};
    submissions.forEach(function(sub) {
      submissionMap[sub.assignment] = sub;
    });
    
    // Store ALL submissions for progress calculation (with proper field mapping)
    $scope.allSubmissions = submissions.map(function(sub) {
      return {
        title: sub.assignment_title,
        course: sub.course,  // This is the course name from API
        date: sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString('en-US') : '',
        status: sub.status === 'under_review' ? 'Under Review' : sub.status === 'resubmit' ? 'Resubmit' : sub.status.charAt(0).toUpperCase() + sub.status.slice(1),
        marks: sub.marks_obtained != null ? sub.marks_obtained + '/100' : null
      };
    });
    
    // Recent submissions for display (first 5)
    $scope.recentSubmissions = $scope.allSubmissions.slice(0, 5);
    
    $scope.submissionCount = submissions.length;
    
    // Calculate average grade from graded submissions
    var graded = submissions.filter(function(sub) { return sub.status === 'graded' && sub.marks_obtained != null; });
    if (graded.length) {
      var sum = graded.reduce(function(acc, sub) { return acc + sub.marks_obtained; }, 0);
      $scope.avgGrade = Math.round(sum / graded.length);
    }
    
    console.log('[Dashboard] All submissions for progress:', $scope.allSubmissions.length, 'Recent for display:', $scope.recentSubmissions.length);
    calculateCourseProgress();
  }, function() {});

  // Fetch deadlines and filter only pending ones
  $http.get('http://127.0.0.1:8000/api/students/deadlines/', { headers: Auth.headers() }).then(function(response) {
    if (response.data && response.data.length) {
      // Get all submissions to check which assignments are pending
      $http.get('http://127.0.0.1:8000/api/students/submissions/', { headers: Auth.headers() }).then(function(subResponse) {
        var submissions = subResponse.data || [];
        var submittedAssignmentIds = new Set(submissions.map(function(s) { return s.assignment; }));
        
        // Filter only pending (unsubmitted) assignments
        $scope.pendingAssignments = response.data
          .filter(function(assign) { return !submittedAssignmentIds.has(assign.id); })
          .slice(0, 5)
          .map(function(assign) {
            return {
              title: assign.title,
              course: assign.course_title,
              due: formatDate(assign.due_date),
              urgency: assign.due_date && new Date(assign.due_date) < new Date() ? 'red' : 'blue'
            };
          });
        
        $scope.pendingCount = response.data.filter(function(assign) { return !submittedAssignmentIds.has(assign.id); }).length;
        console.log('[Dashboard] Pending assignments:', $scope.pendingCount);
      });
    }
  }, function() {});
});

