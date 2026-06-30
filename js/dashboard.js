(function() {
  document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add("loaded");
    var toggles = document.querySelectorAll(".sidebar-toggle");
    toggles.forEach(function(t) {
      t.addEventListener("click", function() {
        var sidebar = document.querySelector(".sidebar");
        sidebar.classList.toggle("collapsed");
        var backdrop = document.getElementById("sidebarBackdrop");
        if (sidebar.classList.contains("collapsed")) {
          if (!backdrop) {
            backdrop = document.createElement("div");
            backdrop.id = "sidebarBackdrop";
            backdrop.style.cssText = "position:fixed;inset:0;z-index:999;background:rgba(0,0,0,0.4);transition:opacity 0.3s;opacity:0";
            document.body.appendChild(backdrop);
            requestAnimationFrame(function() { backdrop.style.opacity = "1"; });
            backdrop.addEventListener("click", function() {
              sidebar.classList.remove("collapsed");
              backdrop.remove();
            });
          }
        } else {
          if (backdrop) backdrop.remove();
        }
      });
    });
    var navLinks = document.querySelectorAll(".side-nav a[data-target]");
    navLinks.forEach(function(link) {
      link.addEventListener("click", function(e) {
        e.preventDefault();
        navLinks.forEach(function(l) { l.classList.remove("active"); });
        link.classList.add("active");
        var target = link.getAttribute("data-target");
        document.querySelectorAll(".tab-panel").forEach(function(p) {
          p.classList.remove("active");
        });
        var panel = document.getElementById(target);
        if (panel) panel.classList.add("active");
        var sidebar = document.querySelector(".sidebar");
        sidebar.classList.remove("collapsed");
        var backdrop = document.getElementById("sidebarBackdrop");
        if (backdrop) backdrop.remove();
      });
    });
    var themeBtn = document.querySelector(".theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function() {
        document.body.classList.toggle("dark-dash");
        var icon = themeBtn.querySelector("i");
        if (icon) {
          if (icon.classList.contains("fa-sun")) {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
          } else {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
          }
        }
      });
    }
    var revenueCanvas = document.getElementById("revenueChart");
    var moduleCanvas = document.getElementById("moduleChart");
    if (window.Chart) {
      if (revenueCanvas) {
        new Chart(revenueCanvas, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{ label: "Revenue", data: [120, 190, 170, 220, 260, 310], borderColor: "#D4AF37", backgroundColor: "rgba(212,175,55,0.1)", fill: true, tension: 0.4 }]
          }
        });
      }
      if (moduleCanvas) {
        new Chart(moduleCanvas, {
          type: "doughnut",
          data: {
            labels: ["CRM", "ERP", "BI", "Projects"],
            datasets: [{ data: [35, 28, 22, 15], backgroundColor: ["#D4AF37", "#3B82F6", "#F59E0B", "#10B981"] }]
          }
        });
      }
    }
  });
  window.dashToast = function(message, type) {
    var bg = type === "error" ? "#EF4444" : type === "success" ? "#10B981" : "#D4AF37";
    var toast = document.createElement("div");
    toast.textContent = message || "Done!";
    Object.assign(toast.style, { position: "fixed", top: "20px", right: "20px", background: bg, color: "#fff", padding: "12px 24px", borderRadius: "8px", zIndex: "10000", fontSize: "14px", fontFamily: "Inter, sans-serif", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", opacity: "0", transition: "opacity 0.3s" });
    document.body.appendChild(toast);
    requestAnimationFrame(function() { toast.style.opacity = "1"; });
    setTimeout(function() { toast.style.opacity = "0"; setTimeout(function() { toast.remove(); }, 300); }, 2500);
  };
  var btnNew = document.querySelector('.dash-actions .btn-primary');
  if (btnNew) {
    btnNew.addEventListener('click', function() {
      dashToast('Record created successfully!', 'success');
    });
  }
  var filterBtns = document.querySelectorAll('.dash-actions .btn-light:not(.theme-toggle):not(.sidebar-toggle)');
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var bar = document.getElementById('filterBar');
      if (bar) { bar.remove(); return; }
      bar = document.createElement('div');
      bar.id = 'filterBar';
      bar.style.cssText = 'display:flex;gap:10px;padding:16px 20px;flex-wrap:wrap;align-items:center;border-radius:8px';
      var inputs = [
        { placeholder: 'Status', options: ['All', 'Active', 'Pending', 'Completed', 'Risk'] },
        { placeholder: 'Priority', options: ['All', 'Low', 'Medium', 'High'] },
        { placeholder: 'Date from', type: 'date' },
        { placeholder: 'Date to', type: 'date' }
      ];
      inputs.forEach(function(cfg) {
        var el;
        if (cfg.options) {
          el = document.createElement('select');
          cfg.options.forEach(function(o) {
            var opt = document.createElement('option');
            opt.textContent = o;
            opt.value = o;
            el.appendChild(opt);
          });
        } else {
          el = document.createElement('input');
          el.type = cfg.type || 'text';
          el.placeholder = cfg.placeholder;
        }
        el.style.cssText = 'padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px;font-size:12px;background:#fff;outline:none;min-width:120px';
        bar.appendChild(el);
      });
      var applyBtn = document.createElement('button');
      applyBtn.textContent = 'Apply';
      applyBtn.className = 'btn btn-primary';
      applyBtn.style.cssText = 'padding:8px 14px;font-size:12px';
      bar.appendChild(applyBtn);
      var clearBtn = document.createElement('button');
      clearBtn.textContent = 'Clear';
      clearBtn.className = 'btn btn-light';
      clearBtn.style.cssText = 'padding:8px 14px;font-size:12px';
      bar.appendChild(clearBtn);
      var top = document.querySelector('.dashboard-top');
      top.parentNode.insertBefore(bar, top.nextSibling);
      applyBtn.addEventListener('click', function() {
        var status = bar.querySelector('select')?.value;
        var rows = document.querySelectorAll('.data-table tbody tr');
        rows.forEach(function(row) {
          var statusCell = row.querySelector('.status');
          if (!statusCell || status === 'All') { row.style.display = ''; return; }
          row.style.display = statusCell.textContent.trim() === status ? '' : 'none';
        });
        dashToast('Filter applied: ' + (status || 'All'), 'info');
      });
      clearBtn.addEventListener('click', function() {
        document.querySelectorAll('.data-table tbody tr').forEach(function(r) { r.style.display = ''; });
        bar.querySelectorAll('select, input').forEach(function(el) { el.value = ''; });
        dashToast('Filters cleared', 'info');
      });
    });
  });
})();
