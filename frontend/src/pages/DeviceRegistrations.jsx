import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import deviceRegistrationService from "../services/deviceRegistrationService";
import locationService from "../services/locationService";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_PROFILES = gql`
  query getProfiles {
    configProfiles {
      _id
      PayloadDisplayName
      PayloadIdentifier
    }
  }
`;

const DeviceRegistrations = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [registrations, setRegistrations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [formData, setFormData] = useState({
    serialNumber: "",
    plannedDeviceName: "",
    assetTag: "",
    location: "",
    profileToInstall: "",
    deviceType: "mac",
    notes: ""
  });
  const [editingId, setEditingId] = useState(null);

  const { data: profilesData } = useQuery(GET_PROFILES);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    loadRegistrations();
  }, [statusFilter]);

  useEffect(() => {
    locationService.getLocations().then(setLocations).catch(() => setLocations([]));
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const data = await deviceRegistrationService.getDeviceRegistrations(statusFilter);
      setRegistrations(data);
    } catch (err) {
      toast.error("Registrierungen konnten nicht geladen werden.");
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.serialNumber.trim()) {
      toast.error("Seriennummer ist erforderlich.");
      return;
    }

    const payload = {
      serialNumber: formData.serialNumber.trim(),
      plannedDeviceName: formData.plannedDeviceName.trim() || undefined,
      assetTag: formData.assetTag.trim() || undefined,
      location: formData.location || undefined,
      profileToInstall: formData.profileToInstall || undefined,
      deviceType: formData.deviceType,
      notes: formData.notes.trim() || undefined
    };

    try {
      if (editingId) {
        await deviceRegistrationService.updateDeviceRegistration(editingId, payload);
        toast.success("Registrierung aktualisiert.");
      } else {
        await deviceRegistrationService.createDeviceRegistration(payload);
        toast.success("Registrierung angelegt.");
      }
      resetForm();
      loadRegistrations();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Fehler";
      toast.error(msg);
    }
  };

  const resetForm = () => {
    setFormData({
      serialNumber: "",
      plannedDeviceName: "",
      assetTag: "",
      location: "",
      profileToInstall: "",
      deviceType: "mac",
      notes: ""
    });
    setEditingId(null);
  };

  const handleEdit = (reg) => {
    setFormData({
      serialNumber: reg.serialNumber,
      plannedDeviceName: reg.plannedDeviceName || "",
      assetTag: reg.assetTag || "",
      location: reg.location?._id || "",
      profileToInstall: reg.profileToInstall?._id || "",
      deviceType: reg.deviceType || "mac",
      notes: reg.notes || ""
    });
    setEditingId(reg._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Registrierung wirklich löschen?")) return;
    try {
      await deviceRegistrationService.deleteDeviceRegistration(id);
      toast.success("Registrierung gelöscht.");
      loadRegistrations();
      if (editingId === id) resetForm();
    } catch (err) {
      toast.error("Registrierung konnte nicht gelöscht werden.");
    }
  };

  const profiles = profilesData?.configProfiles || [];

  if (loading && registrations.length === 0) {
    return <p className="text-center my-4">Laden...</p>;
  }

  return (
    <div className="container">
      <h2 className="mb-4">Geräte-Registrierung</h2>
      <p className="text-muted mb-4">
        Geräte vor dem Enrollment registrieren. Beim ersten Einschreiben werden Location, Name und Profil automatisch angewendet.
      </p>

      <form onSubmit={handleSubmit} className="card mb-4 p-3">
        <div className="row g-2 mb-2">
          <div className="col-md-2">
            <label className="form-label">Seriennummer *</label>
            <input
              type="text"
              className="form-control"
              placeholder="C02XY1234"
              value={formData.serialNumber}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, serialNumber: e.target.value }))
              }
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Geplanter Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="MacBook-S15-01"
              value={formData.plannedDeviceName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, plannedDeviceName: e.target.value }))
              }
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Asset Tag</label>
            <input
              type="text"
              className="form-control"
              placeholder="AT-001"
              value={formData.assetTag}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, assetTag: e.target.value }))
              }
            />
          </div>
          <div className="col-md-2">
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
          <div className="col-md-2">
            <label className="form-label">Gerätetyp</label>
            <select
              className="form-select"
              value={formData.deviceType}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, deviceType: e.target.value }))
              }
            >
              <option value="mac">Mac</option>
              <option value="iphone">iPhone</option>
              <option value="ipad">iPad</option>
              <option value="appletv">Apple TV</option>
            </select>
          </div>
        </div>
        <div className="row g-2 mb-2">
          <div className="col-md-3">
            <label className="form-label">Profil bei Enrollment</label>
            <select
              className="form-select"
              value={formData.profileToInstall}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, profileToInstall: e.target.value }))
              }
            >
              <option value="">—</option>
              {profiles.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.PayloadDisplayName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Notizen</label>
            <input
              type="text"
              className="form-control"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
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
      </form>

      <div className="mb-2">
        <select
          className="form-select form-select-sm"
          style={{ width: "auto" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="pending">Ausstehend</option>
          <option value="enrolled">Eingeschrieben</option>
          <option value="">Alle</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Seriennummer</th>
            <th>Geplanter Name</th>
            <th>Asset Tag</th>
            <th>Location</th>
            <th>Typ</th>
            <th>Status</th>
            <th style={{ width: "140px" }}></th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => (
            <tr key={reg._id}>
              <td>{reg.serialNumber}</td>
              <td>{reg.plannedDeviceName || "—"}</td>
              <td>{reg.assetTag || "—"}</td>
              <td>{reg.location ? `${reg.location.schoolNumber} – ${reg.location.name}` : "—"}</td>
              <td>{reg.deviceType}</td>
              <td>
                <span className={`badge ${reg.enrollmentStatus === 'enrolled' ? 'bg-success' : 'bg-secondary'}`}>
                  {reg.enrollmentStatus}
                </span>
              </td>
              <td>
                {reg.enrollmentStatus === "pending" && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => handleEdit(reg)}
                    >
                      Bearbeiten
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(reg._id)}
                    >
                      Löschen
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {registrations.length === 0 && (
        <p className="text-muted">Keine Registrierungen in dieser Kategorie.</p>
      )}
    </div>
  );
};

export default DeviceRegistrations;
