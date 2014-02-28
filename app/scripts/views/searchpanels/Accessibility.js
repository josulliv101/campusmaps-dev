define([

    'searchpanels/base'

    , 'eventdispatcher'

], function(Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'Accessibility'/*,

        handleOpenPreState: function() {

            var state = this.model.get('state');
            
            if (state !== 'openPre') return;

            //EventDispatcher.trigger('truthupdate', { labelstrategy: 'big', accessibility: true }); 
            
            //EventDispatcher.trigger('truthupdate', { accessibility: true }); 

        },

        handleClosePreState: function() {

            var state = this.model.get('state');
            
            if (state !== 'closePre') return;

            //EventDispatcher.trigger('truthupdate', { labelstrategy: '', accessibility: false });
            
            //EventDispatcher.trigger('truthupdate', { accessibility: false }); 

        }*/

    });

});
