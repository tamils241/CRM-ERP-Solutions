(function() {
  document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add("loaded");
    var toggles = document.querySelectorAll(".sidebar-toggle");
    var backdrop = document.getElementById("sidebarBackdrop");

    function toggleSidebarBackdrop(sidebar) {
      var existingBackdrop = document.getElementById("sidebarBackdrop");
      if (sidebar.classList.contains("open")) {
        if (!existingBackdrop) {
          existingBackdrop = document.createElement("div");
          existingBackdrop.id = "sidebarBackdrop";
          existingBackdrop.style.cssText = "position:fixed;inset:0;z-index:999;background:rgba(0,0,0,0.4);transition:opacity 0.3s;opacity:0";
          document.body.appendChild(existingBackdrop);
          requestAnimationFrame(function() { existingBackdrop.style.opacity = "1"; });
          existingBackdrop.addEventListener("click", function() {
            sidebar.classList.remove("open");
            existingBackdrop.remove();
          });
        }
      } else if (existingBackdrop) {
        existingBackdrop.remove();
      }
    }

    toggles.forEach(function(t) {
      t.addEventListener("click", function() {
        var sidebar = document.querySelector(".sidebar");
        if (!sidebar) return;
        var isMobile = window.matchMedia("(max-width: 980px)").matches;
        if (isMobile) {
          sidebar.classList.toggle("open");
          toggleSidebarBackdrop(sidebar);
        } else {
          sidebar.classList.remove("open");
          if (document.getElementById("sidebarBackdrop")) document.getElementById("sidebarBackdrop").remove();
        }
      });
    });

    var sidebarLogo = document.querySelector('.sidebar .side-logo');
    if (sidebarLogo) {
      sidebarLogo.addEventListener('click', function(e) {
        var sidebar = document.querySelector('.sidebar');
        if (window.matchMedia('(max-width: 980px)').matches && sidebar && sidebar.classList.contains('open')) {
          e.preventDefault();
          sidebar.classList.remove('open');
          var backdrop = document.getElementById('sidebarBackdrop');
          if (backdrop) backdrop.remove();
        }
      });
    }

    var sidebarClose = document.querySelector('.sidebar-close');
    if (sidebarClose) {
      sidebarClose.addEventListener('click', function() {
        var sidebar = document.querySelector('.sidebar');
        if (sidebar) {
          sidebar.classList.remove('open');
          var backdrop = document.getElementById('sidebarBackdrop');
          if (backdrop) backdrop.remove();
        }
      });
    }
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
        if (sidebar) sidebar.classList.remove("open");
        var backdrop = document.getElementById("sidebarBackdrop");
        if (backdrop) backdrop.remove();
      });
    });
    function setDashTheme(isDark) {
      document.body.classList.toggle("dark-dash", isDark);
      try { localStorage.setItem("stackly-theme", isDark ? "dark" : "light"); } catch(e) {}
      document.querySelectorAll(".theme-toggle").forEach(function(btn) {
        var icon = btn.querySelector("i");
        if (icon) icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
        btn.setAttribute("aria-label", isDark ? "Switch to light" : "Switch to dark");
      });
      var dmCheckbox = document.querySelector('#settings input[type="checkbox"]');
      if (dmCheckbox) dmCheckbox.checked = isDark;
      redrawCharts();
    }
    var saved;
    try { saved = localStorage.getItem("stackly-theme"); } catch(e) {}
    if (saved === "dark" || (saved === null && window.matchMedia("(prefers-color-scheme:dark)").matches)) {
      setDashTheme(true);
    }
    document.querySelectorAll(".theme-toggle").forEach(function(btn) {
      btn.addEventListener("click", function() {
        setDashTheme(!document.body.classList.contains("dark-dash"));
      });
    });
    var dmCheckbox = document.querySelector('#settings input[type="checkbox"]');
    if (dmCheckbox) {
      dmCheckbox.addEventListener("change", function() {
        setDashTheme(dmCheckbox.checked);
      });
    }
    function getChartColors() {
      var isDark = document.body.classList.contains("dark-dash");
      return {
        primary: isDark ? "#fbbf24" : "#e88844",
        secondary: isDark ? "#f59e0b" : "#d97706",
        text: isDark ? "#94a3b8" : "#64748b",
        grid: isDark ? "rgba(148,163,184,0.12)" : "rgba(148, 163, 184, 0.2)",
        fill: isDark ? "rgba(248,250,252,0.06)" : "rgba(232,136,68,0.1)"
      };
    }

    var _revenueChart, _moduleChart;

    function prepCanvas(canvas, fallbackWidth, fallbackHeight) {
      var ctx = canvas.getContext("2d");
      if (!ctx) return null;
      var ratio = window.devicePixelRatio || 1;
      var rect = canvas.getBoundingClientRect();
      var width = Math.max(260, Math.floor(rect.width || fallbackWidth));
      var height = Math.max(180, Math.floor(rect.height || fallbackHeight));
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      return { ctx: ctx, width: width, height: height };
    }

    function drawRevenueChart(canvas) {
      var chart = prepCanvas(canvas, 520, 260);
      if (!chart) return;
      var cc = getChartColors();
      var ctx = chart.ctx;
      var width = chart.width;
      var height = chart.height;
      var data = [120, 190, 170, 220, 260, 310];
      var labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      var pad = { top: 20, right: 24, bottom: 38, left: 38 };
      var chartW = width - pad.left - pad.right;
      var chartH = height - pad.top - pad.bottom;
      var max = 340;

      ctx.strokeStyle = cc.grid;
      ctx.lineWidth = 1;
      for (var i = 0; i <= 4; i += 1) {
        var y = pad.top + chartH / 4 * i;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(width - pad.right, y);
        ctx.stroke();
      }

      var points = data.map(function(value, index) {
        return {
          x: pad.left + chartW / (data.length - 1) * index,
          y: pad.top + chartH - value / max * chartH
        };
      });

      ctx.beginPath();
      ctx.moveTo(points[0].x, height - pad.bottom);
      points.forEach(function(point) { ctx.lineTo(point.x, point.y); });
      ctx.lineTo(points[points.length - 1].x, height - pad.bottom);
      ctx.closePath();
      ctx.fillStyle = cc.fill;
      ctx.fill();

      ctx.beginPath();
      points.forEach(function(point, index) {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.strokeStyle = cc.primary;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = cc.text;
      ctx.font = "12px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      labels.forEach(function(label, index) {
        ctx.fillText(label, points[index].x, height - 14);
      });
    }

    function drawModuleChart(canvas) {
      var chart = prepCanvas(canvas, 320, 240);
      if (!chart) return;
      var cc = getChartColors();
      var ctx = chart.ctx;
      var width = chart.width;
      var height = chart.height;
      var values = [35, 28, 22, 15];
      var colors = [cc.primary, "#3B82F6", "#F59E0B", "#10B981"];
      var labels = ["CRM", "ERP", "BI", "Projects"];
      var total = values.reduce(function(sum, value) { return sum + value; }, 0);
      var radius = Math.min(width, height) * 0.28;
      var cx = width * 0.38;
      var cy = height * 0.5;
      var angle = -Math.PI / 2;

      values.forEach(function(value, index) {
        var next = angle + value / total * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, angle, next);
        ctx.arc(cx, cy, radius * 0.56, next, angle, true);
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.fill();
        angle = next;
      });

      ctx.font = "12px Inter, system-ui, sans-serif";
      ctx.textAlign = "left";
      labels.forEach(function(label, index) {
        var y = cy - 42 + index * 28;
        ctx.fillStyle = colors[index];
        ctx.fillRect(width * 0.68, y - 9, 12, 12);
        ctx.fillStyle = cc.text;
        ctx.fillText(label + " " + values[index] + "%", width * 0.68 + 20, y + 1);
      });
    }

    function redrawCharts() {
      if (_revenueChart) drawRevenueChart(_revenueChart);
      if (_moduleChart) drawModuleChart(_moduleChart);
    }

    _revenueChart = document.getElementById("revenueChart");
    _moduleChart = document.getElementById("moduleChart");
    if (_revenueChart) drawRevenueChart(_revenueChart);
    if (_moduleChart) drawModuleChart(_moduleChart);
  });
  window.dashToast = function(message, type) {
    var bg = type === "error" ? "#EF4444" : type === "success" ? "#10B981" : "#e88844";
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
        el.className = 'filter-input';
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
