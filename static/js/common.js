// const chartRemovalNum = 30; //Remove this many data points from the start of the chart if we go out of bounds

function ChartObj(chart, data, timeData) {
  this.chart = chart;
  this.data = data;
  this.timeData = timeData;
  this.maxDataPoints = 200;

  this.updateChart = function (dataPoint, timeDataPoint) {
    this.data.push(dataPoint);
    this.timeData.push(timeDataPoint);

    // if (this.data.length > this.maxDataPoints) {
    //   this.data = this.data.slice(chartRemovalNum, -1);
    //   this.timeData = this.timeData.slice(chartRemovalNum, -1)
    // }

    this.chart.data.labels = this.timeData;
    this.chart.data.datasets[0].data = this.data;

    this.chart.update();
  }

  this.setMaxDataPoints = function (newMax) {
    this.maxDataPoints = newMax;
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
      animation: false,

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