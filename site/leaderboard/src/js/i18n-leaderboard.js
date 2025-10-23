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
  } catch (e) {}

  // 2. If no saved setting, detect from browser language
  const lang = navigator.language.toLowerCase();
  if (lang === 'zh-tw' || lang === 'zh-hant') {
    currentLocale = 'zh-TW';
  } else if (lang.startsWith('zh')) {
    currentLocale = 'zh-CN';
  } else {
    currentLocale = 'en';
  }
}

// Auto-initialize on load
init();

export { t, getLocale, init };
