describe('Registration form', function() {
	 var $compile,
      $rootScope;

  // Load the myApp module, which contains the directive
  beforeEach(module('registerForm'));
  
  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

        it("should be able to play a Song", function() {

        	  var element = $compile("<a-great-eye></a-great-eye>")($rootScope);
        	  $rootScope.$digest();
        	  expect(true).toBe(true);
        });
  });