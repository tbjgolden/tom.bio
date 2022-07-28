import { useRef, useEffect } from "preact/hooks";
import {
  Chart,
  ArcElement,
  DoughnutController,
  Legend,
  Tooltip,
} from "chart.js";

Chart.register(ArcElement, DoughnutController, Legend, Tooltip);
Chart.defaults.font = {
  family: `-apple-system, system-ui, blinkmacsystemfont, "Helvetica Neue", helvetica, arial, sans-serif`,
  size: 16,
  style: "normal",
  weight: "400",
  lineHeight: 1.2,
};
Chart.defaults.color = "#fff";
Chart.defaults.borderColor = "#f4be00";
Chart.defaults.backgroundColor = "#000";

export default function PieChart({
  values,
}: {
  values: Array<{
    background: string;
    label: string;
    value: number;
  }>;
}) {
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const context = contextRef.current;
    const myChart = new Chart(context, {
      type: "doughnut",
      data: {
        labels: values.map(({ label }) => label),
        datasets: [
          {
            data: values.map(({ value }) => value),
            backgroundColor: values.map(({ background }) => background),
            borderColor: "#111",
            borderWidth: 4,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: {
            top: 6,
            bottom: 10,
          },
        },
      },
    });
  }, [contextRef.current]);

  return (
    <div style="padding:100% 0 0;position:relative;">
      <canvas
        ref={contextRef}
        style="position:absolute;top:0;left:0;width:100%;height:100%"
      />
    </div>
  );
}
