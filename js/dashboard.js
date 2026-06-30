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
    if (revenueCanvas) drawRevenueChart(revenueCanvas);
    if (moduleCanvas) drawModuleChart(moduleCanvas);

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
      var ctx = chart.ctx;
      var width = chart.width;
      var height = chart.height;
      var data = [120, 190, 170, 220, 260, 310];
      var labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      var pad = { top: 20, right: 24, bottom: 38, left: 38 };
      var chartW = width - pad.left - pad.right;
      var chartH = height - pad.top - pad.bottom;
      var max = 340;

      ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
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
      ctx.fillStyle = "rgba(212, 175, 55, 0.12)";
      ctx.fill();

      ctx.beginPath();
      points.forEach(function(point, index) {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      labels.forEach(function(label, index) {
        ctx.fillText(label, points[index].x, height - 14);
      });
    }

    function drawModuleChart(canvas) {
      var chart = prepCanvas(canvas, 320, 240);
      if (!chart) return;
      var ctx = chart.ctx;
      var width = chart.width;
      var height = chart.height;
      var values = [35, 28, 22, 15];
      var colors = ["#D4AF37", "#3B82F6", "#F59E0B", "#10B981"];
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
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(label + " " + values[index] + "%", width * 0.68 + 20, y + 1);
      });
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
