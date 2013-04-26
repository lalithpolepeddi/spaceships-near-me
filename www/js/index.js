/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  initialize: function() {
    this.bindEvents();
  },
  
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  
  map: L.map('map'),
  
  onDeviceReady: function() {
    app.initializeMap();
    navigator.geolocation.getCurrentPosition(app.onLocationFound, app.onLocationError)
  },

  initializeMap: function() {
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(app.map);
  },

  onLocationFound: function(position) {
    app.map.setView([position.coords.latitude, position.coords.longitude], 14);
    app.loadSightingsNearMe(position.coords.latitude, position.coords.longitude);
  },

  onLocationError: function(error) {
    app.map.setView([37.7749295,-122.4194155], 14);
    app.loadSightingsNearMe(37.7749295,-122.4194155);
  },
  
  loadSightingsNearMe: function(lat, lng) {
    var sightingsAPI = "http://guarded-fjord-5986.herokuapp.com/sightings/";
    $.getJSON(sightingsAPI, {
      location: lat + ',' + lng,
      radius: '150',
      limit: 250
    })
    .done(function(data) {
      $.each(data.items, function(i, item) {
        L.marker([item.lat, item.lng]).addTo(app.map)
         .bindPopup('<p class="date">' + item.sighted_at + '</p><p class="location">' + item.location + '</p><p class="description">' + item.description + '</p>');       
      });
    });
  }
};
