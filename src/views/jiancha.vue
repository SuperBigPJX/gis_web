<template>
  <div class="home">
    <div id="map" class="map-home"></div>
    <!-- 弹框 -->
    <div ref="popup" class="popup" v-show="shopPopup">
      <div class="info">
        <ul>
          <li>信息1：xxx</li>
          <li>信息2：xxx</li>
          <li>信息3：xxx</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Map, View, Feature, Overlay } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import * as olProj from "ol/proj";
import { Point } from "ol/geom";
import { Style, Fill, Stroke, Circle as sCircle } from "ol/style";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      openMap: null,
      popup: null,
      shopPopup: false,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.openMap = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new XYZ({
              url: "http://127.0.0.1:8001/XC/{z}/{x}/{y}.png",
            }),
          }),
        ],
        view: new View({
          center: olProj.fromLonLat([108.945951, 34.465262]),
          zoom: 1,
        }),
        controls: [],
      });
      this.setMarker();
      this.addOverlay();
      this.singleclick();
      this.pointermove();
    },
    setMarker() {
      let _style = new Style({
        image: new sCircle({
          radius: 10,
          stroke: new Stroke({
            color: "#fff",
          }),
          fill: new Fill({
            color: "#3399CC",
          }),
        }),
      });
      let _feature = new Feature({
        geometry: new Point(olProj.fromLonLat([108.945951, 34.465262])),
      });
      _feature.setStyle(_style);
      let _marker = new VectorLayer({
        source: new VectorSource({
          features: [_feature],
        }),
      });
      this.openMap.addLayer(_marker);
    },
    addOverlay() {
      // 创建Overlay
      let elPopup = this.$refs.popup;
      this.popup = new Overlay({
        element: elPopup,
        positioning: "bottom-center",
        stopEvent: false,
        offset: [0, -20],
      });
      this.openMap.addOverlay(this.popup);
    },
    singleclick() {
      // 点击
      this.openMap.on("singleclick", (e) => {
        // 判断是否点击在点上
        let feature = this.openMap.forEachFeatureAtPixel(
            e.pixel,
            (feature) => feature
        );
        console.log(feature);
        if (feature) {
          this.shopPopup = true;
          // 设置弹窗位置
          let coordinates = feature.getGeometry().getCoordinates();
          this.popup.setPosition(coordinates);
        } else {
          this.shopPopup = false;
        }
      });
    },
    pointermove() {
      this.openMap.on("pointermove", (e) => {
        if (this.openMap.hasFeatureAtPixel(e.pixel)) {
          this.openMap.getViewport().style.cursor = "pointer";
        } else {
          this.openMap.getViewport().style.cursor = "inherit";
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.map-home {
  width: 100vw;
  height: 100vh;
}
.popup {
  width: 200px;
  background-color: white;
  padding: 18px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgb(177, 177, 177);
  .info {
    font-size: 14px;
    text-align: left;
    ul {
      padding-left: 0;
    }
  }
}
</style>

