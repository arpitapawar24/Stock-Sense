import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const PredictionChart = ({ historyData, predictions, ticker }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !historyData || historyData.length === 0 || !predictions || predictions.length === 0) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Combine history dates and future prediction dates
    const historyLabels = historyData.map(item => {
      const d = new Date(item.date);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    });

    const predLabels = predictions.map(item => {
      const d = new Date(item.date);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    });

    const allLabels = [...historyLabels, ...predLabels];

    // Align datasets
    const historyPrices = historyData.map(item => item.close);
    // Fill prediction array with nulls for history duration so it lines up
    const predictionPrices = [
      ...Array(historyPrices.length - 1).fill(null),
      historyPrices[historyPrices.length - 1], // Start prediction line from last historical close
      ...predictions.map(item => item.predictedPrice)
    ];

    // Background gradient for history
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(56, 126, 209, 0.12)');
    gradient.addColorStop(1, 'rgba(56, 126, 209, 0.0)');

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? '#223047' : '#F3F4F6';
    const textColor = isDark ? '#94A3B8' : '#6B7280';

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: allLabels,
        datasets: [
          {
            label: 'Actual Price',
            data: [...historyPrices, ...Array(predictions.length).fill(null)],
            borderColor: '#387ED1',
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            backgroundColor: gradient,
            tension: 0.1
          },
          {
            label: 'Predicted Price',
            data: predictionPrices,
            borderColor: '#F97316',
            borderWidth: 2,
            borderDash: [5, 4],
            pointRadius: 0,
            fill: false,
            tension: 0.05
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => `$${context.raw ? context.raw.toFixed(2) : ''}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { maxTicksLimit: 10, font: { size: 9 }, color: textColor }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { size: 9 },
              callback: (val) => `$${val}`
            }
          }
        }
      }
    });

    const observer = new MutationObserver(() => {
      if (chartInstanceRef.current) {
        const dDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const dGridColor = dDark ? '#223047' : '#F3F4F6';
        const dTextColor = dDark ? '#94A3B8' : '#6B7280';
        
        chartInstanceRef.current.options.scales.x.ticks.color = dTextColor;
        chartInstanceRef.current.options.scales.y.grid.color = dGridColor;
        chartInstanceRef.current.options.scales.y.ticks.color = dTextColor;
        chartInstanceRef.current.update();
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      observer.disconnect();
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [historyData, predictions, ticker]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PredictionChart;
