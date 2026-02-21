export const palette = {
  highlight: "#f5d9a0", // warm star gold, main highlights, numbers
  text: "#e8dcc8", // soft off-white, body text
  dim: "#8a7a68", // secondary text
  faint: "#4a3d30", // labels, hints
  face: "#0d0a12", // background
};

// Inject into :root at app startup
Object.entries(palette).forEach(([key, value]) => {
  document.documentElement.style.setProperty(`--color-${key}`, value);
});

export function opacity(percent: number): string {
  const hex = Math.round(percent * 2.55)
    .toString(16)
    .padStart(2, "0");
  return hex;
}
