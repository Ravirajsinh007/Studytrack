var app = angular.module('edutrackApp', ['ngRoute']);
app.config(function($routeProvider) {
  $routeProvider
    .when('/login', { templateUrl:'views/login.html', controller:'AuthController' })
    .when('/student/dashboard',    { templateUrl:'views/student/dashboard.html',    controller:'StudentDashboardController' })
    .when('/student/courses',      { templateUrl:'views/student/courses.html',       controller:'StudentCoursesController' })
    .when('/student/assignments',  { templateUrl:'views/student/assignments.html',   controller:'StudentAssignmentsController' })
    .when('/student/grades',       { templateUrl:'views/student/grades.html',        controller:'StudentGradesController' })
    .when('/student/submissions',  { templateUrl:'views/student/submissions.html',   controller:'StudentSubmissionsController' })
    .when('/student/forum',        { templateUrl:'views/student/forum.html',         controller:'StudentForumController' })
    .when('/instructor/dashboard', { templateUrl:'views/instructor/dashboard.html',  controller:'InstructorDashboardController' })
    .when('/instructor/courses',   { templateUrl:'views/instructor/courses.html',    controller:'InstructorCoursesController' })
    .when('/instructor/grading',   { templateUrl:'views/instructor/grading.html',    controller:'InstructorGradingController' })
    .when('/instructor/announcements', { templateUrl:'views/instructor/announcements.html', controller:'InstructorAnnouncementsController' })
    .when('/instructor/analytics', { templateUrl:'views/instructor/analytics.html',  controller:'InstructorAnalyticsController' })
    .otherwise({ redirectTo:'/login' });
});
/* ── Shared auth helper ── */
app.factory('Auth', function($location) {
  return {
    getToken: function()    { return localStorage.getItem('access_token'); },
    getUser:  function()    { return localStorage.getItem('username'); },
    isStaff:  function()    { return localStorage.getItem('is_staff') === 'true'; },
    logout:   function()    { localStorage.clear(); $location.path('/login'); },
    guard:    function()    {
      if (!localStorage.getItem('access_token')) { $location.path('/login'); return false; }
      return true;
    },
    headers:  function()    { return { 'Authorization': 'Bearer ' + localStorage.getItem('access_token') }; },
    save:     function(token, username, isStaff) {
      localStorage.setItem('access_token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('is_staff', isStaff ? 'true' : 'false');
    }
  };
});
