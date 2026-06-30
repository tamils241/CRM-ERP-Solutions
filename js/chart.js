document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("previewChart");
  if (!canvas) return;

  const labels = ["Leads", "Deals", "Orders", "Invoices", "Tasks"];
  const values = [82, 64, 73, 58, 91];
  const colors = ["#F97316", "#EA580C", "#FBBF24", "#10B981", "#F59E0B"];
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const drawChart = () => {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width || 480));
    const height = Math.max(220, Math.floor(rect.height || 260));

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 18, right: 18, bottom: 44, left: 38 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = 100;
    const barGap = 14;
    const barWidth = (chartWidth - barGap * (values.length - 1)) / values.length;

    ctx.strokeStyle = "rgba(148, 163, 184, 0.18)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding.left + index * (barWidth + barGap);
      const y = padding.top + chartHeight - barHeight;

      ctx.fillStyle = colors[index];
      if (typeof ctx.roundRect === "function") {
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 8);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labels[index], x + barWidth / 2, height - 18);
    });
  };

  drawChart();
  window.addEventListener("resize", drawChart, { passive: true });
});
