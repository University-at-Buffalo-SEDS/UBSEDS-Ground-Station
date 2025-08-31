// // // function toggleTelemetry() {
// // //   let telemetryContainer = document.getElementById("telemetryContainer");
// // //   let mapContainer = document.getElementById("mapContainer");
// // //   let button = document.querySelector(".map-button");

// // //   if (telemetryContainer.style.display === "none") {
// // //     telemetryContainer.style.display = "block";
// // //     mapContainer.style.display = "none";
// // //     button.textContent = "Map";
// // //   } else {
// // //     telemetryContainer.style.display = "none";
// // //     mapContainer.style.display = "block";
// // //     button.textContent = "Telemetry";
// // //   }
// // // } 

// // // Initializing the socket
// // let socket = io();
// // socket.on('connect', function () {
// //   console.log('Connected to server');
// // });
// // socket.on('disconnect', function () {
// //   console.log('Disconnected from server');
// // });

// // // let { data: accelData, timeData: accelTimeData, chart: accelChart } = createChart("accelChart", "Acceleration", "Acceleration (m/s^2)");
// // // let { data: altitudeData, timeData: altitudeTimeData, chart: altitudeChart } = createChart("altitudeChart", "Altitude", "Altitude (m)");
// // // let { data: velocityData, timeData: velocityTimeData, chart: velocityChart } = createChart("velocityChart", "Velocity", "Velocity (m/s)");

// // Create gauges
// let temperatureGauge = new JustGage({
//   id: "temperature-gauge",
//   value: 0,
//   min: 30,
//   max: 90,
//   title: "Temperature",
//   label: "°C",
//   decimals: true
// })

// let pressureGauge = new JustGage({
//   id: "pressure-gauge",
//   value: 0,
//   min: 50,
//   max: 120,
//   title: "Pressure",
//   label: "kPa",
//   decimals: true
// })

// // let map;

// // function initMap() {
// //   console.log("Loading map...");
// //   map = new ol.Map({
// //     target: "mapContainer",
// //     layers: [
// //       new ol.layer.Tile({
// //         source: new ol.source.OSM()
// //       })
// //     ],
// //     view: new ol.View({
// //       center: ol.proj.fromLonLat([-107, 33]),
// //       zoom: 5,
// //       // maxZoom: 5
// //     })
// //   });
// //   map.getView().on('change:resolution', function () {
// //     const zoom = map.getView().getZoom();
// //     console.log('Current zoom level:', zoom);
// //   });
// // }

// // window.onload = initMap;
// // function addMarker(lon, lat) {
// //   map.getLayers().forEach(layer => {
// //     if (layer instanceof ol.layer.Vector) {
// //       layer.getSource().clear();
// //     }
// //   });

// //   let marker = new ol.Feature({
// //     geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
// //   });

// //   let markerStyle = new ol.style.Style({
// //     image: new ol.style.Icon({
// //       src: "../static/img/marker.png",
// //       scale: 0.1
// //     })
// //   });

// //   marker.setStyle(markerStyle);

// //   let vectorSource = new ol.source.Vector({
// //     features: [marker]
// //   });

// //   let vectorLayer = new ol.layer.Vector({
// //     source: vectorSource
// //   });

// //   map.addLayer(vectorLayer);
// // }

// // function sendTestPacket(action) {
// //   socket.emit('testingPacket', action);
// // }

// // document.querySelectorAll('.test-button').forEach(function (button) {
// //   button.addEventListener('click', function () {
// //     const buttonText = button.textContent.trim();
// //     if (buttonText === "Ejection") {
// //       sendTestPacket("d");
// //     } else if (buttonText === "Reefing") {
// //       sendTestPacket("m");
// //     }
// //   });
// // });

// // let rocketModel;
// // let prevPacketRotation = { x: 0, y: 0, z: 0 };
// // let prevPacketTime = null;

// // document.addEventListener("DOMContentLoaded", function () {
// //   const scene = new THREE.Scene();
// //   const camera = new THREE.PerspectiveCamera(50, window.innerHeight / window.innerWidth, 0.1, 1000);
// //   const modelContainer = document.getElementById('rocket-model');
// //   const renderer = new THREE.WebGLRenderer();
// //   const control = new THREE.OrbitControls(camera, renderer.domElement);
// //   renderer.setPixelRatio(window.devicePixelRatio);
// //   renderer.setClearColor(0xffffff);
// //   renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
// //   modelContainer.appendChild(renderer.domElement);

// //   const axesHelper = new THREE.AxesHelper(500);
// //   scene.add(axesHelper);

// //   const controls = new THREE.OrbitControls(camera, renderer.domElement);

// //   const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// //   directionalLight.position.set(0, 400, 400);
// //   scene.add(directionalLight);

// //   const loader = new THREE.OBJLoader();
// //   loader.load('../static/assets/rocket.obj', function (obj) {
// //     obj.scale.set(0.14, 0.14, 0.14);
// //     obj.position.y = 150;
// //     rocketModel = obj;
// //     scene.add(obj);
// //   }, function (xhr) {
// //     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
// //   }, function (error) {
// //     console.error("Error loading model: " + error);
// //   });

// //   camera.position.set(0, 0, 500);

// //   function animate() {
// //     requestAnimationFrame(animate);
// //     if (rocketModel && prevPacketTime !== null) {
// //       const currentTime = performance.now();
// //       const elapsedTime = (currentTime - prevPacketTime) / 1000; // Convert to seconds

// //       // Calculate the new rotation based on the previous packet's rotation data and elapsed time
// //       const newRotationX = rocketModel.rotation.x + prevPacketRotation.x * elapsedTime;
// //       const newRotationY = rocketModel.rotation.y + prevPacketRotation.y * elapsedTime;
// //       const newRotationZ = rocketModel.rotation.z + prevPacketRotation.z * elapsedTime;

// //       // Update the rocket model's rotation
// //       rocketModel.rotation.set(newRotationX, newRotationY, newRotationZ);
// //     }
// //     controls.update();
// //     renderer.render(scene, camera);
// //   }

// //   animate();
// // });

// // let lastPacketTime = null;
// // let startTime = performance.now();

// // socket.on('data', function (packet) {
// //   document.getElementById('phase').innerText = packet.phase;
// //   document.getElementById('voltage').innerText = packet.batt_v + ' V';
// //   document.getElementById('time').innerText = Math.round((packet.millis / 1000) * 100) / 100 + ' S';
// //   document.getElementById('raw-acc-x').innerText = Math.round(packet.raw_acc[0] * 1000) / 1000;
// //   document.getElementById('raw-acc-y').innerText = Math.round(packet.raw_acc[1] * 1000) / 1000;
// //   document.getElementById('raw-acc-z').innerText = Math.round(packet.raw_acc[2] * 1000) / 1000;
// //   document.getElementById('raw-alt').innerText = Math.round(packet.raw_alt * 1000) / 1000;

// //   let currentPacketTime = performance.now();
// //   let ping = lastPacketTime
// //     ? Math.round(currentPacketTime - lastPacketTime) + ' ms'
// //     : 'N/A';
// //   lastPacketTime = currentPacketTime;

// //   document.getElementById('ping').innerText = ping;

// //   accelData.push(packet.acc);
// //   accelTimeData.push(Math.round((packet.millis / 1000) * 100) / 100);
// //   accelChart.data.labels = accelTimeData;
// //   accelChart.data.datasets[0].data = accelData;
// //   accelChart.update();

// //   altitudeData.push(packet.alt);
// //   altitudeTimeData.push(Math.round((packet.millis / 1000) * 100) / 100);
// //   altitudeChart.data.labels = altitudeTimeData;
// //   altitudeChart.data.datasets[0].data = altitudeData;
// //   altitudeChart.update();

// //   velocityData.push(packet.vel);
// //   velocityTimeData.push(Math.round((packet.millis / 1000) * 100) / 100);
// //   velocityChart.data.labels = velocityTimeData;
// //   velocityChart.data.datasets[0].data = velocityData;
// //   velocityChart.update();

// //   temperatureGauge.refresh(packet.temp);
// //   pressureGauge.refresh(Math.round((packet.pressure / 1000) * 100) / 100)

// //   addMarker(packet.lon, packet.lat);

// //   prevPacketRotation.x = Math.trunc(packet.ang_vel_vector[0]) * Math.PI / 180;
// //   prevPacketRotation.y = Math.trunc(packet.ang_vel_vector[1]) * Math.PI / 180;
// //   prevPacketRotation.z = Math.trunc(packet.ang_vel_vector[2]) * Math.PI / 180;
// //   prevPacketTime = performance.now();
// // });