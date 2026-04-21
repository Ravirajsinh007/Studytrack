app.controller('StudentGradesController', function($scope, $http, $location, Auth) {
  if (!Auth.guard()) return;
  $scope.username = Auth.getUser();
  $scope.logout = function() { Auth.logout(); };
  $scope.overallAvg = 0;
  $scope.gradedCount = 0;
  $scope.highestScore = 0;
  $scope.pendingCount = 0;
  $scope.courseGrades = [];
  $scope.loadingGrades = true;

  function round(value) {
    return Math.round(value);
  }

  function buildCourseGroups(submissions) {
    var courses = {};
    submissions.forEach(function(sub) {
      var courseName = sub.course || 'Unknown Course';
      if (!courses[courseName]) {
        courses[courseName] = {
          course: courseName,
          avg: 0,
          color: 'blue',
          icon: '📘',
          assignments: [],
          totalPct: 0
        };
      }
      var pct = 0;
      if (sub.marks_obtained !== null && sub.assignment_max_marks) {
        pct = round((sub.marks_obtained / sub.assignment_max_marks) * 100);
      }
      courses[courseName].assignments.push({
        title: sub.assignment_title,
        marks: sub.marks_obtained !== null ? sub.marks_obtained : '--',
        max: sub.assignment_max_marks || '--',
        pct: pct
      });
      courses[courseName].totalPct += pct;
    });

    return Object.keys(courses).map(function(name) {
      var group = courses[name];
      var count = group.assignments.length;
      group.avg = count ? round(group.totalPct / count) : 0;
      if (group.avg >= 90) group.color = 'green';
      else if (group.avg >= 80) group.color = 'blue';
      else if (group.avg >= 70) group.color = 'amber';
      else group.color = 'purple';
      return group;
    });
  }

  function updateMetrics(submissions) {
    $scope.totalSubmissions = submissions.length;
    var graded = submissions.filter(function(sub) { return sub.status === 'graded'; });
    $scope.gradedCount = graded.length;
    $scope.pendingCount = submissions.filter(function(sub) { return sub.status !== 'graded'; }).length;
    console.log('[Grades-Metrics] Total:', $scope.totalSubmissions, 'Graded:', $scope.gradedCount, 'Pending:', $scope.pendingCount);
    $scope.highestScore = graded.reduce(function(max, sub) {
      if (sub.marks_obtained !== null && sub.assignment_max_marks) {
        var pct = round((sub.marks_obtained / sub.assignment_max_marks) * 100);
        return pct > max ? pct : max;
      }
      return max;
    }, 0);
    if (graded.length) {
      var total = graded.reduce(function(sum, sub) {
        return sum + ((sub.marks_obtained !== null && sub.assignment_max_marks) ? round((sub.marks_obtained / sub.assignment_max_marks) * 100) : 0);
      }, 0);
      $scope.overallAvg = round(total / graded.length);
    } else {
      $scope.overallAvg = 0;
    }
  }

  var token = Auth.getToken();
  var user = Auth.getUser();
  console.log('[Grades-Init] User:', user, 'Token:', token ? 'YES' : 'NO');

  $http.get('http://127.0.0.1:8000/api/students/submissions/', { headers: Auth.headers() }).then(function(response) {
    var submissions = response.data || [];
    console.log('[Grades-SubAPI] Returned:', submissions.length, 'total submissions');
    var graded = submissions.filter(function(s) { return s.status === 'graded'; });
    var pending = submissions.filter(function(s) { return s.status !== 'graded'; });
    console.log('[Grades-SubAPI] Graded:', graded.length, 'Pending:', pending.length);
    graded.forEach(function(s, i) {
      console.log('  [GRADED', i, '] Student:', s.student_name, 'Assignment:', s.assignment_title, 'Marks:', s.marks_obtained);
    });
    updateMetrics(submissions);
    var gradedOnly = submissions.filter(function(sub) { return sub.status === 'graded'; });
    $scope.courseGrades = buildCourseGroups(gradedOnly);
    $scope.loadingGrades = false;
  }, function(error) {
    console.error('[Grades-SubAPI] Error:', error);
    $scope.loadingGrades = false;
  });
});
