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

interface SubBrandLogoProps {
  subBrandWord: string;
  scale?: number;
  uid?: string;
}

const SUB_FONT_SIZE = 56;
const RULE_STROKE = 1.5;

export function SubBrandLogo({
  subBrandWord,
  scale = 1,
  uid = "sub",
}: SubBrandLogoProps) {
  const textColor = STEEL_TEXT;
  const globeColor = STEEL_GLOBE;
  const accentColor = STEEL_ACCENT;

  const FS = 96 * scale;
  const CAP_H = FS * 0.715;
  const GR = CAP_H / 2;
  const LS = -2 * scale;
  const BASELINE = 36 * scale + CAP_H;
  const GLOBE_CY = BASELINE - GR;
  const LS_SIZE = 84 * scale;
  const LS_Y = BASELINE + 10 * scale + LS_SIZE * 0.72;
  const LS_BOTTOM = LS_Y + LS_SIZE * 0.28;
  const RULE_Y = LS_BOTTOM + 14 * scale;
  const SUB_SIZE = SUB_FONT_SIZE * scale;
  const SUB_Y = RULE_Y + 18 * scale + SUB_SIZE * 0.715;
  const SVG_W = 680 * scale;
  const SVG_H = SUB_Y + SUB_SIZE * 0.28 + 24 * scale;

  const remRef = useRef<SVGTextElement>(null);
  const oRef = useRef<SVGTextElement>(null);
  const totRef = useRef<SVGTextElement>(null);
  const subRef = useRef<SVGTextElement>(null);

  const [layout, setLayout] = useState({
    gx: SVG_W / 2,
    remoteWidth: SVG_W * 0.56,
    subLS: 18 * scale,
  });

  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      try {
        const wRem = remRef.current?.getBBox().width ?? 0;
        const wO = oRef.current?.getBBox().width ?? 0;
        const wTotal = totRef.current?.getBBox().width ?? 0;
        const wSub = subRef.current?.getBBox().width ?? 0;
        if (wRem > 0 && wO > 0 && wTotal > 0 && wSub > 0) {
          const gx = SVG_W / 2 - wTotal / 2 + wRem + wO / 2;
          const subLS = Math.max(0, (wTotal - wSub) / subBrandWord.length);
          setLayout({ gx, remoteWidth: wTotal, subLS });
        }
      } catch (_) {}
    };
    const go = () => requestAnimationFrame(() => requestAnimationFrame(measure));
    go();
    document.fonts.ready.then(go);
    return () => { cancelled = true; };
  }, [subBrandWord, scale, SVG_W, SUB_SIZE]);

  const ruleX1 = SVG_W / 2 - layout.remoteWidth / 2;
  const ruleX2 = SVG_W / 2 + layout.remoteWidth / 2;
  const clipId = `sb-${uid}`;

  const t_s = Math.PI;
  const t_e = 1.67 * Math.PI;
  const ocx = layout.gx + GR * ORB_CX;
  const ocy = GLOBE_CY + GR * ORB_CY;
  const pts = orbPt(t_s, ocx, ocy, GR);
  const pte = orbPt(t_e, ocx, ocy, GR);
  const airplaneDeg = orbTangentDeg(t_e, GR) + PLANE_ORIENT;
  const orbitPath = `M ${pts.x} ${pts.y} A ${GR * ORB_RXF} ${GR * ORB_RYF} -15 0 0 ${pte.x} ${pte.y}`;

  return (
    <svg
      width={SVG_W}
      height={SVG_H}
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ display: "block", width: "100%", height: "auto", maxWidth: "100%" }}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx={layout.gx} cy={GLOBE_CY} r={GR} />
        </clipPath>
      </defs>

      <text ref={remRef} x={0} y={-9999} fontFamily="'Raleway',sans-serif" fontWeight="800" fontSize={FS} letterSpacing={LS}>REM</text>
      <text ref={oRef} x={0} y={-9999} fontFamily="'Raleway',sans-serif" fontWeight="800" fontSize={FS} letterSpacing={LS}>O</text>
      <text ref={totRef} x={0} y={-9999} fontFamily="'Raleway',sans-serif" fontWeight="800" fontSize={FS} letterSpacing={LS}>REMOTE</text>
      <text ref={subRef} x={0} y={-9999} fontFamily="'Raleway',sans-serif" fontWeight="800" fontSize={SUB_SIZE} letterSpacing={0}>{subBrandWord}</text>

      <text x={SVG_W / 2} y={BASELINE} textAnchor="middle" fontFamily="'Raleway',sans-serif"
        fontWeight="800" fontSize={FS} fill={textColor} letterSpacing={LS}>
        <tspan>REM</tspan>
        <tspan fill="transparent">O</tspan>
        <tspan>TE</tspan>
      </text>

      <circle cx={layout.gx} cy={GLOBE_CY} r={GR} fill={globeColor} stroke="white" strokeWidth={1.5 * scale} strokeOpacity={0.25} />
      <g clipPath={`url(#${clipId})`}>
        <g transform={`translate(${layout.gx},${GLOBE_CY}) scale(${GR / 18}) translate(-18,-18)`}>
          <path d={TWEMOJI_AMERICAS} fill={accentColor} stroke={NAVY} strokeWidth={0.6} strokeOpacity={0.3} strokeLinejoin="round" />
        </g>
      </g>
      <path d={orbitPath} fill="none" stroke={accentColor} strokeWidth={2.6 * scale} strokeLinecap="round" opacity={0.92} />
      <Airplane x={pte.x} y={pte.y} angleDeg={airplaneDeg} s={scale} fill={accentColor} />

      <text x={SVG_W / 2} y={LS_Y} textAnchor="middle" fontFamily="'Caveat',cursive"
        fontWeight="700" fontSize={LS_SIZE} fill={textColor}>Lifestyle</text>

      <line x1={ruleX1} y1={RULE_Y} x2={ruleX2} y2={RULE_Y}
        stroke={globeColor} strokeWidth={RULE_STROKE * scale} strokeOpacity={0.8} />

      <text x={SVG_W / 2} y={SUB_Y} textAnchor="middle" fontFamily="'Raleway',sans-serif"
        fontWeight="800" fontSize={SUB_SIZE} fill={textColor} letterSpacing={layout.subLS}>
        {subBrandWord}
      </text>
    </svg>
  );
}
