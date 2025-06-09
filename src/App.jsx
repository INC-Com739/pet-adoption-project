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

// Add a new pet
  useEffect(() => {
    async function addPet() {
      if (pets.length === 0) return;
      try {
        const res = await fetch('/api/pets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pets[pets.length - 1]),
        });
        if (!res.ok) throw new Error('Failed to add pet');
        const newPet = await res.json();
        setPets(pets => [...pets, newPet]);
      } catch (err) {
        console.error('Failed to add pet:', err);
      }
    }
    addPet();
  }, [pets]);
  // delete a pet
  useEffect(() => {
    async function deletePet() {
      if (pets.length === 0) return;
      try {
        const res = await fetch('/api/pets', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pets[pets.length - 1]),
        });
        if (!res.ok) throw new Error('Failed to delete pet');
        setPets(pets => pets.filter(pet => pet.Adopt !== pets[pets.length - 1].Adopt));
      } catch (err) {
        console.error('Failed to delete pet:', err);
      }
    }
    deletePet();
  }, [pets]);
  // handle form changes
  useEffect(() => {
    async function handleFormChange() {
      if (!form.name || !form.type || !form.age) return;
      try {
        const res = await fetch('/api/pets', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Failed to update pet');
        const updatedPet = await res.json();
        setPets(pets => pets.map(pet => pet.Adopt === updatedPet.Adopt ? updatedPet : pet));
      } catch (err) {
        console.error('Failed to update pet:', err);
      }
    }
    handleFormChange();
  }, [form]);
  // handle form changes
  useEffect(() => {
    async function handleFormChange() {
      if (!form.name || !form.type || !form.age) return;
      try {
        const res = await fetch('/api/pets', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Failed to update pet');
        const updatedPet = await res.json();
        setPets(pets => pets.map(pet => pet.Adopt === updatedPet.Adopt ? updatedPet : pet));
      } catch (err) {
        console.error('Failed to update pet:', err);
      }
    }
    handleFormChange();
  }, [form]);

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