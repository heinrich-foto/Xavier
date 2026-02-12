import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import locationService from "../services/locationService";

const Locations = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", schoolNumber: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await locationService.getLocations();
      setLocations(data);
    } catch (err) {
      toast.error("Locations konnten nicht geladen werden.");
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.schoolNumber.trim()) {
      toast.error("Name und S-Nummer sind erforderlich.");
      return;
    }

    try {
      if (editingId) {
        await locationService.updateLocation(
          editingId,
          formData.name.trim(),
          formData.schoolNumber.trim().toUpperCase()
        );
        toast.success("Location aktualisiert.");
      } else {
        await locationService.createLocation(
          formData.name.trim(),
          formData.schoolNumber.trim().toUpperCase()
        );
        toast.success("Location angelegt.");
      }
      setFormData({ name: "", schoolNumber: "" });
      setEditingId(null);
      loadLocations();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Fehler";
      toast.error(msg);
    }
  };

  const handleEdit = (loc) => {
    setFormData({ name: loc.name, schoolNumber: loc.schoolNumber });
    setEditingId(loc._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Location wirklich löschen?")) return;
    try {
      await locationService.deleteLocation(id);
      toast.success("Location gelöscht.");
      loadLocations();
      if (editingId === id) {
        setFormData({ name: "", schoolNumber: "" });
        setEditingId(null);
      }
    } catch (err) {
      toast.error("Location konnte nicht gelöscht werden.");
    }
  };

  if (loading) {
    return <p className="text-center my-4">Laden...</p>;
  }

  return (
    <div className="container">
      <h2 className="mb-4">Locations</h2>

      <form onSubmit={handleSubmit} className="card mb-4 p-3">
        <div className="row g-2">
          <div className="col-md-4">
            <label className="form-label">S-Nummer (z.B. S15)</label>
            <input
              type="text"
              className="form-control"
              placeholder="S15"
              value={formData.schoolNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, schoolNumber: e.target.value }))
              }
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Grundschule Mitte"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="col-md-4 d-flex align-items-end gap-2">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Aktualisieren" : "Hinzufügen"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setFormData({ name: "", schoolNumber: "" });
                  setEditingId(null);
                }}
              >
                Abbrechen
              </button>
            )}
          </div>
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>S-Nummer</th>
            <th>Name</th>
            <th style={{ width: "120px" }}></th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={loc._id}>
              <td>{loc.schoolNumber}</td>
              <td>{loc.name}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-1"
                  onClick={() => handleEdit(loc)}
                >
                  Bearbeiten
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(loc._id)}
                >
                  Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {locations.length === 0 && (
        <p className="text-muted">Noch keine Locations angelegt.</p>
      )}
    </div>
  );
};

export default Locations;
