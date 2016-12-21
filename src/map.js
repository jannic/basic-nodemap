// @license magnet:?xt=urn:btih:b8999bbaf509c08d127678643c515b9ab0836bae&dn=ISC.txt ISC license

var map = L.map('map').setView([50.813, 6.206], 11);

L.tileLayer('https:///tiles{s}.aachen.freifunk.net/{z}/{x}/{y}.png', {
    "subdomains": "1234",
    "attribution": "&copy; <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">OpenStreetMap-Mitwirkende</a>",
    "type": "osm",
    "maxZoom": 19
}).addTo(map);

var createMarker = function(latlng, hostname, clients, online) {
    var color = (online) ? "#1566A9" : "#B42E20";
    var fillColor = (online) ? "#5DA439": "#D43E2A";
    
    var status = (online) ? "Aktuell " + clients + " Benutzer." : "Knoten ist (vermutlich) offline."
    
    var marker = L.circleMarker(latlng, {radius: 7, weight: 1, color: color, fill: true, fillColor: fillColor, fillOpacity: 1.0});
    marker.addTo(map);
    marker.bindTooltip(hostname + "<br/>" + status);
}

var getJson = function(url, callback)
{
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "json";
    request.onload = function() {
        var status = request.status;
        if (status == 200) {
            callback(null, request.response);
        } else {
            callback(status);
        }
    };
    request.send();
}

var createNodeMarkers = function(status, data) {
    for (var i=0; i < data.nodes.length; i++) {
        var node = data.nodes[i];
        
        var clients = (node.statistics !== undefined && node.statistics.clients !== undefined) ? node.statistics.clients : 0;        
        var online = (node.flags !== undefined && node.flags.online !== undefined) ? node.flags.online : false;
        
        
        if (node.nodeinfo !== undefined)
        {
            var nodeinfo = node.nodeinfo;
            if (nodeinfo.location !== undefined && nodeinfo.location.latitude !== undefined && nodeinfo.location.longitude !== undefined) {
                
                createMarker([nodeinfo.location.latitude, nodeinfo.location.longitude], nodeinfo.hostname, clients, online);
            }
        }
    }
}

getJson("https://data.aachen.freifunk.net/nodes.json", createNodeMarkers);

// @end-license
