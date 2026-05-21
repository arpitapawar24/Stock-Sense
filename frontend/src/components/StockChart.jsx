import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const StockChart = ({ historyData, ticker }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !historyData || historyData.length === 0) return;

    // Destroy existing chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    const labels = historyData.map(item => {
      const d = new Date(item.date);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    });

    const prices = historyData.map(item => item.close);

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(56, 126, 209, 0.18)');
    gradient.addColorStop(1, 'rgba(56, 126, 209, 0.0)');

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? '#223047' : '#F3F4F6';
    const textColor = isDark ? '#94A3B8' : '#6B7280';

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `${ticker} Price`,
          data: prices,
          borderColor: '#387ED1',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#387ED1',
          fill: true,
          backgroundColor: gradient,
          tension: 0.15
        }]
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
              label: (context) => `$${context.raw.toFixed(2)}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { maxTicksLimit: 8, font: { size: 10 }, color: textColor }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { size: 10 },
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

    // Cleanup on component unmount
    return () => {
      observer.disconnect();
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [historyData, ticker]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default StockChart;
