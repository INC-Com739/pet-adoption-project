import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function PetModal({ show, onHide, form, onChange, onSave, isEdit }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? 'Edit Animal' : 'Add New Animal'}</Modal.Title>
      </Modal.Header>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSave(e);
        }}
      >
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="petName" className="form-label">Pet Name</label>
            <input
              type="text"
              className="form-control"
              id="petName"
              value={form.name}
              onChange={e => onChange({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="petType" className="form-label">Pet Type</label>
            <input
              type="text"
              className="form-control"
              id="petType"
              value={form.type}
              onChange={e => onChange({ ...form, type: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="petAge" className="form-label">Pet Age</label>
            <input
              type="number"
              className="form-control"
              id="petAge"
              value={form.age}
              onChange={e => onChange({ ...form, age: e.target.value })}
              required
              min="0"
            />
          </div>
          <p className="text-muted">Please fill in the details of the pet you want to {isEdit ? 'edit' : 'add'}.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Close</Button>
          <Button variant="primary" type="submit">{isEdit ? 'Save Changes' : 'Save Animal'}</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}