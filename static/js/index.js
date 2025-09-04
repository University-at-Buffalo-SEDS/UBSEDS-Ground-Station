const controlContainer = document.getElementById('control-container');
const telemetryContainer = document.getElementById('telemetry-container');

let currentContainer = telemetryContainer

function setPageContentTo(newContainer) {
  currentContainer.style.display = "none";
  newContainer.style.display = "";
  currentContainer = newContainer;
}

// ==== CHARTS ===== //
let accChart = createChart("acceleration-chart", "Acceleration", "Acceleration (m/s^2)");
let velChart = createChart("velocity-chart", "Velocity", "Velocity (m/s)");
let altChart = createChart("altitude-chart", "Altitude", "Altitude (m)");

// ==== THREE JS ROCKET MODEL ==== //
let rocketModel;
let prevPacketRotation = { x: 0, y: 0, z: 0 };
let prevPacketTime = null;

document.addEventListener("DOMContentLoaded", function () {
  const modelContainer = document.getElementById('rocket-model');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, modelContainer.clientWidth / modelContainer.clientHeight, 30, 2000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff);
  renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
  modelContainer.appendChild(renderer.domElement);

  const axesHelper = new THREE.AxesHelper(500);
  scene.add(axesHelper);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 400, 400);
  scene.add(directionalLight);

  const loader = new THREE.OBJLoader();
  loader.load('../static/assets/rocket.obj', function (obj) {
    obj.scale.set(0.14, 0.14, 0.14);
    obj.position.y = 150;
    rocketModel = obj;
    scene.add(obj);
  }, function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, function (error) {
    console.error("Error loading model: " + error);
  });

  camera.position.set(0, 0, 500);
  camera.rotation.set(0, 0, .1);

  function animate() {
    requestAnimationFrame(animate);
    if (rocketModel && prevPacketTime !== null) {
      const currentTime = performance.now();
      const elapsedTime = (currentTime - prevPacketTime) / 1000; // Convert to seconds

      // Calculate the new rotation based on the previous packet's rotation data and elapsed time
      const newRotationX = rocketModel.rotation.x + prevPacketRotation.x * elapsedTime;
      const newRotationY = rocketModel.rotation.y + prevPacketRotation.y * elapsedTime;
      const newRotationZ = rocketModel.rotation.z + prevPacketRotation.z * elapsedTime;

      // Update the rocket model's rotation
      rocketModel.rotation.set(newRotationX, newRotationY, newRotationZ);
    }
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
});


// ==== SOCKET ==== //
let socket = io();
socket.on('connect', function () {
  console.log('Connected to server');
});
socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

let lastPacketTime = null;
let startTime = performance.now();

socket.on('data', function (packet) {
  let currentPacketTime = performance.now();
  let ping = lastPacketTime
    ? Math.round(currentPacketTime - lastPacketTime) + ' ms'
    : 'N/A';
  lastPacketTime = currentPacketTime;

  let sec = Math.round((packet.millis / 1000) * 100) / 100;

  accChart.updateChart(packet.acc, sec);
  altChart.updateChart(packet.alt, sec);
  velChart.updateChart(packet.vel, sec);

  prevPacketRotation.x = Math.trunc(packet.ang_vel_vector[0]) * Math.PI / 180;
  prevPacketRotation.y = Math.trunc(packet.ang_vel_vector[1]) * Math.PI / 180;
  prevPacketRotation.z = Math.trunc(packet.ang_vel_vector[2]) * Math.PI / 180;
  prevPacketTime = performance.now();
});

function sendRFPacket(packet) {
  socket.emit('RF', packet);
}

function sendFillPacket() {
  sendRFPacket('cmd,begfl');
}

function sendIgnitePacket() {
  sendRFPacket('cmd,ign');
}

function sendValvePacket() {
  sendRFPacket('cmd,vlv');
}