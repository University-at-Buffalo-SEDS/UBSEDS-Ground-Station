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
      }
    }
  });

  return { data, timeData, chart };
}