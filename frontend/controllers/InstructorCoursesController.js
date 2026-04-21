app.controller('InstructorCoursesController', function($scope, $http, $location, Auth) {
  if (!Auth.guard()) return;
  $scope.username = Auth.getUser();
  $scope.logout = function() { Auth.logout(); };
  $scope.showCreateCourse=false; $scope.showAddModule=false; $scope.showAddAssignment=false;
  $scope.newCourse={}; $scope.newModule={}; $scope.newAssignment={}; $scope.courseSuccess=false;
  $scope.courses=[
    {id:1,title:'Data Structures & Algorithms',students:18,color:'blue',icon:'⚙️',tab:'modules',
      modules:[{title:'Introduction to DSA',content:'Big-O notation'},{title:'Arrays & Linked Lists',content:'Linear structures'}],
      assignments:[{title:'Sorting Algorithms',due_date:'2025-04-15',max_marks:100},{title:'Binary Tree Task',due_date:'2025-04-22',max_marks:100}]},
    {id:2,title:'Web Technologies',students:15,color:'teal',icon:'🌐',tab:'modules',
      modules:[{title:'HTML5',content:'Semantic elements'},{title:'CSS3',content:'Flexbox and Grid'}],
      assignments:[{title:'Portfolio Project',due_date:'2025-04-18',max_marks:100}]}
  ];
  $scope.createCourse=function(){
    if(!$scope.newCourse.title) return;
    $http.post('http://127.0.0.1:8000/api/courses/',{title:$scope.newCourse.title,description:$scope.newCourse.description},{headers:Auth.headers()})
    .then(function(r){ $scope.courses.push({id:r.data.id,title:r.data.title,students:0,color:'blue',icon:'📘',tab:'modules',modules:[],assignments:[]});$scope.newCourse={};$scope.courseSuccess=true;setTimeout(function(){$scope.courseSuccess=false;$scope.showCreateCourse=false;$scope.$apply();},1500); },
    function(){ $scope.courses.push({id:Date.now(),title:$scope.newCourse.title,students:0,color:'green',icon:'📗',tab:'modules',modules:[],assignments:[]});$scope.newCourse={};$scope.showCreateCourse=false; });
  };
  $scope.openAddModule=function(c){$scope.selectedCourse=c;$scope.newModule={};$scope.showAddModule=true;};
  $scope.addModule=function(){
    if(!$scope.newModule.title) return;
    $http.post('http://127.0.0.1:8000/api/courses/'+$scope.selectedCourse.id+'/modules/',{title:$scope.newModule.title,content:$scope.newModule.content,resource_link:$scope.newModule.link||''},{headers:Auth.headers()})
    .then(function(r){$scope.selectedCourse.modules.push(r.data);},function(){$scope.selectedCourse.modules.push({title:$scope.newModule.title,content:$scope.newModule.content});});
    $scope.showAddModule=false;
  };
  $scope.openAddAssignment=function(c){$scope.selectedCourse=c;$scope.newAssignment={};$scope.showAddAssignment=true;};
  $scope.addAssignment=function(){
    if(!$scope.newAssignment.title) return;
    $http.post('http://127.0.0.1:8000/api/courses/'+$scope.selectedCourse.id+'/assignments/',{title:$scope.newAssignment.title,description:$scope.newAssignment.description,due_date:$scope.newAssignment.due_date,max_marks:$scope.newAssignment.max_marks||100},{headers:Auth.headers()})
    .then(function(r){$scope.selectedCourse.assignments.push(r.data);},function(){$scope.selectedCourse.assignments.push({title:$scope.newAssignment.title,due_date:$scope.newAssignment.due_date,max_marks:$scope.newAssignment.max_marks||100});});
    $scope.showAddAssignment=false;
  };
  $scope.deleteCourse=function(c){if(!confirm('Delete this course?')) return;$http.delete('http://127.0.0.1:8000/api/courses/'+c.id+'/',{headers:Auth.headers()}).then(function(){$scope.courses.splice($scope.courses.indexOf(c),1);},function(){$scope.courses.splice($scope.courses.indexOf(c),1);});};
  $scope.deleteModule=function(c,m){c.modules.splice(c.modules.indexOf(m),1);};
  $scope.deleteAssignment=function(c,a){c.assignments.splice(c.assignments.indexOf(a),1);};
  $http.get('http://127.0.0.1:8000/api/courses/',{headers:Auth.headers()}).then(function(r){
    if(r.data&&r.data.length){var col=['blue','teal','amber'],ic=['⚙️','🌐','🗄️'];
    $scope.courses=r.data.map(function(c,i){return{id:c.id,title:c.title,students:c.student_count||0,color:col[i%col.length],icon:ic[i%ic.length],tab:'modules',modules:c.modules||[],assignments:c.assignments||[]};});}
  },function(){});
});
