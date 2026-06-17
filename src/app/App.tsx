import { useState, useRef, useCallback } from "react";

// ─── IMAGE IMPORTS ────────────────────────────────────────────────────────────
import img1 from "@/imports/a087a64f-0578-42e5-a18f-110e9e1d8017.jpg";
import img2 from "@/imports/9b66b651-f1d1-462c-a12c-4fc10cd73a25.jpg";
import img3 from "@/imports/2773a7a6-805a-40f1-840e-753fc13074dd.jpg";
import img4 from "@/imports/9e361312-c724-4023-b4a9-57aa7bcfd4b9.jpg";
import img5 from "@/imports/b0788c1b-0ee6-4e3a-880a-e2b760ee9865.jpg";
import img6 from "@/imports/ec1097cd-2cd7-496d-a1a1-6843f1021f43.jpg";
import img7 from "@/imports/6a0bfbe0-3b77-4528-8cd5-a09297e59737.jpg";
import img8 from "@/imports/45af7876-9415-42d3-9cdc-8177bfdedfc6.jpg";
import img9 from "@/imports/f21ff434-64e9-4057-885b-ec106b3747d7.jpg";

const PHOTOS = [
  { id: 1, src: img1, label: "Peace ✌", msg: "You are so loved ♡" },
  { id: 2, src: img2, label: "Foodie", msg: "You make life tastier ♡" },
  { id: 3, src: img3, label: "Road Trip", msg: "Adventure awaits you ♡" },
  { id: 4, src: img4, label: "Daydream", msg: "Your dreams are valid ♡" },
  { id: 5, src: img5, label: "Candid", msg: "You are beautiful ♡" },
  { id: 6, src: img6, label: "Sunshine", msg: "You light up the room ♡" },
  { id: 7, src: img7, label: "Summer", msg: "You deserve good days ♡" },
  { id: 8, src: img8, label: "Smiles", msg: "Your smile heals hearts ♡" },
  { id: 9, src: img9, label: "Pouty", msg: "Even sad you are cute ♡" },
];

const MC_FONT = "'Press Start 2P', monospace";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const PANEL_BG     = "#fce8f2";
const PANEL_BORDER = "#ffffff #c87aa0 #c87aa0 #ffffff";
const PANEL_SHADOW = "6px 6px 0 #000, inset 1px 1px 0 #fff, inset -1px -1px 0 #e8a0c0";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes titleFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes titleGlow  { 0%,100%{text-shadow:4px 4px 0 #7a5900,8px 8px 0 #3a2a00} 50%{text-shadow:4px 4px 0 #7a5900,8px 8px 0 #3a2a00,0 0 20px rgba(255,210,0,.5)} }
  @keyframes heartFall  { 0%{transform:translateY(-30px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(30deg);opacity:.2} }
  @keyframes heartFloat { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-55px) scale(1.4);opacity:0} }
  @keyframes popIn      { 0%{transform:scale(.75);opacity:0} 100%{transform:scale(1);opacity:1} }
  @keyframes fadeIn     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes confettiFall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(90vh) rotate(720deg);opacity:0} }
  @keyframes bubble     { 0%{transform:translateY(0);opacity:.7} 100%{transform:translateY(-80px);opacity:0} }
  @keyframes mcPulse    { from{transform:scaleY(1);opacity:.6} to{transform:scaleY(1.6);opacity:1} }
  @keyframes shimmer    { 0%,100%{opacity:1} 50%{opacity:.7} }
  * { box-sizing: border-box; }
  input, button { font-family: inherit; }
`;

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function McPanel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: PANEL_BG, border: "3px solid", borderColor: PANEL_BORDER,
      boxShadow: PANEL_SHADOW, padding: 24, ...style,
    }}>
      {children}
    </div>
  );
}

function McButton({
  children, onClick, type = "button", variant = "green",
  disabled = false, small = false, fullWidth = false,
}: {
  children: React.ReactNode; onClick?: () => void; type?: "button" | "submit";
  variant?: "green" | "gray" | "pink"; disabled?: boolean; small?: boolean; fullWidth?: boolean;
}) {
  const cfg = {
    green: { bg: "#5aaa3f", border: "#2a5a18 #7acc5a #7acc5a #2a5a18", ts: "2px 2px 0 #1a3a0a" },
    pink:  { bg: "#d45a8a", border: "#8a1a50 #f09ac0 #f09ac0 #8a1a50", ts: "2px 2px 0 #7a1a40" },
    gray:  { bg: "#9a7a8a", border: "#5a3a4a #ccaabc #ccaabc #5a3a4a", ts: "2px 2px 0 #3a1a2a" },
  }[variant];
  const shadow = disabled ? "none" : "3px 3px 0 #000";

  const press   = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.boxShadow = "1px 1px 0 #000"; e.currentTarget.style.transform = "translate(2px,2px)"; };
  const release = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.boxShadow = shadow; e.currentTarget.style.transform = ""; };

  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onMouseDown={press} onMouseUp={release} onMouseLeave={release}
      style={{
        fontFamily: MC_FONT, fontSize: small ? "clamp(8px,2.2vw,10px)" : "clamp(10px,2.8vw,12px)",
        background: disabled ? "#888" : cfg.bg, color: "#fff",
        textShadow: disabled ? "none" : cfg.ts,
        border: "3px solid", borderColor: disabled ? "#555 #aaa #aaa #555" : cfg.border,
        boxShadow: shadow, cursor: disabled ? "not-allowed" : "pointer",
        padding: small ? "12px 18px" : "16px 22px",
        minHeight: small ? 48 : 56, letterSpacing: "0.03em",
        width: fullWidth ? "100%" : undefined,
        display: fullWidth ? "block" : "inline-block",
      }}>
      {children}
    </button>
  );
}

function McInput({ id, label, type = "text", value, onChange, placeholder, autoComplete }: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <div style={{ marginBottom: 18 }}>
      <label htmlFor={id} style={{ display: "block", marginBottom: 10, color: "#6a2a4a", fontSize: "clamp(8px,2.2vw,10px)", fontFamily: MC_FONT }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input id={id} type={isPw && show ? "text" : type} value={value}
          onChange={e => onChange(e.target.value)} autoComplete={autoComplete}
          spellCheck={false} placeholder={placeholder}
          style={{
            fontFamily: MC_FONT, fontSize: "clamp(10px,2.8vw,12px)",
            background: "#2a0a1a", color: "#fce8f2",
            border: "3px solid", borderColor: "#8a1a50 #f09ac0 #f09ac0 #8a1a50",
            boxShadow: "inset 2px 2px 0 #1a0010", padding: "14px 14px",
            paddingRight: isPw ? "64px" : "14px", width: "100%", outline: "none",
            minHeight: 52,
          }} />
        {isPw && (
          <button type="button" onClick={() => setShow(s => !s)} style={{
            position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: MC_FONT, fontSize: "clamp(7px,1.8vw,9px)", color: "#f09ac0",
          }}>
            {show ? "HIDE" : "SHOW"}
          </button>
        )}
      </div>
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{
      marginBottom: 16, padding: "10px 14px", background: "#5a0020", color: "#ffaabb",
      fontSize: "clamp(7px,2vw,9px)", border: "2px solid #cc0040", lineHeight: 2, fontFamily: MC_FONT,
    }}>{msg}</div>
  );
}

function McDivider() {
  return <div style={{ margin: "20px 0", borderTop: "2px solid #c87aa0", borderBottom: "1px solid #ffe0ee" }} />;
}

// ─── TITLE COMPONENT ──────────────────────────────────────────────────────────

function GameTitle({ color = "day" }: { color?: "day" | "night" }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 6 }}>
      <div style={{
        fontFamily: MC_FONT,
        fontSize: "clamp(26px,7vw,48px)",
        color: "#FFE033",
        textShadow: "4px 4px 0 #7a5900, 8px 8px 0 #3a2a00",
        animation: "titleFloat 3s ease-in-out infinite, titleGlow 3s ease-in-out infinite",
        lineHeight: 1.2,
      }}>
        TRISHA&apos;S
      </div>
      <div style={{
        fontFamily: MC_FONT,
        fontSize: "clamp(26px,7vw,48px)",
        color: "#ff9ecf",
        textShadow: "4px 4px 0 #7a1a50, 8px 8px 0 #3a0a20",
        animation: "titleFloat 3s ease-in-out infinite 0.4s",
        lineHeight: 1.2,
      }}>
        WORLD ✦
      </div>
    </div>
  );
}

// ─── BACKGROUNDS ──────────────────────────────────────────────────────────────

const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i, x: (i * 137.5) % 100, y: (i * 97.3) % 65,
  size: i % 5 === 0 ? 2 : 1, opacity: 0.25 + (i % 10) * 0.07,
}));

const FALLING_HEARTS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: (i * 5.7 + 3) % 100,
  delay: (i * 0.7) % 6,
  duration: 5 + (i % 4),
  size: i % 3 === 0 ? 14 : i % 3 === 1 ? 10 : 7,
  color: ["#ff9ecf","#ffb8d8","#ffd0e8","#ff6baa","#ffcce8"][i % 5],
}));

function NightBg() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#0d0010 0%,#1a0028 40%,#2a0a18 80%,#1a0010 100%)" }} />
      {STARS.map(s => (
        <div key={s.id} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, background: "#fce8f2", opacity: s.opacity }} />
      ))}
      {/* Moon */}
      <div className="absolute" style={{ top: "6%", right: "10%", width: 44, height: 44, background: "#ffe0ee", boxShadow: "4px 4px 0 #ffaacb, 0 0 20px rgba(255,160,200,0.3)" }} />
      {/* Falling pixel hearts */}
      {FALLING_HEARTS.map(h => (
        <div key={h.id} className="absolute" style={{
          left: `${h.x}%`, top: "-30px",
          fontSize: h.size, color: h.color,
          animation: `heartFall ${h.duration}s linear ${h.delay}s infinite`,
          pointerEvents: "none",
        }}>♥</div>
      ))}
    </>
  );
}

function DayBg() {
  return (
    <>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#ffd6f0 0%,#ffe8f7 35%,#fff0fb 65%,#fff8fe 100%)" }} />
      {/* Sun */}
      <div className="absolute" style={{ top: "7%", right: "9%", width: 52, height: 52, background: "#FFE033", boxShadow: "4px 4px 0 #FFB800, 0 0 0 6px rgba(255,224,51,0.2), 0 0 30px rgba(255,200,0,.25)" }} />
      {/* Clouds (pink-tinted) */}
      {[{ x: 5, y: 14, w: 90 }, { x: 36, y: 22, w: 66 }, { x: 64, y: 9, w: 104 }].map((c, i) => (
        <div key={i} className="absolute" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
          <div style={{ width: c.w, height: 26, background: "#fff0f8", opacity: 0.95 }} />
          <div style={{ width: c.w * 0.55, height: 18, background: "#fff0f8", opacity: 0.95, position: "absolute", top: -13, left: 14 }} />
          <div style={{ width: c.w * 0.38, height: 18, background: "#fff0f8", opacity: 0.95, position: "absolute", top: -20, left: 28 }} />
        </div>
      ))}
      {/* Floating pixel hearts in day sky */}
      {[15, 45, 72].map((x, i) => (
        <div key={i} className="absolute" style={{
          left: `${x}%`, top: `${20 + i * 12}%`,
          fontSize: 10, color: "#ffb8d8", opacity: 0.5,
          animation: `shimmer ${2 + i}s ease-in-out infinite`,
          pointerEvents: "none",
        }}>♥</div>
      ))}
    </>
  );
}

function Ground() {
  const N = 32;
  return (
    <>
      <div className="relative z-10 w-full shrink-0 overflow-hidden" style={{ height: 64 }}>
        <div className="flex" style={{ height: 64 }}>
          {Array.from({ length: N }).map((_, i) => (
            <div key={i} className="w-16 shrink-0 flex flex-col" style={{ height: 64 }}>
              <div style={{ height: "25%", background: "#7acc3a", boxShadow: "inset -3px 0 0 #4a9a18,inset 3px 0 0 #9aee40,inset 0 3px 0 #9aee40" }} />
              <div style={{ flex: 1, background: "#8B5E3C", boxShadow: "inset -3px -3px 0 #5C3A1E,inset 3px 0 0 #A0704A" }} />
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10 w-full shrink-0 overflow-hidden" style={{ height: 64 }}>
        <div className="flex" style={{ height: 64 }}>
          {Array.from({ length: N }).map((_, i) => (
            <div key={i} className="w-16 shrink-0" style={{ height: 64, background: "#8B5E3C", boxShadow: "inset -3px -3px 0 #5C3A1E,inset 3px 3px 0 #A0704A" }} />
          ))}
        </div>
      </div>
    </>
  );
}

// ─── CONFETTI ─────────────────────────────────────────────────────────────────

const CONFETTI_PIECES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  color: ["#ff9ecf","#FFE033","#7acc5a","#7ecced","#c27bf0","#ffb347"][i % 6],
  delay: Math.random() * 0.8,
  dur: 1.2 + Math.random() * 1,
  size: 6 + (i % 4) * 3,
}));

function Confetti() {
  return (
    <>
      {CONFETTI_PIECES.map(c => (
        <div key={c.id} style={{
          position: "absolute", left: `${c.x}%`, top: "-20px",
          width: c.size, height: c.size, background: c.color,
          animation: `confettiFall ${c.dur}s ease-in ${c.delay}s both`,
          pointerEvents: "none", zIndex: 200,
        }} />
      ))}
    </>
  );
}

// ─── MEMORY MATCH GAME ────────────────────────────────────────────────────────

type Card = { uid: string; photoId: number; src: string; label: string; msg: string };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeDeck(): Card[] {
  return shuffle(PHOTOS.flatMap(p => [
    { uid: `${p.id}-a`, photoId: p.id, src: p.src, label: p.label, msg: p.msg },
    { uid: `${p.id}-b`, photoId: p.id, src: p.src, label: p.label, msg: p.msg },
  ]));
}

type HeartP = { id: number; x: number; y: number };

function PolaroidCard({ card, flipped, matched, onClick }: {
  card: Card; flipped: boolean; matched: boolean; onClick: () => void;
}) {
  const active = flipped || matched;
  return (
    <div onClick={!active ? onClick : undefined}
      style={{ cursor: active ? "default" : "pointer", perspective: 700, userSelect: "none" }}>
      <div style={{
        position: "relative", width: "100%", paddingBottom: "155%",
        transformStyle: "preserve-3d",
        transform: active ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 0.45s ease",
      }}>
        {/* BACK – pink pixel block */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          background: "#c87aa0",
          border: "3px solid", borderColor: "#ffe0ee #8a1a50 #8a1a50 #ffe0ee",
          boxShadow: "inset -3px -3px 0 #8a1a50, inset 3px 3px 0 #f0aacb",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* Heart pattern on back */}
          <div style={{ fontSize: "clamp(18px,4vw,28px)", color: "#ffe0ee", opacity: 0.7, textAlign: "center", lineHeight: 1.6 }}>
            ♥♥<br />♥♥
          </div>
        </div>
        {/* FRONT – Polaroid */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "#fff",
          border: "3px solid",
          borderColor: matched ? "#ff9ecf #c0457a #c0457a #ff9ecf" : "#eee #bbb #bbb #eee",
          boxShadow: matched ? "0 0 0 3px #ff9ecf, 3px 3px 0 #000" : "3px 3px 0 #000",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Photo area */}
          <div style={{ flex: 1, overflow: "hidden", margin: "4px 4px 0 4px" }}>
            <img src={card.src} alt={card.label}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          {/* Polaroid label strip */}
          <div style={{
            padding: "5px 4px 4px",
            background: matched ? "#ffe0ee" : "#fff",
            textAlign: "center",
            borderTop: matched ? "2px solid #f09ac0" : "none",
            transition: "background 0.3s",
          }}>
            <span style={{ fontFamily: MC_FONT, fontSize: "clamp(5px,1.2vw,7px)", color: matched ? "#c0457a" : "#888" }}>
              {card.label}
            </span>
            {matched && <div style={{ fontSize: "clamp(8px,2vw,11px)" }}>♥</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MemoryGame({ onBack }: { onBack: () => void }) {
  const [deck, setDeck] = useState<Card[]>(makeDeck);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [toast, setToast] = useState("");
  const [toastKey, setToastKey] = useState(0);
  const [hearts, setHearts] = useState<HeartP[]>([]);
  const [won, setWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const heartId = useRef(0);
  const busy = useRef(false);
  const running = useRef(true);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  }, []);

  const spawnHearts = useCallback(() => {
    const nh: HeartP[] = Array.from({ length: 6 }, () => ({
      id: heartId.current++, x: 10 + Math.random() * 80, y: 20 + Math.random() * 50,
    }));
    setHearts(h => [...h, ...nh]);
    setTimeout(() => setHearts(h => h.filter(p => !nh.find(n => n.id === p.id))), 1100);
  }, []);

  function flip(uid: string) {
    if (busy.current) return;
    if (revealed.includes(uid)) return;
    const card = deck.find(c => c.uid === uid)!;
    if (matched.has(card.photoId)) return;
    if (!running.current) { running.current = true; startTimer(); }

    const next = [...revealed, uid];
    setRevealed(next);

    if (next.length === 2) {
      busy.current = true;
      setMoves(m => m + 1);
      const [a, b] = next.map(id => deck.find(c => c.uid === id)!);
      if (a.photoId === b.photoId) {
        const newMatched = new Set(matched);
        newMatched.add(a.photoId);
        setTimeout(() => {
          setMatched(newMatched);
          setRevealed([]);
          spawnHearts();
          setToast(a.msg);
          setToastKey(k => k + 1);
          setTimeout(() => setToast(""), 2600);
          busy.current = false;
          if (newMatched.size === PHOTOS.length) {
            clearInterval(timerRef.current);
            running.current = false;
            setWon(true);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2800);
          }
        }, 600);
      } else {
        setTimeout(() => { setRevealed([]); busy.current = false; }, 900);
      }
    }
  }

  function restart() {
    clearInterval(timerRef.current);
    setDeck(makeDeck());
    setRevealed([]);
    setMatched(new Set());
    setMoves(0);
    setTime(0);
    setWon(false);
    setShowConfetti(false);
    busy.current = false;
    running.current = false;
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden" style={{ fontFamily: MC_FONT }}>
      <div className="absolute inset-0 pointer-events-none"><DayBg /></div>
      {showConfetti && <div className="absolute inset-0 pointer-events-none overflow-hidden"><Confetti /></div>}

      <div className="relative z-10 flex flex-col items-center flex-1 px-3 py-5">
        {/* Header */}
        <div style={{ width: "100%", maxWidth: 640, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <McButton small variant="gray" onClick={onBack}>← BACK</McButton>
          <div style={{ fontSize: "clamp(10px,2.5vw,13px)", color: "#c0457a", textShadow: "2px 2px 0 #7a1a40" }}>MEMORY MATCH</div>
          <McButton small variant="pink" onClick={restart}>NEW GAME</McButton>
        </div>

        {/* Stats */}
        <McPanel style={{ padding: "12px 20px", marginBottom: 12, width: "100%", maxWidth: 640 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {[["PAIRS", `${matched.size}/${PHOTOS.length}`], ["MOVES", moves], ["TIME", fmt(time)]].map(([label, val]) => (
              <div key={label as string} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(6px,1.8vw,8px)", color: "#a06080" }}>{label}</div>
                <div style={{ fontSize: "clamp(11px,3vw,15px)", color: "#6a2a4a", textShadow: "1px 1px 0 #fff", marginTop: 4 }}>{val}</div>
              </div>
            ))}
          </div>
        </McPanel>

        {/* Toast */}
        <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, width: "100%", maxWidth: 640 }}>
          {toast && (
            <div key={toastKey} style={{
              padding: "10px 22px", background: "#ffe0ee",
              border: "3px solid", borderColor: "#fff #c0457a #c0457a #fff",
              boxShadow: "3px 3px 0 #000", animation: "popIn 0.2s ease-out",
            }}>
              <span style={{ fontSize: "clamp(8px,2.2vw,11px)", color: "#c0457a", textShadow: "1px 1px 0 #ffa0c8" }}>{toast}</span>
            </div>
          )}
        </div>

        {/* Grid — auto 3 on mobile, 6 on wide */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(15vw,90px),1fr))",
          gap: "clamp(5px,1.5vw,10px)",
          width: "100%", maxWidth: 640, position: "relative",
        }}>
          {deck.map(card => (
            <PolaroidCard key={card.uid} card={card}
              flipped={revealed.includes(card.uid)}
              matched={matched.has(card.photoId)}
              onClick={() => flip(card.uid)} />
          ))}
          {hearts.map(h => (
            <div key={h.id} style={{
              position: "absolute", left: `${h.x}%`, top: `${h.y}%`,
              fontSize: 20, color: "#ff9ecf", pointerEvents: "none", zIndex: 20,
              animation: "heartFloat 1s ease-out forwards",
            }}>♥</div>
          ))}
        </div>
      </div>

      {/* WIN SCREEN */}
      {won && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(60,0,30,0.82)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16, animation: "fadeIn 0.4s ease-out",
        }}>
          <McPanel style={{ maxWidth: "min(440px,92vw)", width: "100%", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: "clamp(16px,4vw,22px)", color: "#FFE033", textShadow: "3px 3px 0 #7a5900", marginBottom: 10, animation: "titleFloat 2s infinite" }}>
              YOU WIN! ♥
            </div>
            <div style={{ fontSize: "clamp(8px,2vw,10px)", color: "#c0457a", lineHeight: 2.2, marginBottom: 6 }}>
              {moves} MOVES · {fmt(time)}
            </div>
            <div style={{ fontSize: "clamp(8px,2vw,10px)", color: "#6a2a4a", lineHeight: 2.4, marginBottom: 18 }}>
              You found all 9 of her photos!<br />She is lucky to have you ♡
            </div>
            {/* Mini polaroid strip */}
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 20, flexWrap: "wrap" }}>
              {PHOTOS.map(p => (
                <div key={p.id} style={{
                  width: 46, background: "#fff", padding: "3px 3px 8px",
                  border: "2px solid #f09ac0", boxShadow: "2px 2px 0 #000",
                }}>
                  <img src={p.src} alt={p.label} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                  <div style={{ textAlign: "center", marginTop: 3, fontSize: "5px", color: "#c0457a", fontFamily: MC_FONT }}>♥</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <McButton variant="pink" onClick={restart}>PLAY AGAIN</McButton>
              <McButton variant="gray" onClick={onBack}>HOME</McButton>
            </div>
          </McPanel>
        </div>
      )}

      <Ground />
      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

// ─── GARDEN GAME ──────────────────────────────────────────────────────────────

const GARDEN_MSGS = ["You are loved ♡","You matter so much","You are not alone","Small steps count","You are so brave","Better days ahead"];
const PETAL_C = ["#ff6b9d","#ffb347","#a8e063","#7ecced","#c27bf0","#ff8a65"];
const PETAL_D = ["#cc3366","#cc7722","#5aaa1a","#4499bb","#8833cc","#cc4422"];
type PlotState = "empty" | "seed" | "sprout" | "bloom";

function GardenGame({ onBack }: { onBack: () => void }) {
  const [plots, setPlots] = useState<PlotState[]>(Array(6).fill("empty"));
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [allBloomed, setAllBloomed] = useState(false);
  const hId = useRef(0);

  function water(i: number) {
    setPlots(prev => {
      const next = [...prev] as PlotState[];
      if (next[i] === "empty") next[i] = "seed";
      else if (next[i] === "seed") next[i] = "sprout";
      else if (next[i] === "sprout") {
        next[i] = "bloom";
        setMsg(GARDEN_MSGS[i]);
        setTimeout(() => setMsg(null), 2600);
        if (next.every(s => s === "bloom")) setTimeout(() => setAllBloomed(true), 400);
      }
      return next;
    });
    const color = PETAL_C[i % PETAL_C.length];
    const nh = Array.from({ length: 4 }, () => ({ id: hId.current++, x: 20 + Math.random() * 60, y: 20 + Math.random() * 30, color }));
    setHearts(h => [...h, ...nh]);
    setTimeout(() => setHearts(h => h.filter(p => !nh.find(n => n.id === p.id))), 900);
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden" style={{ fontFamily: MC_FONT }}>
      <div className="absolute inset-0 pointer-events-none"><DayBg /></div>
      <div className="relative z-10 flex flex-col items-center flex-1 px-4 py-6">
        <div style={{ width: "100%", maxWidth: 520, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <McButton small variant="gray" onClick={onBack}>← BACK</McButton>
          <div style={{ fontSize: "clamp(10px,2.5vw,12px)", color: "#c0457a", textShadow: "2px 2px 0 #7a1a40" }}>HER GARDEN</div>
          <McButton small variant="gray" onClick={() => { setPlots(Array(6).fill("empty")); setAllBloomed(false); }}>RESET</McButton>
        </div>

        <McPanel style={{ maxWidth: 520, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: "clamp(7px,2vw,9px)", color: "#a06080", lineHeight: 2 }}>
              {allBloomed ? "Your garden is full of love! ♡" : "Click each plot to grow flowers ♡"}
            </div>
            <div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 10 }}>
              {plots.map((p, i) => (
                <div key={i} style={{
                  width: 16, height: 16,
                  background: p === "bloom" ? PETAL_C[i % PETAL_C.length] : p === "sprout" ? "#7FCC19" : p === "seed" ? "#c8a060" : "#9a7a8a",
                  border: "2px solid #6a3a5a", transition: "background 0.3s",
                }} />
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, marginBottom: 16, position: "relative" }}>
            {plots.map((state, i) => (
              <div key={i} onClick={state !== "bloom" ? () => water(i) : undefined}
                style={{ cursor: state !== "bloom" ? "pointer" : "default", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ height: 54, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                  {state === "empty" && <div style={{ width: 28, height: 8, background: "#8B5E3C", boxShadow: "inset 0 2px 0 #A0704A" }} />}
                  {state === "seed" && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 5, height: 5, background: "#c8a060", marginBottom: 2 }} />
                      <div style={{ width: 28, height: 8, background: "#8B5E3C", boxShadow: "inset 0 2px 0 #A0704A" }} />
                    </div>
                  )}
                  {state === "sprout" && (
                    <div style={{ position: "relative", width: 28, height: 38, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                      <div style={{ width: 3, height: 22, background: "#3E8A18" }} />
                      <div style={{ position: "absolute", left: 16, top: 10, width: 9, height: 7, background: "#7FCC19", transform: "rotate(-15deg)" }} />
                    </div>
                  )}
                  {state === "bloom" && (() => {
                    const c = PETAL_C[i % PETAL_C.length], d = PETAL_D[i % PETAL_D.length];
                    return (
                      <div style={{ position: "relative", width: 36, height: 44 }}>
                        <div style={{ position: "absolute", left: 16, top: 16, width: 3, height: 28, background: "#3E8A18" }} />
                        {[[12,10],[20,10],[8,16],[24,16],[12,22],[20,22]].map(([x,y],k) => (
                          <div key={k} style={{ position: "absolute", left: x, top: y, width: 8, height: 8, background: c }} />
                        ))}
                        <div style={{ position: "absolute", left: 16, top: 14, width: 7, height: 7, background: "#FFE033", boxShadow: `2px 2px 0 ${d}` }} />
                      </div>
                    );
                  })()}
                </div>
                <div style={{ width: 40, height: 8, background: "#8B5E3C", boxShadow: "inset -2px -2px 0 #5C3A1E,inset 2px 2px 0 #A0704A" }} />
                {state !== "bloom" && <div style={{ fontSize: "6px", color: "#a06080" }}>{state === "empty" ? "PLANT" : "WATER"}</div>}
              </div>
            ))}
            {hearts.map(h => (
              <div key={h.id} style={{ position: "absolute", left: `${h.x}%`, top: `${h.y}%`, fontSize: 14, color: h.color, pointerEvents: "none", zIndex: 10, animation: "heartFloat 0.9s ease-out forwards" }}>♥</div>
            ))}
          </div>

          {msg && (
            <div style={{ textAlign: "center", padding: "12px 16px", background: "#ffe0ee", border: "3px solid", borderColor: "#fff #c0457a #c0457a #fff", boxShadow: "3px 3px 0 #000", animation: "popIn 0.2s ease-out" }}>
              <div style={{ fontSize: "clamp(8px,2.2vw,10px)", color: "#c0457a", lineHeight: 2 }}>{msg}</div>
            </div>
          )}

          {allBloomed && (
            <div style={{ textAlign: "center", marginTop: 16, padding: 18, background: "#ffe0ee", border: "3px solid", borderColor: "#fff #c0457a #c0457a #fff", boxShadow: "3px 3px 0 #000" }}>
              <div style={{ fontSize: "clamp(9px,2.5vw,12px)", color: "#c0457a", lineHeight: 2.4, textShadow: "1px 1px 0 #ffa0c8" }}>
                YOUR GARDEN IS<br />FULL OF LOVE! ♡
              </div>
              <div style={{ fontSize: "clamp(7px,2vw,9px)", color: "#a06080", marginTop: 10, lineHeight: 2 }}>
                Just like you fill the world<br />with love by being in it.
              </div>
            </div>
          )}
        </McPanel>
      </div>
      <Ground />
      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

// ─── AXOLOTL GAME ─────────────────────────────────────────────────────────────

const AXOL_MSGS = ["hehe ♡","eee! ♡♡","so happy!","you're great","come back soon","*happy splash*","luv u!!","yay! ♡","*wiggles*","heehee ♡♡♡"];

function AxolotlGame({ onBack }: { onBack: () => void }) {
  const [pets, setPets] = useState(0);
  const [bouncing, setBouncing] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgKey, setMsgKey] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const hId = useRef(0);

  function pet() {
    setPets(p => p + 1);
    setBouncing(true);
    setTimeout(() => setBouncing(false), 300);
    const nh = Array.from({ length: 4 }, () => ({ id: hId.current++, x: 10 + Math.random() * 80, y: 10 + Math.random() * 50 }));
    setHearts(h => [...h, ...nh]);
    setTimeout(() => setHearts(h => h.filter(p => !nh.find(n => n.id === p.id))), 900);
    setMsg(AXOL_MSGS[Math.floor(Math.random() * AXOL_MSGS.length)]);
    setMsgKey(k => k + 1);
  }

  const level = Math.min(10, Math.floor(pets / 3));
  const eye = level > 5 ? "^" : "•";
  const mouth = level > 7 ? "D" : level > 3 ? "u" : "ω";
  const pink = "#ffb8c8", dark = "#cc4477";
  const waterColor = pets > 20 ? "#b8e0f8" : pets > 10 ? "#d0eef8" : "#e8f8ff";

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden" style={{ fontFamily: MC_FONT }}>
      <div className="absolute inset-0 pointer-events-none"><DayBg /></div>
      <div className="relative z-10 flex flex-col items-center flex-1 px-4 py-6">
        <div style={{ width: "100%", maxWidth: 360, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <McButton small variant="gray" onClick={onBack}>← BACK</McButton>
          <div style={{ fontSize: "clamp(9px,2.5vw,12px)", color: "#c0457a", textShadow: "2px 2px 0 #7a1a40" }}>PET AXOLOTL</div>
          <div style={{ width: 60 }} />
        </div>

        <McPanel style={{ maxWidth: 360, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: "clamp(7px,2vw,9px)", color: "#a06080", marginBottom: 14 }}>Click to pet! ♡</div>

          <div onClick={pet} style={{
            position: "relative", height: 160, background: waterColor,
            border: "3px solid", borderColor: "#ffe0ee #8888aa #8888aa #ffe0ee",
            boxShadow: "inset 2px 2px 0 rgba(255,255,255,.6), inset -2px -2px 0 rgba(100,150,200,.25)",
            cursor: "pointer", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.5s", marginBottom: 10,
          }}>
            {[15, 40, 65, 82].map((x, i) => (
              <div key={i} style={{ position: "absolute", left: `${x}%`, bottom: 12, width: i % 2 === 0 ? 4 : 6, height: i % 2 === 0 ? 4 : 6, background: "rgba(255,255,255,.7)", animation: `bubble ${1.5 + i * 0.4}s ease-in infinite` }} />
            ))}
            <div style={{ position: "relative", width: 80, height: 64, transform: bouncing ? "translateY(-10px)" : "translateY(0)", transition: "transform 0.15s ease-out" }}>
              <div style={{ position: "absolute", left: 8, top: 16, width: 64, height: 40, background: pink, boxShadow: `3px 3px 0 ${dark}` }} />
              <div style={{ position: "absolute", left: 16, top: 4, width: 48, height: 36, background: pink, boxShadow: `3px 3px 0 ${dark}` }} />
              <div style={{ position: "absolute", left: 6, top: 0, width: 12, height: 20, background: "#ff6b9d", boxShadow: `2px 2px 0 ${dark}` }} />
              <div style={{ position: "absolute", right: 6, top: 0, width: 12, height: 20, background: "#ff6b9d", boxShadow: `2px 2px 0 ${dark}` }} />
              <div style={{ position: "absolute", left: 22, top: 14, fontSize: 10, color: dark, fontFamily: MC_FONT, lineHeight: 1 }}>{eye}</div>
              <div style={{ position: "absolute", right: 22, top: 14, fontSize: 10, color: dark, fontFamily: MC_FONT, lineHeight: 1 }}>{eye}</div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", fontSize: 10, color: dark, fontFamily: MC_FONT, lineHeight: 1 }}>{mouth}</div>
              <div style={{ position: "absolute", left: 52, top: 38, width: 24, height: 16, background: pink, boxShadow: `2px 2px 0 ${dark}`, transform: bouncing ? "rotate(-12deg)" : "rotate(5deg)", transition: "transform 0.15s" }} />
              <div style={{ position: "absolute", left: 8, top: 48, width: 16, height: 14, background: pink, boxShadow: `2px 2px 0 ${dark}` }} />
              <div style={{ position: "absolute", left: 32, top: 48, width: 16, height: 14, background: pink, boxShadow: `2px 2px 0 ${dark}` }} />
            </div>
            {hearts.map(h => (
              <div key={h.id} style={{ position: "absolute", left: `${h.x}%`, top: `${h.y}%`, fontSize: 18, color: "#ff9ecf", pointerEvents: "none", animation: "heartFloat 0.9s ease-out forwards" }}>♥</div>
            ))}
          </div>

          {msg && (
            <div key={msgKey} style={{ padding: "8px 14px", background: "#ffe0ee", border: "2px solid #f09ac0", boxShadow: "2px 2px 0 #888", animation: "popIn 0.2s ease-out", marginBottom: 10 }}>
              <span style={{ fontSize: "clamp(8px,2.2vw,10px)", color: "#c0457a" }}>{msg}</span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <div style={{ fontSize: "clamp(7px,2vw,9px)", color: "#a06080" }}>PETS: {pets}</div>
            <div style={{ fontSize: "clamp(9px,2.5vw,12px)", color: "#ff9ecf" }}>{"♥".repeat(Math.min(5, Math.floor(pets / 2) + 1))}</div>
          </div>
        </McPanel>
      </div>
      <Ground />
      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

// ─── PHOTO GALLERY ────────────────────────────────────────────────────────────

function PhotoGallery({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden" style={{ fontFamily: MC_FONT }}>
      <div className="absolute inset-0 pointer-events-none"><DayBg /></div>
      <div className="relative z-10 flex flex-col items-center flex-1 px-4 py-6">
        <div style={{ width: "100%", maxWidth: 560, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <McButton small variant="gray" onClick={onBack}>← BACK</McButton>
          <div style={{ fontSize: "clamp(10px,2.5vw,12px)", color: "#c0457a", textShadow: "2px 2px 0 #7a1a40" }}>HER ALBUM ♡</div>
          <div style={{ width: 60 }} />
        </div>

        <McPanel style={{ maxWidth: 560, width: "100%" }}>
          <div style={{ fontSize: "clamp(7px,2vw,9px)", color: "#a06080", textAlign: "center", marginBottom: 18, lineHeight: 2 }}>
            Every smile tells a story ♡
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {PHOTOS.map((p, i) => (
              <div key={p.id} onClick={() => setSelected(i)}
                style={{
                  cursor: "pointer", background: "#fff", padding: "6px 6px 16px",
                  border: "3px solid", borderColor: "#fff #c87aa0 #c87aa0 #fff",
                  boxShadow: "4px 4px 0 #000", transition: "transform 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05) rotate(-1deg)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "")}>
                <div style={{ paddingBottom: "100%", position: "relative", overflow: "hidden" }}>
                  <img src={p.src} alt={p.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ textAlign: "center", marginTop: 6, fontSize: "clamp(5px,1.3vw,7px)", color: "#c0457a" }}>{p.label}</div>
              </div>
            ))}
          </div>
        </McPanel>
      </div>

      {selected !== null && (
        <div onClick={() => setSelected(null)} style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(60,0,30,0.88)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20, cursor: "pointer", animation: "fadeIn 0.2s ease-out",
        }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: "min(380px,88vw)", width: "100%", textAlign: "center" }}>
            <div style={{ background: "#fff", padding: "8px 8px 24px", border: "4px solid #c0457a", boxShadow: "6px 6px 0 #000", marginBottom: 14 }}>
              <img src={PHOTOS[selected].src} alt={PHOTOS[selected].label} style={{ width: "100%", display: "block", maxHeight: "55vh", objectFit: "cover" }} />
              <div style={{ marginTop: 10, fontSize: "clamp(7px,2vw,9px)", color: "#c0457a", fontFamily: MC_FONT }}>{PHOTOS[selected].label}</div>
            </div>
            <div style={{ fontSize: "clamp(8px,2.2vw,11px)", color: "#ff9ecf", textShadow: "2px 2px 0 #7a1a50", marginBottom: 16 }}>{PHOTOS[selected].msg}</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <McButton small variant="gray" onClick={() => setSelected(s => s! > 0 ? s! - 1 : PHOTOS.length - 1)}>◀ PREV</McButton>
              <McButton small variant="pink" onClick={() => setSelected(null)}>CLOSE</McButton>
              <McButton small variant="gray" onClick={() => setSelected(s => s! < PHOTOS.length - 1 ? s! + 1 : 0)}>NEXT ▶</McButton>
            </div>
          </div>
        </div>
      )}

      <Ground />
      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────

const DAILY_MSGS = [
  "You are loved more than you know.",
  "Today is hard. Tomorrow might be easier.",
  "You don't have to be okay to be worthy.",
  "Small steps still move you forward.",
  "You are not a burden — you are a gift.",
  "Rest is not giving up. Rest is healing.",
];

type GameScreen = "home" | "memory" | "garden" | "axolotl" | "gallery";

function HomeScreen({ playerName, onLogout }: { playerName: string; onLogout: () => void }) {
  const [game, setGame] = useState<GameScreen>("home");
  const dayMsg = DAILY_MSGS[new Date().getDate() % DAILY_MSGS.length];

  if (game === "memory")  return <MemoryGame onBack={() => setGame("home")} />;
  if (game === "garden")  return <GardenGame onBack={() => setGame("home")} />;
  if (game === "axolotl") return <AxolotlGame onBack={() => setGame("home")} />;
  if (game === "gallery") return <PhotoGallery onBack={() => setGame("home")} />;

  const GAMES = [
    { key: "memory",  emoji: "🃏", title: "MEMORY\nMATCH",    desc: "Find her photos!",  variant: "pink"  as const },
    { key: "gallery", emoji: "📷", title: "HER\nALBUM",       desc: "Her best moments",  variant: "pink"  as const },
    { key: "garden",  emoji: "🌸", title: "GROW A\nGARDEN",   desc: "Water the flowers", variant: "green" as const },
    { key: "axolotl", emoji: "🦎", title: "PET THE\nAXOLOTL", desc: "Give some love",    variant: "green" as const },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden" style={{ fontFamily: MC_FONT }}>
      <div className="absolute inset-0 pointer-events-none"><DayBg /></div>

      <div className="relative z-10 flex flex-col items-center flex-1 px-4 py-6">
        {/* Top bar */}
        <div style={{ width: "100%", maxWidth: 560, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: "clamp(8px,2.2vw,11px)", color: "#c0457a", textShadow: "2px 2px 0 #7a1a40" }}>
            ♡ HI, {playerName.toUpperCase()}!
          </div>
          <McButton small variant="gray" onClick={onLogout}>LOG OUT</McButton>
        </div>

        <GameTitle color="day" />
        <p style={{ fontSize: "clamp(8px,2.2vw,11px)", color: "#c0457a", textShadow: "1px 1px 0 #7a1a40", marginBottom: 22, letterSpacing: "0.1em" }}>
          A world made just for you ✦
        </p>

        {/* Daily message */}
        <McPanel style={{ maxWidth: 500, width: "100%", textAlign: "center", marginBottom: 18, padding: "16px 24px" }}>
          <div style={{ fontSize: "clamp(7px,1.8vw,9px)", color: "#c0457a", marginBottom: 10, letterSpacing: "0.1em" }}>✦ TODAY&apos;S MESSAGE ✦</div>
          <div style={{ fontSize: "clamp(8px,2.2vw,11px)", color: "#6a2a4a", lineHeight: 2.6 }}>{dayMsg}</div>
        </McPanel>

        {/* Game grid */}
        <McPanel style={{ maxWidth: 500, width: "100%" }}>
          <div style={{ fontSize: "clamp(9px,2.5vw,13px)", color: "#6a2a4a", textAlign: "center", marginBottom: 18 }}>
            CHOOSE A GAME ♡
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {GAMES.map(g => {
              const isPink = g.variant === "pink";
              const bg    = isPink ? "#d45a8a" : "#5aaa3f";
              const bc    = isPink ? "#fff #8a1a50 #8a1a50 #fff" : "#fff #2a5a18 #2a5a18 #fff";
              return (
                <div key={g.key} onClick={() => setGame(g.key as GameScreen)}
                  style={{
                    cursor: "pointer", textAlign: "center", background: bg,
                    border: "3px solid", borderColor: bc, boxShadow: "4px 4px 0 #000",
                    padding: "clamp(16px,4vw,28px) 12px",
                    minHeight: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}
                  onMouseDown={e => { e.currentTarget.style.transform = "translate(3px,3px)"; e.currentTarget.style.boxShadow = "1px 1px 0 #000"; }}
                  onMouseUp={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0 #000"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0 #000"; }}
                >
                  <div style={{ fontSize: "clamp(28px,8vw,42px)", marginBottom: 10 }}>{g.emoji}</div>
                  <div style={{ fontSize: "clamp(8px,2.2vw,10px)", color: "#fff", textShadow: "2px 2px 0 rgba(0,0,0,.5)", lineHeight: 2, whiteSpace: "pre-line" }}>{g.title}</div>
                  <div style={{ fontSize: "clamp(6px,1.6vw,8px)", color: "rgba(255,255,255,.85)", marginTop: 6 }}>{g.desc}</div>
                </div>
              );
            })}
          </div>
        </McPanel>

        <p style={{ marginTop: 18, fontSize: "clamp(7px,1.8vw,9px)", color: "#c87aa0" }}>
          Trisha&apos;s World · made with ♥
        </p>
      </div>

      <Ground />
      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

// ─── AUTH SCREENS ─────────────────────────────────────────────────────────────

function AuthWrap({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden" style={{ fontFamily: MC_FONT }}>
      <div className="absolute inset-0 pointer-events-none"><NightBg /></div>
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-10">
        <GameTitle />
        <p style={{ fontSize: "clamp(8px,2.2vw,11px)", color: "#ff9ecf", textShadow: "1px 1px 0 #7a1a50", marginBottom: 28, letterSpacing: "0.1em" }}>
          A world made just for you ✦
        </p>
        <McPanel style={{ width: "100%", maxWidth: "min(420px,92vw)" }}>
          <div style={{ textAlign: "center", fontSize: "clamp(11px,3vw,14px)", color: "#6a2a4a", marginBottom: 28 }}>{title}</div>
          {children}
        </McPanel>
        <p style={{ marginTop: 18, fontSize: "clamp(7px,2vw,9px)", color: "#c87aa0" }}>Trisha&apos;s World · made with ♥</p>
      </div>
      <Ground />
      <style>{GLOBAL_CSS}</style>
    </div>
  );
}

function LoginPage({ onLogin, onSwitch }: { onLogin: (n: string) => void; onSwitch: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) { setError("Username is required."); return; }
    if (!password.trim()) { setError("Password is required."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(username.trim()); }, 1400);
  }

  return (
    <AuthWrap title="LOG IN">
      <form onSubmit={submit} noValidate>
        <McInput id="l-u" label="USERNAME / EMAIL" value={username} onChange={setUsername} placeholder="Enter username" autoComplete="username" />
        <McInput id="l-p" label="PASSWORD" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="current-password" />
        {error && <ErrorBox msg={error} />}
        <McButton type="submit" disabled={loading} variant="pink" fullWidth>{loading ? "ENTERING..." : "LOG IN ♡"}</McButton>
        <p style={{ textAlign: "center", marginTop: 14, fontSize: "clamp(7px,1.8vw,9px)", color: "#a06080", cursor: "pointer" }}>
          FORGOT PASSWORD?
        </p>
        <McDivider />
        <McButton variant="gray" fullWidth onClick={onSwitch}>CREATE NEW ACCOUNT</McButton>
      </form>
    </AuthWrap>
  );
}

function CreatePage({ onLogin, onSwitch }: { onLogin: (n: string) => void; onSwitch: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || username.length < 3) { setError("Min. 3 chars for username."); return; }
    if (!email.includes("@")) { setError("Valid email required."); return; }
    if (password.length < 8) { setError("Min. 8 chars for password."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setError(""); setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(username.trim()); }, 1400);
  }

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : password.length < 14 ? 3 : 4;
  const sLabel = ["","WEAK","FAIR","GOOD","STRONG"];
  const sColor = ["","#cc0040","#cc6600","#aacc00","#5aaa3f"];

  return (
    <AuthWrap title="CREATE ACCOUNT">
      <form onSubmit={submit} noValidate>
        <McInput id="r-u" label="USERNAME" value={username} onChange={setUsername} placeholder="Your username" autoComplete="username" />
        <McInput id="r-e" label="EMAIL" type="email" value={email} onChange={setEmail} placeholder="your@email.com" autoComplete="email" />
        <McInput id="r-p" label="PASSWORD" type="password" value={password} onChange={setPassword} placeholder="Min. 8 chars" autoComplete="new-password" />
        {password.length > 0 && (
          <div style={{ marginBottom: 18, marginTop: -12 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
              {[1,2,3,4].map(i => <div key={i} style={{ height: 5, flex: 1, background: i <= strength ? sColor[strength] : "#9a7a8a", transition: "background .2s", border: "1px solid #6a3a5a" }} />)}
            </div>
            <span style={{ fontSize: "clamp(7px,1.8vw,9px)", color: sColor[strength] }}>{sLabel[strength]}</span>
          </div>
        )}
        <McInput id="r-c" label="CONFIRM PASSWORD" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat password" autoComplete="new-password" />
        {error && <ErrorBox msg={error} />}
        <McButton type="submit" disabled={loading} variant="pink" fullWidth>{loading ? "CREATING..." : "CREATE ACCOUNT ♡"}</McButton>
        <McDivider />
        <McButton variant="gray" fullWidth onClick={onSwitch}>ALREADY HAVE AN ACCOUNT</McButton>
      </form>
    </AuthWrap>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

type Screen = "login" | "create" | "home";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [player, setPlayer] = useState("");

  function login(name: string) { setPlayer(name); setScreen("home"); }
  function logout() { setPlayer(""); setScreen("login"); }

  if (screen === "home")   return <HomeScreen playerName={player} onLogout={logout} />;
  if (screen === "create") return <CreatePage onLogin={login} onSwitch={() => setScreen("login")} />;
  return <LoginPage onLogin={login} onSwitch={() => setScreen("create")} />;
}
