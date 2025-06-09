import React, { useState, useEffect } from 'react';
import './App.css';
import PetModal from './PetModal';
import { scanPets, addPet, deletePet } from './awsClient';


function App() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ name: '', type: '', age: '' });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchPets() {
      const pets = await scanPets();
      setPets(pets);
    }
    fetchPets();
  }, []);

  const handleChange = (formUpdate) => {
    setForm(formUpdate);
  };

  const handleSave = async () => {
    const newPet = {
      Adopt: Date.now().toString(),
      name: form.name,
      type: form.type,
      age: form.age,
    };
    try {
      await addPet(newPet);
      setPets([...pets, newPet]);
      setModalOpen(false);
      setForm({ name: '', type: '', age: '' });
    } catch (error) {
      console.error("Error saving pet:", error);
    }
  };

  const handleDelete = async (adoptId) => {
    try {
      await deletePet(adoptId);
      setPets(pets.filter(pet => pet.Adopt !== adoptId));
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  return (
    <>
      <h1>Pet Adoption</h1>
      <button onClick={() => setModalOpen(true)}>Add Pet</button>
      <ul>
        {pets.length === 0 && <li>No pets yet.</li>}
        {pets.map(pet => (
          <li key={pet.Adopt}>
            <span>{pet.name} ({pet.type}, Age: {pet.age})</span>
            <button onClick={() => handleDelete(pet.Adopt)} style={{marginLeft: '1em'}}>Delete</button>
          </li>
        ))}
      </ul>
      <PetModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        form={form}
        onChange={handleChange}
        onSave={handleSave}
      />
    </>
  );
}

export default App;