describe('Customer App e2e tests', function(){  //to assemble
beforeEach(function(){    //before test this needs to be done 
browser.get("http://localhost:3000/first.html");
});

var customerList =element.all(by.repeater('customer in customers'));  // similar to ng-repeat 
it("should have 5 customers",function(){
expect(customerList.count()).toEqual(5);
});


it("should delete a customer",function(){
customerList.get(2).element(by.css('.close')).click();
expect(customerList.count()).toEqual(4);
});
});