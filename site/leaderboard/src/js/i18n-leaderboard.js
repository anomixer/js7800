// Leaderboard i18n module
// Shares locale with main emulator via localStorage

const LOCALE_KEY = "locale";

let currentLocale = "en";

const translations = {
  en: {
    title: "Global Leaderboard",
    description: "Select a game in the drop-down menu below to view current high scores.",
    topPlayers: "Top Players",
    topPlayersAll: "Top Players<br>(All games)",
    topPlayersMost: "Top Players<br>(Most competitive modes)",
    latestScores: "Latest High Scores",
    mostCompetitive: "Most Competitive Modes",
    game: "Game:",
    settings: "Settings:",
    allSettings: "(All)",
    player: "Player",
    score: "Score",
    date: "Date",
    noScores: "No scores currently exist for this game.",
    points: "points",
    scores: "scores",
    players: "players",
    refresh: "Refresh",
    play: "Play"
  },
  "zh-TW": {
    title: "全域排行榜",
    description: "請從下方選單選擇遊戲以查看目前高分紀錄。",
    topPlayers: "頂尖玩家",
    topPlayersAll: "頂尖玩家<br>(全部遊戲)",
    topPlayersMost: "頂尖玩家<br>(最具競爭模式)",
    latestScores: "最新高分紀錄",
    mostCompetitive: "最具競爭模式",
    game: "遊戲：",
    settings: "設定：",
    allSettings: "(全部)",
    player: "玩家",
    score: "分數",
    date: "日期",
    noScores: "此遊戲目前無分數紀錄。",
    points: "分",
    scores: "筆分數",
    players: "位玩家",
    refresh: "重新整理",
    play: "開始遊戲"
  },
  "zh-CN": {
    title: "全局排行榜",
    description: "请从下方菜单选择游戏以查看当前高分记录。",
    topPlayers: "顶尖玩家",
    topPlayersAll: "顶尖玩家<br>(全部游戏)",
    topPlayersMost: "顶尖玩家<br>(最具竞争模式)",
    latestScores: "最新高分记录",
    mostCompetitive: "最具竞争模式",
    game: "游戏：",
    settings: "设置：",
    allSettings: "(全部)",
    player: "玩家",
    score: "分数",
    date: "日期",
    noScores: "此游戏目前无分数记录。",
    points: "分",
    scores: "笔分数",
    players: "位玩家",
    refresh: "刷新",
    play: "开始游戏"
  },
  "ja": {
    title: "グローバルリーダーボード",
    description: "下のドロップダウンメニューからゲームを選択して現在のハイスコアを表示します。",
    topPlayers: "トッププレイヤー",
    topPlayersAll: "トッププレイヤー<br>(全ゲーム)",
    topPlayersMost: "トッププレイヤー<br>(最も競争的なモード)",
    latestScores: "最新ハイスコア",
    mostCompetitive: "最も競争的なモード",
    game: "ゲーム：",
    settings: "設定：",
    allSettings: "(すべて)",
    player: "プレイヤー",
    score: "スコア",
    date: "日付",
    noScores: "このゲームには現在スコアがありません。",
    points: "ポイント",
    scores: "スコア",
    players: "プレイヤー",
    refresh: "リフレッシュ",
    play: "プレイ"
  },
  "ko": {
    title: "글로벌 리더보드",
    description: "아래 드롭다운 메뉴에서 게임을 선택하여 현재 하이스코어를 확인하세요.",
    topPlayers: "톱 플레이어",
    topPlayersAll: "톱 플레이어<br>(모든 게임)",
    topPlayersMost: "톱 플레이어<br>(가장 경쟁적인 모드)",
    latestScores: "최신 하이스코어",
    mostCompetitive: "가장 경쟁적인 모드",
    game: "게임：",
    settings: "설정：",
    allSettings: "(모두)",
    player: "플레이어",
    score: "점수",
    date: "날짜",
    noScores: "이 게임에는 현재 점수가 없습니다.",
    points: "점",
    scores: "점수",
    players: "플레이어",
    refresh: "새로고침",
    play: "플레이"
  }
};

function getLocale() {
  return currentLocale;
}

function t(key) {
  const locale = translations[currentLocale];
  return locale && locale[key] ? locale[key] : translations.en[key] || key;
}

function init() {
  // 1. Check localStorage for saved locale (from main emulator)
  try {
    const stored = window.localStorage.getItem(LOCALE_KEY);
    if (stored && translations[stored]) {
      currentLocale = stored;
      return;
    }
  } catch (e) { }

  // 2. If no saved setting, detect from browser language
  const lang = navigator.language.toLowerCase();
  if (lang === 'zh-tw' || lang === 'zh-hant') {
    currentLocale = 'zh-TW';
  } else if (lang.startsWith('zh')) {
    currentLocale = 'zh-CN';
  } else if (lang === 'ja') {
    currentLocale = 'ja';
  } else if (lang === 'ko') {
    currentLocale = 'ko';
  } else {
    currentLocale = 'en';
  }
}

// Auto-initialize on load
init();

export { t, getLocale, init };
