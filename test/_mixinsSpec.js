/*global describe, it, beforeEach
 */

define(['_mixins', 'backbone'], function (_, Backbone) {

  describe('_mixins Utility Tests', function () {

    var locsArray, locsCollection, models,

        fnSelected = function(model) { return model.selected === true; };

    beforeEach(function(){

        locsCollection = new Backbone.Collection([

          { name: 'Ballou Hall', id: 'm001', locationid: 'xyz' },

          { name: 'Houston Hall', id: 'm002', locationid: 'abc' },

          { name: '80 George Street', id: 'm003', locationid: 'hij' }

        ]);

        locsArray = [

          { name: 'Ballou Hall', id: 'm001', locationid: 'xyz' },

          { name: 'Houston Hall', id: 'm002', locationid: 'abc' },

          { name: '80 George Street', id: 'm003', locationid: 'hij' }

        ];

        _.each(locsArray, function(item) { item.collection = locsArray; });

        models = locsArray;
        //models = locsCollection.models;

    });

    describe('Getting the selected object from a collection', function () {

      it('should have a getSelectedItem method', function () {

        expect(_.getSelectedItem).toBeDefined();

      });

      it('should return undefined if there is no item selected', function () {

        expect(_.getSelectedItem(models)).toBeUndefined();

      });

      it('should return an item that is flagged as selected', function () {

        models[0].selected = true;

        expect(_.getSelectedItem(models)).toEqual(models[0]);

      });

    });


    describe('Getting an item from array', function () {

      it('should have a getItemById method', function () {

        expect(_.getItemById).toBeDefined();

        expect(_.getItemAt).toBeDefined();

      });

      it('should return undefined if there is no matching item', function () {

        expect(_.getItemById(models, 'fakeid')).toBeUndefined();

      });

      it('should return the correct item when supplied its id', function () {

        expect(_.getItemById(models, 'm001')).toEqual(models[0]);

      });

      it('should select and return an item matching an id', function () {

        var item1, item2, opts = { select: true };

        item1 = _.getItemById(models, 'm001', opts);

        expect(item1.selected).toBe(true);

        item2 = _.getItemById(models, 'm002', opts);

        expect(item1.selected).not.toBe(true);

        expect(item2.selected).toBe(true);

      });



      it('should return the correct item when supplied a custom id attr', function () {

        var item, options;

        options = { id: 'locationid' };

        item = _.getItemById(models, 'xyz', options);

        expect(item).toEqual(models[0]);

        _.extend(options, { select: true });

        item = _.getItemById(models, 'abc', options);

        expect(_.getSelectedItem(models)).toEqual(models[1]);

      });

      it('should return the correct item when retrieved by index', function () {

        var options = { id: 'locationid' };

        expect(_.getItemAt(models, 2)).toEqual(models[2]);

        _.extend(options, { select: true });

        expect(_.getItemAt(models, 0, options)).toEqual(_.getSelectedItem(models));

      });

    });


    describe('Setting the selected object from a collection', function () {

      it('should have a selectItem method', function () {

        expect(_.selectItem).toBeDefined();

      });

      it('should only have one item selected at a time', function () {

        var selectedList;

        _.selectItem(models[0]);

        _.selectItem(models[2]);
        
        _.selectItem(models[1]);

        expect(_.getSelectedItem(models)).toEqual(models[1]);

        selectedList = _.filter(models, fnSelected);

        expect(selectedList.length).toEqual(1);

      });

    });

  });

});