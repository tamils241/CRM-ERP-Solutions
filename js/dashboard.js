document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".sidebar-toggle")?.addEventListener("click", () => {
    document.querySelector(".sidebar")?.classList.toggle("open");
  });

  const revenue = document.getElementById("revenueChart");
  if (revenue && window.Chart) {
    new Chart(revenue, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: "Revenue",
          data: [42, 58, 54, 76, 92, 118],
          borderColor: "#F97316",
          backgroundColor: "rgba(249,115,22,0.12)",
          tension: 0.42,
          fill: true
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
  }

  const module = document.getElementById("moduleChart");
  if (module && window.Chart) {
    new Chart(module, {
      type: "doughnut",
      data: {
        labels: ["CRM", "ERP", "BI", "Support"],
        datasets: [{ data: [38, 31, 19, 12], backgroundColor: ["#F97316", "#EA580C", "#FBBF24", "#10B981"], borderWidth: 0 }]
      },
      options: { responsive: true, plugins: { legend: { position: "bottom" } } }
    });
  }
});
