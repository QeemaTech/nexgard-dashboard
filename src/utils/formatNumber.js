export default function formatNumber(value) {
  const num = Number(value || 0);
  return num.toLocaleString("en-US");
}
