import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // Pet state: array of pet objects { id, name, type, age }
  const [pets, setPets] = useState([])
  // Form state
  const [form, setForm] = useState({ name: '', type: '', age: '' })
  // Edit mode state
  const [editId, setEditId] = useState(null)

  // Handle form input changes
  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  // Handle form submit for create or update
  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.type || !form.age) return
    if (editId === null) {
      // Create
      setPets(pets => [
        ...pets,
        { id: Date.now(), name: form.name, type: form.type, age: form.age }
      ])
    } else {
      // Update
      setPets(pets => pets.map(p =>
        p.id === editId ? { ...p, ...form } : p
      ))
      setEditId(null)
    }
    setForm({ name: '', type: '', age: '' })
  }

  // Edit pet
  function handleEdit(pet) {
    setForm({ name: pet.name, type: pet.type, age: pet.age })
    setEditId(pet.id)
  }

  // Delete pet
  async function deletePetFromDynamoDB(id) {
    try {
      // TODO: Replace with your API call to delete from DynamoDB
      // Example:
      // const res = await fetch(`/api/pets/${id}`, { method: 'DELETE' })
      // if (!res.ok) throw new Error('Network response was not ok')
      // return true
      return true
    } catch (err) {
      console.error('DynamoDB delete error:', err)
      throw err
    }
  }

  function handleDelete(id) {
    deletePetFromDynamoDB(id)
      .then(() => {
        setPets(pets => pets.filter(p => p.id !== id))
        if (editId === id) {
          setEditId(null)
          setForm({ name: '', type: '', age: '' })
        }
      })
      .catch(err => {
        alert('Failed to delete pet from DynamoDB')
        // Optionally display error in UI
      })
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 24 }}>
      <h1 style={{ fontSize: '2em', marginBottom: 16 }}>Pet Adoption</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        <input
          name="name"
          placeholder="Pet Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          name="type"
          placeholder="Type (e.g. Dog, Cat)"
          value={form.type}
          onChange={handleChange}
          required
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <input
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
          type="number"
          min="0"
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={{ flex: 1 }}>{editId === null ? 'Add Pet' : 'Update Pet'}</button>
          {editId !== null && (
            <button type="button" onClick={() => { setEditId(null); setForm({ name: '', type: '', age: '' }) }} style={{ flex: 1, background: '#eee', color: '#333' }}>Cancel</button>
          )}
        </div>
      </form>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {pets.length === 0 && <li style={{ color: '#888' }}>No pets yet.</li>}
        {pets.map(pet => (
          <li key={pet.id} style={{ marginBottom: 12, border: '1px solid #eee', padding: 12, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><strong>{pet.name}</strong> ({pet.type}, Age: {pet.age})</span>
            <span>
              <button onClick={() => handleEdit(pet)} style={{ marginRight: 8 }}>Edit</button>
              <button onClick={() => handleDelete(pet.id)} style={{ background: '#f66', color: '#fff' }}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
