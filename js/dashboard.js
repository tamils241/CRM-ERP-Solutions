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

  const analyticsChart = document.getElementById("analyticsChart");
  if (analyticsChart && window.Chart) {
    new Chart(analyticsChart, {
      type: "bar",
      data: {
        labels: ["Prospects", "Qualified", "Proposal", "Negotiation", "Closed"],
        datasets: [{
          label: "Pipeline Count",
          data: [62, 45, 32, 18, 8],
          backgroundColor: ["#F97316", "#EA580C", "#FBBF24", "#10B981", "#3B82F6"]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 10 } } }
      }
    });
  }

  const tabPanels = document.querySelectorAll(".tab-panel");
  const navLinks = document.querySelectorAll(".side-nav a[data-target]");

  const setNavState = (target) => {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.target === target);
    });
    tabPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === target);
    });
    if (history.replaceState) {
      history.replaceState(null, "", `#${target}`);
    }
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setNavState(link.dataset.target);
    });
  });

  const currentHash = window.location.hash.replace("#", "") || "dashboard";
  const validHash = Array.from(navLinks).some((link) => link.dataset.target === currentHash) ? currentHash : "dashboard";
  setNavState(validHash);
});
