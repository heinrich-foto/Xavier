import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import locationService from "../../services/locationService";
import deviceService from "../../services/deviceService";

export default function EditLocationModal({
  visible,
  device,
  deviceType,
  onClose,
  onSuccess,
}) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationId, setLocationId] = useState("");
  const [assetTag, setAssetTag] = useState("");

  useEffect(() => {
    if (visible) {
      setLocationId(device?.location?._id || "");
      setAssetTag(device?.assetTag || "");
      locationService.getLocations().then(setLocations).catch(() => setLocations([]));
    }
  }, [visible, device]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deviceService.updateDeviceMetadata(deviceType, device.SerialNumber, {
        location: locationId || null,
        assetTag: assetTag.trim() || null,
      });
      toast.success("Location und Asset Tag aktualisiert.");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Location & Asset Tag</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Location</label>
                <select
                  className="form-select"
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                >
                  <option value="">— Keine —</option>
                  {locations.map((loc) => (
                    <option key={loc._id} value={loc._id}>
                      {loc.schoolNumber} – {loc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Asset Tag</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="AT-001"
                  value={assetTag}
                  onChange={(e) => setAssetTag(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Abbrechen
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Speichern…" : "Speichern"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
