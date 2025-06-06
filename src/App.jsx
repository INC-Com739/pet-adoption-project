import React, { useState } from 'react';
import './App.css';
import PetModal from './PetModal';

function App() {
  const [form, setForm] = useState({ name: '', type: '', age: '' });
  const [modalOpen, setModalOpen] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSave() {
    // Add your save logic here (e.g., API call)
    setModalOpen(false);
    setForm({ name: '', type: '', age: '' });
  }

  return (
    <>
      <h1>Pet Adoption</h1>
      <button onClick={() => setModalOpen(true)}>Add Pet</button>
      <PetModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        form={form}
        onChange={setForm}
        onSave={handleSave}
      />
    </>
  );
}
export default App;