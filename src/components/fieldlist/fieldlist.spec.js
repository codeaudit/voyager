'use strict';

/* global vl:true */

describe('Directive: fieldList', function () {

  // load the directive's module
  beforeEach(module('voyager'));

  var element, scope, $compile;

  beforeEach(module('voyager', function($provide) {
    var mockDataschema = [{
      name: 'a',
      type: 'Q',
    }, {
      name: 'b',
      type: 'O',
    }];

    var mockDataset = {
      datasets: [{name: 'foo'}, {name: 'bar'}],
      dataset: null,
      fieldOrder: vl.field.order.typeThenName,
      dataschema: mockDataschema,
      update: function() {},
      stats: {
        a: {},
        b: {}
      }
    };
    mockDataset.dataset = mockDataset.datasets[0];
    $provide.value('Dataset', mockDataset);

    $provide.constant('vl', vl); // vl is loaded by karma
  }));


  beforeEach(inject(function ($rootScope, _$compile_) {
    scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  it('should make hidden element visible', function () {
    element = angular.element('<field-list></field-list>');
    element = $compile(element)(scope);
    scope.$digest();
    expect(element.find('.field').length).to.eql(2);
  });
});