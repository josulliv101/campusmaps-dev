
define([

    'jquery',

    '_mixins',

    'mapstyles',

    'datastore',

    'scripts/services/map/LabelMapType',

    'scripts/services/map/MapUtils',

    'scripts/domManager',

    'eventdispatcher',

    'async!http://maps.google.com/maps/api/js?sensor=false'

], function($, _, MapStyles, Datastore, LabelMapType, MapUtils, DomManager, EventDispatcher) {

    'use strict';

    // google object is now available
    
    var gMap, getMarker;

    getMarker = _.memoize(getMarker_, function(model) { return _.getAttr(model, 'locationid'); });

    function init_(el, latlng, zoom) {    

        createMap_.apply(this, arguments);

    }

    function refresh_(latlng) {    

        gMap.panTo(getLatLng(latlng));

    }

    function setCenter_(latlng, offset, zoom) {    

        var ll = _.latLng(latlng), offsetLatLng;

        zoom || (zoom = gMap.getZoom());

        offset || (offset = this.mapCenterOffset || { x: 0, y: 0 });

        if (!ll) return;

        ll = { lat: ll[0], lng: ll[1] };

        offsetLatLng = MapUtils.offsetLatLngByPixels(ll, zoom, offset);

        gMap.panTo(getLatLng(offsetLatLng));

    }

    function getLatLng(latlng) {

        var ll = _.isString(latlng) ? _.latLng(latlng) : latlng;

        return _.isArray(ll) ? new google.maps.LatLng(ll[0], ll[1]) : new google.maps.LatLng(ll.lat, ll.lng);

    }

    function refreshLabels_(models) {  

        console.log('refreshLabels_', models.length, models[0]);

        var DM = DomManager.getInstance(), hasDetails;

        _.each(models, function(loc) {

            var offsetLatLng, $el, dimensions, southwestLatLng, northeastLatLng, bounds;

            if (!loc) return;

            $el = DM.refreshLabel(loc);

            //if (loc.details !== true || !$el) return;

// Memoize setting bounds?

            if (!$el) return;

            if (loc.details === true) hasDetails = true;;

            offsetLatLng = MapUtils.offsetLatLngByPixels({ lat: _.latLng(loc.latlng)[0], lng: _.latLng(loc.latlng)[1] }, loc.zoom, { x: hasDetails ? 16 : -8, y: 10 });

            dimensions = DM.getDimensions($el.find('.txt'));

            southwestLatLng = MapUtils.offsetLatLngByPixels(offsetLatLng, loc.zoom, { x: 0, y: -dimensions.height });

            northeastLatLng = MapUtils.offsetLatLngByPixels(offsetLatLng, loc.zoom, { x: -dimensions.width, y: 0 });

            bounds = new google.maps.LatLngBounds(getLatLng(southwestLatLng), getLatLng(northeastLatLng));

            loc.bounds = bounds;

            if (!hasDetails) return;

            gMap.clickRect.setBounds(bounds);

        });

        gMap.clickRect.setMap(hasDetails !== true ? null : gMap);

    }

    function handleTileMouseover_(tileid) { 

        console.log('handleTileMouseover_', tileid);

    }

    function refreshIcons_(models) { 

        console.log('refreshIcons_', models.length);

    }

    function refreshAll_(models) { 

        console.log('refreshAll_', models.length);

    }

    function renderLabels_(models) {

        console.log('renderLabels_', models.length);

        if (gMap.overlayMapTypes.length === 1) gMap.overlayMapTypes.removeAt(0);

        gMap.overlayMapTypes.insertAt(0, gMap.labelStrategy);    

    }

    function getMarker_(model) {

        var marker, icon = { 

            url: model.icon,  

            size: new google.maps.Size(16, 16),

            origin: new google.maps.Point(0,0),

            anchor: new google.maps.Point(8, 8)

        };

        //alert('creating marker');

        marker = _.extend(model, { icon: _.isString(model.icon) ? icon : null, visible: false, clickable: true, map: gMap, position: getLatLng(model.latlng) });

        return new google.maps.Marker(marker);

    }

    function renderIcons_(models) {

        _.each(models, getMarker);
/*
        var markers;

//return;

        console.log('renderIcons_', models.length);

        clear_();

        //gMap.markers = 

                    _.chain(models)

                        .reject(function(model) {

                            return model.icon === false;

                        })

                        .map(getMarker)

                        .each(function(marker) {

                            google.maps.event.addListener(marker, 'click', function() {

                                var locationid = _.getAttr(marker, 'locationid');

                                console.log('click', this);

                                DomManager.getInstance().$root.find('.label.active').removeClass('active fade-in shadow');


                                EventDispatcher.trigger('truthupdate', { details: locationid }); // locationid: locationid,

                            });

                            google.maps.event.addListener(marker, 'mouseover', function() {

                                //var selectedTileOffset = marker.tileCache[marker.zoom],

                                    //cache = MapUtils.getLocationsFromTileCache(selectedTileOffset.tile, marker.zoom);



                                //DomManager.getInstance().$root.find('.label.active').removeClass('active fade-in shadow');

                               //... refreshLabels_([marker]);

                                //_.each(hideMarkers, function(marker) { marker.setMap(null); });

                                //debugger;

                            });

                            google.maps.event.addListener(marker, 'mouseout', function() {

                                // DomManager.getInstance().$root.find('.label.active').removeClass('active fade-in shadow');

                                // refreshLabels_([]);

                                // _.each(gMap.markers, function(m) { 

                                //     if (!m.getMap()) m.setMap(gMap);

                                // })

                            });

                        })

                        .value();
*/
        return this;

    }

    function render_(models) {

        console.log('render_ (icons & labels)', models.length);

        //renderIcons_(models);

        //renderLabels_(models);

        return this;

    }

    function setCursor_(id) {

        gMap.setOptions({ draggableCursor: id });

    }

    function setPanorama_(obj) {

        alert('setPanorama_');

    }

    function setPanoramaHighlight_(model) {

        //alert('setPanoramaHighlight_');
        //debugger;

        gMap.panoramahighlight ||  (gMap.panoramahighlight = new google.maps.Marker({ 
/*
                                            icon: { 

                                                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, 

                                                scale: 2,

                                                rotation: 90 

                                            }, 
                                            */

                                            map: gMap 

                                        })

                                    );
        
        if (_.isString(model.latlng)) {

            gMap.panoramahighlight.setPosition(getLatLng(model.latlng));

            gMap.panoramahighlight.setIcon({ 

                //path: google.maps.SymbolPath.FORWARD_OPEN_ARROW, 

                path: 'M-27,64.363c14.432,15.477,38.634,16.322,54.111,1.89L0.056,0L-27,64.363z',

                scale: .4,

                strokeWeight: 1,

                strokeColor: '#f8f8f8',

                strokeOpacity: .3,

                fillOpacity: .2,

                fillColor: '#333',

                rotation: model.heading - 180 || 0,

                anchor: { x: 0, y: -12 }

            });

            gMap.panoramahighlight.setVisible(true);

        } else {

            gMap.panoramahighlight.setVisible(false);

        }
        
    }

    function showPanoramas_(objs) {

        var thePanorama = gMap.thePanorama;

        // Clear any existing
        _.each(gMap.panoramas, function(marker) { 

            google.maps.event.clearInstanceListeners(marker);

            marker.setMap(null);

            marker = null; 

        });

        _.each(objs, function(panorama) {

            var marker;

            if (!panorama.latlng) return;

                marker = new google.maps.Marker({

                    position: getLatLng(panorama.latlng),

                    map: gMap,

                    icon: {

                        url: './app/images/icons/map/' + (panorama.type && panorama.type === 'photo' ? 'photo-dot.png' : 'pegman.png'),

                        anchor: { x: 6, y: 6 }

                    }, 

                    title: 'Streetview'

                });

                _.extend(marker, panorama);

                google.maps.event.addListener(marker, 'click', function() {

                    //alert('streetview marker clicked');

                    // Exclude any marker specific attributes
                    EventDispatcher.trigger('truthupdate', { panoramadetails: _.pick(marker, 'heading', 'latlng', 'pitch', 'photo', 'zoom') });

                    thePanorama.setPosition(marker.getPosition());

                    thePanorama.setPov({

                        heading: marker.heading,

                        pitch: marker.pitch

                    });

                    thePanorama.setVisible(true);/**/

                });

                google.maps.event.addListener(marker, 'mouseover', function() {

                    console.log('streetview marker mouseover', marker);

                    EventDispatcher.trigger('truthupdate', { 

                        photowide: MapUtils.getStreetviewStaticUrl(marker),

                        panoramahighlight: _.pick(marker, 'heading', 'latlng')

                    });

                });

                google.maps.event.addListener(marker, 'mouseout', function() {

                    console.log('streetview marker mouseout', marker);

                    EventDispatcher.trigger('truthupdate', { 

                        photowide: '', 

                        panoramahighlight: ''

                    });

                });

              gMap.panoramas.push(marker);

        });

    }

    function setZoom_(level) {

        level = parseInt(level);

        console.log('gmap setZoom_..', level);

        gMap.setZoom(level);/**/

    }

    function setMapType_(maptype) {

        console.log('gmap setMapType_..', maptype);

        maptype || (maptype = google.maps.MapTypeId.ROADMAP);

        gMap.setMapTypeId(maptype);

    }

    function clear_() {

        //alert(gMap.markers.length);

        _.each(gMap.markers, function(marker) { 

            google.maps.event.clearInstanceListeners(marker);

            marker.setMap(null);

            //marker = null; 

        });

    }

    function handleLatLng_(e, zoom) {

        var latlng, tileoffset, locs, locAtLatLng;

        latlng = e.latLng;

        tileoffset = MapUtils.latLngToTileOffset_({ lat: latlng.lat(), lng: latlng.lng() }, zoom);

console.log('latlng', latlng);

        EventDispatcher.trigger('truthupdate', { tile: MapUtils.getTileZoomId(tileoffset.tile, zoom) });

        // Include surrounding tiles in case loc ui spills over onto neighbor tile
        locs = MapUtils.getCloseByLocationsFromTileCache(tileoffset.tile, zoom);
debugger;
        locAtLatLng = _.chain(locs)

                       .reject(function(loc) { return loc.hide === true; })

                       .map(function(loc) { 

                          var latlng = loc.latlng,

                              tile = MapUtils.latLngToTileOffset_({ lat: latlng[0], lng: latlng[1] }, zoom),

                              offset = MapUtils.getAdjustedOffset(tile.offset, tileoffset.tile, tile.tile);

                          return { bounds: loc.bounds, locationid: loc.locationid, offset: offset, latlng: loc.latlng };

                       })

                       .find(function(obj) {

/*new google.maps.Rectangle({

            strokeColor: '#FF0000',

            strokeOpacity: 0.31,

            strokeWeight: 0,

            fillColor: '#6699cc',

            fillOpacity: 0.2,

            map: gMap,

            bounds: obj.bounds,

            clickable: false
            
        });*/

                            return obj.bounds.contains(latlng) || Math.abs(tileoffset.offset.x - obj.offset.x) < 12 && Math.abs(tileoffset.offset.y - obj.offset.y) < 12;

                       })

                       .value();

        return locAtLatLng;

    }

    function createMap_(el, latlng, zoom) {

        gMap = new google.maps.Map(el, {

            center: new google.maps.LatLng(latlng[0], latlng[1]),

            zoom: zoom,

            styles: MapStyles.styles,

            mapTypeId: google.maps.MapTypeId.ROADMAP,

            navigationControl: true,

            navigationControlOptions: {

                style: google.maps.NavigationControlStyle.SMALL
                
            },

            panControl: false,

            zoomControl: false,

            mapTypeControl: false,

            streetViewControl: true,

            streetViewControlOptions: {

                position: google.maps.ControlPosition.RIGHT_BOTTOM

            }


        });

        gMap.clickRect = new google.maps.Rectangle({

            strokeColor: '#FF0000',

            strokeOpacity: 0.31,

            strokeWeight: 0,

            fillColor: '#6699cc',

            fillOpacity: 0.3,

            map: null,

            bounds: null
            
        });

        gMap.panoramas = [];

        google.maps.event.addListener(gMap.clickRect, 'click', function() {

            console.log('rect clicked');

            //EventDispatcher.trigger('truthupdate', { detailsview: '+' });

            EventDispatcher.trigger('detailsview:increment');

        });

        console.log('LabelMapType', LabelMapType);

        gMap.labelStrategy = new LabelMapType(new google.maps.Size(256, 256));

        gMap.overlayMapTypes.insertAt(0, gMap.labelStrategy);

        //gMap.markers = [];

        gMap.thePanorama = gMap.getStreetView();

        gMap.thePanorama.setOptions({

          addressControl: false

        });

        google.maps.event.addListenerOnce(gMap, 'tilesloaded', function() {

            google.maps.event.addListener(gMap.thePanorama, 'visible_changed', function() {

                EventDispatcher.trigger('truthupdate', { streetview: gMap.thePanorama.getVisible() });

            });
/*
            // Hack to give map keyboard focus
            //$("#map-canvas div:first div:first div:first").trigger('click');

            $("#map-canvas a").attr('tabindex', -1);

*/
        });

/*        google.maps.event.addListener(gMap, 'dragend', function(ev) {

            EventDispatcher.trigger('truthupdate', { latlng: gMap.getCenter().toUrlValue() });

        });*/

       google.maps.event.addListener(gMap, 'zoom_changed', function(ev) {

            EventDispatcher.trigger('truthupdate', { zoom: this.getZoom() });

        });
 
        google.maps.event.addListener(gMap, 'click', function(ev) {

            //EventDispatcher.trigger('truthupdate', { details: '', cmd: '' });
            
            var loc, id, cmd, attrs, zoom = gMap.getZoom();

            loc = handleLatLng_(ev, zoom);

            id = (loc && loc.locationid || '');

            cmd = (loc && loc.locationid ? 'Location' : '');

            attrs = { details: id, highlight: id, cmd: cmd };
// Do at global level so works for keyboard control as well
/*            if (loc && loc.locationid) {

                attrs.latlng = loc.latlng[0] + ',' + loc.latlng[1];

            }*/

            EventDispatcher.trigger('truthupdate', attrs);

        });

        google.maps.event.addListener(gMap, 'mousemove', function (ev) { // _.throttle()
          
          var loc, attrs, zoom = gMap.getZoom(); //, tileoffset, locs, id, closest;

          loc = handleLatLng_(ev, zoom);
        
          attrs = _.isObject(loc) 

                    ? { highlight: loc.locationid, cursor: 'pointer' } 

                    : { highlight: '', cursor: '' };

          EventDispatcher.trigger('truthupdate', attrs);

        }, 40);

/*        EventDispatcher.on('maptype', function(maptype) {

            //var maptype = (type === 'satellite' ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP);

            console.log('heard maptype event', maptype);

            gMap.setMapTypeId(maptype);

        });*/


    }

    return {

        init: init_,

        refresh: refresh_,

        refreshIcons: refreshIcons_,

        refreshLabels: refreshLabels_,

        refreshAll: refreshAll_,

        renderLabels: renderLabels_,

        renderIcons: renderIcons_,

        render: render_,

        setZoom: setZoom_,

        setCursor: setCursor_,

        setCenter: setCenter_,

        setMapType: setMapType_,

        setPanorama: setPanorama_,

        setPanoramaHighlight: setPanoramaHighlight_,

        showPanoramas: showPanoramas_,

        handleTileMouseover: handleTileMouseover_,

        clear: clear_

    };

});
