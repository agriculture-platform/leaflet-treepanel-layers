Leaflet TreePanel Layers
==============

Leaflet Control Layers extended with support 2-layer tree and icons

Copyright [Frankie Fan](hustakin@gmail.com)

Tested in Leaflet 1.1.0+

**demo:**
![Demo](https://github.com/hustakin/leaflet-treepanel-layers/blob/master/images/demo.jpg)


**Source code:**  
[Github](https://github.com/hustakin/leaflet-panel-layers)


#Usage

**Panel Item Definition formats**
```javascript
    var parent = {
        name: 'Parent Node',
        icon: '<i class="fa fa-home"></i>'
    };
    var parent2 = {
        name: 'Parent Node 2',
        icon: '<i class="fa fa-home"></i>'
    };
```
```javascript
    var testLayer = L.marker([-54.9158558529102, 122.286912370614]);
    var child1 = {
        layer: testLayer,
        name: 'Sub Node 1',
        icon: '<i class="glyphicon glyphicon-info-sign"></i>',
        color: 'green'
    };
    
    var testLayer2 = L.marker([-53.9158558529102, 121.286912370614]);
    var child2 = {
        layer: testLayer2,
        name: 'Sub Node 2',
        icon: '<i class="fa fa-map-signs"></i>',
        color: '#123456'
    };
    var children = [child1, child2];
    
    var testLayer3 = L.marker([-55.9158558529102, 125.286912370614]);
    var child3 = {
        layer: testLayer3,
        name: 'Sub Node 2_1',
        icon: '<i class="glyphicon glyphicon-info-sign"></i>',
        color: 'yellow'
    };
    var children2 = [child3];
```
```javascript
    var treePanelLayers = L.control.treePanelLayers();
    this.map.addControl(treePanelLayers);
    
    treePanelLayers.addTreeOverlay(parent, children);
    treePanelLayers.addTreeOverlay(parent2, children2);
```