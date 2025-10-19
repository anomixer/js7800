const LOCALE_KEY = "locale";

let current = "en";
let pendingReload = false;

const locales = {
  // same content as before but without comments
  en: {
    common: { ok: "OK", cancel: "Cancel", defaults: "Defaults", defaultsTitle: "Reset to Defaults", close: "Close", settings: "Settings", help: "Help", loading: "Loading...", loadedCartList: "Succesfully loaded cartridge list." },
    cbar: { pause: "Pause", resume: "Resume", soundOff: "Sound Off", soundOn: "Sound On", restart: "Restart", selectText: "SELECT", selectTooltip: "Select", resetText: "RESET", resetTooltip: "Reset", leftDiff: "Left difficulty switch", rightDiff: "Right difficulty switch", leaderboard: "Leaderboard", help: "Help / Info", settings: "Settings", fullscreen: "Fullscreen", exitFullscreen: "Exit Fullscreen" },
    site: { desc_settings: "Click<IMG/> <SPAN/> to view current keyboard mappings.", desc_help: "Click<IMG/> <SPAN/> for detailed usage instructions.", desc_load: "Load a cartridge using the drop-down menu or buttons below (you can also drag and drop a local file or remote file link onto the emulator)." },
    settings: {
      title: "Settings",
      tab: { display: "Display", keyboard: "Keyboard", gamepads: "Gamepads", highscores: "High Scores", advanced: "Advanced", language: "Language" },
      display: { title: "Display Settings", desc: "The following settings are used to control the screen display.", screenSize: "Screen size:", screenSizes: { "2x": "2", "2.25x": "2.25", "2.5x": "2.5", "2.75x": "2.75", "3x": "3", "3.25x": "3.25", "3.5x": "3.5", "3.75x": "3.75", "4x": "4" }, aspectRatio: "Aspect ratio:", ar_pp: "Pixel perfect (1:1 PAR)", ar_7800: "Atari 7800 (6:7 PAR)", ar_16x9: "Widescreen (16:9)", ar_ultra: "Ultra-widescreen (2.37:1)", fullscreen: "Fullscreen:", fs_fill: "Fill screen", fs_integer: "Integer scaling (height)", palette: "Palette:", filter: "Apply filter:" },
      gamepads: { title: "Gamepad Compatibility", desc1: "This page provides the ability to <b class=\"callout\">test compatibility</b> with connected gamepads.", gamepad: "Gamepad:", mapping: "Mapping:", consoleButtons: "Console Buttons" },
      keyboard: { title: "Keyboard Mappings", tip1: "Click on the <b class=\"callout\">red box</b> near a control to select it for mapping.", tip2: "Once selected, press the <b class=\"callout\">key</b> you would like to map to the control.", controller1: "Controller 1", controller2: "Controller 2" },
      highscores: { title: "High Score Settings", desc: "The following settings control high score persistence.", pending: "Changes will not take effect until the next game is loaded.", saveScores: "Save scores:", saveLocation: "Save location:", local: "Local (this device only)", global: "Global (worldwide leaderboard)", localFallback: "Local fallback:", localFallbackLabel: "Local Fallback" },
      advanced: { title: "Advanced", desc: "The following settings provide the ability to configure advanced features.", xm: "Expansion module (XM):", xm_auto: "(Automatic)", xm_enabled: "Enabled", xm_disabled: "Disabled", frameSkip: "Frame skipping:", none: "(None)", low: "Low", medium: "Medium (50%)", high: "High", vsync: "Vertical sync:", vsyncLabel: "Vertical Sync" },
      language: { title: "Language", label: "Language:", en: "English", zhTW: "繁體中文", zhCN: "简体中文", noteReload: "Language change will reload the page." },
      misc: {
        noneConnect: "None (connect and press button)",
        unknown: "(Unknown)",
        pause: "PAUSE",
        select: "SELECT",
        reset: "RESET",
        palDefault: "ProSystem default",
        palDark: "Dark",
        palCoolDark: "Cool (Dark)",
        palWarmDark: "Warm (Dark)",
        palHotDark: "Hot (Dark)",
        palLight: "Light",
        palCoolLight: "Cool (Light)",
        palWarmLight: "Warm (Light)",
        palHotLight: "Hot (Light)",
        toggleFilter: "Toggle Filter",
        gamepadTest: "Connect gamepads and test if they are mapped correctly (by pressing buttons, D-pad, etc.)."
      }
    },
    help: { title: "Help", tabs: { about: "About", overview: "Overview", carts: "Cartridges", cbar: "Controls Bar", settings: "Settings Dialog", highscores: "High Scores" } }
  },
  "zh-TW": {
    common: { ok: "確定", cancel: "取消", defaults: "預設值", defaultsTitle: "重設為預設值", close: "關閉", settings: "設定", help: "說明", loading: "載入中...", loadedCartList: "已成功載入卡帶清單。" },
    cbar: { pause: "暫停", resume: "繼續", soundOff: "關閉聲音", soundOn: "開啟聲音", restart: "重新啟動", selectText: "SELECT", selectTooltip: "選擇", resetText: "RESET", resetTooltip: "重設", leftDiff: "左難度切換", rightDiff: "右難度切換", leaderboard: "排行榜", help: "說明 / 資訊", settings: "設定", fullscreen: "全螢幕", exitFullscreen: "離開全螢幕" },
    site: { desc_settings: "點擊<IMG/> <SPAN/> 以檢視目前鍵盤對應。", desc_help: "點擊<IMG/> <SPAN/> 以取得詳細使用說明。", desc_load: "使用下拉選單或下方按鈕載入卡帶（也可拖曳本機檔案或遠端連結到模擬器）。" },
    settings: {
      title: "設定",
      tab: { display: "顯示", keyboard: "鍵盤", gamepads: "手把", highscores: "高分", advanced: "進階", language: "語言" },
      display: { title: "顯示設定", desc: "以下設定用於控制畫面顯示。", screenSize: "畫面大小:", screenSizes: { "2x": "2", "2.25x": "2.25", "2.5x": "2.5", "2.75x": "2.75", "3x": "3", "3.25x": "3.25", "3.5x": "3.5", "3.75x": "3.75", "4x": "4" }, aspectRatio: "長寬比:", ar_pp: "像素等比 (1:1 PAR)", ar_7800: "Atari 7800 (6:7 PAR)", ar_16x9: "寬螢幕 (16:9)", ar_ultra: "超寬螢幕 (2.37:1)", fullscreen: "全螢幕:", fs_fill: "填滿螢幕", fs_integer: "整數縮放（高度）", palette: "調色盤:", filter: "套用濾鏡:" },
      gamepads: { title: "手把相容性", desc1: "此頁可用來<b class=\"callout\">測試</b>已連線手把的相容性。", gamepad: "手把:", mapping: "對應:", consoleButtons: "主機按鈕" },
      keyboard: { title: "鍵盤對應", tip1: "點選控制項旁的<b class=\"callout\">紅框</b>以選取要設定的對應。", tip2: "選取後，按下要對應的<b class=\"callout\">按鍵</b>。", controller1: "控制器 1", controller2: "控制器 2" },
      highscores: { title: "高分設定", desc: "以下設定用於控制高分紀錄保存。", pending: "變更將在下次載入遊戲後生效。", saveScores: "儲存分數:", saveLocation: "儲存位置:", local: "本機（僅此裝置）", global: "全域（世界排行榜）", localFallback: "本機備援:", localFallbackLabel: "本機備援" },
      advanced: { title: "進階", desc: "以下設定可調整進階功能。", xm: "擴充模組（XM）:", xm_auto: "（自動）", xm_enabled: "啟用", xm_disabled: "停用", frameSkip: "跳幀:", none: "（無）", low: "低", medium: "中（50%）", high: "高", vsync: "垂直同步:", vsyncLabel: "垂直同步" },
      language: { title: "語言", label: "語言:", en: "English", zhTW: "繁體中文", zhCN: "简体中文", noteReload: "切換語言將重新載入頁面。" },
      misc: {
        noneConnect: "無 (請連接並按鈕)",
        unknown: "（未知）",
        pause: "暫停",
        select: "選擇",
        reset: "重設",
        palDefault: "ProSystem 預設",
        palDark: "暗色",
        palCoolDark: "冷色（暗）",
        palWarmDark: "暖色（暗）",
        palHotDark: "熱色（暗）",
        palLight: "亮色",
        palCoolLight: "冷色（亮）",
        palWarmLight: "暖色（亮）",
        palHotLight: "熱色（亮）",
        toggleFilter: "切換濾鏡",
        gamepadTest: "連接遊戲手把並測試對應是否正確（透過按鈕、方向鍵等）。"
      }
    },
    help: { title: "說明", tabs: { about: "關於", overview: "總覽", carts: "卡帶", cbar: "控制列", settings: "設定對話框", highscores: "高分" } }
  },
  "zh-CN": {
    common: { ok: "确定", cancel: "取消", defaults: "默认值", defaultsTitle: "重置为默认值", close: "关闭", settings: "设置", help: "帮助", loading: "加载中...", loadedCartList: "已成功载入卡带清单。" },
    cbar: { pause: "暂停", resume: "继续", soundOff: "关闭声音", soundOn: "打开声音", restart: "重新启动", selectText: "SELECT", selectTooltip: "选择", resetText: "RESET", resetTooltip: "重置", leftDiff: "左难度切换", rightDiff: "右难度切换", leaderboard: "排行榜", help: "帮助 / 信息", settings: "设置", fullscreen: "全屏", exitFullscreen: "退出全屏" },
    site: { desc_settings: "点击<IMG/> <SPAN/> 以查看当前键位映射。", desc_help: "点击<IMG/> <SPAN/> 查看详细使用说明。", desc_load: "使用下拉菜单或下方按钮载入卡带（也可拖拽本地文件或远程链接到模拟器）。" },
    settings: {
      title: "设置",
      tab: { display: "显示", keyboard: "键盘", gamepads: "手柄", highscores: "高分", advanced: "高级", language: "语言" },
      display: { title: "显示设置", desc: "以下设置用于控制屏幕显示。", screenSize: "屏幕大小:", screenSizes: { "2x": "2", "2.25x": "2.25", "2.5x": "2.5", "2.75x": "2.75", "3x": "3", "3.25x": "3.25", "3.5x": "3.5", "3.75x": "3.75", "4x": "4" }, aspectRatio: "纵横比:", ar_pp: "像素等比 (1:1 PAR)", ar_7800: "Atari 7800 (6:7 PAR)", ar_16x9: "宽屏 (16:9)", ar_ultra: "超宽屏 (2.37:1)", fullscreen: "全屏:", fs_fill: "填满屏幕", fs_integer: "整数缩放（高度）", palette: "调色板:", filter: "应用滤镜:" },
      gamepads: { title: "手柄兼容性", desc1: "此页可用于<b class=\"callout\">测试</b>已连接手柄的兼容性。", gamepad: "手柄:", mapping: "映射:", consoleButtons: "主机按钮" },
      keyboard: { title: "键盘映射", tip1: "点击控制项旁的<b class=\"callout\">红框</b>以选择要设置的映射。", tip2: "选择后，按下要映射的<b class=\"callout\">按键</b>。", controller1: "控制器 1", controller2: "控制器 2" },
      highscores: { title: "高分设置", desc: "以下设置用于控制高分记录保存。", pending: "更改将在下次载入游戏后生效。", saveScores: "保存分数:", saveLocation: "保存位置:", local: "本机（仅此设备）", global: "全局（世界排行榜）", localFallback: "本机回退:", localFallbackLabel: "本机回退" },
      advanced: { title: "高级", desc: "以下设置可调整高级功能。", xm: "扩展模块（XM）:", xm_auto: "（自动）", xm_enabled: "启用", xm_disabled: "停用", frameSkip: "跳帧:", none: "（无）", low: "低", medium: "中（50%）", high: "高", vsync: "垂直同步:", vsyncLabel: "垂直同步" },
      language: { title: "语言", label: "语言:", en: "English", zhTW: "繁體中文", zhCN: "简体中文", noteReload: "切换语言将重新加载页面。" },
      misc: {
        noneConnect: "无 (请连接并按键)",
        unknown: "（未知）",
        pause: "暂停",
        select: "选择",
        reset: "重置",
        palDefault: "ProSystem 默认",
        palDark: "暗色",
        palCoolDark: "冷色（暗）",
        palWarmDark: "暖色（暗）",
        palHotDark: "热色（暗）",
        palLight: "亮色",
        palCoolLight: "冷色（亮）",
        palWarmLight: "暖色（亮）",
        palHotLight: "热色（亮）",
        toggleFilter: "切换滤镜",
        gamepadTest: "连接游戏手柄并测试映射是否正确（通过按键、方向键等）。"
      }
    },
    help: { title: "帮助", tabs: { about: "关于", overview: "总览", carts: "卡带", cbar: "控制栏", settings: "设置对话框", highscores: "高分" } }
  }
};

function getLocale() { return current; }

function t(key) {
  const parts = key.split('.')
  let obj = locales[current];
  for (const p of parts) obj = obj && obj[p];
  if (obj !== undefined) return obj;
  obj = locales.en;
  for (const p of parts) obj = obj && obj[p];
  return obj === undefined ? key : obj;
}

function setLocale(locale, reloadAfter = false) {
  current = locale;
  try { window.localStorage.setItem(LOCALE_KEY, locale); } catch (e) {}
  pendingReload = pendingReload || reloadAfter;
}

function needsReload() { return pendingReload; }

function init() {
  // 1. Check for a user's saved setting first.
  try {
    const stored = window.localStorage.getItem(LOCALE_KEY);
    if (stored) {
      current = stored;
      return;
    }
  } catch (e) {}

  // 2. If no saved setting, detect from browser language.
  const lang = navigator.language.toLowerCase();
  if (lang === 'zh-tw') {
    current = 'zh-TW';
  } else if (lang.startsWith('zh')) {
    current = 'zh-CN';
  } else {
    current = 'en'; // Default for everything else
  }
}

// auto-init so early bundles (e.g., cbar) pick up stored locale
init();

export { t, init, setLocale, getLocale, needsReload }
