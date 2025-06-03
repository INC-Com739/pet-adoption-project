import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  // Pet state: array of pet objects { id, name, type, age }
  const [pets, setPets] = useState([]);
  // Form state
  const [form, setForm] = useState({ name: '', type: '', age: '' });
  // Edit mode state
  const [editId, setEditId] = useState(null);

  // Handle form input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  // Handle form submit for create or update
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.type || !form.age) return;
    if (editId === null) {
      // Create
      setPets(pets => [
        ...pets,
        { id: Date.now(), name: form.name, type: form.type, age: form.age }
      ]);
    } else {
      // Update
      setPets(pets => pets.map(p =>
        p.id === editId ? { ...p, ...form } : p
      ));
      setEditId(null);
    }
    setForm({ name: '', type: '', age: '' });
  }

  // Edit pet
  function handleEdit(pet) {
    setForm({ name: pet.name, type: pet.type, age: pet.age });
    setEditId(pet.id);
  }

  // Delete pet
  async function deletePetFromDynamoDB(id) {
    try {
      // TODO: Replace with your API call to delete from DynamoDB
      // Example:
      // const res = await fetch(`/api/pets/${id}`, { method: 'DELETE' })
      // if (!res.ok) throw new Error('Network response was not ok')
      // return true
      return true;
    } catch (err) {
      console.error('DynamoDB delete error:', err);
      throw err;
    }
  }

  function handleDelete(id) {
    deletePetFromDynamoDB(id)
      .then(() => {
        setPets(pets => pets.filter(p => p.id !== id));
        if (editId === id) {
          setEditId(null);
          setForm({ name: '', type: '', age: '' });
        }
      })
      .catch(err => {
        alert('Failed to delete pet from DynamoDB');
        // Optionally display error in UI
      });
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Pet Adoption</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <input
          name="name"
          placeholder="Pet Name"
          value={form.name}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          name="type"
          placeholder="Type (e.g. Dog, Cat)"
          value={form.type}
          onChange={handleChange}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <input
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
          type="number"
          min="0"
          className="p-2 border border-gray-300 rounded"
        />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">{editId === null ? 'Add Pet' : 'Update Pet'}</button>
          {editId !== null && (
            <button type="button" onClick={() => { setEditId(null); setForm({ name: '', type: '', age: '' }) }} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition">Cancel</button>
          )}
        </div>
      </form>
      <ul className="list-none p-0 m-0">
        {pets.length === 0 && <li className="text-gray-400 text-center">No pets yet.</li>}
        {pets.map(pet => (
          <li key={pet.id} className="mb-4 border border-gray-200 p-4 rounded flex justify-between items-center">
            <span><strong>{pet.name}</strong> ({pet.type}, Age: {pet.age})</span>
            <span>
              <button onClick={() => handleEdit(pet)} className="mr-2 px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition">Edit</button>
              <button onClick={() => handleDelete(pet.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
