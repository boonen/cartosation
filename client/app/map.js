var initialize = function(mapQuery, buttons) {
    // Zoom and set center to the Netherlands
    var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var toProjection = new OpenLayers.Projection("EPSG:900913"); // Transform to OSM projection
    mapQuery.olMap.zoomToExtent(OpenLayers.Bounds.fromString("3,50.5,7.3,53.6")
        .transform(fromProjection, toProjection));  

    // Add vector drawing layer with controls
    var vector = new OpenLayers.Layer.Vector("Vector");
    mapQuery.olMap.addLayer(vector);

    var drawControls = {
        point: new OpenLayers.Control.DrawFeature(vector,
            OpenLayers.Handler.Point),
        line: new OpenLayers.Control.DrawFeature(vector,
            OpenLayers.Handler.Path),
        polygon: new OpenLayers.Control.DrawFeature(vector,
            OpenLayers.Handler.Polygon)
    };
    for(var key in drawControls) {
        drawControls[key].events.register("featureadded", mapQuery.olMap, function notify(feature) {
            alert("Feature added");
        });
        mapQuery.olMap.addControl(drawControls[key]);
    }

    var toggleDrawFeatureControl = function(controlName) {
        for(key in drawControls) {
            var control = drawControls[key];
            if(controlName === null || controlName != key) {
                control.deactivate();    
            } else {
                control.activate();            
            }
        }
    };
    
    // Connect event handlers to buttons:
    buttons.drawfeature.button({
            text: false,
            icons: {
                primary: "ui-icon-pencil"
            }
        }).click(function(event) {
        var selected = null;
        if(event.target.checked) {
            selected = $("input:checked", buttons.geometrychooser)[0].id.substring(21);
        }
        toggleDrawFeatureControl(selected);
    });
    buttons.geometrychooser.buttonset();
    $("input", buttons.geometrychooser).change(function toggle(){
        if(buttons.drawfeature[0].checked) {
            toggleDrawFeatureControl($("input:checked", buttons.geometrychooser)[0].id.substring(21));
        }
    });
}