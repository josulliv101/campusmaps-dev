
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

        if (loc.label !== true) return;

        var tile = loc.tileCache[zoom], offset = tile.offset,

          $lbl = DomManager.getInstance().create({ 

            tagname: 'div', 

            classname: 'label bg-lite',

            html: _.getAttr(loc, 'name'), 

            style: { 

              'min-width': '140px',

              'text-align': 'left',

              width: 'auto', 

              position: 'absolute', 

              'font-weight': 400,

              //'background': '#fff',

              top: px(offset.y), 

              left: px(offset.x),

              'font-size': '18px',

              'margin': '-1.15em 0 0 0'

            }
            
          });

        div.className = 'label-tile fade-in';

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