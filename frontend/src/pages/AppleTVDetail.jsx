import React, { useState } from "react";
import { GET_APPLE_TV } from "../queries/appleTVQueries";
import DeviceDetailBase, { calculateStoragePercentage, formatMacAddress } from "../components/DeviceDetailBase";
import {
  updateDeviceInventory,
  restartDevice,
} from "../commands/mdmCommands.js";
import RenameDeviceModal from "../components/modals/RenameDeviceModal.jsx";
import InstallProfileModal from "../components/modals/InstallProfileModal.jsx";
import EraseDeviceModal from "../components/modals/EraseDeviceModal.jsx";

export default function AppleTVDetail() {
  const [showRenameDeviceModal, setShowRenameDeviceModal] = useState(false);
  const [showInstallProfileModal, setShowInstallProfileModal] = useState(false);
  const [showEraseDeviceModal, setShowEraseDeviceModal] = useState(false);

  const actionButtons = [
    {
      label: "Erase Device",
      onClick: () => setShowEraseDeviceModal(true)
    },
    {
      label: "Install Profile",
      onClick: () => setShowInstallProfileModal(true)
    },
    {
      label: "Rename Device",
      onClick: () => setShowRenameDeviceModal(true)
    },
    {
      label: "Restart Device",
      onClick: (device) => restartDevice(device.UDID)
    },
    {
      label: "Update Device Inventory",
      onClick: (device) => updateDeviceInventory("tvos", device.UDID)
    }
  ];

  const infoSections = [
    {
      title: 'hardware',
      getData: (device) => ({
        "serial number": device.SerialNumber,
        "product name": device.QueryResponses.ProductName,
        "storage": calculateStoragePercentage(device)
      })
    },
    {
      title: 'network',
      getData: (device) => ({
        "WiFi MAC address": formatMacAddress(device.QueryResponses?.WiFiMAC),
        "bluetooth MAC address": formatMacAddress(device.QueryResponses?.BluetoothMAC)
      })
    },
    {
      title: 'operating system',
      getData: (device) => ({
        "tvOS version": device.QueryResponses?.OSVersion,
        "build version": device.QueryResponses?.BuildVersion,
        "MDM profile installed": device.mdmProfileInstalled,
        "supervised": device.QueryResponses?.IsSupervised
      })
    }
  ];

  const renderModals = (device) => (
    <>
      {showRenameDeviceModal && (
        <RenameDeviceModal
          visible={showRenameDeviceModal}
          UDID={device.UDID}
          platform='tvOS'
          oldName={device.QueryResponses?.DeviceName}
          hideRenameDeviceModal={() => setShowRenameDeviceModal(false)}
        />
      )}
      {showInstallProfileModal && (
        <InstallProfileModal
          visible={showInstallProfileModal}
          UDID={device.UDID}
          currentProfiles={device.Profiles}
          configProfiles={device.configProfiles}
          hideInstallProfileModal={() => setShowInstallProfileModal(false)}
        />
      )}
      {showEraseDeviceModal && (
        <EraseDeviceModal
          visible={showEraseDeviceModal}
          UDID={device.UDID}
          hideEraseDeviceModal={() => setShowEraseDeviceModal(false)}
        />
      )}
    </>
  );

  return (
    <DeviceDetailBase
      query={GET_APPLE_TV}
      deviceType="appletv"
      getDeviceData={(data) => data.appletv}
      actionButtons={actionButtons}
      renderModals={renderModals}
      infoSections={infoSections}
    />
  );
}
