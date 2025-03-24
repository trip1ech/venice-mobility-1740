var map, featureList, traghettoSearch = [], squeroSearch = [];

// 調整地圖控制層的大小
$(window).resize(function() {
  sizeLayerControl();
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = traghettoLayer.getLayer(id) || squeroLayer.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
}

/* Sidebar Sync */
function syncSidebar() {
  $("#feature-list tbody").empty();

  // Home Layer
  homeLayer.eachLayer(function (layer) {
    if (map.hasLayer(homeLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) +
          '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng +
          '"><td style="vertical-align: middle;"><span style="color:blue;">●</span></td><td class="feature-name">' +
          layer.feature.properties.person + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });

  // Work Layer
  workLayer.eachLayer(function (layer) {
    if (map.hasLayer(workLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) +
          '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng +
          '"><td style="vertical-align: middle;"><span style="color:red;">●</span></td><td class="feature-name">' +
          layer.feature.properties.person + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });

  featureList = new List("features", { valueNames: ["feature-name"] });
  featureList.sort("feature-name", { order: "asc" });
}

/* Basemap Layers */
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
});

// MapTiler XYZ Tiles Layer
var maptilerLayer = L.tileLayer("https://api.maptiler.com/tiles/1f38bb64-40ab-4980-bdce-df0d13b460a4/{z}/{x}/{y}.png?key=YPQX1dG9We5qb251uLii", {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> contributors'
});

// MapTiler XYZ Tiles Layer
var maptilerLayer1674 = L.tileLayer("https://api.maptiler.com/tiles/e17bec18-0898-4e08-be7f-bfd12b7fabe0/{z}/{x}/{y}.png?key=oJLqiL9uMtWAbb17sG6I", {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> contributors'
});

// MapTiler XYZ Tiles Layer
var maptilerLayer1808 = L.tileLayer("https://geo-timemachine.epfl.ch/geoserver/www/tilesets/venice/sommarioni/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: '© EPFL Time Machine'
});

// 定義一個顏色映射函數，根據 flow 值給顏色
function getFlowColor(flow) {
  return flow > 200 ? "red" :
         flow > 100 ? "orange" :
         flow > 50  ? "yellow" :
         "green"; // 根據 flow 值設置顏色
}

// 加入 edges_with_flow.geojson 圖層
var flowLayer = L.geoJson(null, {
  style: function (feature) {
    var flow = feature.properties.flow || 0;
    return {
      color: getFlowColor(flow),  // 動態設置顏色
      weight: Math.max(1, Math.min(flow / 50, 7)),  // 根據 flow 設置粗細
      opacity: 0.8
    };
  },
  onEachFeature: function (feature, layer) {
    var popupContent = "<b>Flow: </b>" + feature.properties.flow;
    layer.bindPopup(popupContent);
  }
});


$.getJSON("data/edges_with_flow.geojson", function (data) {
  flowLayer.addData(data);
});

var streetTraghettoLayer = L.geoJson(null, {
  style: function (feature) {
    var type = feature.properties.Type || "road";
    return {
      color: type === "traghetto" ? "blue" : "black",  // 藍色代表 traghetto，黑色代表 road
      weight: 2,
      opacity: 0.6
    };
  },
  onEachFeature: function (feature, layer) {
    var popupContent = "<b>Type: </b>" + feature.properties.Type;
    layer.bindPopup(popupContent);
  }
});

$.getJSON("data/1808_street_traghetto_route.geojson", function (data) {
  streetTraghettoLayer.addData(data);
});

/* Overlay Layers */
// Home Layer
var homeLayer = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 2, // 圓點大小
      fillColor: "blue", // 填充顏色 (Work 為紅色)
      color: "blue", // 邊框顏色
      weight: 1,
      opacity: 0.6,
      fillOpacity: 0.6
    });
  },
  onEachFeature: function (feature, layer) {
    var popupContent = "<b>Person: </b> " + feature.properties.person + "<br>" +
                       "<b>Home Role: </b> " + feature.properties.home_role + "<br>" +
                       "<b>Home Function: </b> " + feature.properties.home_function;
    layer.bindPopup(popupContent);
  }
});

$.getJSON("data/od_home.geojson", function (data) {
  homeLayer.addData(data);
  syncSidebar();
});

// Work Layer
var workLayer = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 2, // 圓點大小
      fillColor: "red", // 填充顏色 (Work 為紅色)
      color: "red", // 邊框顏色
      weight: 1,
      opacity: 0.6,
      fillOpacity: 0.6
    });
  },
  onEachFeature: function (feature, layer) {
    var popupContent = "<b>Person: </b> " + feature.properties.person + "<br>" +
                       "<b>Work Role: </b> " + feature.properties.work_role + "<br>" +
                       "<b>Work Function: </b> " + feature.properties.work_function;
    layer.bindPopup(popupContent);
  }
});


$.getJSON("data/od_work.geojson", function (data) {
  workLayer.addData(data);
  syncSidebar();
});

/* Basemap Layers */
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

/* Map Initialization */
map = L.map("map", {
  zoom: 13,
  center: [45.4408, 12.3155],
  layers: [cartoLight, homeLayer, workLayer],
  zoomControl: false,
  attributionControl: false
});

var baseLayers = {
  "Street Map": cartoLight,
  "Map1751": maptilerLayer,       // 1751年地圖
  "Map1674": maptilerLayer1674,   // 1674年地圖
  "Map1808": maptilerLayer1808    // 新增的 1808 地圖
};

var groupedOverlays = {
  "Points of Interest": {
    "<span style='color:blue;'>●</span> Home": homeLayer,
    "<span style='color:red;'>●</span> Work": workLayer
  },
  "Street Networks": {
    "Edges with Flow": flowLayer,
    "Street + Traghetto": streetTraghettoLayer
  }
};



// 將新圖層加入到地圖中
map.addLayer(flowLayer);
map.addLayer(streetTraghettoLayer);
L.control.groupedLayers(baseLayers, groupedOverlays, { collapsed: false }).addTo(map);

/* Map Event Listeners */

map.on("moveend", syncSidebar);
map.on("overlayadd", syncSidebar);
map.on("overlayremove", syncSidebar);

/* Typeahead Search */
$(document).one("ajaxStop", function () {
  featureList = new List("features", { valueNames: ["feature-name"] });
  featureList.sort("feature-name", { order: "asc" });

  var traghettoBH = new Bloodhound({
    name: "Traghetto",
    datumTokenizer: function (d) { return Bloodhound.tokenizers.whitespace(d.name); },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: traghettoSearch,
    limit: 10
  });

  var squeroBH = new Bloodhound({
    name: "Squero",
    datumTokenizer: function (d) { return Bloodhound.tokenizers.whitespace(d.name); },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: squeroSearch,
    limit: 10
  });

  traghettoBH.initialize();
  squeroBH.initialize();

  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  }, {
    name: "Traghetto",
    displayKey: "name",
    source: traghettoBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Traghetto</h4>"
    }
  }, {
    name: "Squero",
    displayKey: "name",
    source: squeroBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Squero</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Traghetto") {
      map.setView([datum.lat, datum.lng], 17);
    }
    if (datum.source === "Squero") {
      map.setView([datum.lat, datum.lng], 17);
    }
  });
});

/* Sidebar Click Event */
$(document).on("click", ".feature-row", function(e) {
  var id = parseInt($(this).attr("id"), 10);
  sidebarClick(id);
});

$(document).ready(function() {
  $("#displayField").change(function() {
    syncSidebar();
  });
  syncSidebar();
  $("#loading").hide();
});