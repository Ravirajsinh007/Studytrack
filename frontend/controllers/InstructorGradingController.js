app.controller('InstructorGradingController', function($scope, $http, $location, Auth) {
  if (!Auth.guard()) return;
  $scope.username = Auth.getUser();
  $scope.logout = function() { Auth.logout(); };
  $scope.filterStatus=''; $scope.gradeSuccess=false;
  $scope.submissions=[
    {id:1,student:'Priya Sharma',initials:'PS',color:'a',assignment:'Responsive Portfolio',course:'Web Tech',date:'Apr 8',status:'submitted',max_marks:100,marks_input:null,feedback_input:'',fileUrl:null},
    {id:2,student:'Rohan Mehta',initials:'RM',color:'b',assignment:'Use Case Diagrams',course:'Soft Engg',date:'Apr 9',status:'submitted',max_marks:100,marks_input:null,feedback_input:'',fileUrl:null},
    {id:3,student:'Ananya Patel',initials:'AP',color:'c',assignment:'Sorting Assignment',course:'DSA',date:'Apr 7',status:'submitted',max_marks:100,marks_input:null,feedback_input:'',fileUrl:null},
    {id:4,student:'Dev Joshi',initials:'DJ',color:'d',assignment:'ER Diagram Phase 2',course:'DBMS',date:'Apr 6',status:'submitted',max_marks:50,marks_input:null,feedback_input:'',fileUrl:null},
    {id:5,student:'Kiran Shah',initials:'KS',color:'e',assignment:'Binary Tree Task',course:'DSA',date:'Apr 5',status:'graded',max_marks:100,marks_input:88,feedback_input:'Excellent work!',fileUrl:null}
  ];
  $scope.saveGrade=function(s){
    if(s.marks_input===null||s.marks_input===undefined){alert('Please enter marks before saving.');return;}
    $http.put('http://127.0.0.1:8000/api/submissions/'+s.id+'/grade/',{marks_obtained:s.marks_input,feedback:s.feedback_input,status:'graded'},{headers:Auth.headers()})
    .then(function(){s.status='graded';$scope.gradeSuccess=true;setTimeout(function(){$scope.gradeSuccess=false;$scope.$apply();},2000);},
    function(){s.status='graded';$scope.gradeSuccess=true;setTimeout(function(){$scope.gradeSuccess=false;$scope.$apply();},2000);});
  };
  $scope.requestResubmit=function(s){
    $http.put('http://127.0.0.1:8000/api/submissions/'+s.id+'/grade/',{status:'resubmit',feedback:s.feedback_input||'Please resubmit with corrections.'},{headers:Auth.headers()})
    .then(function(){s.status='resubmit';},function(){s.status='resubmit';});
  };
  $http.get('http://127.0.0.1:8000/api/submissions/',{headers:Auth.headers()}).then(function(r){
    if(r.data&&r.data.length){$scope.submissions=r.data.map(function(s){return Object.assign(s,{marks_input:s.marks_obtained,feedback_input:s.feedback||'',initials:(s.student_name||'S').split(' ').map(function(n){return n[0];}).join('').toUpperCase(),color:'a'});});}
  },function(){});
});
