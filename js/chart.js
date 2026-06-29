document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("previewChart");
  if (!canvas || !window.Chart) return;

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Leads", "Deals", "Orders", "Invoices", "Tasks"],
      datasets: [{
        label: "This month",
        data: [82, 64, 73, 58, 91],
        backgroundColor: ["#F97316", "#EA580C", "#FBBF24", "#10B981", "#F59E0B"],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: "rgba(148,163,184,0.18)" } }, x: { grid: { display: false } } }
    }
  });
});
