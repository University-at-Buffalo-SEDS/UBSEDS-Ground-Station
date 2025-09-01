// ==== CHARTS ===== //
let {accData, accTimeData, accChart} = createChart("acceleration-chart", "Acceleration", "Acceleration (m/s^2)");
let {velData, velTimeData, velChart} = createChart("velocity-chart", "Velocity", "Velocity (m/s)");
let {altData, altTimeData, altChart} = createChart("altitude-chart", "Altitude", "Altitude (m)");


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
  document.getElementById('phase').innerText = packet.phase;
  document.getElementById('voltage').innerText = packet.batt_v + ' V';
  document.getElementById('time').innerText = Math.round((packet.millis / 1000) * 100) / 100 + ' S';
  document.getElementById('raw-acc-x').innerText = Math.round(packet.raw_acc[0] * 1000) / 1000;
  document.getElementById('raw-acc-y').innerText = Math.round(packet.raw_acc[1] * 1000) / 1000;
  document.getElementById('raw-acc-z').innerText = Math.round(packet.raw_acc[2] * 1000) / 1000;
  document.getElementById('raw-alt').innerText = Math.round(packet.raw_alt * 1000) / 1000;

  let currentPacketTime = performance.now();
  let ping = lastPacketTime
    ? Math.round(currentPacketTime - lastPacketTime) + ' ms'
    : 'N/A';
  lastPacketTime = currentPacketTime;

  document.getElementById('ping').innerText = ping;

  accelData.push(packet.acc);
  accelTimeData.push(Math.round((packet.millis / 1000) * 100) / 100);
  accelChart.data.labels = accelTimeData;
  accelChart.data.datasets[0].data = accelData;
  accelChart.update();

  altitudeData.push(packet.alt);
  altitudeTimeData.push(Math.round((packet.millis / 1000) * 100) / 100);
  altitudeChart.data.labels = altitudeTimeData;
  altitudeChart.data.datasets[0].data = altitudeData;
  altitudeChart.update();

  velocityData.push(packet.vel);
  velocityTimeData.push(Math.round((packet.millis / 1000) * 100) / 100);
  velocityChart.data.labels = velocityTimeData;
  velocityChart.data.datasets[0].data = velocityData;
  velocityChart.update();

  temperatureGauge.refresh(packet.temp);
  pressureGauge.refresh(Math.round((packet.pressure / 1000) * 100) / 100)

  addMarker(packet.lon, packet.lat);

  prevPacketRotation.x = Math.trunc(packet.ang_vel_vector[0]) * Math.PI / 180;
  prevPacketRotation.y = Math.trunc(packet.ang_vel_vector[1]) * Math.PI / 180;
  prevPacketRotation.z = Math.trunc(packet.ang_vel_vector[2]) * Math.PI / 180;
  prevPacketTime = performance.now();
});

