import React, { useState, useEffect } from 'react';
import './App.css';
import PetModal from './PetModal';

function App() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ name: '', type: '', age: '' });
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch pets on mount
  useEffect(() => {
    async function fetchPets() {
      try {
        const res = await fetch('/api/pets');
        if (!res.ok) throw new Error('Failed to fetch pets');
        const data = await res.json();
        setPets(data);
      } catch (err) {
        console.error('Failed to fetch pets:', err);
      }
    }
    fetchPets();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name || !form.type || !form.age) return;
    const newPet = {
      Adopt: Date.now().toString(),
      name: form.name,
      type: form.type,
      age: form.age,
    };
    try {
      const res = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPet),
      });
      if (!res.ok) throw new Error('Failed to create pet');
      setPets(pets => [...pets, newPet]);
      setModalOpen(false);
      setForm({ name: '', type: '', age: '' });
    } catch (err) {
      alert('Failed to create pet');
    }
  }

  return (
    <>
      <h1>Pet Adoption</h1>
      <button onClick={() => setModalOpen(true)}>Add Pet</button>
      <ul>
        {pets.length === 0 && <li>No pets yet.</li>}
        {pets.map(pet => (
          <li key={pet.Adopt}>
            <span>{pet.name} ({pet.type}, Age: {pet.age})</span>
          </li>
        ))}
      </ul>
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