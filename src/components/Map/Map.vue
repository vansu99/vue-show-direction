<template>
  <div class="panel">
    <div class="map-box route">
      <div id="map"></div>
    </div>
    <div class="map-actions">
      <p v-if="address">
        Your location: <span>{{ address }}</span>
      </p>
      <button class="btn" @click="handleLocateCurrent">Your Location</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

export default {
  name: "Map",
  data() {
    return {
      accessToken: "pk.eyJ1IjoiYmF0Y3Jhenk3NDEiLCJhIjoiY2txNjRkMWsyMHY3eTJ4bnR1cWRkYXZqZiJ9.62M5-Fnm7f16nc1Uh_HpOQ",
      coords: {},
      map: null,
      enteredAddress: "",
      address: "",
      center: [108.2772, 14.0583],
      startCoord: [],
      destiCoord: [],
      routeData: [],
    };
  },

  mounted() {
    this.map = this.getMap(this.center, 7, "map");
    this.map.on("load", () => {
      this.map.resize();
    });
  },

  methods: {
    // init map
    getMap: function (center, zoom, container) {
      //let destPoint;
      mapboxgl.accessToken = this.accessToken;
      if (center.length > 1) {
        const map = new mapboxgl.Map({
          container,
          style: "mapbox://styles/mapbox/streets-v11",
          center,
          zoom,
        });

        const geocoder = new MapboxGeocoder({
          // Initialize the geocoder
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          marker: { color: "orange" },

          placeholder: "Search for places in Berkeley",
        });

        geocoder.on("result", async ({ result }) => {
          const destCoords = result.center;
          const resGEO = await axios.get(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${this.startCoord[0]},${this.startCoord[1]};${destCoords[0]},${destCoords[1]}?geometries=geojson&access_token=${this.accessToken}`
          );
          this.routeData = resGEO.data.routes[0].geometry;
          map.addLayer({
            id: "route",
            type: "line",
            source: {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: this.routeData,
              },
            },
            paint: {
              "line-width": 7,
              "line-color": "rgba(0, 0, 0, 0.25)",
            },
          });
        });

        map.addControl(geocoder);
        return map;
      }
    },

    // init user marker
    setMapboxMarker: function (pos, map) {
      new mapboxgl.Marker({
        draggable: true,
        color: "blue",
      })
        .setLngLat(pos)
        .addTo(map);
    },

    getAddressFromCoordinate: async function (coords) {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?access_token=${this.accessToken}`
      );
      const data = await response.json();
      return data.features[0].place_name;
    },

    // get user current
    handleLocateCurrent: function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          //location success
          async (position) => {
            this.coords = position.coords;
            this.address = await this.getAddressFromCoordinate(this.coords);
            const centerLocation = [position.coords.longitude, position.coords.latitude];
            this.startCoord = [...centerLocation];
            this.map = this.getMap(centerLocation, 15, "map");
            this.setMapboxMarker(centerLocation, this.map);
          },
          //location error
          (error) => {
            alert("Không tìm thấy vị trí của bạn. Vui lòng thử lại.");
            console.log(error);
          }
        );
      }
    },
  },
};
</script>

<style scoped>
.marker {
  background-color: red;
  border: 2px solid white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}
.pulse {
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

.panel {
  display: flex;
  justify-content: space-between;
}

.map-box {
  position: relative;
  height: 400px;
  width: calc(60% - 30px);
}

#map {
  height: 100%;
  width: 100%;
}

.search {
  position: absolute;
  left: 20px;
  top: 20px;
}

.search-input {
  outline: none;
  border: 0;
  padding: 10px;
}

.map-actions {
  width: calc(40% - 30px);
}

.btn {
  outline: none;
  cursor: pointer;
  border: 0;
  border-radius: 3px;
  padding: 7px 12px;
  background-color: #1473e6;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}
</style>
