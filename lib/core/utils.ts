export function formatBytes(
  bytes: number
) {
  if (bytes === 0) return "0 Bytes";

  const sizes = [
    "Bytes",
    "KB",
    "MB",
    "GB",
  ];

  const i = Math.floor(
    Math.log(bytes) /
      Math.log(1024)
  );

  return `${parseFloat(
    (bytes / Math.pow(1024, i)).toFixed(2)
  )} ${sizes[i]}`;
}

export function truncateAddress(
  address: string
) {
  return `${address.slice(
    0,
    6
  )}...${address.slice(-4)}`;
}