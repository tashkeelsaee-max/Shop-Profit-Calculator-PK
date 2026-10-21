
const $ = (id) => document.getElementById(id);

let sales = [];
try {
  sales = JSON.parse(localStorage.getItem("shopProfitSales") || "[]");
} catch {
  sales = [];
}

function money(value) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2
  }).format(Number(value) || 0);
}

function getValues() {
  const buy = Math.max(0, Number($("buyPrice").value) || 0);
  const sell = Math.max(0, Number($("sellPrice").value) || 0);
  const qty = Math.max(1, Math.floor(Number($("quantity").value) || 1));
  const expenses = Math.max(0, Number($("expenses").value) || 0);
  const totalSales = sell * qty;
  const totalCost = buy * qty + expenses;
  const profit = totalSales - totalCost;
  const margin = totalSales ? profit / totalSales * 100 : 0;

  return { buy, sell, qty, expenses, totalSales, totalCost, profit, margin };
}

function updatePreview() {
  const v = getValues();
  $("previewSales").textContent = money(v.totalSales);
  $("previewProfit").textContent = money(v.profit);
  $("previewMargin").textContent = v.margin.toFixed(1) + "%";
}

function saveSales() {
  localStorage.setItem("shopProfitSales", JSON.stringify(sales));
}

function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  })[c]);
}

function render() {
  $("totalSales").textContent = money(
    sales.reduce((sum, s) => sum + s.totalSales, 0)
  );
  $("totalCost").textContent = money(
    sales.reduce((sum, s) => sum + s.totalCost, 0)
  );
  $("netProfit").textContent = money(
    sales.reduce((sum, s) => sum + s.profit, 0)
  );

  const query = $("searchInput").value.toLowerCase().trim();
  const period = $("periodFilter").value;
  const now = new Date();

  const filtered = sales.filter(s => {
    if (!s.name.toLowerCase().includes(query)) return false;
    const d = new Date(s.date);
    if (period === "today") return d.toDateString() === now.toDateString();
    if (period === "week") return d >= new Date(now.getTime() - 7 * 86400000);
    if (period === "month") {
      return d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth();
    }
    return true;
  });

  $("recordCount").textContent = `${filtered.length} record(s) shown`;
  const list = $("salesList");

  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state">No sales found.</div>';
    return;
  }

  list.innerHTML = filtered.map(s => `
    <article class="sale-item">
      <div class="sale-main">
        <h3>${escapeHTML(s.name)}</h3>
        <div class="sale-meta">
          ${new Date(s.date).toLocaleString()}<br>
          ${s.qty} × ${money(s.sell)} selling · Cost ${money(s.buy * s.qty)}
          · Expenses ${money(s.expenses)}
        </div>
      </div>
      <div class="sale-numbers">
        <strong>${money(s.profit)}</strong>
        <span>Net profit</span>
        <div class="sale-actions">
          <button class="delete-btn" data-delete="${s.id}">Delete</button>
        </div>
      </div>
    </article>
  `).join("");

  list.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (confirm("Delete this sale?")) {
        sales = sales.filter(s => s.id !== btn.dataset.delete);
        saveSales();
        render();
      }
    });
  });
}

["buyPrice", "sellPrice", "quantity", "expenses"].forEach(id => {
  $(id).addEventListener("input", updatePreview);
});

$("saleForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("productName").value.trim();
  const v = getValues();

  if (!name || v.sell <= 0) {
    alert("Enter a product name and a selling price greater than zero.");
    return;
  }

  sales.unshift({
    id: Date.now().toString(),
    name,
    ...v,
    date: new Date().toISOString()
  });

  saveSales();
  $("saleForm").reset();
  $("quantity").value = 1;
  $("expenses").value = 0;
  updatePreview();
  render();
});

$("searchInput").addEventListener("input", render);
$("periodFilter").addEventListener("change", render);

$("exportBtn").addEventListener("click", () => {
  if (!sales.length) {
    alert("No sales to export yet.");
    return;
  }

  const headers = [
    "Date", "Product", "Buying Price", "Selling Price",
    "Quantity", "Expenses", "Total Sales", "Total Cost",
    "Net Profit", "Profit Margin %"
  ];

  const rows = sales.map(s => [
    new Date(s.date).toLocaleString(), s.name, s.buy, s.sell,
    s.qty, s.expenses, s.totalSales, s.totalCost,
    s.profit, s.margin.toFixed(2)
  ]);

  const csv = [headers, ...rows].map(row =>
    row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
  ).join("\r\n");

  const blob = new Blob(["\ufeff" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "shop-sales.csv";
  a.click();
  URL.revokeObjectURL(url);
});

updatePreview();
render();
