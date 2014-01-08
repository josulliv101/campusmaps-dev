
define([

      'scripts/domManager'

    , 'scripts/services/map/MapUtils'

], function(DomManager, MapUtils) {


    'use strict';


    function LabelMapType(tileSize) {

      this.tileSize = tileSize;

    }

    LabelMapType.prototype.getTile = function(coord, zoom, ownerDocument) {

      var div = ownerDocument.createElement('div'),

        locs = MapUtils.getLocationsFromTileCache(coord, zoom), $labels;

      $labels = _.map(locs, function(loc) {

        var tile = loc.tileCache[zoom], offset = tile.offset,

          $lbl = DomManager.getInstance().create({ 

            tagname: 'div', 

            html: _.getAttr(loc, 'name'), 

            style: { 

              'min-width': '100px', 

              position: 'absolute', 

              //background: '#fff',

              top: px(offset.y), 

              left: px(offset.x),

              'font-size': '14px'

            }
            
          });

        $lbl.appendTo(div);

        return $lbl;

      });

      //div.innerHTML = locs.length;
      
      div.style.position = 'relative';

      div.style.width = this.tileSize.width + 'px';

      div.style.height = this.tileSize.height + 'px';

      div.style.fontSize = '12';

      return div;

    };

    function px(num) {

      return num + 'px';

    }
 
    return LabelMapType;

});