'use strict';

angular.module('voyager')
  .factory('Fields', function(_, Dataset, vl, cp, Logger){

    var Fields = {
      fields: {},
      highlighted: {},
      selected: [],
      selectedKey: null
    };

    function resetField(field) {
      field.selected = undefined;
      field._any = !vl.field.isTypes(field, ['O', 'N']) && field.aggregate!=='count';
      delete field._raw;
      delete field._aggregate;
      delete field._timeUnit;
    }

    Fields.updateSchema = function(dataschema) {
      Fields.fields = _(dataschema).reduce(function(d, field){
        resetField(field);
        d[field.name] = field;
        return d;
      }, {});
      Fields.highlighted = {};
    };

    Fields.update = function() {
      var list = Fields.getList();
      Fields.selected = list.filter(function(d) { return d.selected; });
      Fields.selectedPKey = cp.gen.projections.key(Fields.selected);

      Logger.logInteraction(Logger.actions.FIELDS_CHANGE, {
        selected: Fields.selected,
        list: list
      });

      return list;
    };

    Fields.reset = function() {
      _.each(Fields.fields, resetField);
    };

    Fields.getList = function() {
      var list = _.sortBy(_.values(Fields.fields), function(field) {
        return vl.field.order.typeThenName(field);
      });
      return list;
    };

    Fields.setSelected = function(fieldName, val) {
      (Fields.fields[fieldName] || {}).selected = val;
    };

    Fields.toggleSelected = function(fieldName) {
      var field = Fields.fields[fieldName] || {};
      field.selected = field.selected ? undefined : true;
    };

    Fields.isSelected = function(fieldName) {
      return (Fields.fields[fieldName] || {}).selected;
    };

    Fields.setHighlight = function(fieldName, val) {
      Fields.highlighted[fieldName] = val;
    };

    return Fields;
  });
