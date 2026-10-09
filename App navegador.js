(() => {
  const form = document.getElementById('crud-form');
  if (!form) return;

  const resource = form.dataset.resource;
  const alertBox = document.getElementById('alert');
  const formTitle = document.getElementById('form-title');
  const cancelBtn = document.getElementById('cancel-edit');
  let editingId = null;

  const showAlert = (msg, ok = false) => {
    alertBox.textContent = msg;
    alertBox.className = ok ? 'alert ok' : 'alert';
    alertBox.hidden = false;
  };

  const flash = sessionStorage.getItem('flash');
  if (flash) {
    showAlert(flash, true);
    sessionStorage.removeItem('flash');
  }

  const resetForm = () => {
    editingId = null;
    form.reset();
    formTitle.textContent = 'Nuevo registro';
    cancelBtn.hidden = true;
  };

  const request = async (url, method, body) => {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message + (data.detalle ? ` (${data.detalle})` : ''));
    return data;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {};
    for (const el of form.elements) {
      if (!el.name) continue;
      if (el.value === '') {
        if (editingId) body[el.name] = null; // al editar, vaciar un campo lo limpia
      } else {
        body[el.name] = el.value;
      }
    }
    try {
      const url = `/api/${resource}${editingId ? '/' + editingId : ''}`;
      const data = await request(url, editingId ? 'PUT' : 'POST', body);
      sessionStorage.setItem('flash', data.message);
      location.reload();
    } catch (err) {
      showAlert(err.message);
    }
  });

  cancelBtn.addEventListener('click', resetForm);

  document.querySelector('table').addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    if (btn.dataset.action === 'edit') {
      const row = JSON.parse(btn.dataset.row);
      for (const el of form.elements) {
        if (el.name) el.value = row[el.name] == null ? '' : row[el.name];
      }
      editingId = row.id;
      formTitle.textContent = `Editando registro #${row.id}`;
      cancelBtn.hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (btn.dataset.action === 'delete') {
      if (!confirm('¿Seguro que querés eliminar este registro?')) return;
      try {
        const data = await request(`/api/${resource}/${btn.dataset.id}`, 'DELETE');
        sessionStorage.setItem('flash', data.message);
        location.reload();
      } catch (err) {
        showAlert(err.message);
      }
    }
  });
})();