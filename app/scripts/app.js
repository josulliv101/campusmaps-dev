
define([

    'jquery',

    'scripts/controllers/appController'

], function($, AppController) {

    'use strict';

    function App(settings) {

        this.settings = settings || {};

        console.log('App::constructor', this.settings);

        this.init_();

    }
    
    App.prototype.init_ = function() {

        var controller;

        if (!this.settings.el) throw new Error('A root DOM element is required.');

        controller = new AppController(this.settings.el);

        $.when( controller.getData() )

         .done(function(data) { 

            console.log('data', data);

            controller.processRoute();

         })

         .fail(function() {

            throw new Error('Error fetching data.');
            
         });

    }
 
    return App;

});
