import { useState, useRef, useEffect, createContext, useContext } from "react";

// ─── テーマ ─────────────────────────────────────────────────
const THEMES = {
  warm:   { bg:"#FFF8F3",bg2:"#FFF0E6",card:"#FFFFFF",acc:"#C0392B",accm:"#FADBD8",tx:"#1A0A00",tx2:"#6B4C3B",txm:"#A0826D",br:"#F0DDD5",star:"#E67E22",grad:"linear-gradient(135deg,#C0392B,#E74C3C)",sh:"rgba(192,57,43,0.12)" },
  dark:   { bg:"#0F0A08",bg2:"#1A110D",card:"#231610",acc:"#E74C3C",accm:"#3D1A17",tx:"#F5EDE8",tx2:"#C4A99A",txm:"#7A5C4F",br:"#3D2418",star:"#F39C12",grad:"linear-gradient(135deg,#E74C3C,#FF6B6B)",sh:"rgba(231,76,60,0.2)" },
  cool:   { bg:"#F0F4FF",bg2:"#E8EEFF",card:"#FFFFFF",acc:"#3B5BDB",accm:"#DBE4FF",tx:"#0A0F2C",tx2:"#3B4A8A",txm:"#7C8DB0",br:"#D0D9F5",star:"#F59F00",grad:"linear-gradient(135deg,#3B5BDB,#4C6EF5)",sh:"rgba(59,91,219,0.12)" },
  season: { bg:"#F5FFF0",bg2:"#EAFAE0",card:"#FFFFFF",acc:"#2E7D32",accm:"#C8E6C9",tx:"#0A1F0C",tx2:"#2E5C30",txm:"#6A9B6D",br:"#D4EDD6",star:"#F57F17",grad:"linear-gradient(135deg,#2E7D32,#43A047)",sh:"rgba(46,125,50,0.12)" },
};

// ─── ラーメンDB ──────────────────────────────────────────────
const RAMEN_DB = [
  { id:"r1",  name:"麺屋 武蔵",       genre:"醤油",    area:"新宿",      dist:0.3, rank:1,  score:4.9, price:1200, emoji:"🏆", tags:["醤油","チャーシュー","行列"], desc:"新宿の名店。黄金色の清湯スープが絶品。" },
  { id:"r2",  name:"一蘭 渋谷",        genre:"豚骨",    area:"渋谷",      dist:0.8, rank:2,  score:4.7, price:890,  emoji:"🐷", tags:["豚骨","半個室","深夜"],       desc:"天然とんこつの個室スタイル。24時間営業。" },
  { id:"r3",  name:"塩らーめん 白月",  genre:"塩",      area:"池袋",      dist:1.2, rank:3,  score:4.8, price:1100, emoji:"🌙", tags:["塩","鶏","あっさり"],         desc:"透き通ったスープに感動の一杯。" },
  { id:"r4",  name:"風雲児",           genre:"鶏白湯",  area:"代々木",    dist:2.1, rank:4,  score:4.8, price:1050, emoji:"☁️", tags:["鶏白湯","濃厚","行列"],      desc:"濃厚クリーミーな鶏白湯の元祖的存在。" },
  { id:"r5",  name:"とみ田",           genre:"つけ麺",  area:"松戸",      dist:8.5, rank:5,  score:4.9, price:1300, emoji:"🎯", tags:["つけ麺","濃厚","人気"],      desc:"全国つけ麺ランキング常連の超有名店。" },
  { id:"r6",  name:"飯田商店",         genre:"塩",      area:"湯河原",    dist:42,  rank:6,  score:4.9, price:1400, emoji:"✨", tags:["塩","醤油","全国一"],        desc:"一度は食べたい日本一とも呼ばれる清湯ラーメン。" },
  { id:"r7",  name:"中華そば 青葉",    genre:"中華そば",area:"中野",      dist:4.2, rank:7,  score:4.6, price:850,  emoji:"🌿", tags:["中華そば","昔ながら","安い"], desc:"ダブルスープの元祖。懐かしい中華そば。" },
  { id:"r8",  name:"二郎 三田本店",    genre:"二郎系",  area:"三田",      dist:3.8, rank:8,  score:4.5, price:800,  emoji:"💪", tags:["二郎系","ボリューム","野菜"], desc:"伝説の二郎本店。ニンニク・ヤサイ・アブラ。" },
  { id:"r9",  name:"博多一幸舎",       genre:"豚骨",    area:"博多",      dist:15,  rank:9,  score:4.7, price:780,  emoji:"🔥", tags:["豚骨","博多","本場"],        desc:"本場博多の極細麺と白濁スープ。" },
  { id:"r10", name:"蔦",               genre:"醤油",    area:"巣鴨",      dist:5.1, rank:10, score:4.8, price:1500, emoji:"🌱", tags:["醤油","高級","ミシュラン"],  desc:"世界初ミシュラン星獲得のラーメン店。" },
  { id:"r11", name:"麺屋 さっぽろ",    genre:"味噌",    area:"札幌",      dist:25,  rank:11, score:4.6, price:950,  emoji:"⛄", tags:["味噌","札幌","バター"],      desc:"札幌味噌ラーメンの元祖。バターコーン必須。" },
  { id:"r12", name:"斑鳩",             genre:"醤油",    area:"五反田",    dist:2.9, rank:12, score:4.7, price:1100, emoji:"🦉", tags:["醤油","鶏油","名店"],       desc:"鶏油の香りが鼻を抜ける極上の醤油。" },
  { id:"r13", name:"くじら食堂",       genre:"塩",      area:"東小金井",  dist:7.3, rank:13, score:4.6, price:980,  emoji:"🐋", tags:["塩","鶏","あっさり"],       desc:"鶏と貝のWスープが織り成す繊細な塩ラーメン。" },
  { id:"r14", name:"ラーメン凪",       genre:"煮干し",  area:"新宿",      dist:0.5, rank:14, score:4.5, price:890,  emoji:"🐟", tags:["煮干し","濃厚","行列"],      desc:"煮干し特化の濃厚ラーメン。深夜2時まで営業。" },
  { id:"r15", name:"麺処 井の庄",      genre:"煮干し",  area:"石神井公園",dist:11,  rank:15, score:4.7, price:870,  emoji:"🎣", tags:["煮干し","辛い","限定"],     desc:"辛辛魚が大人気。煮干しと唐辛子の絶妙な融合。" },
  { id:"r16", name:"俺のラーメン",     genre:"味噌",    area:"横浜",      dist:12,  rank:16, score:4.4, price:880,  emoji:"👊", tags:["味噌","濃厚","ボリューム"], desc:"濃厚味噌に背脂。ガツンとくる力強い一杯。" },
  { id:"r17", name:"栄屋ミルクホール", genre:"中華そば",area:"御茶ノ水",  dist:3.3, rank:17, score:4.5, price:700,  emoji:"🥛", tags:["中華そば","老舗","安い"],   desc:"創業1947年の老舗。シンプルな中華そばが旨い。" },
  { id:"r18", name:"ほん田",           genre:"醤油",    area:"東十条",    dist:6.8, rank:18, score:4.8, price:1050, emoji:"🍂", tags:["醤油","清湯","行列"],       desc:"清湯醤油の最高峰。黄金色のスープに感動。" },
];

const GENRES    = ["すべて","醤油","豚骨","塩","味噌","つけ麺","鶏白湯","二郎系","中華そば","煮干し"];
const AREAS     = ["すべて","新宿","渋谷","池袋","代々木","中野","三田","巣鴨","五反田","横浜","松戸","博多","札幌"];
const DIST_OPTS = [{ label:"すべて", max:999 }, { label:"1km以内", max:1 }, { label:"3km以内", max:3 }, { label:"10km以内", max:10 }, { label:"30km以内", max:30 }];

const MOCK_ENTRIES = [
  { id:"1", shopName:"麺屋 蒼龍", visitDate:"2026-03-20", menu:"特製醤油ラーメン", price:1200, rating:5, comment:"出汁が深くて絶品！チャーシューがとろとろ。", review:"東京でも有数の名店。澄んだ醤油スープに細麺が絶妙にマッチ。チャーシューは低温調理でとろとろ。並んででも食べる価値あり。", members:["田中","佐藤"], visibility:"group", emoji:"🍜" },
  { id:"2", shopName:"豚骨将軍 渋谷", visitDate:"2026-03-15", menu:"濃厚豚骨＋替え玉", price:980, rating:4, comment:"替え玉2回してしまった笑", review:"博多直送の豚骨スープ。濃厚でクリーミー。替え玉システムが最高。", members:["田中"], visibility:"group", emoji:"🐷" },
  { id:"3", shopName:"塩らーめん 白月", visitDate:"2026-03-10", menu:"塩ラーメン 特上", price:1100, rating:5, comment:"透明なスープなのに深みがすごい", review:"見た目の透明感と反して、味の深みに驚愕。鶏と魚介の二重出汁が見事に調和。", members:["山田","田中"], visibility:"public", emoji:"🌙" },
  { id:"4", shopName:"二郎系 BEAST", visitDate:"2026-03-05", menu:"大 ニンニクマシ", price:900, rating:3, comment:"量が多すぎた…でも美味い", review:"とにかく量がすごい。スープはジロリアン御用達の濃厚豚骨醤油。", members:[], visibility:"private", emoji:"💪" },
];
const MOCK_GROUPS = [
  { id:"g1", name:"ラーメン部", emoji:"🍜", members:["田中","佐藤","山田","あなた"] },
  { id:"g2", name:"食べ歩きクラブ", emoji:"🚶", members:["あなた","鈴木"] },
];
const EMOJIS   = ["🍜","🍖","🌶️","🏆","⭐","🔥","🐷","🌙","💪","😋","🤤","🎯"];
const PALETTES = ["#FADBD8","#FDEBD0","#D5F5E3","#D6EAF8","#E8DAEF","#FEF9E7","#EAFAE0"];
const PIN_POS  = [{l:"18%",t:"24%"},{l:"55%",t:"38%"},{l:"34%",t:"62%"},{l:"68%",t:"20%"},{l:"12%",t:"55%"},{l:"60%",t:"68%"}];
const rc = r => r>=5?"#E74C3C":r>=4?"#E67E22":"#95A5A6";
let _uid = 300;
const uid = () => String(++_uid);

// ─── Context ────────────────────────────────────────────────
const Ctx = createContext(null);
const useApp = () => useContext(Ctx);

function Provider({ children }) {
  const load = (key, fallback) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  };
  const [entries,  setEntries]  = useState(() => load("rd_entries",  MOCK_ENTRIES));
  const [groups,   setGroups]   = useState(() => load("rd_groups",   MOCK_GROUPS));
  const [settings, setSettings] = useState(() => load("rd_settings", { theme:"warm", notifyGroup:true, notifyRecommend:true, notifyInvite:true, notifyFreq:"weekly", mapsApiKey:"" }));
  const [tab,       setTab]       = useState(0);
  const [showPost,  setShowPost]  = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [detail,    setDetail]    = useState(null);
  const [recoDetail,setRecoDetail]= useState(null);

  useEffect(() => { try { localStorage.setItem("rd_entries",  JSON.stringify(entries));  } catch {} }, [entries]);
  useEffect(() => { try { localStorage.setItem("rd_groups",   JSON.stringify(groups));   } catch {} }, [groups]);
  useEffect(() => { try { localStorage.setItem("rd_settings", JSON.stringify(settings)); } catch {} }, [settings]);

  const addEntry    = e    => setEntries(p => [{ ...e, id:uid() }, ...p]);
  const updateEntry = (id,d) => setEntries(p => p.map(e => e.id===id ? {...e,...d} : e));
  const deleteEntry = id   => setEntries(p => p.filter(e => e.id!==id));
  const addGroup    = g    => setGroups(p => [...p, { ...g, id:uid(), members:["あなた"] }]);
  const t = THEMES[settings.theme] || THEMES.warm;

  return (
    <Ctx.Provider value={{ entries, addEntry, updateEntry, deleteEntry, groups, addGroup, settings, setSettings, tab, setTab, showPost, setShowPost, editEntry, setEditEntry, detail, setDetail, recoDetail, setRecoDetail, t }}>
      {children}
    </Ctx.Provider>
  );
}

// ─── Hooks & Utils ──────────────────────────────────────────
function useSwipe(count, current, onChange) {
  const startX = useRef(null);
  return {
    onTouchStart: e => { startX.current = e.touches[0].clientX; },
    onTouchEnd:   e => {
      if (startX.current===null) return;
      const dx = e.changedTouches[0].clientX - startX.current;
      startX.current = null;
      if (dx < -50 && current < count-1) onChange(current+1);
      if (dx >  50 && current > 0)       onChange(current-1);
    },
    onMouseDown: e => { startX.current = e.clientX; },
    onMouseUp:   e => {
      if (startX.current===null) return;
      const dx = e.clientX - startX.current;
      startX.current = null;
      if (dx < -50 && current < count-1) onChange(current+1);
      if (dx >  50 && current > 0)       onChange(current-1);
    },
    onMouseLeave: () => { startX.current = null; },
  };
}

function Stars({ value=0, onChange, size=24, readonly=false }) {
  const [hov, setHov] = useState(0);
  const { t } = useApp();
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n}
          onMouseEnter={()=>!readonly&&setHov(n)} onMouseLeave={()=>!readonly&&setHov(0)}
          onClick={()=>!readonly&&onChange?.(n)}
          style={{ fontSize:size, cursor:readonly?"default":"pointer", color:(hov||value)>=n?t.star:t.br, display:"inline-block", transition:"transform 0.1s", transform:hov===n&&!readonly?"scale(1.3)":"scale(1)", userSelect:"none" }}>★</span>
      ))}
    </div>
  );
}

function Dots({ count, current, t }) {
  return (
    <div style={{ display:"flex", justifyContent:"center", gap:5, padding:"6px 0" }}>
      {Array.from({length:count}).map((_,i) => (
        <div key={i} style={{ width:i===current?16:5, height:5, borderRadius:3, background:i===current?t.acc:t.br, transition:"all 0.28s" }} />
      ))}
    </div>
  );
}

function Pill({ active, onClick, children, t, small }) {
  return (
    <button onClick={onClick} style={{ padding:small?"3px 10px":"4px 13px", borderRadius:20, border:"none", background:active?t.acc:t.bg2, color:active?"white":t.tx2, fontSize:small?11:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>{children}</button>
  );
}

function Badge({ children, t, style={} }) {
  return <span style={{ background:t.accm, color:t.acc, fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20, ...style }}>{children}</span>;
}

// ─── ホーム ─────────────────────────────────────────────────
function HomePage() {
  const { entries, setDetail, setShowPost, setTab, t } = useApp();
  const [filter, setFilter] = useState("all");
  const filtered = entries.filter(e => filter==="group"?e.visibility==="group":filter==="mine"?!e.members?.length:true);
  const avg = entries.length ? (entries.reduce((a,b)=>a+(b.rating||0),0)/entries.length).toFixed(1) : "—";
  const thisMonth = entries.filter(e=>e.visitDate?.startsWith(new Date().toISOString().slice(0,7))).length;
  const visitedNames = new Set(entries.map(e=>e.shopName));
  const quickReco = RAMEN_DB.filter(r=>!visitedNames.has(r.name)).slice(0,4);

  return (
    <div style={{ height:"100%", overflowY:"auto", background:t.bg }}>
      {/* ヒーロー */}
      <div style={{ background:t.grad, padding:"16px 16px 18px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-24, right:-24, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
        <div style={{ position:"absolute", bottom:-16, right:40, width:70, height:70, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <p style={{ color:"rgba(255,255,255,0.82)", fontSize:12, marginBottom:3 }}>おかえり 👋</p>
            <h2 style={{ color:"white", fontWeight:700, fontSize:22, fontFamily:"Georgia,serif", margin:0 }}>あなたさん</h2>
          </div>
          <button style={{ background:"rgba(255,255,255,0.22)", border:"none", borderRadius:"50%", width:38, height:38, fontSize:16, cursor:"pointer", color:"white" }}>🔔</button>
        </div>
        <div style={{ display:"flex", gap:8, marginTop:14 }}>
          {[["訪問軒数",entries.length,"🏪"],["今月",thisMonth,"📅"],["平均",avg+"★","⭐"]].map(([l,v,em])=>(
            <div key={l} style={{ flex:1, background:"rgba(255,255,255,0.17)", borderRadius:11, padding:"9px 6px", textAlign:"center" }}>
              <div style={{ color:"rgba(255,255,255,0.75)", fontSize:10, marginBottom:2 }}>{em} {l}</div>
              <div style={{ color:"white", fontWeight:700, fontSize:18 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* おすすめ */}
      <div style={{ padding:"16px 14px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:16 }}>🔥</span>
            <span style={{ fontWeight:700, fontSize:14, color:t.tx }}>まだ行っていないおすすめ</span>
          </div>
          <button onClick={()=>setTab(1)} style={{ background:"none", border:"none", cursor:"pointer", color:t.acc, fontSize:12, fontWeight:700, padding:0 }}>もっと見る →</button>
        </div>
        <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:4 }}>
          {quickReco.map(r=>(
            <div key={r.id} onClick={()=>setTab(1)} style={{ minWidth:130, flexShrink:0, background:t.card, border:`1px solid ${t.br}`, borderRadius:14, overflow:"hidden", boxShadow:`0 2px 10px ${t.sh}`, cursor:"pointer" }}>
              <div style={{ background:t.accm, height:64, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>{r.emoji}</div>
              <div style={{ padding:"9px 10px" }}>
                <div style={{ fontWeight:700, fontSize:12, color:t.tx, marginBottom:2 }}>{r.name}</div>
                <div style={{ fontSize:10, color:t.txm, marginBottom:4 }}>{r.area} · {r.genre}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:11, color:t.star, fontWeight:700 }}>★{r.score}</span>
                  <span style={{ fontSize:10, color:t.txm }}>¥{r.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 日記フィード */}
      <div style={{ padding:"16px 14px 8px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontWeight:700, fontSize:14, color:t.tx }}>📖 ラーメン日記</span>
          <div style={{ display:"flex", gap:6 }}>
            {[["all","すべて"],["group","グループ"],["mine","個人"]].map(([v,l])=>(
              <Pill key={v} active={filter===v} onClick={()=>setFilter(v)} t={t} small>{l}</Pill>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"40px 20px", gap:12, textAlign:"center" }}>
            <div style={{ fontSize:50 }}>🍜</div>
            <div style={{ fontWeight:700, fontSize:16, color:t.tx }}>まだ記録がありません</div>
            <button onClick={()=>setShowPost(true)} style={{ background:t.grad, color:"white", border:"none", borderRadius:11, padding:"10px 22px", fontWeight:700, fontSize:14, cursor:"pointer" }}>日記を書く</button>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map(e=>(
              <div key={e.id} onClick={()=>setDetail(e)} style={{ background:t.card, border:`1px solid ${t.br}`, borderRadius:14, overflow:"hidden", boxShadow:`0 2px 10px ${t.sh}`, cursor:"pointer" }}>
                <div style={{ padding:"13px 14px" }}>
                  <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <div style={{ width:46, height:46, borderRadius:11, background:t.accm, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{e.emoji||"🍜"}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:14, color:t.tx, marginBottom:1 }}>{e.shopName}</div>
                      <div style={{ fontSize:11, color:t.txm, marginBottom:5 }}>{e.visitDate}　{e.menu}</div>
                      <Stars value={e.rating} readonly size={13}/>
                    </div>
                    <span style={{ color:t.txm, fontSize:16 }}>›</span>
                  </div>
                  {e.comment && <p style={{ margin:"9px 0 0", fontSize:12, color:t.tx2, lineHeight:1.55, borderLeft:`3px solid ${t.accm}`, paddingLeft:8 }}>{e.comment}</p>}
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:9, alignItems:"center" }}>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>{e.members?.map(m=><Badge key={m} t={t}>👤{m}</Badge>)}</div>
                    {e.price && <span style={{ fontSize:11, color:t.txm, fontWeight:600 }}>¥{e.price.toLocaleString()}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ランキングプレビュー */}
      <div style={{ padding:"16px 14px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontWeight:700, fontSize:14, color:t.tx }}>🏆 ラーメンランキング TOP5</span>
          <button onClick={()=>setTab(1)} style={{ background:"none", border:"none", cursor:"pointer", color:t.acc, fontSize:12, fontWeight:700, padding:0 }}>全部見る →</button>
        </div>
        {RAMEN_DB.slice(0,5).map((r,i)=>(
          <div key={r.id} onClick={()=>setTab(1)} style={{ background:t.card, border:`1px solid ${t.br}`, borderRadius:12, padding:"10px 13px", marginBottom:8, display:"flex", alignItems:"center", gap:12, cursor:"pointer", boxShadow:`0 2px 8px ${t.sh}` }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:i===0?"#FFD700":i===1?"#C0C0C0":i===2?"#CD7F32":t.bg2, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:i<3?13:12, color:i<3?"white":t.txm, flexShrink:0 }}>{i+1}</div>
            <span style={{ fontSize:22, flexShrink:0 }}>{r.emoji}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13, color:t.tx }}>{r.name}</div>
              <div style={{ fontSize:11, color:t.txm }}>{r.area} · {r.genre}</div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontSize:12, color:t.star, fontWeight:700 }}>★{r.score}</div>
              <div style={{ fontSize:10, color:t.txm }}>¥{r.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── おすすめ提案 ────────────────────────────────────────────
function RecommendPage() {
  const { entries, setRecoDetail, t } = useApp();
  const [axis,    setAxis]    = useState("rank");
  const [genre,   setGenre]   = useState("すべて");
  const [area,    setArea]    = useState("すべて");
  const [distIdx, setDistIdx] = useState(0);
  const [sortDir, setSortDir] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [list,    setList]    = useState(RAMEN_DB);
  const visitedNames = new Set(entries.map(e=>e.shopName));

  useEffect(()=>{
    setLoading(true);
    const t = setTimeout(()=>{
      let l = [...RAMEN_DB];
      if (genre !== "すべて") l = l.filter(r=>r.genre===genre);
      if (area  !== "すべて") l = l.filter(r=>r.area===area);
      l = l.filter(r=>r.dist <= DIST_OPTS[distIdx].max);
      if      (axis==="rank")     l.sort((a,b)=>a.rank-b.rank);
      else if (axis==="category") l.sort((a,b)=>a.genre.localeCompare(b.genre));
      else if (axis==="dist")     l.sort((a,b)=>sortDir==="asc"?a.dist-b.dist:b.dist-a.dist);
      else if (axis==="area")     l.sort((a,b)=>a.area.localeCompare(b.area));
      setList(l);
      setLoading(false);
    }, 280);
    return ()=>clearTimeout(t);
  },[axis, genre, area, distIdx, sortDir]);

  const AXES = [{ id:"rank",label:"🏆 ランキング" },{ id:"category",label:"🍜 カテゴリ" },{ id:"dist",label:"📍 距離" },{ id:"area",label:"🗾 地域" }];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:t.bg }}>
      <div style={{ flexShrink:0, padding:"8px 12px 0", background:t.bg, borderBottom:`1px solid ${t.br}` }}>
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:8 }}>
          {AXES.map(b=>(
            <button key={b.id} onClick={()=>setAxis(b.id)} style={{ flexShrink:0, padding:"6px 14px", borderRadius:20, border:"none", background:axis===b.id?t.acc:t.bg2, color:axis===b.id?"white":t.tx2, fontSize:12, fontWeight:700, cursor:"pointer", boxShadow:axis===b.id?`0 2px 8px ${t.sh}`:"none", transition:"all 0.2s" }}>{b.label}</button>
          ))}
        </div>
        <div style={{ paddingBottom:8 }}>
          {axis==="category" && <div style={{ display:"flex", gap:5, overflowX:"auto" }}>{GENRES.map(g=><Pill key={g} active={genre===g} onClick={()=>setGenre(g)} t={t} small>{g}</Pill>)}</div>}
          {axis==="dist" && (
            <div style={{ display:"flex", gap:5, overflowX:"auto", alignItems:"center" }}>
              {DIST_OPTS.map((d,i)=><Pill key={i} active={distIdx===i} onClick={()=>setDistIdx(i)} t={t} small>{d.label}</Pill>)}
              <button onClick={()=>setSortDir(v=>v==="asc"?"desc":"asc")} style={{ marginLeft:4, background:t.bg2, border:"none", borderRadius:16, padding:"3px 10px", fontSize:11, fontWeight:600, cursor:"pointer", color:t.tx2, whiteSpace:"nowrap" }}>{sortDir==="asc"?"近い順 ↑":"遠い順 ↓"}</button>
            </div>
          )}
          {axis==="area" && <div style={{ display:"flex", gap:5, overflowX:"auto" }}>{AREAS.map(a=><Pill key={a} active={area===a} onClick={()=>setArea(a)} t={t} small>{a}</Pill>)}</div>}
          {axis==="rank" && (
            <div style={{ display:"flex", gap:5 }}>
              <Pill active={genre==="すべて"} onClick={()=>setGenre("すべて")} t={t} small>総合</Pill>
              {["醤油","豚骨","塩","味噌","つけ麺"].map(g=><Pill key={g} active={genre===g} onClick={()=>setGenre(g)} t={t} small>{g}</Pill>)}
            </div>
          )}
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"10px 12px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontSize:12, color:t.txm }}>{loading?"検索中...":`${list.length}件`}</span>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#2ECC71" }} />
            <span style={{ fontSize:10, color:t.txm }}>未訪問</span>
            <div style={{ width:8, height:8, borderRadius:"50%", background:t.br, marginLeft:6 }} />
            <span style={{ fontSize:10, color:t.txm }}>訪問済</span>
          </div>
        </div>
        {loading ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"60px 0", gap:12 }}>
            <div style={{ fontSize:36 }}>🍜</div>
            <div style={{ fontSize:13, color:t.txm }}>ラーメンDBを検索中...</div>
          </div>
        ) : list.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>😢</div>
            <div style={{ fontWeight:700, fontSize:15, color:t.tx, marginBottom:6 }}>条件に合うお店が見つかりません</div>
            <div style={{ fontSize:12, color:t.txm }}>フィルターを変えてみてください</div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {list.map((r,i)=>{
              const visited = visitedNames.has(r.name);
              return (
                <div key={r.id} onClick={()=>setRecoDetail(r)} style={{ background:t.card, border:`1.5px solid ${visited?t.br:"#2ECC71"}`, borderRadius:14, overflow:"hidden", boxShadow:`0 2px 10px ${t.sh}`, cursor:"pointer", opacity:visited?0.75:1 }}>
                  <div style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                      <div style={{ width:44, height:44, borderRadius:12, background:axis==="rank"&&i<3?"linear-gradient(135deg,#FFD700,#FFA500)":t.accm, display:"flex", alignItems:"center", justifyContent:"center", fontSize:axis==="rank"&&i<3?18:26, fontWeight:700, color:axis==="rank"&&i<3?"white":"inherit", flexShrink:0 }}>
                        {axis==="rank"&&i<3 ? ["🥇","🥈","🥉"][i] : r.emoji}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                          <span style={{ fontWeight:700, fontSize:14, color:t.tx }}>{r.name}</span>
                          {visited && <span style={{ fontSize:9, fontWeight:700, color:t.txm, background:t.bg2, padding:"1px 6px", borderRadius:10 }}>訪問済</span>}
                          {!visited && <span style={{ fontSize:9, fontWeight:700, color:"#2ECC71", background:"#EAFAF1", padding:"1px 6px", borderRadius:10 }}>未訪問</span>}
                        </div>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
                          <span style={{ fontSize:11, color:t.txm }}>{r.area}</span>
                          <span style={{ fontSize:10, color:t.acc, background:t.accm, padding:"1px 7px", borderRadius:10, fontWeight:600 }}>{r.genre}</span>
                          <span style={{ fontSize:11, color:t.txm }}>📍{r.dist<1?`${Math.round(r.dist*1000)}m`:`${r.dist}km`}</span>
                        </div>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0 }}>
                        <div style={{ fontSize:13, color:t.star, fontWeight:700 }}>★{r.score}</div>
                        <div style={{ fontSize:11, color:t.txm }}>¥{r.price}</div>
                        {axis==="rank" && <div style={{ fontSize:10, color:t.txm, marginTop:2 }}>#{r.rank}</div>}
                      </div>
                    </div>
                    <p style={{ margin:"8px 0 0", fontSize:12, color:t.tx2, lineHeight:1.5 }}>{r.desc}</p>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginTop:7 }}>
                      {r.tags.map(tag=><span key={tag} style={{ fontSize:10, color:t.txm, background:t.bg2, padding:"2px 8px", borderRadius:20 }}>#{tag}</span>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ height:16 }} />
      </div>
    </div>
  );
}

// ─── RecoDetailSheet ─────────────────────────────────────────
function RecoDetailSheet() {
  const { recoDetail, setRecoDetail, setShowPost, setEditEntry, entries, t } = useApp();
  if (!recoDetail) return null;
  const r = recoDetail;
  const visited = entries.some(e=>e.shopName===r.name);
  const goPost = () => { setEditEntry(null); setShowPost(true); setRecoDetail(null); };
  return (
    <>
      <div onClick={()=>setRecoDetail(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200 }} />
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:t.card, borderRadius:"20px 20px 0 0", padding:"0 18px 32px", zIndex:201, maxHeight:"88vh", overflowY:"auto" }}>
        <div style={{ width:36, height:4, background:t.br, borderRadius:2, margin:"11px auto 16px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
          <div style={{ display:"flex", gap:12, flex:1 }}>
            <div style={{ width:56, height:56, borderRadius:14, background:t.accm, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, flexShrink:0 }}>{r.emoji}</div>
            <div>
              <div style={{ fontWeight:700, fontSize:19, color:t.tx, marginBottom:4 }}>{r.name}</div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <span style={{ fontSize:13, color:t.star, fontWeight:700 }}>★{r.score}</span>
                <span style={{ fontSize:11, color:t.acc, background:t.accm, padding:"2px 8px", borderRadius:10, fontWeight:600 }}>{r.genre}</span>
                {visited ? <span style={{ fontSize:10, color:t.txm, background:t.bg2, padding:"2px 7px", borderRadius:10 }}>✅ 訪問済</span>
                         : <span style={{ fontSize:10, color:"#2ECC71", background:"#EAFAF1", padding:"2px 7px", borderRadius:10 }}>未訪問</span>}
              </div>
            </div>
          </div>
          <button onClick={()=>setRecoDetail(null)} style={{ background:"none", border:"none", cursor:"pointer", color:t.txm, fontSize:20 }}>✕</button>
        </div>
        <div style={{ background:t.bg2, borderRadius:12, padding:"12px 14px", marginBottom:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div><div style={{ fontSize:10, color:t.txm }}>📍 エリア</div><div style={{ fontWeight:600, fontSize:13, color:t.tx }}>{r.area}</div></div>
          <div><div style={{ fontSize:10, color:t.txm }}>🚶 距離</div><div style={{ fontWeight:600, fontSize:13, color:t.tx }}>{r.dist<1?`${Math.round(r.dist*1000)}m`:`${r.dist}km`}</div></div>
          <div><div style={{ fontSize:10, color:t.txm }}>💴 価格帯</div><div style={{ fontWeight:600, fontSize:13, color:t.tx }}>¥{r.price}〜</div></div>
          <div><div style={{ fontSize:10, color:t.txm }}>🏆 ランク</div><div style={{ fontWeight:600, fontSize:13, color:t.tx }}>#{r.rank}</div></div>
        </div>
        <p style={{ fontSize:13, color:t.tx2, lineHeight:1.7, marginBottom:12 }}>{r.desc}</p>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:18 }}>
          {r.tags.map(tag=><span key={tag} style={{ fontSize:11, color:t.txm, background:t.bg2, padding:"3px 10px", borderRadius:20 }}>#{tag}</span>)}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setRecoDetail(null)} style={{ flex:1, padding:"12px", borderRadius:11, border:`1.5px solid ${t.br}`, background:t.bg2, color:t.tx, fontWeight:600, cursor:"pointer" }}>閉じる</button>
          <button onClick={goPost} style={{ flex:2, padding:"12px", borderRadius:11, border:"none", background:t.grad, color:"white", fontWeight:700, cursor:"pointer" }}>{visited?"📝 再訪問を記録":"🍜 行ってきた！記録する"}</button>
        </div>
      </div>
    </>
  );
}

// ─── マップ ─────────────────────────────────────────────────
function MapPage() {
  const { entries, setDetail, settings, t } = useApp();
  const [filter, setFilter] = useState("all");
  const [sel, setSel] = useState(null);
  const filtered = entries.filter(e=>filter==="high"?e.rating>=4:filter==="group"?e.visibility==="group":true);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:t.bg }}>
      <div style={{ flexShrink:0, padding:"8px 14px", display:"flex", gap:6, borderBottom:`1px solid ${t.br}`, background:t.bg }}>
        {[["all","すべて"],["high","高評価"],["group","グループ"]].map(([v,l])=>(
          <Pill key={v} active={filter===v} onClick={()=>setFilter(v)} t={t} small>{l}</Pill>
        ))}
      </div>
      {/* MAPエリア */}
      <div style={{ flexShrink:0, margin:"10px 12px", borderRadius:14, overflow:"hidden", background:t.bg2, border:`1px solid ${t.br}`, position:"relative", height:210 }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${t.br} 1px,transparent 1px),linear-gradient(90deg,${t.br} 1px,transparent 1px)`, backgroundSize:"32px 32px", opacity:0.55 }} />
        <div style={{ position:"absolute", top:"43%", left:0, right:0, height:3, background:t.br, opacity:.7 }} />
        <div style={{ position:"absolute", left:"42%", top:0, bottom:0, width:3, background:t.br, opacity:.7 }} />
        <div style={{ position:"absolute", left:"41%", top:"41%", background:t.acc, color:"white", borderRadius:6, padding:"2px 6px", fontSize:9, fontWeight:700, transform:"translate(-50%,-50%)" }}>🚉</div>
        {filtered.map((e,i)=>(
          <button key={e.id} onClick={()=>setSel(sel?.id===e.id?null:e)}
            style={{ position:"absolute", left:PIN_POS[i%PIN_POS.length].l, top:PIN_POS[i%PIN_POS.length].t, background:rc(e.rating), border:"2.5px solid white", borderRadius:16, padding:"2px 8px", color:"white", fontSize:10, fontWeight:700, cursor:"pointer", boxShadow:"0 2px 6px rgba(0,0,0,.28)", transform:sel?.id===e.id?"scale(1.22) translateY(-4px)":"scale(1)", transition:"transform 0.18s" }}>
            📍{e.shopName.slice(0,4)}
          </button>
        ))}
        <div style={{ position:"absolute", bottom:7, left:7, right:7, background:"rgba(0,0,0,.72)", borderRadius:8, padding:"5px 9px", color:"white", fontSize:10, textAlign:"center" }}>
          {settings.mapsApiKey ? "Google Maps 接続中 ✓" : "🔑 設定でAPIキーを入力するとリアルMAPに切替"}
        </div>
      </div>
      {sel && (
        <div onClick={()=>setDetail(sel)} style={{ flexShrink:0, margin:"0 12px 8px", background:t.card, border:`1px solid ${t.br}`, borderRadius:14, cursor:"pointer", boxShadow:`0 2px 10px ${t.sh}` }}>
          <div style={{ padding:"11px 13px", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:t.accm, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{sel.emoji||"🍜"}</div>
            <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:13, color:t.tx }}>{sel.shopName}</div><Stars value={sel.rating} readonly size={12}/></div>
            <span style={{ color:t.txm }}>›</span>
          </div>
        </div>
      )}
      <div style={{ flex:1, overflowY:"auto", padding:"0 12px 10px", display:"flex", flexDirection:"column", gap:7 }}>
        {filtered.map(e=>(
          <div key={e.id} onClick={()=>setSel(sel?.id===e.id?null:e)} style={{ background:t.card, border:sel?.id===e.id?`2px solid ${t.acc}`:`1px solid ${t.br}`, borderRadius:12, cursor:"pointer" }}>
            <div style={{ padding:"11px 13px", display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:rc(e.rating), flexShrink:0 }} />
              <span style={{ fontWeight:600, fontSize:13, flex:1, color:t.tx }}>{e.shopName}</span>
              <Stars value={e.rating} readonly size={11}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── アルバム ────────────────────────────────────────────────
function AlbumPage() {
  const { entries, setDetail, t } = useApp();
  const [mode, setMode] = useState("shop");
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:t.bg }}>
      <div style={{ flexShrink:0, padding:"8px 14px", display:"flex", gap:6, borderBottom:`1px solid ${t.br}`, background:t.bg }}>
        {[["shop","店舗別"],["grid","グリッド"]].map(([v,l])=>(
          <Pill key={v} active={mode===v} onClick={()=>setMode(v)} t={t}>{l}</Pill>
        ))}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"12px" }}>
        {mode==="shop" ? (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {entries.map((e,i)=>(
              <div key={e.id} onClick={()=>setDetail(e)} style={{ background:t.card, border:`1px solid ${t.br}`, borderRadius:14, overflow:"hidden", cursor:"pointer", boxShadow:`0 2px 10px ${t.sh}` }}>
                <div style={{ height:88, background:PALETTES[i%PALETTES.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:38, position:"relative" }}>
                  {e.emoji||"🍜"}
                  <div style={{ position:"absolute", bottom:4, right:4, background:"rgba(0,0,0,.46)", borderRadius:8, padding:"1px 5px", color:"white", fontSize:9 }}>📷0枚</div>
                </div>
                <div style={{ padding:"8px 10px" }}>
                  <div style={{ fontWeight:700, fontSize:12, color:t.tx, marginBottom:1 }}>{e.shopName}</div>
                  <div style={{ fontSize:10, color:t.txm }}>{e.visitDate}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:3 }}>
            {entries.map((e,i)=>(
              <div key={e.id} onClick={()=>setDetail(e)} style={{ aspectRatio:"1", background:PALETTES[i%PALETTES.length], borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, cursor:"pointer" }}>{e.emoji||"🍜"}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── マイページ ──────────────────────────────────────────────
function MyPage() {
  const { entries, groups, addGroup, setTab, t } = useApp();
  const [showC, setShowC] = useState(false);
  const [gname, setGname] = useState("");
  const [gemoji, setGemoji] = useState("🍜");
  const avg = entries.length ? (entries.reduce((a,b)=>a+(b.rating||0),0)/entries.length).toFixed(1) : "—";
  const top = Object.entries(entries.reduce((acc,e)=>{acc[e.shopName]=(acc[e.shopName]||0)+1;return acc},{})).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—";
  const doCreate = () => { if(!gname.trim()) return; addGroup({name:gname.trim(),emoji:gemoji}); setGname(""); setGemoji("🍜"); setShowC(false); };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:t.bg }}>
      <div style={{ flexShrink:0, background:t.grad, padding:"12px 16px 14px", display:"flex", alignItems:"center", gap:12, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-16, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
        <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(255,255,255,0.22)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>😊</div>
        <div style={{ flex:1 }}>
          <div style={{ color:"white", fontWeight:700, fontSize:18, fontFamily:"Georgia,serif" }}>あなた</div>
          <div style={{ color:"rgba(255,255,255,0.75)", fontSize:11 }}>ラーメン愛好家 🍜</div>
        </div>
        <button onClick={()=>setTab(5)} style={{ background:"rgba(255,255,255,0.22)", border:"none", borderRadius:"50%", width:34, height:34, color:"white", fontSize:15, cursor:"pointer" }}>⚙️</button>
      </div>
      <div style={{ flexShrink:0, padding:"10px 12px", borderBottom:`1px solid ${t.br}`, background:t.bg }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:8 }}>
          {[["🏪","訪問",entries.length],["📅","今月",entries.filter(e=>e.visitDate?.startsWith(new Date().toISOString().slice(0,7))).length],["⭐","平均",avg+"★"]].map(([em,l,v])=>(
            <div key={l} style={{ background:t.card, border:`1px solid ${t.br}`, borderRadius:12, padding:"10px 6px", textAlign:"center", boxShadow:`0 2px 8px ${t.sh}` }}>
              <div style={{ fontSize:18, marginBottom:2 }}>{em}</div>
              <div style={{ fontWeight:700, fontSize:16, color:t.acc }}>{v}</div>
              <div style={{ fontSize:10, color:t.txm }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ background:t.card, border:`1px solid ${t.br}`, borderRadius:12, padding:"10px 13px", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:16 }}>🏆</span>
          <div><div style={{ fontSize:10, color:t.txm }}>よく行くお店</div><div style={{ fontWeight:700, fontSize:13, color:t.tx }}>{top}</div></div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"10px 12px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontSize:11, fontWeight:700, color:t.txm, letterSpacing:"0.06em" }}>👥 グループ</span>
          <button onClick={()=>setShowC(!showC)} style={{ background:t.accm, border:"none", borderRadius:16, padding:"4px 11px", color:t.acc, fontSize:11, fontWeight:600, cursor:"pointer" }}>＋ 作成</button>
        </div>
        {showC && (
          <div style={{ background:t.card, border:`1px solid ${t.br}`, borderRadius:14, padding:"14px", marginBottom:12, boxShadow:`0 2px 10px ${t.sh}` }}>
            <div style={{ fontWeight:700, fontSize:13, color:t.tx, marginBottom:8 }}>新しいグループ</div>
            <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
              {["🍜","🍖","🌶️","🏆","⭐","🔥"].map(e=>(
                <button key={e} onClick={()=>setGemoji(e)} style={{ width:34, height:34, borderRadius:8, border:"none", background:gemoji===e?t.accm:t.bg2, fontSize:18, cursor:"pointer", outline:gemoji===e?`2px solid ${t.acc}`:"none" }}>{e}</button>
              ))}
            </div>
            <input value={gname} onChange={e=>setGname(e.target.value)} placeholder="グループ名" onKeyDown={e=>e.key==="Enter"&&doCreate()}
              style={{ width:"100%", padding:"10px 13px", background:t.bg2, border:`1.5px solid ${t.br}`, borderRadius:11, fontSize:14, color:t.tx, outline:"none", marginBottom:8, boxSizing:"border-box" }} />
            <div style={{ display:"flex", gap:7 }}>
              <button onClick={()=>setShowC(false)} style={{ flex:1, padding:"11px", borderRadius:11, border:`1.5px solid ${t.br}`, background:t.bg2, color:t.tx, fontWeight:600, cursor:"pointer" }}>キャンセル</button>
              <button onClick={doCreate} style={{ flex:1, padding:"11px", borderRadius:11, border:"none", background:t.grad, color:"white", fontWeight:700, cursor:"pointer" }}>作成</button>
            </div>
          </div>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {groups.map(g=>(
            <div key={g.id} style={{ background:t.card, border:`1px solid ${t.br}`, borderRadius:14, overflow:"hidden", boxShadow:`0 2px 10px ${t.sh}` }}>
              <div style={{ padding:"12px 13px", display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:t.accm, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{g.emoji}</div>
                <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:13, color:t.tx }}>{g.name}</div><div style={{ fontSize:11, color:t.txm }}>{g.members.length}人</div></div>
                <button style={{ background:t.bg2, border:"none", borderRadius:7, padding:"4px 9px", cursor:"pointer", color:t.tx2, fontSize:11, fontWeight:600 }}>📤招待</button>
              </div>
              <div style={{ padding:"0 12px 10px", display:"flex", gap:4, flexWrap:"wrap" }}>
                {g.members.map(m=><Badge key={m} t={t}>{m}</Badge>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 設定 ────────────────────────────────────────────────────
const THEME_LIST = [
  { id:"warm",  label:"暖色",  emoji:"🔥", desc:"温かみ" },
  { id:"dark",  label:"ダーク",emoji:"🌙", desc:"夜向け" },
  { id:"cool",  label:"寒色",  emoji:"❄️", desc:"ブルー" },
  { id:"season",label:"季節",  emoji:"🍃", desc:"グリーン" },
];
function SettingsPage() {
  const { settings, setSettings, t } = useApp();
  const [pg, setPg] = useState(0);
  const [apiKeyDraft, setApiKeyDraft] = useState(settings.mapsApiKey || "");
  const swipe = useSwipe(3, pg, setPg);
  const upd = (k,v) => setSettings(s=>({...s,[k]:v}));

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:t.bg }}>
      <div style={{ flexShrink:0, padding:"8px 14px", display:"flex", gap:5, borderBottom:`1px solid ${t.br}`, background:t.bg }}>
        {["外観","通知","アカウント"].map((label,i)=>(
          <button key={label} onClick={()=>setPg(i)} style={{ flex:1, padding:"7px 4px", borderRadius:9, border:"none", background:pg===i?t.acc:t.bg2, color:pg===i?"white":t.tx2, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s" }}>{label}</button>
        ))}
      </div>
      <Dots count={3} current={pg} t={t} />
      <div style={{ flex:1, overflow:"hidden", position:"relative" }} {...swipe}>
        <div style={{ display:"flex", height:"100%", transition:"transform 0.32s cubic-bezier(0.4,0,0.2,1)", transform:`translateX(${-pg*100}%)` }}>
          {/* 外観 */}
          <div style={{ flexShrink:0, width:"100%", height:"100%", overflowY:"auto", padding:"10px 14px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:t.txm, marginBottom:8 }}>テーマカラー</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:16 }}>
              {THEME_LIST.map(th=>(
                <button key={th.id} onClick={()=>upd("theme",th.id)} style={{ padding:"12px 10px", borderRadius:12, border:settings.theme===th.id?`2.5px solid ${t.acc}`:`1.5px solid ${t.br}`, background:settings.theme===th.id?t.accm:t.card, cursor:"pointer", textAlign:"left", transition:"all 0.2s" }}>
                  <div style={{ fontSize:24, marginBottom:4 }}>{th.emoji}</div>
                  <div style={{ fontWeight:700, fontSize:13, color:t.tx, marginBottom:1 }}>{th.label}</div>
                  <div style={{ fontSize:10, color:t.txm }}>{th.desc}</div>
                </button>
              ))}
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:t.txm, marginBottom:8 }}>Google Maps APIキー</div>
            <input placeholder="AIza..." value={apiKeyDraft} onChange={e=>setApiKeyDraft(e.target.value)}
              style={{ width:"100%", padding:"10px 13px", background:t.bg2, border:`1.5px solid ${t.br}`, borderRadius:11, fontSize:14, color:t.tx, outline:"none", marginBottom:8, boxSizing:"border-box" }} />
            <button onClick={()=>upd("mapsApiKey",apiKeyDraft)} style={{ width:"100%", padding:"12px", borderRadius:11, border:"none", background:t.grad, color:"white", fontWeight:700, fontSize:14, cursor:"pointer" }}>APIキーを保存</button>
            <p style={{ fontSize:10, color:t.txm, marginTop:8, lineHeight:1.6, textAlign:"center" }}>
              Google Cloud Console で Maps JavaScript API・Places API を有効化してください
            </p>
          </div>
          {/* 通知 */}
          <div style={{ flexShrink:0, width:"100%", height:"100%", overflowY:"auto", padding:"10px 14px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:t.txm, marginBottom:8 }}>プッシュ通知</div>
            {[["notifyGroup","グループ投稿","メンバーが投稿した時"],["notifyRecommend","おすすめ通知","おすすめが届いた時"],["notifyInvite","招待通知","招待された時"]].map(([k,l,d])=>(
              <div key={k} style={{ background:t.card, border:`1px solid ${t.br}`, borderRadius:12, padding:"13px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ flex:1 }}><div style={{ fontWeight:600, fontSize:13, color:t.tx }}>{l}</div><div style={{ fontSize:11, color:t.txm }}>{d}</div></div>
                <div onClick={()=>upd(k,!settings[k])} style={{ width:44, height:25, borderRadius:13, background:settings[k]?t.acc:t.br, position:"relative", cursor:"pointer", transition:"background 0.3s", flexShrink:0 }}>
                  <div style={{ position:"absolute", top:2.5, left:settings[k]?21.5:2.5, width:20, height:20, borderRadius:"50%", background:"white", transition:"left 0.3s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize:11, fontWeight:700, color:t.txm, marginBottom:8, marginTop:14 }}>通知頻度</div>
            {[["daily","毎日"],["weekly","週1回"],["monthly","月1回"]].map(([v,l])=>(
              <button key={v} onClick={()=>upd("notifyFreq",v)} style={{ width:"100%", padding:"10px 13px", borderRadius:10, border:settings.notifyFreq===v?`2px solid ${t.acc}`:`1.5px solid ${t.br}`, background:settings.notifyFreq===v?t.accm:t.card, display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", marginBottom:6 }}>
                <span style={{ fontWeight:600, fontSize:13, color:t.tx }}>{l}</span>
                {settings.notifyFreq===v && <span style={{ color:t.acc }}>✓</span>}
              </button>
            ))}
          </div>
          {/* アカウント */}
          <div style={{ flexShrink:0, width:"100%", height:"100%", overflowY:"auto", padding:"10px 14px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:t.txm, marginBottom:8 }}>プロフィール</div>
            <div style={{ background:t.card, border:`1px solid ${t.br}`, borderRadius:12, marginBottom:14 }}>
              {[["ユーザー名","あなた"],["メール","user@example.com"],["自己紹介","ラーメン大好き！"]].map(([l,v])=>(
                <div key={l} style={{ padding:"12px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${t.br}` }}>
                  <div><div style={{ fontSize:10, color:t.txm }}>{l}</div><div style={{ fontWeight:600, fontSize:13, color:t.tx }}>{v}</div></div>
                  <span style={{ color:t.txm }}>›</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:t.txm, marginBottom:8 }}>データ管理</div>
            <button onClick={()=>{ if(window.confirm("すべてのデータをリセットしますか？")) { localStorage.clear(); window.location.reload(); }}} style={{ width:"100%", padding:"12px", borderRadius:11, border:"1.5px solid #FADBD8", background:"#FFF5F5", color:"#E74C3C", fontWeight:600, fontSize:14, cursor:"pointer", marginBottom:8 }}>
              🗑️ データをリセット
            </button>
            <button style={{ width:"100%", padding:"12px", borderRadius:11, border:`1.5px solid ${t.br}`, background:t.bg2, color:t.tx, fontWeight:600, fontSize:14, cursor:"pointer" }}>🚪 ログアウト</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 投稿シート ──────────────────────────────────────────────
const INIT_F = { shopName:"", visitDate:new Date().toISOString().slice(0,10), menu:"", price:"", rating:0, comment:"", review:"", members:[], visibility:"group", emoji:"🍜" };
function PostSheet() {
  const { showPost, setShowPost, editEntry, setEditEntry, addEntry, updateEntry, groups, t } = useApp();
  const [pg, setPg] = useState(0);
  const [form, setForm] = useState(INIT_F);
  const [err, setErr] = useState({});
  const goNext = () => {
    const e = {};
    if (!form.shopName.trim()) e.shopName = "店舗名は必須です";
    if (!form.rating) e.rating = "評価を選択してください";
    setErr(e);
    if (!Object.keys(e).length) setPg(1);
  };
  const swipe = useSwipe(2, pg, p => { if(p===1) goNext(); else setPg(0); });
  useEffect(()=>{ if(editEntry) setForm({...INIT_F,...editEntry,price:editEntry.price||""}); else setForm({...INIT_F,visitDate:new Date().toISOString().slice(0,10)}); setPg(0); setErr({}); },[editEntry, showPost]);
  if (!showPost) return null;
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const allM = [...new Set(groups.flatMap(g=>g.members).filter(m=>m!=="あなた"))];
  const togM = m => set("members", form.members.includes(m)?form.members.filter(x=>x!==m):[...form.members,m]);
  const submit = () => { const d={...form,price:form.price?Number(form.price):null}; if(editEntry) updateEntry(editEntry.id,d); else addEntry(d); setShowPost(false); setEditEntry(null); };
  const close = () => { setShowPost(false); setEditEntry(null); };
  const inp = { width:"100%", padding:"10px 13px", background:t.bg2, border:`1.5px solid ${t.br}`, borderRadius:11, fontSize:14, color:t.tx, outline:"none", boxSizing:"border-box" };

  return (
    <>
      <div onClick={close} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200 }} />
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:t.card, borderRadius:"20px 20px 0 0", padding:"0 18px 28px", zIndex:201, maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ width:36, height:4, background:t.br, borderRadius:2, margin:"11px auto 16px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <h2 style={{ fontWeight:700, fontSize:16, color:t.tx, margin:0 }}>{editEntry?"日記を編集":"🍜 ラーメン日記を書く"}</h2>
          <button onClick={close} style={{ background:"none", border:"none", cursor:"pointer", color:t.txm, fontSize:18 }}>✕</button>
        </div>
        <Dots count={2} current={pg} t={t} />
        <div style={{ overflow:"hidden", marginTop:8 }} {...swipe}>
          <div style={{ display:"flex", transition:"transform 0.32s cubic-bezier(0.4,0,0.2,1)", transform:`translateX(${-pg*100}%)` }}>
            {/* Page 0 */}
            <div style={{ flexShrink:0, width:"100%", minWidth:0 }}>
              <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:12 }}>
                {EMOJIS.map(e=><button key={e} onClick={()=>set("emoji",e)} style={{ width:36, height:36, borderRadius:8, border:"none", flexShrink:0, background:form.emoji===e?t.accm:t.bg2, fontSize:18, cursor:"pointer", outline:form.emoji===e?`2px solid ${t.acc}`:"none" }}>{e}</button>)}
              </div>
              <div style={{ marginBottom:9 }}>
                <label style={{ fontSize:11, fontWeight:700, color:t.txm, display:"block", marginBottom:4 }}>店舗名 <span style={{ color:t.acc }}>*</span></label>
                <input style={inp} placeholder="例：麺屋 蒼龍" value={form.shopName} onChange={e=>set("shopName",e.target.value)}/>
                {err.shopName && <p style={{ color:t.acc, fontSize:10, marginTop:2 }}>{err.shopName}</p>}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:9 }}>
                <div><label style={{ fontSize:11, fontWeight:700, color:t.txm, display:"block", marginBottom:4 }}>訪問日 *</label><input type="date" style={inp} value={form.visitDate} onChange={e=>set("visitDate",e.target.value)}/></div>
                <div><label style={{ fontSize:11, fontWeight:700, color:t.txm, display:"block", marginBottom:4 }}>価格（円）</label><input type="number" style={inp} placeholder="1200" value={form.price} onChange={e=>set("price",e.target.value)}/></div>
              </div>
              <div style={{ marginBottom:9 }}>
                <label style={{ fontSize:11, fontWeight:700, color:t.txm, display:"block", marginBottom:4 }}>注文メニュー</label>
                <input style={inp} placeholder="例：特製醤油ラーメン" value={form.menu} onChange={e=>set("menu",e.target.value)}/>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:t.txm, display:"block", marginBottom:6 }}>評価 <span style={{ color:t.acc }}>*</span></label>
                <Stars value={form.rating} onChange={v=>set("rating",v)} size={32}/>
                {err.rating && <p style={{ color:t.acc, fontSize:10, marginTop:2 }}>{err.rating}</p>}
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:t.txm, display:"block", marginBottom:6 }}>一緒に行ったメンバー</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {allM.map(m=><button key={m} onClick={()=>togM(m)} style={{ padding:"4px 11px", borderRadius:16, border:"none", background:form.members.includes(m)?t.acc:t.bg2, color:form.members.includes(m)?"white":t.tx2, fontSize:11, fontWeight:600, cursor:"pointer" }}>👤{m}</button>)}
                </div>
              </div>
              <button onClick={goNext} style={{ width:"100%", padding:"12px", borderRadius:11, border:"none", background:t.grad, color:"white", fontWeight:700, fontSize:14, cursor:"pointer" }}>次へ：写真・コメント →</button>
            </div>
            {/* Page 1 */}
            <div style={{ flexShrink:0, width:"100%", minWidth:0 }}>
              <div style={{ marginBottom:11 }}>
                <label style={{ fontSize:11, fontWeight:700, color:t.txm, display:"block", marginBottom:6 }}>写真（実装時：Firebase Storage連携）</label>
                <div style={{ border:`2px dashed ${t.br}`, borderRadius:12, padding:"18px", textAlign:"center", background:t.bg2 }}>
                  <div style={{ fontSize:26, marginBottom:4 }}>📷</div>
                  <p style={{ fontSize:12, color:t.txm, margin:0 }}>タップして写真を追加</p>
                </div>
              </div>
              <div style={{ marginBottom:9 }}>
                <label style={{ fontSize:11, fontWeight:700, color:t.txm, display:"block", marginBottom:4 }}>一言コメント</label>
                <input style={inp} placeholder="例：替え玉2回してしまった笑" value={form.comment} onChange={e=>set("comment",e.target.value)} maxLength={60}/>
                <div style={{ fontSize:10, color:t.txm, textAlign:"right", marginTop:1 }}>{form.comment.length}/60</div>
              </div>
              <div style={{ marginBottom:11 }}>
                <label style={{ fontSize:11, fontWeight:700, color:t.txm, display:"block", marginBottom:4 }}>詳細レビュー（任意）</label>
                <textarea style={{ ...inp, minHeight:82, resize:"none" }} placeholder="スープの濃さ、麺の硬さ..." value={form.review} onChange={e=>set("review",e.target.value)}/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:t.txm, display:"block", marginBottom:6 }}>公開設定</label>
                <div style={{ display:"flex", gap:6 }}>
                  {[["private","🔒 非公開"],["group","👥 グループ"],["public","🌐 公開"]].map(([v,l])=>(
                    <button key={v} onClick={()=>set("visibility",v)} style={{ flex:1, padding:"7px 2px", borderRadius:9, border:"none", background:form.visibility===v?t.acc:t.bg2, color:form.visibility===v?"white":t.tx2, fontSize:11, fontWeight:600, cursor:"pointer" }}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", gap:7 }}>
                <button onClick={()=>setPg(0)} style={{ flex:1, padding:"12px", borderRadius:11, border:`1.5px solid ${t.br}`, background:t.bg2, color:t.tx, fontWeight:600, cursor:"pointer" }}>← 戻る</button>
                <button onClick={submit} style={{ flex:2, padding:"12px", borderRadius:11, border:"none", background:t.grad, color:"white", fontWeight:700, cursor:"pointer" }}>{editEntry?"更新 ✓":"投稿する 🍜"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── 日記詳細シート ──────────────────────────────────────────
function EntryDetail() {
  const { detail, setDetail, deleteEntry, setEditEntry, setShowPost, t } = useApp();
  if (!detail) return null;
  const e = detail;
  const vis = { private:"🔒 非公開", group:"👥 グループ", public:"🌐 公開" }[e.visibility]||"";
  const handleEdit = () => { setEditEntry(e); setDetail(null); setShowPost(true); };
  const handleDel  = () => { if(window.confirm(`「${e.shopName}」を削除しますか？`)) { deleteEntry(e.id); setDetail(null); } };
  return (
    <>
      <div onClick={()=>setDetail(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200 }} />
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:t.card, borderRadius:"20px 20px 0 0", padding:"0 18px 28px", zIndex:201, maxHeight:"88vh", overflowY:"auto" }}>
        <div style={{ width:36, height:4, background:t.br, borderRadius:2, margin:"11px auto 16px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ width:48, height:48, borderRadius:12, background:t.accm, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>{e.emoji||"🍜"}</div>
            <div>
              <div style={{ fontWeight:700, fontSize:18, color:t.tx, marginBottom:3 }}>{e.shopName}</div>
              <Stars value={e.rating} readonly size={14}/>
            </div>
          </div>
          <button onClick={()=>setDetail(null)} style={{ background:"none", border:"none", cursor:"pointer", color:t.txm, fontSize:18 }}>✕</button>
        </div>
        <div style={{ background:t.bg2, borderRadius:10, padding:"10px 12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:11 }}>
          <div><div style={{ fontSize:10, color:t.txm }}>📅 訪問日</div><div style={{ fontWeight:600, fontSize:13, color:t.tx }}>{e.visitDate}</div></div>
          {e.price && <div><div style={{ fontSize:10, color:t.txm }}>💴 価格</div><div style={{ fontWeight:600, fontSize:13, color:t.tx }}>¥{e.price.toLocaleString()}</div></div>}
          {e.menu && <div style={{ gridColumn:"1/-1" }}><div style={{ fontSize:10, color:t.txm }}>🍜 注文</div><div style={{ fontWeight:600, fontSize:13, color:t.tx }}>{e.menu}</div></div>}
        </div>
        {e.members?.length>0 && (
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:10 }}>
            {e.members.map(m=><Badge key={m} t={t}>👤{m}</Badge>)}
            <Badge t={t} style={{ background:t.bg2, color:t.txm }}>{vis}</Badge>
          </div>
        )}
        {e.comment && <div style={{ background:t.accm, borderRadius:10, padding:"10px 12px", marginBottom:10, borderLeft:`3px solid ${t.acc}` }}><p style={{ fontSize:12, lineHeight:1.6, fontStyle:"italic", color:t.tx, margin:0 }}>「{e.comment}」</p></div>}
        {e.review && <div style={{ marginBottom:12 }}><div style={{ fontSize:11, fontWeight:700, color:t.txm, marginBottom:5 }}>📝 レビュー</div><p style={{ fontSize:12, color:t.tx2, lineHeight:1.7, margin:0 }}>{e.review}</p></div>}
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={handleEdit} style={{ flex:1, padding:"12px", borderRadius:11, border:`1.5px solid ${t.br}`, background:t.bg2, color:t.tx, fontWeight:600, cursor:"pointer" }}>✏️ 編集</button>
          <button onClick={handleDel}  style={{ flex:1, padding:"12px", borderRadius:11, border:"1.5px solid #FADBD8", background:"#FFF5F5", color:"#E74C3C", fontWeight:600, cursor:"pointer" }}>🗑️ 削除</button>
        </div>
      </div>
    </>
  );
}

// ─── タブ定義 ────────────────────────────────────────────────
const TABS = [
  { icon:"🏠", label:"ホーム",    title:"🍜 ラーメン日記", Page:HomePage      },
  { icon:"🔥", label:"おすすめ",  title:"🔥 おすすめ提案", Page:RecommendPage },
  { icon:"🗺️", label:"マップ",   title:"🗺️ ラーメンMAP",  Page:MapPage       },
  { icon:"📷", label:"アルバム",  title:"📷 アルバム",      Page:AlbumPage     },
  { icon:"👤", label:"マイページ",title:"👤 マイページ",    Page:MyPage        },
];

// ─── AppCore ────────────────────────────────────────────────
function AppCore() {
  const { tab, setTab, settings, setShowPost, t } = useApp();
  const isSettings = tab === 5;
  const mainSwipe = useSwipe(5, isSettings?0:tab, idx=>{ if(idx>=0&&idx<=4) setTab(idx); });

  return (
    <div style={{ display:"flex", flexDirection:"column", width:"100%", height:"100%", background:t.bg, fontFamily:"'Noto Sans JP',system-ui,sans-serif", overflow:"hidden" }}>

      {/* ヘッダー */}
      <div style={{ flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px", height:52, background:t.bg, borderBottom:`1px solid ${t.br}`, zIndex:20 }}>
        {isSettings
          ? <button onClick={()=>setTab(4)} style={{ background:"none", border:"none", cursor:"pointer", color:t.tx, fontSize:22, lineHeight:1, padding:"2px 4px" }}>‹</button>
          : <div style={{ width:28 }}/>}
        <h1 style={{ fontFamily:"Georgia,serif", fontSize:18, fontWeight:700, color:t.tx, margin:0 }}>
          {isSettings ? "⚙️ 設定" : TABS[tab]?.title}
        </h1>
        {isSettings
          ? <div style={{ width:28 }}/>
          : <button onClick={()=>setShowPost(true)} style={{ background:t.grad, border:"none", borderRadius:8, padding:"5px 12px", color:"white", fontSize:12, fontWeight:700, cursor:"pointer" }}>＋ 投稿</button>}
      </div>

      {/* コンテンツ（スワイプ対応） */}
      <div style={{ flex:1, minHeight:0, overflow:"hidden", position:"relative" }} {...(!isSettings?mainSwipe:{})}>
        {isSettings ? <SettingsPage/> : (
          <div style={{ display:"flex", height:"100%", transition:"transform 0.32s cubic-bezier(0.4,0,0.2,1)", transform:`translateX(${-tab*100}%)` }}>
            {TABS.map(({ Page },i) => (
              <div key={i} style={{ flexShrink:0, width:"100%", height:"100%", overflow:"hidden" }}>
                <Page/>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* フッターナビ */}
      {!isSettings && (
        <div style={{ flexShrink:0, display:"flex", background:t.card, borderTop:`1px solid ${t.br}`, boxShadow:`0 -3px 14px ${t.sh}`, zIndex:20 }}>
          {TABS.map(({ icon, label },i) => (
            <button key={i} onClick={()=>setTab(i)}
              style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, border:"none", background:"transparent", color:tab===i?t.acc:t.txm, cursor:"pointer", padding:"8px 2px", minHeight:52, fontSize:10, fontWeight:500, transition:"color 0.2s" }}>
              <span style={{ fontSize:tab===i?20:17 }}>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
          <button onClick={()=>setShowPost(true)}
            style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, border:"none", background:"transparent", color:t.acc, cursor:"pointer", padding:"8px 2px", minHeight:52, fontSize:10, fontWeight:500 }}>
            <span style={{ fontSize:20 }}>➕</span>
            <span>投稿</span>
          </button>
        </div>
      )}

      <PostSheet/>
      <EntryDetail/>
      <RecoDetailSheet/>
    </div>
  );
}

export default function App() {
  return (
    <Provider>
      <AppCore/>
    </Provider>
  );
}
