// Optional browser hints; unsupported devices fall back to input capabilities.
export function lightweightMotion() {
  const device = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return (
    window.matchMedia("(max-width: 900px), (hover: none), (pointer: coarse)").matches ||
    (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 4) ||
    (device.deviceMemory !== undefined && device.deviceMemory <= 4) ||
    device.connection?.saveData === true
  );
}
