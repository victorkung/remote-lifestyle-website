import { useRef, useState, useEffect } from "react";
import {
  NAVY,
  TWEMOJI_AMERICAS,
  ORB_RXF,
  ORB_RYF,
  ORB_CX,
  ORB_CY,
  PLANE_ORIENT,
  STEEL_TEXT,
  STEEL_GLOBE,
  STEEL_ACCENT,
  Airplane,
  orbPt,
  orbTangentDeg,
} from "./logoGeometry";

interface TRLLogoProps {
  scale?: number;
  uid?: string;
}

export function TRLLogo({ scale = 1, uid = "trl" }: TRLLogoProps) {
  const textColor = STEEL_TEXT;
  const globeColor = STEEL_GLOBE;
  const accentColor = STEEL_ACCENT;
  const scriptFont = "'Caveat', cursive";

  const FS = 96 * scale;
  const CAP_H = FS * 0.715;
  const GLOBE_R = CAP_H / 2;
  const LS = -2 * scale;

  const PAD_TOP = 28 * scale;
  const PAD_BOT = 22 * scale;
  const THE_SIZE = 34 * scale;
  const GAP_THE = 10 * scale;
  const THE_Y = PAD_TOP + THE_SIZE;
  const BASELINE = THE_Y + GAP_THE + CAP_H;
  const GLOBE_CY = BASELINE - GLOBE_R;
  const LS_GAP = 10 * scale;
  const LS_SIZE = 84 * scale;
  const LS_Y = BASELINE + LS_GAP + LS_SIZE * 0.72;
  const SVG_W = 680 * scale;
  const SVG_H = LS_Y + LS_SIZE * 0.28 + PAD_BOT;

  const remRef = useRef<SVGTextElement>(null);
  const oRef = useRef<SVGTextElement>(null);
  const totRef = useRef<SVGTextElement>(null);
  const [gx, setGx] = useState(SVG_W / 2);

  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      if (cancelled || !remRef.current || !oRef.current || !totRef.current) return;
      try {
        const wRem = remRef.current.getBBox().width;
        const wO = oRef.current.getBBox().width;
        const wTotal = totRef.current.getBBox().width;
        if (wRem > 0 && wO > 0 && wTotal > 0) {
          setGx(SVG_W / 2 - wTotal / 2 + wRem + wO / 2);
        }
      } catch (_) {}
    };
    const scheduleDouble = () =>
      requestAnimationFrame(() => requestAnimationFrame(measure));
    scheduleDouble();
    document.fonts.ready.then(scheduleDouble);
    return () => { cancelled = true; };
  }, [scale, SVG_W]);

  const gy = GLOBE_CY;
  const R = GLOBE_R;

  const t_s = 1.00 * Math.PI;
  const t_e = 1.67 * Math.PI;
  const ocx = gx + R * ORB_CX;
  const ocy = gy + R * ORB_CY;
  const pt_s = orbPt(t_s, ocx, ocy, R);
  const pt_e = orbPt(t_e, ocx, ocy, R);
  const ORB_DEG = -15;
  const orbitPath = `M ${pt_s.x} ${pt_s.y} A ${R * ORB_RXF} ${R * ORB_RYF} ${ORB_DEG} 0 0 ${pt_e.x} ${pt_e.y}`;

  const airplaneDeg = orbTangentDeg(t_e, R) + PLANE_ORIENT;
  const airplaneS = scale * 1.0;
  const clipId = `gc-${uid}`;

  return (
    <svg
      width={SVG_W}
      height={SVG_H}
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ display: "block", width: "100%", height: "auto", maxWidth: "100%" }}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx={gx} cy={gy} r={R} />
        </clipPath>
      </defs>

      <text ref={remRef} x={0} y={-9999} textAnchor="start"
            fontFamily="'Raleway', sans-serif" fontWeight="800"
            fontSize={FS} letterSpacing={LS}>REM</text>
      <text ref={oRef} x={0} y={-9999} textAnchor="start"
            fontFamily="'Raleway', sans-serif" fontWeight="800"
            fontSize={FS} letterSpacing={LS}>O</text>
      <text ref={totRef} x={0} y={-9999} textAnchor="start"
            fontFamily="'Raleway', sans-serif" fontWeight="800"
            fontSize={FS} letterSpacing={LS}>REMOTE</text>

      <text
        x={SVG_W / 2} y={THE_Y}
        textAnchor="middle"
        fontFamily="'Raleway', sans-serif"
        fontWeight="800"
        fontSize={THE_SIZE}
        fill={textColor}
        letterSpacing={6 * scale}
      >THE</text>

      <text
        x={SVG_W / 2} y={BASELINE}
        textAnchor="middle"
        fontFamily="'Raleway', sans-serif"
        fontWeight="800"
        fontSize={FS}
        fill={textColor}
        letterSpacing={LS}
      >
        <tspan>REM</tspan>
        <tspan fill="transparent">O</tspan>
        <tspan>TE</tspan>
      </text>

      <circle
        cx={gx} cy={gy} r={R}
        fill={globeColor}
        stroke="white"
        strokeWidth={1.5 * scale}
        strokeOpacity={0.25}
      />

      <g clipPath={`url(#${clipId})`}>
        <g transform={`translate(${gx},${gy}) scale(${R / 18}) translate(-18,-18)`}>
          <path
            d={TWEMOJI_AMERICAS}
            fill={accentColor}
            stroke={NAVY}
            strokeWidth={0.6}
            strokeOpacity={0.30}
            strokeLinejoin="round"
          />
        </g>
      </g>

      <path
        d={orbitPath}
        fill="none"
        stroke={accentColor}
        strokeWidth={2.6 * scale}
        strokeLinecap="round"
        opacity="0.92"
      />

      <Airplane x={pt_e.x} y={pt_e.y} angleDeg={airplaneDeg} s={airplaneS} fill={accentColor} />

      <text
        x={SVG_W / 2} y={LS_Y}
        textAnchor="middle"
        fontFamily={scriptFont}
        fontWeight="700"
        fontSize={LS_SIZE}
        fill={textColor}
      >Lifestyle</text>
    </svg>
  );
}
