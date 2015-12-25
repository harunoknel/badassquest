define(['bs', 'External', 'Icon', 'InfoWindow'], function($, External, Icon, InfoWindow) {

    function StepsChain(placesService, map, game, user, steps, completedCallback) {
        this.placesService = placesService;
        this.map = map;
        this.game = game;
        this.user = user;
        this.steps = steps;
        this.completedCallback = completedCallback;
        return this;
    }

    StepsChain.prototype = {
        placesService: null,
        map: null,
        game: null,
        user: null,

        markersGarbage: [],

        steps: [],

        currentStep: null,

        // Will run once the set of steps are completed.
        completedCallback: null,

        setStepLocation: function(step) {

            if (typeof step === "undefined") {
                step = this.getNextStep();
            }

            // Placeid is not required.
            if (step.placeid) {
                var request = {placeId: step.placeid};
                this.placesService.getDetails(request, function(placeData, status) {

                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        console.error('PlacesService error: ' + status);
                        return;
                    }

                    this.addStepLocation(step, placeData);
                }.bind(this));

            } else {
                this.addStepLocation(step);
            }
        },

        getNextStep: function() {
            if (this.currentStep === null) {
                this.currentStep = 0;
            } else {
                this.currentStep++;
            }

            if (typeof this.steps[this.currentStep] === "undefined") {
                return false;
            }

            // Provide data to the step.
            this.steps[this.currentStep].setUser(this.user);
            this.steps[this.currentStep].setGame(this.game);

            return this.steps[this.currentStep];
        },

        addStepLocation: function(step, placeData) {

            // Just an "unideal" default.
            if (typeof placeData === "undefined") {
                placeData = {
                    fakePlace: true,
                    icon: Icon.getByType('idea'),
                    name: 'You arrived'
                };
            }

            // Fallback to the poi marker.
            if (step.icon === null) {
                // Fallback again to the default icon.
                step.icon = placeData.icon;
                if (placeData.fakePlace) {
                    console.error('If the step does not have a placeid you should specify a step icon');
                }
            }

            // Fallback to the poi name.
            if (step.name === null) {
                step.name = placeData.name;
                if (placeData.fakePlace) {
                    console.error('If the step does not have a placeid you should specify a step name');
                }
            }

            // Fallback to the poi position.
            if (step.position === null) {
                if (placeData.fakePlace) {
                    // Here we return because this is a required param, we can not have a generic one.
                    console.error('If the step does not have a placeid you should specify a step position');
                    return;
                }
                step.position = placeData.geometry.location;
            }

            // To execute it after the step is completed.
            step.setCompletedCallback(this.stepCompleted.bind(this));

            var marker = new google.maps.Marker({
                map: this.map,
                title: step.name,
                position: step.position,
                icon: step.icon,
                zIndex: 7
            });
            marker.setAnimation(google.maps.Animation.BOUNCE);

            // Steps may specify hints.
            if (step.hint) {
                this.addStepHint(step);
            }

            // Click listener.
            marker.addListener('click', function(e) {

                this.user.moveTo(e.latLng, function(position) {

                    // Clean previous steps garbage.
                    this.cleanGarbage();

                    // We show info if required, this might be pre-completed info, post-completed info or any
                    // info during the step process.
                    var contents = step.getInfo();
                    if (contents) {
                        this.openInfoWindow(marker, step.name, contents, step.infoWindow);
                    }

                    // It only makes sense when the step is uncompleted, the step must control what should be shown
                    // depending on its internal status.
                    if (!step.isCompleted()) {
                        step.execute();
                    }

                    if (step.isCompleted()) {
                        marker.setAnimation(null);

                        // The step can decide whether the marker is removed or not.
                        if (step.cleanIt()) {
                            // We will clean it after next point is reached as otherwise we would
                            // have to deal with onClose infoWindow.
                            this.markersGarbage.push(marker);
                        }
                    }
                }.bind(this));
            }.bind(this));
        },

        cleanGarbage: function() {
            for (var i in this.markersGarbage) {
                // TODO We might want to clean step data too if garbage remains there.
                this.markersGarbage[i].setMap(null);
            }
        },

        stepCompleted: function() {

            var nextStep = this.getNextStep();
            if (nextStep) {
                // Reveal next step.
                // TODO Play sound.
                this.setStepLocation(nextStep);
            } else {
                this.completedCallback();
            }
        },

        openInfoWindow: function(marker, name, contents, infoWindow) {

            // Initialise it if required.
            if (!infoWindow) {
                infoWindow = InfoWindow.getInstance();
            }

            var content = '<h3>' + name + '</h3>' +
                '<div class="infowindow-content">' + contents + '</div>';

            // Add some wikipedia info if available.
            //var promise = External.getWikipediaInfo(step.name);
            //promise.done(function(article) {
                //content += '<br/>' + article;
            //}).always(function() {
                InfoWindow.open({
                    map: this.map,
                    marker: marker,
                    content: content,
                    infoWindow: infoWindow,
                });
            //}.bind(this));

            return infoWindow;
        },

        addStepHint: function(step) {
            // Bit of timeout to make it look real.
            setTimeout(function() {
                $('#map').trigger('notification:add', {
                    from: step.hint.from,
                    message: step.hint.message,
                    callback: function() {
                        if (this.map.getCenter().distanceFrom(step.position) > 300) {
                            // Show both current location and next step.
                            var bounds = new google.maps.LatLngBounds(this.map.getCenter().toJSON(), step.position.toJSON());
                            this.map.fitBounds(bounds);
                        } else {
                            this.map.panTo(step.position);
                        }
                    }.bind(this)
                });
            }.bind(this), 500);
        }

    };

    return StepsChain;
});