import { ChartOptions, TooltipItem } from "chart.js";

export const pieChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  normalized: true,
  plugins: {
    legend: {
      position: 'right',
      labels : {
        usePointStyle: true,
        padding: 25,
      }
    },
    tooltip: {
      callbacks: {
        label(context:TooltipItem<"pie">) {
          const sum = context.dataset.data.reduce((sum, value) => sum + value);

          const value = context.raw as number;
          const percentage = Math.round((value / sum) * 100);

          return `learners ${value} (${percentage}%)`;
        }
      }
    }
  },
} as ChartOptions<'pie' | 'doughnut'>

