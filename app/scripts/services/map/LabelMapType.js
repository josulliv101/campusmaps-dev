
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

        // not needed since tilecache reset each time? if (loc.label !== true) return;

        var tile = loc.tileCache[zoom], label = _.getAttr(loc, 'label'), offset = tile.offset,

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

              'font-size': (1.5*parseInt(_.getAttr(loc, 'emphasis')) + 14) + 'px',

              'margin': '-1.15em 0 0 12px'

            }
            
          });

        div.className = 'label-tile fade-in';

        //$lbl.prepend('<i style="color:#5e9bb8;font-size:10px;font-weight:700;margin-right:4px;" class="fa fa-circle-o"></i> ');

        $lbl.appendTo(div);

        // Value may be space delimited list of classes
        if (_.isString(label)) $lbl.addClass(label);

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