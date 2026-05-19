/* global API_BASE_URL */

const els = {
  form: document.getElementById("employeeForm"),
  id: document.getElementById("employeeId"),
  name: document.getElementById("name"),
  position: document.getElementById("position"),
  department: document.getElementById("department"),
  salary: document.getElementById("salary"),
  submitBtn: document.getElementById("submitBtn"),
  cancelBtn: document.getElementById("cancelBtn"),
  tbody: document.getElementById("employeesTbody"),
  search: document.getElementById("search"),
  message: document.getElementById("message"),
  apiBase: document.getElementById("apiBase"),
};

els.apiBase.textContent = API_BASE_URL;

function showMessage(text, type = "info") {
  els.message.hidden = false;
  els.message.textContent = text;
  els.message.className = `message ${type}`;
  setTimeout(() => {
    els.message.hidden = true;
  }, 3500);
}

function normalize(str) {
  return (str || "").toLowerCase().trim();
}

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json();
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

function renderEmployees(employees) {
  const q = normalize(els.search.value);
  const filtered = q
    ? employees.filter((e) => normalize(e.name).includes(q))
    : employees;

  els.tbody.innerHTML = "";
  for (const e of filtered) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.id ?? ""}</td>
      <td>${e.name ?? ""}</td>
      <td>${e.position ?? ""}</td>
      <td>${e.department ?? ""}</td>
      <td>${e.salary ?? ""}</td>
      <td>${formatDate(e.createdAt)}</td>
      <td class="cell-actions"></td>
    `;

    const actionsTd = tr.querySelector(".cell-actions");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "secondary";
    editBtn.onclick = () => startEdit(e);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "danger";
    delBtn.onclick = async () => {
      if (!confirm(`Delete employee ${e.name}?`)) return;
      await api(`/employees/${e.id}`, { method: "DELETE" });
      showMessage("Deleted", "success");
      await refresh();
    };

    actionsTd.appendChild(editBtn);
    actionsTd.appendChild(delBtn);

    els.tbody.appendChild(tr);
  }
}

function resetForm() {
  els.id.value = "";
  els.form.reset();
  els.cancelBtn.hidden = true;
  els.submitBtn.textContent = "Save";
}

function startEdit(e) {
  els.id.value = e.id;
  els.name.value = e.name ?? "";
  els.position.value = e.position ?? "";
  els.department.value = e.department ?? "";
  els.salary.value = e.salary ?? "";
  els.cancelBtn.hidden = false;
  els.submitBtn.textContent = "Update";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

let cache = [];

async function refresh() {
  cache = await api("/employees");
  renderEmployees(cache);
}

els.search.addEventListener("input", () => renderEmployees(cache));

els.cancelBtn.addEventListener("click", () => {
  resetForm();
});

els.form.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  const payload = {
    name: els.name.value.trim(),
    position: els.position.value.trim(),
    department: els.department.value.trim(),
    salary: Number(els.salary.value),
  };

  try {
    if (els.id.value) {
      await api(`/employees/${els.id.value}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      showMessage("Updated", "success");
    } else {
      await api(`/employees`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      showMessage("Created", "success");
    }

    resetForm();
    await refresh();
  } catch (err) {
    showMessage(err.message || String(err), "error");
  }
});

refresh().catch((err) => {
  showMessage(`Failed to load employees: ${err.message}`, "error");
});
