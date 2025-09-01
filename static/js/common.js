function ChartObj(chart, data, timeData) {
  this.chart = chart;
  this.data = data;
  this.timeData = timeData;

  this.updateChart = function(dataPoint, timeDataPoint) {
    this.data.push(dataPoint);
    this.timeData.push(timeDataPoint);

    this.chart.data.labels = this.timeData;
    this.chart.data.datasets[0].data = this.data;
    
    this.chart.update();
  }
}

// Function to create charts
function createChart(canvasId, label, yLabel) {
  let data = [];
  let timeData = [];
  let ctx = document.getElementById(canvasId).getContext("2d");
  let chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: label,
        data: data,
        borderColor: '  ',
        fill: false,
        pointRadius: 2,
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time (s)'
          }
        },
        y: {
          title: {
            display: true,
            text: yLabel
          }
        }
      },
      plugins: {
        legend: {
          display: false // Hide the legend
        },
        title: {
          display: true,
          text: label + ' vs Time' // Set the title text
        }
      },
      maintainAspectRatio: false,
    }
  });

  return new ChartObj(chart, data, timeData);
}