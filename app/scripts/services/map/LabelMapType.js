
define([

      'scripts/domManager'

    , 'scripts/services/map/MapUtils'

], function(DomManager, MapUtils) {


    'use strict';


    function LabelMapType(tileSize) {

      this.tileSize = tileSize;

    }

    LabelMapType.prototype.getTile = function(coord, zoom, ownerDocument) {

      // Native innerHTML for best performance
      var div = ownerDocument.createElement('div'),

        locs = MapUtils.getLocationsFromTileCache(coord, zoom), labels, html;

        return DomManager.getInstance().getLabelTile(MapUtils.getTileZoomId(coord, zoom), ownerDocument, locs);

      //labels = _.map(locs, function(loc) { return DomManager.getInstance().createLabelHtml(loc); });

     // div.innerHTML = labels.join('');

/*          $lbl = DomManager.getInstance().create({ 

            tagname: 'div', 

            classname: 'label bg-lite',

            id: _.getAttr(loc, 'locationid'),

            html: _.getAttr(loc, 'name') + '<div class="loc-details">View details</div>', 

            style: { 

              //'min-width': '140px',
              
              padding: '4px 8px 4px 26px',

              'border-radius': '4px',

              'text-align': 'left',

              width: 'auto', 

              position: 'absolute', 

              'font-weight': 400,

              //'background': '#fff',

              top: px(offset.y), 

              left: px(offset.x),

              'font-size': (1.5*parseInt(_.getAttr(loc, 'emphasis')) + 14) + 'px',

              'margin': '-1.4em 0 0 -12px'

            }
            
          });

        div.className = 'label-tile fade-in';

        //$lbl.prepend('<i style="color:#5e9bb8;font-size:10px;font-weight:700;margin-right:4px;" class="fa fa-circle-o"></i> ');

        //if (_.getAttr(loc, 'thumbnail')) {

          $('<div/>')

            .addClass('icon-test') //thumb

            .html('<img src="./app/images/icons/map/circle_outline_center.png"/>')

            //.html('<img class="shadow" src="./app/images/thumbs/' + _.getAttr(loc, 'thumbnail') + '"/>')

            .prependTo($lbl);

        //}*/



      //div.innerHTML = locs.length;


    };

    function px(num) {

      return num + 'px';

    }
 
    return LabelMapType;

});