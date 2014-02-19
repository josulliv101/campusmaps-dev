
define([

    'underscore',

    'app', 

    'scripts/moduleManager', 

    'scripts/domManager', 

    'datastore'

], function(_, App, ModuleManager, DomManager, Datastore) {

    'use strict';

    var vizpath = ModuleManager.getVizPath(),

        DM = DomManager.getInstance();

    if (require === undefined) return;

    // Adjusts some paths based on feature detection
    ModuleManager.setPathsMap(require);

    function campusmap_(el, settings) {

        require([ 'scripts/views/locationdetails', 'scripts/controllers/locationDetailsController', 'scripts/views/searchbox', 'scripts/controllers/searchboxController', 'animationCSS'], function (LocationDetailsView, LocationDetailsController, SearchboxView, SearchboxController, Animation) {

            var app, theSettings, root = el,

                sbView = new SearchboxView({ el: root, model: Datastore.Factory.model() }),

                locDetailsView = new LocationDetailsView({ el: root, model: Datastore.Factory.model() }),

                sbController = new SearchboxController(sbView, Animation),

                locDetailsController = new LocationDetailsController(locDetailsView);


            DM.render(root, sbView);

            DM.render(root, locDetailsView);

            theSettings = _.extend({ vizpath: vizpath }, settings);

            app = new App(root, theSettings);

            app.init();

        });

    }
 
    return {

        CampusMap: campusmap_

    };

});
