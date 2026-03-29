import { useState, useRef, useEffect, createContext, useContext, useCallback } from "react";

// ─── テーマ設定 ──────────────────────────────────────────────
const THEMES = {
  warm:   { bg:"#FFF8F3",bg2:"#FFF0E6",card:"#FFFFFF",acc:"#C0392B",accm:"#FADBD8",tx:"#1A0A00",tx2:"#6B4C3B",txm:"#A0826D",br:"#F0DDD5",star:"#E67E22",grad:"linear-gradient(135deg,#C0392B,#E74C3C)",sh:"rgba(192,57,43,0.12)" },
  dark:   { bg:"#0F0A08",bg2:"#1A110D",card:"#231610",acc:"#E74C3C",accm:"#3D1A17",tx:"#F5EDE8",tx2:"#C4A99A",txm:"#7A5C4F",br:"#3D2418",star:"#F39C12",grad:"linear-gradient(135deg,#E74C3C,#FF6B6B)",sh:"rgba(231,76,60,0.2)" },
  cool:   { bg:"#F0F4FF",bg2:"#E8EEFF",card:"#FFFFFF",acc:"#3B5BDB",accm:"#DBE4FF",tx:"#0A0F2C",tx2:"#3B4A8A",txm:"#7C8DB0",br:"#D0D9F5",star:"#F59F00",grad:"linear-gradient(135deg,#3B5BDB,#4C6EF5)",sh:"rgba(59,91,219,0.12)" },
  season: { bg:"#F5FFF0",bg2:"#EAFAE0",card:"#FFFFFF",acc:"#2E7D32",accm:"#C8E6C9",tx:"#0A1F0C",tx2:"#2E5C30",txm:"#6A9B6D",br:"#D4EDD6",star:"#F57F17",grad:"linear-gradient(135deg,#2E7D32,#43A047)",sh:"rgba(46,125,50,0.12)" },
};

const RAMENDB_BASE = "https://ramendb.supleks.jp";
const GENRES = ["すべて","醤油","豚骨","塩","味噌","つけ麺","鶏白湯","二郎系","中華そば","煮干し","その他"];
const AREAS  = ["すべて","新宿","渋谷","池袋","代々木","中野","三田","巣鴨","五反田","横浜","松戸","博多","札幌"];

// ─── コンテキスト ──────────────────────────────────────────
const Ctx = createContext(null);
const useApp = () => useContext(Ctx);

function Provider({ children }) {
  const load = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
  
  const [entries, setEntries] = useState(() => load("rd_entries", []));
  const [groups, setGroups] = useState(() => load("rd_groups", [{ id:"g1", name:"ラーメン部", members:["あなた","田中"] }]));
  const [profile, setProfile] = useState(() => load("rd_profile", { name: "あなた", gender: "未設定", station: "未設定", favorite: "醤油" }));
  const [settings, setSettings] = useState(() => load("rd_settings", { theme:"warm" }));
  const [tab, setTab] = useState(0);
  const [showPost, setShowPost] = useState(false);
  const [detail, setDetail] = useState(null);
  const [filterMode, setFilterMode] = useState({ type: 'all', value: null });

  useEffect(() => { localStorage.setItem("rd_entries", JSON.stringify(entries)); }, [entries]);
  useEffect(() => { localStorage.setItem("rd_profile", JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem("rd_settings", JSON.stringify(settings)); }, [settings]);

  const t = THEMES[settings.theme] || THEMES.warm;

  const value = {
    entries, setEntries, groups, setGroups, profile, setProfile, settings, setSettings,
    tab, setTab, showPost, setShowPost, detail, setDetail, filterMode, setFilterMode, t
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// ─── ホーム画面 ──────────────────────────────────────────────
function HomePage() {
  const { entries, profile, setTab, setFilterMode, t } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  // 訪問月のリスト作成
  const months = Array.from(new Set(entries.map(e => e.visitDate?.slice(0, 7)))).sort().reverse();
  if (!months.includes(new Date().toISOString().slice(0, 7))) months.unshift(new Date().toISOString().slice(0, 7));

  const stats = {
    total: entries.length,
    month: entries.filter(e => e.visitDate?.startsWith(selectedMonth)).length,
    avg: entries.length ? (entries.reduce((a, b) => a + b.rating, 0) / entries.length).toFixed(1) : "0.0"
  };

  const handleStatClick = (type) => {
    setFilterMode({ type, value: type === 'month' ? selectedMonth : null });
    setTab(3); // マイページ（フィルタ結果表示）へ
  };

  return (
    <div style={{ height:"100%", overflowY:"auto", background:t.bg }}>
      <div style={{ background:t.grad, padding:20, color:"white" }}>
        <h2>{profile.name}さんのMen～Log</h2>
        <div style={{ display:"flex", gap:10, marginTop:15 }}>
          <div onClick={() => handleStatClick('all')} style={{ flex:1, background:"rgba(255,255,255,0.2)", padding:10, borderRadius:10, textAlign:"center", cursor:"pointer" }}>
            <div style={{ fontSize:12 }}>訪問件数</div>
            <div style={{ fontSize:20, fontWeight:700 }}>{stats.total}</div>
          </div>
          <div style={{ flex:1, background:"rgba(255,255,255,0.2)", padding:10, borderRadius:10, textAlign:"center" }}>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} 
              style={{ background:"none", border:"none", color:"white", fontSize:12, outline:"none" }}>
              {months.map(m => <option key={m} value={m} style={{ color:"black" }}>{m}</option>)}
            </select>
            <div onClick={() => handleStatClick('month')} style={{ fontSize:20, fontWeight:700, cursor:"pointer" }}>{stats.month}</div>
          </div>
          <div onClick={() => handleStatClick('high')} style={{ flex:1, background:"rgba(255,255,255,0.2)", padding:10, borderRadius:10, textAlign:"center", cursor:"pointer" }}>
            <div style={{ fontSize:12 }}>平均</div>
            <div style={{ fontSize:20, fontWeight:700 }}>{stats.avg}★</div>
          </div>
        </div>
      </div>
      <div style={{ padding:20 }}>
        <h3>プロフィール概要</h3>
        <p style={{ fontSize:14, color:t.tx2 }}>最寄り: {profile.station} / 好み: {profile.favorite}</p>
      </div>
    </div>
  );
}

// ─── おすすめ（ラーメンDB連携） ──────────────────────────────
const MOCK_DB = [
  { id: "s1", name: "らぁ麺 飯田商店", score: 98.5, genre: "醤油", area: "湯河原", ramendbId: "119107" },
  { id: "s2", name: "中華そば とみ田", score: 97.2, genre: "つけ麺", area: "松戸", ramendbId: "3051" },
];

function RecommendPage() {
  const { t } = useApp();
  return (
    <div style={{ padding:20, background:t.bg, height:"100%", overflowY:"auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h3>注目のランキング</h3>
        <a href={`${RAMENDB_BASE}/rank`} target="_blank" rel="noreferrer" style={{ fontSize:12, color:t.acc }}>サイトで詳しく見る</a>
      </div>
      {MOCK_DB.map(shop => (
        <div key={shop.id} style={{ background:t.card, padding:15, borderRadius:12, marginBottom:10, boxShadow:`0 2px 8px ${t.sh}` }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontWeight:700 }}>{shop.name}</span>
            <span style={{ color:t.star, fontWeight:700 }}>{shop.score} pt</span>
          </div>
          <p style={{ fontSize:12, color:t.txm }}>{shop.area} / {shop.genre}</p>
          <a href={`${RAMENDB_BASE}/s/${shop.ramendbId}.html`} target="_blank" rel="noreferrer" 
            style={{ display:"block", marginTop:10, textAlign:"center", padding:8, background:t.bg2, borderRadius:8, fontSize:12, textDecoration:"none", color:t.tx }}>
            詳細をラーメンデータベースで見る
          </a>
        </div>
      ))}
    </div>
  );
}

// ─── マイページ（フィルタ＆編集） ─────────────────────────────
function MyPage() {
  const { entries, profile, setProfile, groups, filterMode, setFilterMode, t } = useApp();
  const [tempProfile, setTempProfile] = useState(profile);
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [view, setView] = useState('you'); // 'you' or 'group'

  const resetFilters = () => {
    setFilterMode({ type: 'all', value: null });
    setSelectedGroupIds([]);
  };

  const filtered = entries.filter(e => {
    if (filterMode.type === 'month') return e.visitDate.startsWith(filterMode.value);
    if (filterMode.type === 'high') return e.rating >= 4;
    if (view === 'group' && selectedGroupIds.length > 0) return selectedGroupIds.includes(e.groupId);
    return true;
  });

  return (
    <div style={{ padding:20, background:t.bg, height:"100%", overflowY:"auto" }}>
      <section style={{ marginBottom:30, background:t.card, padding:15, borderRadius:12 }}>
        <h3>プロフィール編集</h3>
        <div style={{ display:"grid", gap:10 }}>
          <input value={tempProfile.name} onChange={e=>setTempProfile({...tempProfile, name:e.target.value})} placeholder="ニックネーム" style={{ padding:8 }} />
          <input value={tempProfile.station} onChange={e=>setTempProfile({...tempProfile, station:e.target.value})} placeholder="最寄り駅" style={{ padding:8 }} />
          <select value={tempProfile.favorite} onChange={e=>setTempProfile({...tempProfile, favorite:e.target.value})} style={{ padding:8 }}>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <button onClick={() => setProfile(tempProfile)} style={{ background:t.acc, color:"white", border:"none", padding:10, borderRadius:5 }}>保存</button>
        </div>
      </section>

      <section>
        <div style={{ display:"flex", gap:10, marginBottom:15 }}>
          <button onClick={() => setView('you')} style={{ flex:1, padding:10, background:view==='you'?t.acc:t.bg2, color:view==='you'?"white":t.tx }}>あなた</button>
          <button onClick={() => setView('group')} style={{ flex:1, padding:10, background:view==='group'?t.acc:t.bg2, color:view==='group'?"white":t.tx }}>グループ</button>
        </div>

        {view === 'group' && (
          <div style={{ marginBottom:15, padding:10, background:t.bg2, borderRadius:8 }}>
            <p style={{ fontSize:12 }}>グループを選択して決定を押してください</p>
            {groups.map(g => (
              <label key={g.id} style={{ display:"block", margin:"5px 0" }}>
                <input type="checkbox" checked={selectedGroupIds.includes(g.id)} 
                  onChange={e => e.target.checked ? setSelectedGroupIds([...selectedGroupIds, g.id]) : setSelectedGroupIds(selectedGroupIds.filter(id=>id!==g.id))} />
                {g.name}
              </label>
            ))}
            <button onClick={() => {}} style={{ marginTop:10, width:"100%", padding:5 }}>決定</button>
          </div>
        )}

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h4>表示結果 ({filtered.length}件)</h4>
          <button onClick={resetFilters} style={{
