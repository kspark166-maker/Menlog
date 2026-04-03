import { useState, useEffect, useRef } from "react";

// ─── World Themes ───
const WORLDS = {
  core: {
    name: "CORE RESONANCE",
    sub: "Core",
    color1: "#00e5ff",
    color2: "#6C5CE7",
    color3: "#0a1628",
    gradient: "radial-gradient(ellipse at 50% 30%, #1a2d5a 0%, #0a1628 50%, #050d1a 100%)",
    particleColor: "#00e5ff",
    accent: "#00e5ff",
    coachName: "Dr. 響 (ヒビキ)",
    coachTitle: "音響工学博士 / ボイスサイエンティスト",
    coachDesc: "科学的アプローチで声の可能性を解き放つ",
  },
  strike: {
    name: "TECH-STRIKE",
    sub: "Target",
    color1: "#ff2d2d",
    color2: "#ff6b00",
    color3: "#1a0a0a",
    gradient: "radial-gradient(ellipse at 50% 40%, #3a1515 0%, #1a0a0a 50%, #0d0505 100%)",
    particleColor: "#ff4444",
    accent: "#ff2d2d",
    coachName: "烈火 (レッカ)",
    coachTitle: "ロックシンガー / テクニックマスター",
    coachDesc: "限界を超えろ。声は最強の武器だ",
  },
  groove: {
    name: "GLOBAL GROOVE",
    sub: "English",
    color1: "#ff4da6",
    color2: "#00e5ff",
    color3: "#1a0a2e",
    gradient: "radial-gradient(ellipse at 50% 30%, #2d1245 0%, #1a0a2e 50%, #0d0518 100%)",
    particleColor: "#ff4da6",
    accent: "#ff4da6",
    coachName: "LUNA ルナ",
    coachTitle: "グローバルポップシンガー",
    coachDesc: "世界のステージで歌え！FEVER TIME!!",
  },
};

const CONTENT = {
  core: [
    { id: "hatsusei", name: "発声練習", desc: "共鳴の基礎を築く", xp: 100, unlockLv: 1, difficulty: 1 },
    { id: "onpitchi", name: "音程トレーニング", desc: "正確なピッチを掴む", xp: 150, unlockLv: 2, difficulty: 2 },
    { id: "breath", name: "腹式呼吸", desc: "声のエネルギー源", xp: 200, unlockLv: 3, difficulty: 2 },
    { id: "rhythm", name: "リズム感強化", desc: "グルーヴを体に刻め", xp: 200, unlockLv: 4, difficulty: 3 },
  ],
  strike: [
    { id: "vibrato", name: "ビブラート", desc: "振動波で敵を揺さぶれ", xp: 250, unlockLv: 5, difficulty: 3 },
    { id: "shakuri", name: "しゃくり", desc: "鋭い一撃を繰り出す", xp: 250, unlockLv: 6, difficulty: 3 },
    { id: "kobushi", name: "こぶし", desc: "魂の連撃", xp: 300, unlockLv: 7, difficulty: 4 },
    { id: "longtone", name: "ロングトーン", desc: "持続力で圧倒する", xp: 300, unlockLv: 8, difficulty: 3 },
    { id: "mixvoice", name: "ミックスボイス", desc: "二つの声を融合せよ", xp: 350, unlockLv: 9, difficulty: 4 },
    { id: "deathvoice", name: "デスボイス", desc: "禁断の咆哮を解放", xp: 400, unlockLv: 10, difficulty: 5 },
    { id: "hightone", name: "ハイトーン", desc: "限界突破の高音域", xp: 400, unlockLv: 11, difficulty: 5 },
    { id: "lowtone", name: "ロートーン", desc: "深淵の重低音", xp: 350, unlockLv: 12, difficulty: 4 },
  ],
  groove: [
    { id: "rap", name: "ラップ", desc: "フロウで観客を沸かせ", xp: 450, unlockLv: 13, difficulty: 5 },
    { id: "english", name: "全英歌詞", desc: "世界に歌を届けろ", xp: 500, unlockLv: 14, difficulty: 5 },
  ],
};

const LESSONS = {
  hatsusei: [
    { type: "lecture", title: "共鳴の科学", text: "声は体全体で響かせるもの。\n\n胸腔・口腔・鼻腔の3つの共鳴腔を\n意識することで、豊かな倍音が生まれます。\n\nまずは正しい姿勢から始めましょう。", tip: "鏡の前で姿勢をチェック！" },
    { type: "exercise", title: "リップロール", text: "唇を軽く閉じて「ブルルル…」\n\n音程をつけず、唇を振動させます。\n慣れたら「ド→レ→ミ→ファ→ソ」へ。", duration: 30, goal: "30秒途切れずにキープ" },
    { type: "exercise", title: "ハミング共鳴", text: "口を閉じて「ンー」と響かせます。\n\n鼻と額に振動を感じてください。\nそれが正しい共鳴ポイントです。\n\n低音→高音へスライドさせましょう。", duration: 45, goal: "振動を感じながらハミング" },
    { type: "quiz", title: "RESONANCE CHECK", q: "発声で最も重要な「土台」は？", opts: ["大きな声量", "正しい姿勢と呼吸", "高い音域", "速いテンポ"], ans: 1 },
  ],
  vibrato: [
    { type: "lecture", title: "振動波の原理", text: "ビブラートは横隔膜の振動が生む\n自然な音の揺れです。\n\n喉で無理に揺らすのはNG。\n体の奥から波を起こしましょう。", tip: "好きな歌手のロングトーンを聴いて観察！" },
    { type: "exercise", title: "横隔膜アタック", text: "「ハッ、ハッ、ハッ」と短く吐く。\n\nお腹の弾みを感じたら、\n「アーーー」と伸ばしながら\nその弾みを加えてみましょう。", duration: 40, goal: "お腹の動きで声を揺らす" },
    { type: "exercise", title: "ウェーブコントロール", text: "半音上→元→半音上→元\nとゆっくり繰り返します。\n\nBPM60→80→100\n徐々にスピードアップ！", duration: 60, goal: "安定ビブラート60秒キープ" },
    { type: "quiz", title: "STRIKE CHECK", q: "自然なビブラートの源は？", opts: ["喉の振動", "横隔膜の振動", "唇の動き", "首の動き"], ans: 1 },
  ],
};

const getLesson = (id, item) => LESSONS[id] || [
  { type: "lecture", title: `${item.name}の極意`, text: `${item.desc}\n\nこのスキルをマスターすれば\n歌の表現力が飛躍的に向上します。\n\n段階的にトレーニングしていきましょう。`, tip: "毎日の積み重ねが最強の武器！" },
  { type: "exercise", title: "基本ドリル", text: `${item.name}の基本動作を反復。\n\nゆっくり丁寧に。\n形が安定したら加速。`, duration: 45, goal: "正しいフォームを体に刻め" },
  { type: "quiz", title: "MASTERY CHECK", q: `${item.name}で最も重要なことは？`, opts: ["力任せに出す", "基礎を丁寧に積む", "他人の真似だけ", "毎日8時間"], ans: 1 },
];

// ─── Animated Components ───
function CrystalCore({ color = "#00e5ff", size = 120 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <div style={{
        position: "absolute", inset: -size * 0.3,
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        borderRadius: "50%", animation: "crystalPulse 3s ease-in-out infinite",
      }} />
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ filter: `drop-shadow(0 0 20px ${color}66)` }}>
        <defs>
          <linearGradient id={`cg-${color.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <polygon points="50,8 72,35 65,70 50,92 35,70 28,35" fill={`url(#cg-${color.replace('#','')})`} opacity="0.85" />
        <polygon points="50,8 72,35 50,50 28,35" fill="white" opacity="0.25" />
        <polygon points="50,92 65,70 50,50 35,70" fill={color} opacity="0.3" />
        <line x1="20" y1="50" x2="80" y2="50" stroke={color} strokeWidth="0.5" opacity="0.4" />
        <line x1="50" y1="5" x2="50" y2="95" stroke={color} strokeWidth="0.5" opacity="0.3" />
        <circle cx="50" cy="50" r="3" fill="white" opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%", width: 3, height: 3,
          background: color, borderRadius: "50%", opacity: 0.6,
          transform: `rotate(${deg}deg) translateY(-${size * 0.55}px)`,
          animation: `orbitSpin 6s linear ${i * 0.3}s infinite`,
          boxShadow: `0 0 6px ${color}`,
        }} />
      ))}
    </div>
  );
}

function BossMonster({ color = "#ff2d2d", size = 120 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <div style={{
        position: "absolute", inset: -20,
        background: `radial-gradient(circle, ${color}33 0%, transparent 60%)`,
        animation: "crystalPulse 2s ease-in-out infinite",
      }} />
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ filter: `drop-shadow(0 0 25px ${color}88)` }}>
        <defs>
          <linearGradient id="boss-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="50%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <polygon points="50,10 75,30 80,55 70,80 50,90 30,80 20,55 25,30" fill="url(#boss-g)" opacity="0.85" />
        <polygon points="25,30 10,15 28,35" fill={color} opacity="0.7" />
        <polygon points="75,30 90,15 72,35" fill={color} opacity="0.7" />
        <polygon points="20,55 5,50 22,58" fill={color} opacity="0.6" />
        <polygon points="80,55 95,50 78,58" fill={color} opacity="0.6" />
        <circle cx="40" cy="42" r="5" fill="#fff" opacity="0.9" />
        <circle cx="60" cy="42" r="5" fill="#fff" opacity="0.9" />
        <circle cx="40" cy="42" r="2.5" fill={color}>
          <animate attributeName="r" values="2.5;1.5;2.5" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="42" r="2.5" fill={color}>
          <animate attributeName="r" values="2.5;1.5;2.5" dur="3s" repeatCount="indefinite" />
        </circle>
        <path d="M38,58 L44,63 L50,58 L56,63 L62,58" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.8" />
        {[0,1,2,3,4].map(i => (
          <rect key={i} x={20 + i * 15} y={75 + (i%2)*5} width="4" height="4"
            fill={color} opacity="0.5" transform={`rotate(${i*30} ${22+i*15} ${77+i%2*5})`}>
            <animate attributeName="opacity" values="0.5;0.1;0.5" dur={`${1.5+i*0.3}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </svg>
    </div>
  );
}

function StageVisual({ size = 120 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <div style={{
        position: "absolute", inset: -20,
        background: "radial-gradient(circle, rgba(255,77,166,0.25) 0%, transparent 60%)",
        animation: "crystalPulse 2.5s ease-in-out infinite",
      }} />
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ filter: "drop-shadow(0 0 20px rgba(255,77,166,0.5))" }}>
        <defs>
          <linearGradient id="stage-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4da6" />
            <stop offset="50%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#ff4da6" />
          </linearGradient>
        </defs>
        {/* Stage lights */}
        <polygon points="50,5 55,45 50,50 45,45" fill="#ff4da6" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="1.5s" repeatCount="indefinite" />
        </polygon>
        <polygon points="15,20 45,45 40,50 15,30" fill="#00e5ff" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
        </polygon>
        <polygon points="85,20 55,45 60,50 85,30" fill="#ff4da6" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.8s" repeatCount="indefinite" />
        </polygon>
        {/* Mic */}
        <circle cx="50" cy="40" r="10" fill="url(#stage-g)" opacity="0.8" />
        <rect x="48" y="50" width="4" height="20" rx="2" fill="#888" opacity="0.7" />
        <rect x="44" y="68" width="12" height="3" rx="1.5" fill="#666" opacity="0.5" />
        {/* Sound waves */}
        {[18, 24, 30].map((r, i) => (
          <circle key={i} cx="50" cy="40" r={r} fill="none" stroke="#ff4da6" strokeWidth="0.8" opacity={0.3 - i * 0.08}>
            <animate attributeName="r" values={`${r};${r+5};${r}`} dur={`${2+i*0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values={`${0.3-i*0.08};${0.1};${0.3-i*0.08}`} dur={`${2+i*0.5}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* Confetti */}
        {[0,1,2,3,4,5].map(i => (
          <rect key={i} x={15+i*14} y={80+Math.sin(i)*8} width="3" height="3"
            fill={i%2 ? "#ff4da6" : "#00e5ff"} opacity="0.5" rx="0.5"
            transform={`rotate(${i*45} ${16+i*14} ${81+Math.sin(i)*8})`}>
            <animate attributeName="y" values={`${80+Math.sin(i)*8};${70+Math.sin(i)*8};${80+Math.sin(i)*8}`}
              dur={`${1+i*0.2}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </svg>
    </div>
  );
}

function Waveform({ color = "#00e5ff", active = false }) {
  const bars = 24;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 2, height: 40, padding: "0 16px",
    }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} style={{
          width: 3, borderRadius: 2,
          background: `linear-gradient(180deg, ${color}, ${color}44)`,
          height: active ? undefined : (4 + Math.sin(i * 0.5) * 6),
          transition: "height 0.15s ease",
          animation: active ? `waveBar 0.5s ease-in-out ${i * 0.04}s infinite alternate` : "none",
          opacity: active ? 0.9 : 0.4,
        }} />
      ))}
    </div>
  );
}

function WorldParticles({ color, count = 20 }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: 2 + Math.random() * 3,
          height: 2 + Math.random() * 3,
          background: color,
          borderRadius: "50%",
          opacity: 0.15 + Math.random() * 0.25,
          animation: `particleFloat ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 4}s infinite alternate`,
          boxShadow: `0 0 ${4 + Math.random() * 8}px ${color}66`,
        }} />
      ))}
    </div>
  );
}

function CoachAvatar({ world, size = 80 }) {
  const w = WORLDS[world];
  const isCore = world === "core";
  const isStrike = world === "strike";
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: `linear-gradient(135deg, ${w.color1}44, ${w.color2}44)`,
      border: `2px solid ${w.color1}66`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.45,
      boxShadow: `0 0 20px ${w.color1}33`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, transparent 50%, ${w.color1}22 100%)`,
      }} />
      <span style={{ position: "relative", zIndex: 1 }}>
        {isCore ? "🧑‍🔬" : isStrike ? "🎸" : "💃"}
      </span>
    </div>
  );
}

// ─── Main App ───
export default function App() {
  const [screen, setScreen] = useState("title");
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [cleared, setCleared] = useState({});
  const [world, setWorld] = useState(null);
  const [mission, setMission] = useState(null);
  const [step, setStep] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [showLvUp, setShowLvUp] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [titleAnim, setTitleAnim] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => { setTimeout(() => setTitleAnim(true), 300); }, []);
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const xpNeeded = level * 200;
  const addXp = (amt) => {
    const n = xp + amt;
    setTotalXp(t => t + amt);
    if (n >= xpNeeded) {
      setLevel(l => l + 1);
      setXp(n - xpNeeded);
      setShowLvUp(true);
      setTimeout(() => setShowLvUp(false), 2800);
    } else setXp(n);
  };

  const startTimer = (dur) => {
    setTimer(dur); setTimerOn(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(s => { if (s <= 1) { clearInterval(timerRef.current); setTimerOn(false); return 0; } return s - 1; });
    }, 1000);
  };

  const getWorldVisual = (w, size) => {
    if (w === "strike") return <BossMonster color={WORLDS[w].color1} size={size} />;
    if (w === "groove") return <StageVisual size={size} />;
    return <CrystalCore color={WORLDS[w].accent} size={size} />;
  };

  // ─── TITLE SCREEN ───
  const renderTitle = () => (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 20%, #1a1a3e 0%, #0a0a1a 60%, #050510 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: 20,
    }}>
      <WorldParticles color="#6C5CE7" count={30} />
      <WorldParticles color="#00e5ff" count={15} />
      <WorldParticles color="#ff4da6" count={10} />

      <div style={{
        opacity: titleAnim ? 1 : 0, transform: titleAnim ? "translateY(0) scale(1)" : "translateY(30px) scale(0.8)",
        transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        textAlign: "center", marginBottom: 40, position: "relative", zIndex: 2,
      }}>
        <div style={{
          fontSize: 72, fontWeight: 900, letterSpacing: -2, lineHeight: 1,
          background: "linear-gradient(135deg, #00e5ff 0%, #fff 30%, #ff4da6 60%, #fff 80%, #00e5ff 100%)",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "shimmer 4s ease-in-out infinite",
          fontFamily: "'Noto Sans JP', sans-serif",
        }}>歌極</div>
        <div style={{
          fontSize: 11, letterSpacing: 6, color: "rgba(255,255,255,0.5)", marginTop: 8,
          fontWeight: 600, textTransform: "uppercase",
        }}>VOCAL TRAINING APP</div>

        {totalXp > 0 && (
          <div style={{
            marginTop: 24, display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,0.06)", borderRadius: 30, padding: "8px 20px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <span style={{ fontSize: 18 }}>⚡</span>
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>Lv.{level}</span>
            <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}>
              <div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #00e5ff, #ff4da6)", width: `${(xp/xpNeeded)*100}%` }} />
            </div>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{totalXp} XP</span>
          </div>
        )}
      </div>

      <div style={{
        opacity: titleAnim ? 1 : 0, transition: "opacity 1.5s ease 0.5s",
        marginBottom: 40, position: "relative", zIndex: 1,
      }}>
        <CrystalCore color="#00e5ff" size={100} />
      </div>

      <div style={{
        display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 340,
        opacity: titleAnim ? 1 : 0, transform: titleAnim ? "translateY(0)" : "translateY(20px)",
        transition: "all 1s ease 0.8s", position: "relative", zIndex: 2,
      }}>
        {Object.entries(WORLDS).map(([key, w]) => {
          const items = CONTENT[key];
          const clearedCount = items.filter(it => cleared[it.id]).length;
          return (
            <button key={key} onClick={() => { setWorld(key); setScreen("world"); }}
              style={{
                background: `linear-gradient(135deg, ${w.color3}, ${w.color1}11)`,
                border: `1px solid ${w.color1}33`,
                borderRadius: 16, padding: "18px 20px", cursor: "pointer",
                textAlign: "left", position: "relative", overflow: "hidden",
                transition: "all 0.3s",
              }}>
              <div style={{
                position: "absolute", right: -20, top: -20, width: 80, height: 80,
                background: `radial-gradient(circle, ${w.color1}15 0%, transparent 70%)`,
                borderRadius: "50%",
              }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ color: w.color1, fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>{w.name}</div>
                  <div style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginTop: 4 }}>{w.coachName}</div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }}>{w.coachDesc}</div>
                </div>
                <div style={{ textAlign: "center", minWidth: 50 }}>
                  <div style={{ color: w.color1, fontSize: 20, fontWeight: 800 }}>{clearedCount}/{items.length}</div>
                </div>
              </div>
              <div style={{ marginTop: 10, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", background: `linear-gradient(90deg, ${w.color1}, ${w.color2})`, width: `${(clearedCount/items.length)*100}%`, transition: "width 0.5s" }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ─── WORLD SCREEN ───
  const renderWorld = () => {
    const w = WORLDS[world];
    const items = CONTENT[world];
    return (
      <div style={{ minHeight: "100vh", background: w.gradient, position: "relative", overflow: "hidden" }}>
        <WorldParticles color={w.particleColor} count={25} />
        <div style={{ position: "relative", zIndex: 2, padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <button onClick={() => setScreen("title")} style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10, padding: "6px 14px", color: "rgba(255,255,255,0.6)",
              fontSize: 13, cursor: "pointer",
            }}>← 戻る</button>
            <div style={{
              background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "4px 14px",
              color: w.accent, fontSize: 12, fontWeight: 700, border: `1px solid ${w.accent}33`,
            }}>Lv.{level}</div>
          </div>

          <div style={{ textAlign: "center", marginBottom: 24, marginTop: 16 }}>
            <div style={{
              fontSize: 28, fontWeight: 900, letterSpacing: 3, color: "#fff",
              textShadow: `0 0 30px ${w.color1}66`,
              fontFamily: "'Noto Sans JP', sans-serif",
            }}>{w.name}</div>
            <div style={{ color: w.accent, fontSize: 13, fontWeight: 600, marginTop: 4, letterSpacing: 2 }}>{w.sub}</div>
          </div>

          <div style={{ margin: "0 auto 30px" }}>{getWorldVisual(world, 100)}</div>

          <div style={{
            display: "flex", alignItems: "center", gap: 14, marginBottom: 24,
            background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px",
            border: `1px solid ${w.accent}22`,
          }}>
            <CoachAvatar world={world} size={52} />
            <div>
              <div style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>{w.coachName}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{w.coachTitle}</div>
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "10px 0", marginBottom: 24,
            border: `1px solid ${w.accent}15`,
          }}>
            <Waveform color={w.accent} active={false} />
          </div>

          {/* Technique quick-select for strike world */}
          {world === "strike" && (
            <div style={{
              display: "flex", gap: 8, marginBottom: 20, overflowX: "auto",
              padding: "4px 0", scrollbarWidth: "none",
            }}>
              {items.filter(it => level >= it.unlockLv).slice(0, 4).map(item => (
                <button key={item.id} onClick={() => {
                  setMission(item); setStep(0); setQuiz(null); setTimerOn(false); setTimer(0); setShowReward(false); setScreen("lesson");
                }} style={{
                  flex: "0 0 auto", background: `${w.accent}15`, border: `1px solid ${w.accent}33`,
                  borderRadius: 12, padding: "10px 16px", cursor: "pointer",
                  textAlign: "center", minWidth: 80,
                }}>
                  <div style={{ fontSize: 18 }}>⚔️</div>
                  <div style={{ color: "#fff", fontSize: 10, fontWeight: 700, marginTop: 4 }}>{item.name}</div>
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((item) => {
              const unlocked = level >= item.unlockLv;
              const done = cleared[item.id];
              return (
                <button key={item.id}
                  onClick={() => {
                    if (!unlocked) return;
                    setMission(item); setStep(0); setQuiz(null); setTimerOn(false); setTimer(0); setShowReward(false); setScreen("lesson");
                  }}
                  style={{
                    background: done ? `linear-gradient(135deg, ${w.accent}15, ${w.accent}08)` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${done ? w.accent + "44" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 14, padding: "14px 16px", cursor: unlocked ? "pointer" : "default",
                    opacity: unlocked ? 1 : 0.35, textAlign: "left", position: "relative",
                    transition: "all 0.2s",
                  }}>
                  {done && (
                    <div style={{
                      position: "absolute", top: 8, right: 10, background: w.accent,
                      borderRadius: 20, padding: "2px 10px", fontSize: 9, fontWeight: 800, color: "#fff",
                      letterSpacing: 1,
                    }}>CLEAR</div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: `linear-gradient(135deg, ${w.accent}22, ${w.accent}08)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20, border: `1px solid ${w.accent}22`,
                    }}>{unlocked ? (world === "strike" ? "⚔️" : world === "groove" ? "🎧" : "💎") : "🔒"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{item.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }}>{item.desc}</div>
                      <div style={{ display: "flex", gap: 3, marginTop: 5 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} style={{
                            width: 8, height: 8, borderRadius: 2,
                            background: i < item.difficulty ? w.accent : "rgba(255,255,255,0.1)",
                            opacity: i < item.difficulty ? (done ? 1 : 0.6) : 0.3,
                          }} />
                        ))}
                        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, marginLeft: 6 }}>+{item.xp}XP</span>
                      </div>
                    </div>
                  </div>
                  {!unlocked && (
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textAlign: "center", marginTop: 6 }}>
                      Lv.{item.unlockLv} で解放
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ─── LESSON SCREEN ───
  const renderLesson = () => {
    const w = WORLDS[world];
    const steps = getLesson(mission.id, mission);
    const s = steps[step];
    const isLast = step === steps.length - 1;
    const pct = ((step + 1) / steps.length) * 100;

    if (showReward) {
      return (
        <div style={{
          minHeight: "100vh", background: w.gradient,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden", padding: 20,
        }}>
          <WorldParticles color={w.particleColor} count={40} />
          <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
            <div style={{ fontSize: 70, animation: "bounceIn 0.6s cubic-bezier(0.68,-0.55,0.265,1.55)", marginBottom: 16 }}>
              {world === "strike" ? "⚔️" : world === "groove" ? "🎉" : "💎"}
            </div>
            <div style={{ color: w.accent, fontSize: 13, fontWeight: 800, letterSpacing: 4 }}>MISSION COMPLETE!</div>
            <div style={{ color: "#fff", fontSize: 26, fontWeight: 900, marginTop: 8, fontFamily: "'Noto Sans JP', sans-serif" }}>{mission.name}</div>

            {world === "groove" && (
              <div style={{
                color: "#ff4da6", fontSize: 20, fontWeight: 900, marginTop: 12,
                textShadow: "0 0 20px rgba(255,77,166,0.5)",
                animation: "crystalPulse 1s ease-in-out infinite",
              }}>PERFECT! ✨</div>
            )}
            {world === "strike" && (
              <div style={{
                color: "#ff2d2d", fontSize: 18, fontWeight: 900, marginTop: 12,
                textShadow: "0 0 20px rgba(255,45,45,0.5)",
              }}>TARGET DESTROYED! 💥</div>
            )}

            <div style={{
              marginTop: 24, background: `linear-gradient(135deg, ${w.accent}15, ${w.accent}08)`,
              border: `1px solid ${w.accent}33`, borderRadius: 16, padding: "20px 40px",
              display: "inline-block",
            }}>
              <div style={{ color: w.accent, fontSize: 36, fontWeight: 900 }}>+{mission.xp}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: 2 }}>EXPERIENCE</div>
            </div>

            <div style={{ marginTop: 30 }}>
              <button onClick={() => { setShowReward(false); setScreen("world"); }} style={{
                background: `linear-gradient(135deg, ${w.color1}, ${w.color2})`,
                border: "none", borderRadius: 14, padding: "14px 40px",
                color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
                boxShadow: `0 4px 25px ${w.color1}44`,
              }}>次のミッションへ →</button>
            </div>
          </div>
        </div>
      );
    }

    const handleNext = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimerOn(false); setTimer(0);
      if (isLast) {
        if (!cleared[mission.id]) {
          setCleared(p => ({ ...p, [mission.id]: true }));
          addXp(mission.xp);
          setShowReward(true);
        } else setScreen("world");
      } else { setStep(st => st + 1); setQuiz(null); }
    };

    return (
      <div style={{ minHeight: "100vh", background: w.gradient, position: "relative", overflow: "hidden" }}>
        <WorldParticles color={w.particleColor} count={12} />
        <div style={{ position: "relative", zIndex: 2, padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <button onClick={() => { setScreen("world"); if (timerRef.current) clearInterval(timerRef.current); setTimerOn(false); }} style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer",
            }}>✕</button>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{step + 1}/{steps.length}</span>
          </div>

          <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 20, overflow: "hidden" }}>
            <div style={{ height: "100%", background: `linear-gradient(90deg, ${w.color1}, ${w.color2})`, width: `${pct}%`, transition: "width 0.4s", borderRadius: 2 }} />
          </div>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ color: w.accent, fontSize: 11, fontWeight: 800, letterSpacing: 3 }}>{w.name}</div>
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginTop: 4 }}>{mission.name}</div>
          </div>

          <div style={{ margin: "0 auto 20px" }}>{getWorldVisual(world, 80)}</div>

          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
            background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "10px 14px",
            border: `1px solid ${w.accent}15`,
          }}>
            <CoachAvatar world={world} size={40} />
            <div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{w.coachName}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>{w.coachTitle}</div>
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.03)", border: `1px solid ${w.accent}15`,
            borderRadius: 18, padding: "22px 18px", marginBottom: 20,
          }}>
            <div style={{
              display: "inline-block", padding: "3px 12px", borderRadius: 20, marginBottom: 12,
              fontSize: 10, fontWeight: 800, letterSpacing: 1,
              background: s.type === "quiz" ? "rgba(255,165,2,0.15)" : `${w.accent}18`,
              color: s.type === "quiz" ? "#FFA502" : w.accent,
            }}>
              {s.type === "lecture" ? "📖 LECTURE" : s.type === "exercise" ? "🏋️ EXERCISE" : "❓ QUIZ"}
            </div>
            <div style={{ color: "#fff", fontSize: 17, fontWeight: 800, marginBottom: 12 }}>{s.title}</div>

            {s.type === "quiz" ? (
              <>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{s.q}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {s.opts.map((o, i) => {
                    const sel = quiz === i;
                    const correct = i === s.ans;
                    const show = quiz !== null;
                    return (
                      <button key={i} onClick={() => quiz === null && setQuiz(i)} style={{
                        background: show ? (correct ? "rgba(0,210,100,0.12)" : sel ? "rgba(255,60,60,0.12)" : "rgba(255,255,255,0.02)") : "rgba(255,255,255,0.04)",
                        border: `1px solid ${show ? (correct ? "rgba(0,210,100,0.35)" : sel ? "rgba(255,60,60,0.35)" : "rgba(255,255,255,0.05)") : "rgba(255,255,255,0.06)"}`,
                        borderRadius: 10, padding: "11px 14px", cursor: quiz === null ? "pointer" : "default",
                        color: "#fff", fontSize: 13, textAlign: "left",
                      }}>
                        <span style={{ opacity: 0.35, marginRight: 8 }}>{["A","B","C","D"][i]}.</span>{o}
                        {show && correct && " ✅"}{show && sel && !correct && " ❌"}
                      </button>
                    );
                  })}
                </div>
                {quiz !== null && (
                  <div style={{
                    marginTop: 12, padding: "8px 12px", borderRadius: 8, fontSize: 12,
                    background: quiz === s.ans ? "rgba(0,210,100,0.08)" : "rgba(255,165,2,0.08)",
                    color: quiz === s.ans ? "#00D264" : "#FFA502",
                  }}>
                    {quiz === s.ans
                      ? (world === "groove" ? "PERFECT! 🎉" : world === "strike" ? "CRITICAL HIT! ⚔️" : "RESONANCE MATCHED! 💎")
                      : "もう一度挑戦しよう 💪"}
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-line" }}>{s.text}</div>
                {s.tip && (
                  <div style={{ marginTop: 14, padding: "8px 12px", borderRadius: 8, background: `${w.accent}0d`, border: `1px solid ${w.accent}18`, color: w.accent, fontSize: 11 }}>
                    💡 {s.tip}
                  </div>
                )}
                {s.type === "exercise" && s.duration && (
                  <div style={{ marginTop: 20, textAlign: "center" }}>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>🎯 {s.goal}</div>
                    <div style={{ marginBottom: 12 }}>
                      <Waveform color={w.accent} active={timerOn} />
                    </div>
                    <div style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 90, height: 90, borderRadius: "50%",
                      background: timerOn ? `${w.accent}12` : "rgba(255,255,255,0.03)",
                      border: `2px solid ${timerOn ? w.accent : "rgba(255,255,255,0.08)"}`,
                      marginBottom: 10, transition: "all 0.3s",
                    }}>
                      <span style={{ color: "#fff", fontSize: 24, fontWeight: 800, fontFamily: "monospace" }}>
                        {timerOn || timer > 0 ? `${Math.floor(timer/60)}:${String(timer%60).padStart(2,"0")}` : `${s.duration}s`}
                      </span>
                    </div>
                    <div>
                      {!timerOn && timer === 0 && (
                        <button onClick={() => startTimer(s.duration)} style={{
                          background: `linear-gradient(135deg, ${w.color1}, ${w.color2})`,
                          border: "none", borderRadius: 10, padding: "10px 28px",
                          color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
                          boxShadow: `0 4px 15px ${w.color1}33`,
                        }}>▶ START</button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {(s.type !== "quiz" || quiz !== null) && (
            <button onClick={handleNext} style={{
              width: "100%", background: `linear-gradient(135deg, ${w.color1}, ${w.color2})`,
              border: "none", borderRadius: 14, padding: "14px",
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
              boxShadow: `0 4px 20px ${w.color1}33`,
            }}>
              {isLast ? (cleared[mission.id] ? "完了" : (world === "strike" ? "⚔️ FINISH!" : world === "groove" ? "🎉 CLEAR!" : "💎 COMPLETE!")) : "NEXT →"}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        @keyframes crystalPulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.8; } }
        @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.08); } 70% { transform: scale(0.96); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes shimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes orbitSpin { 0% { transform: rotate(0deg) translateY(-55px); } 100% { transform: rotate(360deg) translateY(-55px); } }
        @keyframes particleFloat { 0% { transform: translateY(0) translateX(0); } 100% { transform: translateY(-20px) translateX(10px); } }
        @keyframes waveBar { 0% { height: 6px; } 100% { height: 30px; } }
      `}</style>

      {showLvUp && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)",
        }}>
          <div style={{ textAlign: "center", animation: "bounceIn 0.5s ease" }}>
            <div style={{ fontSize: 56 }}>⚡</div>
            <div style={{ color: "#FFA502", fontSize: 13, fontWeight: 800, letterSpacing: 4, marginTop: 8 }}>LEVEL UP!</div>
            <div style={{
              color: "#fff", fontSize: 52, fontWeight: 900,
              background: "linear-gradient(135deg, #00e5ff, #fff, #ff4da6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Lv. {level}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 8 }}>新しいスキルが解放されたかも！</div>
          </div>
        </div>
      )}

      {screen === "title" && renderTitle()}
      {screen === "world" && renderWorld()}
      {screen === "lesson" && renderLesson()}
    </div>
  );
}
