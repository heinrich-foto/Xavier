import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import deviceGroupService from "../services/deviceGroupService";
import locationService from "../services/locationService";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_PROFILES = gql`
  query getProfiles {
    configProfiles {
      _id
      PayloadDisplayName
    }
  }
`;

const DeviceGroups = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [groups, setGroups] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", location: "", profiles: [] });
  const [editingId, setEditingId] = useState(null);

  const { data: profilesData } = useQuery(GET_PROFILES);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    locationService.getLocations().then(setLocations).catch(() => setLocations([]));
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await deviceGroupService.getDeviceGroups();
      setGroups(data);
    } catch (err) {
      toast.error("Gruppen konnten nicht geladen werden.");
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name ist erforderlich.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      location: formData.location || undefined,
      profiles: Array.isArray(formData.profiles) ? formData.profiles : []
    };

    try {
      if (editingId) {
        await deviceGroupService.updateDeviceGroup(editingId, payload);
        toast.success("Gruppe aktualisiert.");
      } else {
        await deviceGroupService.createDeviceGroup(payload);
        toast.success("Gruppe angelegt.");
      }
      resetForm();
      loadGroups();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Fehler";
      toast.error(msg);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", location: "", profiles: [] });
    setEditingId(null);
  };

  const handleEdit = (grp) => {
    setFormData({
      name: grp.name,
      location: grp.location?._id || "",
      profiles: grp.profiles?.map((p) => p._id) || []
    });
    setEditingId(grp._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Gruppe wirklich löschen?")) return;
    try {
      await deviceGroupService.deleteDeviceGroup(id);
      toast.success("Gruppe gelöscht.");
      loadGroups();
      if (editingId === id) resetForm();
    } catch (err) {
      toast.error("Gruppe konnte nicht gelöscht werden.");
    }
  };

  const toggleProfile = (profileId) => {
    setFormData((prev) => {
      const next = Array.isArray(prev.profiles) ? [...prev.profiles] : [];
      const idx = next.indexOf(profileId);
      if (idx >= 0) {
        next.splice(idx, 1);
      } else {
        next.push(profileId);
      }
      return { ...prev, profiles: next };
    });
  };

  const profiles = profilesData?.configProfiles || [];

  if (loading && groups.length === 0) {
    return <p className="text-center my-4">Laden...</p>;
  }

  return (
    <div className="container">
      <h2 className="mb-4">Geräte-Gruppen</h2>
      <p className="text-muted mb-4">
        Gruppen definieren Profile-Sets, die bei Enrollment installiert werden. Registrierungen können einer Gruppe zugeordnet werden.
      </p>

      <form onSubmit={handleSubmit} className="card mb-4 p-3">
        <div className="row g-2 mb-2">
          <div className="col-md-3">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Schul-iPads Standard"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Location</label>
            <select
              className="form-select"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
            >
              <option value="">—</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.schoolNumber} – {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 d-flex align-items-end gap-2">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Aktualisieren" : "Hinzufügen"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                Abbrechen
              </button>
            )}
          </div>
        </div>
        <div className="row g-2">
          <div className="col-12">
            <label className="form-label">Profile (Reihenfolge = Installationsreihenfolge)</label>
            <div className="d-flex flex-wrap gap-2">
              {profiles.map((p) => (
                <label key={p._id} className="form-check form-check-inline">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={formData.profiles?.includes(p._id) || false}
                    onChange={() => toggleProfile(p._id)}
                  />
                  <span className="form-check-label">{p.PayloadDisplayName}</span>
                </label>
              ))}
              {profiles.length === 0 && (
                <span className="text-muted">Keine Profile vorhanden.</span>
              )}
            </div>
          </div>
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Profile</th>
            <th style={{ width: "140px" }}></th>
          </tr>
        </thead>
        <tbody>
          {groups.map((grp) => (
            <tr key={grp._id}>
              <td>{grp.name}</td>
              <td>{grp.location ? `${grp.location.schoolNumber} – ${grp.location.name}` : "—"}</td>
              <td>
                {grp.profiles?.map((p) => p.PayloadDisplayName).join(", ") || "—"}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-1"
                  onClick={() => handleEdit(grp)}
                >
                  Bearbeiten
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(grp._id)}
                >
                  Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {groups.length === 0 && (
        <p className="text-muted">Noch keine Gruppen angelegt.</p>
      )}
    </div>
  );
};

export default DeviceGroups;
