/*
 * Leaflet Tree Panel Layers v1 - 2017-11-10
 *
 * Copyright 2017 Frankie Fan
 * hustakin@gmail.com
 *
 *
 */
(function (factory) {
    if(typeof define === 'function' && define.amd) {
    //AMD
        define(['leaflet'], factory);
    } else if(typeof module !== 'undefined') {
    // Node/CommonJS
        module.exports = factory(require('leaflet'));
    } else {
    // Browser globals
        if(typeof window.L === 'undefined')
            throw 'Leaflet must be loaded first';
        factory(window.L);
    }
})(function (L) {

L.Control.TreePanelLayers = L.Control.Layers.extend({

	//
	//Events:
	//	Event				Data passed		Description
	//
	//	panel:selected		{layerDef}		fired when an item of panel is added
	//	panel:unselected	{layerDef}		fired when an item of panel is removed
	//
	//Methods:
	//	Method 			Data passed		Description
	//
	//	addTreeLayer	{panel items}	add new layer items defition to tree panel
	//	removeLayer	    {panel item}	remove layer item from panel
	//

	options: {
		compact: false,
		collapsed: false,
		autoZIndex: true,
		collapsibleGroups: false,
		buildItem: null,				//function that return row item html node(or html string)
		title: '',						//title of panel
		className: '',					//additional class name for panel
		position: 'topright'
	},

	initialize: function (options) {
		L.setOptions(this, options);
		this._layers = [];
		this._parents = [];
		this._layerControlInputs = [];
	},

	onAdd: function (map) {
		var self = this;
		L.Control.Layers.prototype.onAdd.call(this, map);

		this._container.className += ' leaflet-treepanel-layers';

		return this._container;
	},

	// @method addOverlay(layer: Layer, name: String): this
	// Adds an overlay (checkbox entry) with the given name to the control.
	addTreeOverlay: function (parent, children) {
		this._addLayer(parent, children);
		return (this._map) ? this._update() : this;
	},

	_addLayer: function (parent, children) {
        this._parents.push({
            name: parent.name,
            icon: parent.icon,
            items: children.length
        });

		for (var i = 0; i < children.length; i++) {
		    var child = children[i];

            if (this._map) {
                child.layer.on('add remove', this._onLayerChange, this);
            }

            this._layers.push({
                layer: child.layer,
                name: child.name,
                icon: child.icon,
                color: child.color,
                overlay: true
            });

            if (this.options.sortLayers) {
                this._layers.sort(L.bind(function (a, b) {
                    return this.options.sortFunction(a.layer, b.layer, a.name, b.name);
                }, this));
            }

            if (this.options.autoZIndex && child.layer.setZIndex) {
                this._lastZIndex++;
                child.layer.setZIndex(this._lastZIndex);
            }
		}

		this._expandIfNotCollapsed();
	},

	/**
        parent: {
            name: String,
            icon: String
        }
        child: {
            layer: Layer,
            name: String,
            icon: String,
            color: String
        }
    */
	_addItem: function (parent, children) {
        var parent_icon = document.createElement("div");
        parent_icon.innerHTML = parent.icon;

        var parent_span = document.createElement('span');
        parent_span.innerText = parent.name;

        var parent_li = document.createElement('li');
        parent_li.className = 'level-one';
        parent_li.appendChild(parent_icon);
        parent_li.appendChild(parent_span);

        this.topUl.appendChild(parent_li);

        var ul = document.createElement('ul');
        ul.className = 'level-two';
        parent_li.appendChild(ul);

		for (var i = 0; i < children.length; i++) {
		    var child = children[i];
			var checked = this._map.hasLayer(child.layer);

            var icon = document.createElement("div");
            icon.innerHTML = child.icon;

            var icon_i = icon.firstChild;
            if(icon_i)
                icon_i.style.color = child.color;

            var input = document.createElement('input');
            input.type = 'checkbox';
			input.defaultChecked = checked;
            var label = document.createElement('label');
            label.appendChild(input);

		    this._layerControlInputs.push(input);
		    input.layerId = L.stamp(child.layer);
		    L.DomEvent.on(input, 'click', this._onInputClick, this);

            var text = document.createTextNode(child.name);
            label.appendChild(text);

            var li = document.createElement('li');
            li.appendChild(icon);
            li.appendChild(label);

            ul.appendChild(li);
		}

		this._checkDisabledLayers();
	},

	_update: function () {
		if (!this._container) { return this; }

		empty(this._overlaysList);
        this.topUl = document.createElement('ul');
        this.topUl.className = 'treepanel';
		this._overlaysList.appendChild(this.topUl);

		this._layerControlInputs = [];
		var overlaysPresent, i, child;

		for (var i = 0, k = 0; i < this._parents.length; i++) {
		    var parent = this._parents[i];

            var children = [];
            for (var j = 0; j < parent.items; j++, k++) {
                child = this._layers[k];
                children.push(child);
            }

            this._addItem(parent, children);
        }

        this._separator.style.display = 'none';
		return this;
	}

});

// @function empty(el: HTMLElement)
// Removes all of `el`'s children elements from `el`
function empty(el) {
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
}

//To support the on/off events
L.Control.TreePanelLayers.include(L.Evented.prototype);

L.control.treePanelLayers = function (baseLayers, overlays, options) {
	return new L.Control.TreePanelLayers(baseLayers, overlays, options);
};

return L.Control.TreePanelLayers;

});
