define(['fontawesomeMarkers'], function(fontawesomeMarkers) {

    var typeIcons = {
        angry: {
            icon: fontawesome.markers.CLOUD,
            color: '#FF2821'
        },
        idea: {
            icon: fontawesome.markers.LIGHTBULB_O,
            color: '#dfff98'
        },
        home: {
            icon: fontawesome.markers.HOME,
            color: '#95c355'
        },
        done: {
            icon: fontawesome.markers.FLAG,
            color: '#95c355'
        },
        institution: {
            icon: fontawesome.markers.UNIVERSITY,
            color: '#fce580'
        },
        police: {
            icon: fontawesome.markers.TAXI,
            color: '#6270d6'
        },
        health: {
            icon: fontawesome.markers.H_SQUARE,
            color: '#e15c5c'
        },
        shop: {
            icon: fontawesome.markers.SHOPPING_CART,
            color: '#2196f3'
        },
        wealth: {
            icon: fontawesome.markers.MONEY,
            color: '#95c355'
        },
        hackable: {
            icon: fontawesome.markers.FAX,
            color: '#D2CE44'
        },
        food: {
            icon: fontawesome.markers.CUTLERY,
            color: 'grey'
        },
        interest: {
            icon: fontawesome.markers.UNIVERSITY,
            color: 'blue'
        },
        comment: {
            icon: fontawesome.markers.COMMENTING_O,
            color: 'white'
        }
    };

    return {

        getByType: function(type, scale) {

            if (typeof scale === "undefined") {
                scale = 1;
            }

            return {
                path: typeIcons[type].icon,
                scale: scale,
                strokeWeight: 1,
                strokeColor: 'black',
                strokeOpacity: 1,
                fillColor: typeIcons[type].color,
                fillOpacity: 1,
            };
        },

        getByFont: function(font, color, scale) {

            if (typeof scale === "undefined") {
                scale = 1;
            }

            if (typeof color === "undefined") {
                color = '#dfff98';
            }

            return {
                path: fontawesome.markers[font],
                scale: scale,
                strokeWeight: 1,
                strokeColor: 'black',
                strokeOpacity: 1,
                fillColor: color,
                fillOpacity: 1,
            };

        },

        get: function(placeTypes, poiTypes, scale) {

            if (typeof scale === "undefined") {
                scale = 1;
            }

            if (typeof poiTypes === "undefined") {
                poiTypes = null;
            }

            // Convert to array if single type is passed.
            if (typeof placeTypes === "string") {
                placeTypes = [placeTypes];
            }

            var type = null;
            for(var i = 0; i < placeTypes.length; i++) {
                if (poiTypes && poiTypes.hasOwnProperty(placeTypes[i])) {
                    type = poiTypes[placeTypes[i]];

                    return {
                        path: typeIcons[type].icon,
                        scale: scale,
                        strokeWeight: 1,
                        strokeColor: 'black',
                        strokeOpacity: 1,
                        fillColor: typeIcons[type].color,
                        fillOpacity: 1,
                    };
                }
            }

            console.error('No place type found for placetypes ' + placeTypes.join(','));

            // Return a generic one.
            return {
                path: fontawesome.markers.MAP_MARKER,
                scale: scale,
                strokeWeight: 1,
                strokeColor: 'black',
                strokeOpacity: 1,
                fillColor: 'white',
                fillOpacity: 1,
            };
        }
    };
});
