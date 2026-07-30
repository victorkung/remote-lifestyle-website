export const NAVY = "#1D3461";

export const TWEMOJI_AMERICAS = `M30.13 23.748c-1.017-.39-.836-.248-1.463-1.581-.627-1.332-1.007-1.761-2.417-1.917-1.411-.155-1.358-.045-1.75-.75-.392-.706-1.982.191-3 .584-1.021.392-.769 1.246-1.083 1.166-.315-.078-1.107-.281-1.893-.907-.784-.628.583-1.118.976-1.509.393-.393-.74-.179-1.133-.416-.393-.234-1.096.471-1.723-.158-.628-.627-.235-1.568-.313-2.352-.079-.785 1.018-.941 1.724-1.098.705-.156 1.253.001 1.253.941 0 .941.863 1.255.628.156s.235-1.411.55-1.96c.313-.549.862-1.334 1.567-2.51.706-1.176 1.177-.628 2.039-.544.863.085 1.098-.083 1.725-.004.625.079 0-.784.236-1.646.234-.862 1.097-.706 1.961-.47.862.235-.864-1.099-1.177-1.804-.315-.706-1.177 0-1.724-1.176-.553-1.176-1.324-1.937-2.03-2.042-.706-.106.225 1.494-.324 2.356-.551.862-1.395.727-2.26.727-.861 0-1.661-.727-1.033-1.825.626-1.097 1.823-.984 2.45-1.925.628-.94-2.23-.854-3.25-1.167-1.02-.314-2.244-.311-3.263.473-1.02.783-3.201 1.028-4.064 1.341-.862.313-1.017-.52-1.173-1.148-.07-.279-.388-.367-.836-.357C7.11 3.45 5.187 5.138 3.664 7.147c.237.807 1.385-.189 1.61-.414.235-.235 1.411.079 1.567.941.157.862.079 1.805-.234 2.589-.314.783.784 1.881 1.411 2.979.628 1.099 1.333 1.098 1.647 1.098.313 0 2.117.706 2.038 1.568-.078.863 1.647 1.646 2.353 2.195.706.551 1.152 1.092 2.068 1.25.917.158 1.989 1.657 2.459 1.815.361.12.972.697 1.341.876-.485.614-1.424 1.875-1.424 2.456 0 .786 1.025 2.021 1.417 2.334.391.312 1.517.55 1.75 1.333.236.784-.164 3.423-.868 4.128-.708.705-.965 2.372-.965 2.372s.249.541 1.083 0C21.839 34.07 23.383 32.37 24 32c1.176-.707 2.319-1.565 3.417-2.583 1.098-1.019.7-1.733 1.25-2.75.549-1.019 1.259-.973 2.199-1.833.942-.864.284-.693-.736-1.086z`;

export const TWEMOJI_PLANE_PATHS = [
  `M2 22c2 0 11 1 11 1s1 9 1 11-2 2-3 1-4-6-4-6-5-3-6-4-1-3 1-3z`,
  `M4 6.039C7 6 29 7 29 7s.924 22 .962 25c.038 3-2.763 4.002-3.862.001S21 15 21 15 7.045 10.583 3.995 9.898C0 9 .999 6.077 4 6.039z`,
  `M27 3c2-2 7-3 8-2s0 6-2 8-19 18-19 18-6.5 4.5-8 3 3-8 3-8S25 5 27 3z`,
  `M14 22s.5.5-4 5-5 4-5 4-.5-.5 4-5 5-4 5-4z`,
];

export const ORB_A = -15 * Math.PI / 180;
export const ORB_RXF = 1.15;
export const ORB_RYF = 0.24;
export const ORB_CX = 0.15;
export const ORB_CY = 0.0;
const cosA = Math.cos(ORB_A);
const sinA = Math.sin(ORB_A);

export function orbPt(t: number, gx: number, gy: number, R: number) {
  const rx = R * ORB_RXF, ry = R * ORB_RYF;
  return {
    x: gx + rx * Math.cos(t) * cosA - ry * Math.sin(t) * sinA,
    y: gy + rx * Math.cos(t) * sinA + ry * Math.sin(t) * cosA,
  };
}

export function orbTangentDeg(t: number, R: number): number {
  const rx = R * ORB_RXF, ry = R * ORB_RYF;
  const dxdt = -rx * Math.sin(t) * cosA - ry * Math.cos(t) * sinA;
  const dydt = -rx * Math.sin(t) * sinA + ry * Math.cos(t) * cosA;
  return Math.atan2(dydt, dxdt) * 180 / Math.PI;
}

export const PLANE_ORIENT = 16;

export const STEEL_TEXT = "#1C2B3A";
export const STEEL_GLOBE = "#5B8DB8";
export const STEEL_ACCENT = "white";
export const STEEL_TINT = "#EEF3F8";

export function Airplane({
  x, y, angleDeg, s = 1, fill = "white",
}: { x: number; y: number; angleDeg: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${angleDeg})`} opacity="0.95">
      <g transform={`scale(${s * 0.325}) translate(-18,-12)`}>
        {TWEMOJI_PLANE_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={fill}
            stroke={NAVY}
            strokeWidth={0.8}
            strokeOpacity={0.30}
            strokeLinejoin="round"
          />
        ))}
      </g>
    </g>
  );
}
