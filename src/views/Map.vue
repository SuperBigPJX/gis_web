<template>
  <div class="page">
    <div id="map-container" class="bg-map"></div>
    <div id="gradient" class="gradient"></div>
    <div id="point-map-container" class="vector"></div>
    <div id="show" class="show"></div>
    <div class="edge">
      <div class="edge-up">
        <div class="top">测速记录</div>
        <div class="text">记录编号</div>
        <div class="text">记录时间</div>
        <div class="speed-box">
          <div class="">
            <DownloadIcon style="color: blue" size="2em"/>
          </div>
        </div>
        <div class="speed-box">
          <div class="">
            <UploadIcon style="color: blue" size="2em"/>
          </div>
        </div>
        <div class="three-box">
          <div class="three-item">
            <DashboardIcon/><div>延迟/ms</div>
          </div>
          <div class="three-item">
            <MobileVibrateIcon/><div>抖动/ms</div>
          </div>
          <div class="three-item">
            <TimeIcon/><div>丢包率/%</div>
          </div>
        </div>
      </div>
      <div class="legend">
        <div class="">
          <Dashboard1Icon/>
          图例
        </div>
        <div class="pic-container">
          <div class="one-pic"></div>
          <div class="one-pic"></div>
          <div class="one-pic"></div>
          <div class="one-pic"></div>
          <div class="one-pic"></div>
          <div class="one-pic"></div>
        </div>
      </div>
      <div class="edge-down">

      </div>

    </div>

    <div id="show-page" class="show-page" v-show="false">
      <div class="show-top">
        <div class="text">网速1</div>
        <div class="text">网速2</div>
      </div>
      <div class="show-bottom">
        <div class="text">网速3</div>
      </div>
    </div>

    <div id="popup" ref="popup" class="popup" v-show="true">

      <div class="info">
        <div>{{ popupUp }}</div>
        <div>信息2</div>
        <div>信息3</div>
      </div>
    </div>


  </div>
</template>

<script>
import {Map, Feature, View, Overlay} from "ol";
import {Tile} from "ol/layer"
import XYZ from "ol/source/XYZ";
import {defaults as defaultsControl} from "ol/control";
import {defaults} from "ol/interaction";
import {Vector as LayerVector} from "ol/layer"
import {Vector} from "ol/source";
import {Point} from "ol/geom";
import {Icon, Style} from "ol/style";
import axios from "axios";
import data from "tdesign-icons-vue-next/lib/components/data.js";
import {TOKEN_NAME} from "@/config/global.js";
import {getCookie} from "@/utils/cookie_utils.js";
import {
  Dashboard1Icon,
  DashboardIcon,
  DownloadIcon,
  MobileVibrateIcon,
  TimeIcon,
  UploadIcon
} from "tdesign-icons-vue-next";

export default {
  components: {Dashboard1Icon, TimeIcon, DashboardIcon, MobileVibrateIcon, UploadIcon, DownloadIcon},
  data() {
    return {
      map: null,
      pointMap: null,
      pointLay: null,
      popup: null,
      shopPopup: false,
      points: [],
      popupUp: null
    }
  },
  mounted() {
    this.initData()
    this.initMap();


  },
  methods: {
    setMarker() {
      let _feature = new Feature({
        geometry: new Point([112, 32]),
      });
      _feature.setStyle(new Style({
        image: new Icon({
          src: "/img/ic_speed_level_2.png"
        })
      }))
      this.pointLay.getSource().addFeature(_feature)
    },
    pointermove() {
      this.pointMap.on('pointermove', (evt) => {
        if (this.pointMap.hasFeatureAtPixel(evt.pixel)) {
          this.pointMap.getViewport().style.cursor = "pointer";
        } else {
          this.pointMap.getViewport().style.cursor = "inherit";
        }
      })
    },
    addOverlay() {
      // 创建Overlay
      let elPopup = this.$refs.popup;
      this.popup = new Overlay({
        element: elPopup,
        stopEvent: false,
        offset: [0, -115],
        positioning: 'bottom-center',
      });
      this.pointMap.addOverlay(this.popup);
    },

    initMap() {
      // 定义地图视图
      const view = new View({
        center: [112.15944529, 32.02012061],
        projection: "EPSG:4326",
        zoom: 13,
        maxZoom: 18,
        minZoom: 10,
        extent: [111.44443926330257, 31.650693356573015, 112.84864324914228, 32.547812744965555],
      })
      // 初始化瓦片地图容器
      this.map = new Map({
        target: "map-container",
        view: view,
        layers: [
          new Tile({
            source: new XYZ({
              url: "http://127.0.0.1:8001/XC/{z}/{x}/{y}.png"
            })
          })
        ],

        controls: defaultsControl({
          zoom: false,
          rotate: false,
          attribution: false,
        }),

        interactions: defaults({
          doubleClickZoom: false,
        }),
      })
      // 初始化标记地图容器和矢量层
      this.pointMap = new Map({
        target: "point-map-container",
        view: view,
        layers: [],
        controls: defaultsControl({
          zoom: false,
          rotate: false,
          attribution: false,
        }),
        interactions: defaults({
          doubleClickZoom: false,
        }),
      })
      this.pointLay = new LayerVector({
        source: new Vector({
          feature: [],
        }),
      })
      this.pointMap.addLayer(this.pointLay)

      let that = this
      this.pointMap.on('singleclick', function (evt) {
        // 在右下角展示经纬度
        // let pixel = that.pointMap.getEventPixel(evt.originalEvent);
        // let coordinate = that.pointMap.getCoordinateFromPixel(pixel);
        //
        //
        //
        // let showContainer = document.getElementById("show")
        // showContainer.innerHTML = "<b>经度：" + coordinate[0] + "纬度：" + coordinate[1] + "</b>"

        // 判断是否点击在feature点上
        let feature2 = that.pointMap.forEachFeatureAtPixel(
            evt.pixel,
            (feature2) => feature2
        );
        if (feature2) {
          console.log(feature2)
          that.shopPopup = true;
          let coordinates = feature2.getGeometry().getCoordinates();
          that.popupUp = feature2.get("up")

          that.popup.setPosition(coordinates);
        } else {
          // 点击添加feature
          that.shopPopup = false;
          let feature = new Feature({
            geometry: new Point(coordinate),
          })
          feature.setStyle(new Style({
                image: new Icon({
                  src: "/img/ic_speed_level_2.png"
                }),
              })
          )
          that.pointLay.getSource().addFeature(feature)
        }
      })
      this.setMarker();
      this.pointermove();
      this.addOverlay();
    },

    initPoint() {
      let that = this
      // 点数据列表
      let points = this.points
      // 标记图层元素列表
      let features = []

      // 遍历点数据
      points.forEach(item => {
        // 获取经纬度
        let coordinate = [item.lon, item.lat]
        // 创建标记图层元素，将点数据转换为标记图层元素
        let feature = new Feature({
          geometry: new Point(coordinate)
        })

        feature.set('down', item.downloadSpeed)
        feature.set('up', item.uploadSpeed)

        // 设置元素样式
        if (item.downloadSpeed > 50) {
          feature.setStyle(new Style({
                image: new Icon({
                  src: "/img/ic_speed_level_1.png"
                }),
              })
          )
        } else {
          feature.setStyle(new Style({
                image: new Icon({
                  src: "/img/ic_speed_level_3.png"
                }),
              })
          )
        }
        // 点元素添加进元素列表
        features.push(feature)
      })

      // 创建标记图层
      let pointLay = new LayerVector({
        source: new Vector({
          features: features,
        }),
      })
      // 标记图层添加进容器中
      this.pointMap.addLayer(pointLay)
      console.log(this.pointMap.getLayers())
    },
    async initData() {

      console.log("===============")
      let token = getCookie(TOKEN_NAME)
      let res = await axios.get(
          "http://127.0.0.1:8199/api/speed/getHistoryList", {
            headers: {
              'Authorization': token
            }
          }
      )
      if (res.data.code === 200) {
        this.points = res.data.data
        this.initPoint()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  height: 100vh;
  width: 100vw;

  .bg-map {
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .edge {
    position: absolute;
    left: 50px;
    bottom: 20px;
    width: 300px;
    height: 750px;
    display: flex;
    flex-direction: column;
    z-index: 40;
    gap: 30px;

    .top {
      position: relative;
      font-size: 30px;
      color: blue;

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 150px;
        height: 1px; /* 调整矩形的高度 */
        background-color: blue; /* 设置矩形的颜色 */
        display: block;
      }
    }

    .text {
      font-size: 20px;
    }

    .edge-up {
      flex: 4;
      border-radius: 8px;
      box-shadow: 0 0 15px rgb(177, 177, 177);
      background-color: white;
      .three-box{
        display: flex;
        flex-direction: row;
        gap: 80px;
      }
      .speed-box {

      }
    }

    .legend {
      flex: 1;
      box-shadow: 0 0 15px rgb(177, 177, 177);
      background-color: white;
      border-radius: 8px;
    }
  }

  //.legend{
  //  position: absolute;
  //  left: 20px;
  //  bottom: 20px;
  //  width: 80px;
  //  height: 100px;
  //  z-index: 40;
  //}
  .show-page {
    z-index: 9;
    width: 400px;
    height: 100vh;
    position: absolute;
    left: 40px;
    top: 0;
    bottom: 10px;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    gap: 50px;

    .show-top {
      width: 390px;
      height: 500px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 0 15px rgb(177, 177, 177);

      .text {
        font-size: 30px;
      }
    }

    .show-bottom {
      width: 390px;
      height: 20vh;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 0 15px rgb(177, 177, 177);

      .text {
        font-size: 30px;
      }
    }
  }


  .vector {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9;
  }

  .gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    background: radial-gradient(circle, rgba(18, 93, 190, 0.1) 70%, rgba(76, 150, 246, 0.75));
    pointer-events: none;
    //backdrop-filter: blur(1px);
  }

  .show {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

  .popup {
    position: absolute;
    left: -160px;
    width: 320px;
    height: fit-content;
    background-color: white;
    padding: 15px;
    box-sizing: border-box;
    border: 1px solid #cccccc;
    z-index: 999;
    backdrop-filter: blur(5px);
    transition: 0.5s ease-in-out;

    border-radius: 8px;
    box-shadow: -0.2px -0.2px 0px #fff,
    0.2px 0.2px 0px #000,
    3px 3px 12px rgba(0, 0, 0, 0.5);

    &:after,
    &:before {
      top: 100%;
      border: solid transparent;
      content: "";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }

    &:after {
      border-top-color: #00000050;
      border-width: 10px;
      left: 50%;
      transform: translate(-50%);
    }

    &:before {
      border-top-color: #cccccc;
      border-width: 11px;
      left: 50%;
      transform: translateX(-50%);

    }

    .info {
      font-size: 14px;
      text-align: left;

      ul {
        padding-left: 0;
      }
    }
  }
}

</style>