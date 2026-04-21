app.controller('InstructorAnalyticsController', function($scope, $http, $location, Auth) {
  if (!Auth.guard()) return;
  $scope.username = Auth.getUser();
  $scope.logout = function() { Auth.logout(); };
  $scope.submissionRate=87; $scope.classAvg=78; $scope.topScorer='Ananya P.'; $scope.atRisk=3;
  $scope.assignmentAvgs=[
    {title:'Sorting Algorithms',avg:76},{title:'Binary Tree Task',avg:82},
    {title:'Responsive Portfolio',avg:68},{title:'ER Diagram Phase 1',avg:91},{title:'SRS Document',avg:74}
  ];
  $scope.leaderboard=[
    {name:'Ananya Patel',initials:'AP',color:'b',avg:94,submissions:7},
    {name:'Priya Sharma',initials:'PS',color:'a',avg:89,submissions:6},
    {name:'Dev Joshi',initials:'DJ',color:'d',avg:85,submissions:7},
    {name:'Kiran Shah',initials:'KS',color:'e',avg:81,submissions:5},
    {name:'Rohan Mehta',initials:'RM',color:'c',avg:77,submissions:6}
  ];
  $scope.coursePerformance=[
    {title:'Database Management',students:14,avg:85},
    {title:'Data Structures & Algorithms',students:18,avg:79},
    {title:'Software Engineering',students:16,avg:74},
    {title:'Web Technologies',students:15,avg:68}
  ];
  $http.get('http://127.0.0.1:8000/api/courses/analytics/',{headers:Auth.headers()}).then(function(r){
    if(r.data){ $scope.classAvg=r.data.avg||$scope.classAvg; }
  },function(){});
});
