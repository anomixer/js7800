const LOCALE_KEY = "locale";

let current = "en";
let pendingReload = false;

const locales = {
  // same content as before but without comments
  en: {
    common: { ok: "OK", cancel: "Cancel", defaults: "Defaults", defaultsTitle: "Reset to Defaults", close: "Close", settings: "Settings", help: "Help", loading: "Loading...", loadedCartList: "Succesfully loaded cartridge list." },
    cbar: { pause: "Pause", resume: "Resume", soundOff: "Sound Off", soundOn: "Sound On", restart: "Restart", selectText: "SELECT", selectTooltip: "Select", resetText: "RESET", resetTooltip: "Reset", leftDiff: "Left difficulty switch", rightDiff: "Right difficulty switch", leaderboard: "Leaderboard", help: "Help / Info", settings: "Settings", fullscreen: "Fullscreen", exitFullscreen: "Exit Fullscreen" },
    site: {
      desc_settings: "Click<IMG/> <SPAN/> to change keyboard mappings & languages.",
      desc_help: "Click<IMG/> <SPAN/> for detailed usage instructions.",
      desc_load: "Load a cartridge using the drop-down menu or buttons below (you can also drag and drop a local file or remote file link onto the emulator).",
      cart_select: "Select Atari 7800 Cartridge...",
      cart_local: "Select Local File",
      cart_remote: "Select Remote File",
      cart_prompt: "Enter the URL of a remote Cartridge file or Cartridge list"
    },
    settings: {
      title: "Settings",
      tab: { display: "Display", keyboard: "Keyboard", gamepads: "Gamepads", highscores: "High Scores", advanced: "Advanced", language: "Language" },
      display: { title: "Display Settings", desc: "The following settings are used to control the screen display.", screenSize: "Screen size:", screenSizes: { "2x": "2", "2.25x": "2.25", "2.5x": "2.5", "2.75x": "2.75", "3x": "3", "3.25x": "3.25", "3.5x": "3.5", "3.75x": "3.75", "4x": "4" }, aspectRatio: "Aspect ratio:", ar_pp: "Pixel perfect (1:1 PAR)", ar_7800: "Atari 7800 (6:7 PAR)", ar_16x9: "Widescreen (16:9)", ar_ultra: "Ultra-widescreen (2.37:1)", fullscreen: "Fullscreen:", fs_fill: "Fill screen", fs_integer: "Integer scaling (height)", palette: "Palette:", filter: "Apply filter:" },
      gamepads: { title: "Gamepad Compatibility", desc1: "This page provides the ability to <b class=\"callout\">test compatibility</b> with connected gamepads.", gamepad: "Gamepad:", mapping: "Mapping:", consoleButtons: "Console Buttons" },
      keyboard: { title: "Keyboard Mappings", tip1: "Click on the <b class=\"callout\">red box</b> near a control to select it for mapping.", tip2: "Once selected, press the <b class=\"callout\">key</b> you would like to map to the control.", controller1: "Controller 1", controller2: "Controller 2" },
      highscores: { title: "High Score Settings", desc: "The following settings control high score persistence.", pending: "Changes will not take effect until the next game is loaded.", saveScores: "Save scores:", saveLocation: "Save location:", local: "Local (this device only)", global: "Global (worldwide leaderboard)", localFallback: "Local fallback:", localFallbackLabel: "Local Fallback" },
      advanced: { title: "Advanced", desc: "The following settings provide the ability to configure advanced features.", xm: "Expansion module (XM):", xm_auto: "(Automatic)", xm_enabled: "Enabled", xm_disabled: "Disabled", frameSkip: "Frame skipping:", none: "(None)", low: "Low", medium: "Medium (50%)", high: "High", vsync: "Vertical sync:", vsyncLabel: "Vertical Sync" },
      language: { title: "Language", label: "Language:", en: "English", zhTW: "繁體中文", zhCN: "简体中文", ja: "日本語", ko: "한국어", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", pt: "Português", ru: "Русский", noteReload: "Language change will reload the page." },
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
    site: {
      desc_settings: "點擊<IMG/> <SPAN/> 以變更鍵盤對應與語言。", desc_help: "點擊<IMG/> <SPAN/> 以取得詳細使用說明。", desc_load: "使用下拉選單或下方按鈕載入卡帶（也可拖曳本機檔案或遠端連結到模擬器）。",
      cart_select: "選擇 Atari 7800 卡帶...",
      cart_local: "選擇本機檔案",
      cart_remote: "選擇遠端檔案",
      cart_prompt: "輸入遠端卡帶檔案或卡帶清單的 URL"
    },
    settings: {
      title: "設定",
      tab: { display: "顯示", keyboard: "鍵盤", gamepads: "手把", highscores: "高分", advanced: "進階", language: "語言" },
      display: { title: "顯示設定", desc: "以下設定用於控制畫面顯示。", screenSize: "畫面大小:", screenSizes: { "2x": "2", "2.25x": "2.25", "2.5x": "2.5", "2.75x": "2.75", "3x": "3", "3.25x": "3.25", "3.5x": "3.5", "3.75x": "3.75", "4x": "4" }, aspectRatio: "長寬比:", ar_pp: "像素等比 (1:1 PAR)", ar_7800: "Atari 7800 (6:7 PAR)", ar_16x9: "寬螢幕 (16:9)", ar_ultra: "超寬螢幕 (2.37:1)", fullscreen: "全螢幕:", fs_fill: "填滿螢幕", fs_integer: "整數縮放（高度）", palette: "調色盤:", filter: "套用濾鏡:" },
      gamepads: { title: "手把相容性", desc1: "此頁可用來<b class=\"callout\">測試</b>已連線手把的相容性。", gamepad: "手把:", mapping: "對應:", consoleButtons: "主機按鈕" },
      keyboard: { title: "鍵盤對應", tip1: "點選控制項旁的<b class=\"callout\">紅框</b>以選取要設定的對應。", tip2: "選取後，按下要對應的<b class=\"callout\">按鍵</b>。", controller1: "控制器 1", controller2: "控制器 2" },
      highscores: { title: "高分設定", desc: "以下設定用於控制高分紀錄保存。", pending: "變更將在下次載入遊戲後生效。", saveScores: "儲存分數:", saveLocation: "儲存位置:", local: "本機（僅此裝置）", global: "全域（世界排行榜）", localFallback: "本機備援:", localFallbackLabel: "本機備援" },
      advanced: { title: "進階", desc: "以下設定可調整進階功能。", xm: "擴充模組（XM）:", xm_auto: "（自動）", xm_enabled: "啟用", xm_disabled: "停用", frameSkip: "跳幀:", none: "（無）", low: "低", medium: "中（50%）", high: "高", vsync: "垂直同步:", vsyncLabel: "垂直同步" },
      language: { title: "語言", label: "語言:", en: "English", zhTW: "繁體中文", zhCN: "简体中文", ja: "日本語", ko: "한국어", noteReload: "切換語言將重新載入頁面。" },
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
    site: {
      desc_settings: "点击<IMG/> <SPAN/> 以变更键位映射与语言。", desc_help: "点击<IMG/> <SPAN/> 查看详细使用说明。", desc_load: "使用下拉菜单或下方按钮载入卡带（也可拖拽本地文件或远程链接到模拟器）。",
      cart_select: "选择 Atari 7800 卡带...",
      cart_local: "选择本地文件",
      cart_remote: "选择远程文件",
      cart_prompt: "输入远程卡带文件或卡带列表的 URL"
    },
    settings: {
      title: "设置",
      tab: { display: "显示", keyboard: "键盘", gamepads: "手柄", highscores: "高分", advanced: "高级", language: "语言" },
      display: { title: "显示设置", desc: "以下设置用于控制屏幕显示。", screenSize: "屏幕大小:", screenSizes: { "2x": "2", "2.25x": "2.25", "2.5x": "2.5", "2.75x": "2.75", "3x": "3", "3.25x": "3.25", "3.5x": "3.5", "3.75x": "3.75", "4x": "4" }, aspectRatio: "纵横比:", ar_pp: "像素等比 (1:1 PAR)", ar_7800: "Atari 7800 (6:7 PAR)", ar_16x9: "宽屏 (16:9)", ar_ultra: "超宽屏 (2.37:1)", fullscreen: "全屏:", fs_fill: "填满屏幕", fs_integer: "整数缩放（高度）", palette: "调色板:", filter: "应用滤镜:" },
      gamepads: { title: "手柄兼容性", desc1: "此页可用于<b class=\"callout\">测试</b>已连接手柄的兼容性。", gamepad: "手柄:", mapping: "映射:", consoleButtons: "主机按钮" },
      keyboard: { title: "键盘映射", tip1: "点击控制项旁的<b class=\"callout\">红框</b>以选择要设置的映射。", tip2: "选择后，按下要映射的<b class=\"callout\">按键</b>。", controller1: "控制器 1", controller2: "控制器 2" },
      highscores: { title: "高分设置", desc: "以下设置用于控制高分记录保存。", pending: "更改将在下次载入游戏后生效。", saveScores: "保存分数:", saveLocation: "保存位置:", local: "本机（仅此设备）", global: "全局（世界排行榜）", localFallback: "本机回退:", localFallbackLabel: "本机回退" },
      advanced: { title: "高级", desc: "以下设置可调整高级功能。", xm: "扩展模块（XM）:", xm_auto: "（自动）", xm_enabled: "启用", xm_disabled: "停用", frameSkip: "跳帧:", none: "（无）", low: "低", medium: "中（50%）", high: "高", vsync: "垂直同步:", vsyncLabel: "垂直同步" },
      language: { title: "语言", label: "语言:", en: "English", zhTW: "繁體中文", zhCN: "简体中文", ja: "日本語", ko: "한국어", noteReload: "切换语言将重新加载页面。" },
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
  },
  "ja": {
    common: { ok: "OK", cancel: "キャンセル", defaults: "デフォルト", defaultsTitle: "デフォルトにリセット", close: "閉じる", settings: "設定", help: "ヘルプ", loading: "読み込み中...", loadedCartList: "カートリッジリストを正常に読み込みました。" },
    cbar: { pause: "一時停止", resume: "再開", soundOff: "音声オフ", soundOn: "音声オン", restart: "再起動", selectText: "SELECT", selectTooltip: "選択", resetText: "RESET", resetTooltip: "リセット", leftDiff: "左難易度スイッチ", rightDiff: "右難易度スイッチ", leaderboard: "リーダーボード", help: "ヘルプ / 情報", settings: "設定", fullscreen: "フルスクリーン", exitFullscreen: "フルスクリーン終了" },
    site: {
      desc_settings: "<IMG/> <SPAN/> をクリックしてキーボードマッピングと言語を変更します。",
      desc_help: "<IMG/> <SPAN/> をクリックして詳細な使用説明を表示します。",
      desc_load: "ドロップダウンメニューまたは下のボタンを使用してカートリッジを読み込みます（ローカルファイルやリモートファイルリンクをエミュレーターにドラッグアンドドロップすることもできます）。",
      cart_select: "Atari 7800 カートリッジを選択...",
      cart_local: "ローカルファイルを選択",
      cart_remote: "リモートファイルを選択",
      cart_prompt: "リモートカートリッジファイルまたはカートリッジリストのURLを入力"
    },
    settings: {
      title: "設定",
      tab: { display: "表示", keyboard: "キーボード", gamepads: "ゲームパッド", highscores: "ハイスコア", advanced: "詳細", language: "言語" },
      display: { title: "表示設定", desc: "以下の設定は画面表示を制御するために使用されます。", screenSize: "画面サイズ:", screenSizes: { "2x": "2", "2.25x": "2.25", "2.5x": "2.5", "2.75x": "2.75", "3x": "3", "3.25x": "3.25", "3.5x": "3.5", "3.75x": "3.75", "4x": "4" }, aspectRatio: "アスペクト比:", ar_pp: "ピクセルパーフェクト (1:1 PAR)", ar_7800: "Atari 7800 (6:7 PAR)", ar_16x9: "ワイドスクリーン (16:9)", ar_ultra: "ウルトラワイドスクリーン (2.37:1)", fullscreen: "フルスクリーン:", fs_fill: "画面を埋める", fs_integer: "整数スケーリング（高さ）", palette: "パレット:", filter: "フィルターを適用:" },
      gamepads: { title: "ゲームパッド互換性", desc1: "このページでは接続されたゲームパッドの<b class=\"callout\">互換性をテスト</b>できます。", gamepad: "ゲームパッド:", mapping: "マッピング:", consoleButtons: "コンソールボタン" },
      keyboard: { title: "キーボードマッピング", tip1: "マッピングするコントロールの近くの<b class=\"callout\">赤いボックス</b>をクリックします。", tip2: "選択したら、マッピングする<b class=\"callout\">キー</b>を押します。", controller1: "コントローラー 1", controller2: "コントローラー 2" },
      highscores: { title: "ハイスコア設定", desc: "以下の設定はハイスコアの保存を制御します。", pending: "変更は次のゲームが読み込まれるまで有効になりません。", saveScores: "スコアを保存:", saveLocation: "保存場所:", local: "ローカル（このデバイスのみ）", global: "グローバル（世界ランキング）", localFallback: "ローカルフォールバック:", localFallbackLabel: "ローカルフォールバック" },
      advanced: { title: "詳細", desc: "以下の設定は詳細機能を設定できます。", xm: "拡張モジュール (XM):", xm_auto: "（自動）", xm_enabled: "有効", xm_disabled: "無効", frameSkip: "フレームスキップ:", none: "（なし）", low: "低", medium: "中（50%）", high: "高", vsync: "垂直同期:", vsyncLabel: "垂直同期" },
      language: { title: "言語", label: "言語:", en: "English", zhTW: "繁體中文", zhCN: "简体中文", ja: "日本語", ko: "한국어", noteReload: "言語変更はページを再読み込みします。" },
      misc: {
        noneConnect: "なし (接続してボタンを押す)",
        unknown: "（不明）",
        pause: "一時停止",
        select: "選択",
        reset: "リセット",
        palDefault: "ProSystem デフォルト",
        palDark: "ダーク",
        palCoolDark: "クール（ダーク）",
        palWarmDark: "ウォーム（ダーク）",
        palHotDark: "ホット（ダーク）",
        palLight: "ライト",
        palCoolLight: "クール（ライト）",
        palWarmLight: "ウォーム（ライト）",
        palHotLight: "ホット（ライト）",
        toggleFilter: "フィルター切り替え",
        gamepadTest: "ゲームパッドを接続し、マッピングが正しいかテストします（ボタン、Dパッドなど）。"
      }
    },
    help: { title: "ヘルプ", tabs: { about: "について", overview: "概要", carts: "カートリッジ", cbar: "コントロールバー", settings: "設定ダイアログ", highscores: "ハイスコア" } }
  },
  "ko": {
    common: { ok: "확인", cancel: "취소", defaults: "기본값", defaultsTitle: "기본값으로 재설정", close: "닫기", settings: "설정", help: "도움말", loading: "로딩 중...", loadedCartList: "카트리지 목록을 성공적으로 로드했습니다." },
    cbar: { pause: "일시정지", resume: "재개", soundOff: "소리 끄기", soundOn: "소리 켜기", restart: "재시작", selectText: "SELECT", selectTooltip: "선택", resetText: "RESET", resetTooltip: "리셋", leftDiff: "왼쪽 난이도 스위치", rightDiff: "오른쪽 난이도 스위치", leaderboard: "리더보드", help: "도움말 / 정보", settings: "설정", fullscreen: "전체화면", exitFullscreen: "전체화면 종료" },
    site: {
      desc_settings: "<IMG/> <SPAN/>을 클릭하여 키보드 매핑과 언어를 변경합니다.",
      desc_help: "<IMG/> <SPAN/>을 클릭하여 자세한 사용 지침을 확인합니다.",
      desc_load: "드롭다운 메뉴 또는 아래 버튼을 사용하여 카트리지를 로드합니다 (로컬 파일이나 원격 파일 링크를 에뮬레이터에 드래그 앤 드롭할 수도 있습니다).",
      cart_select: "Atari 7800 카트리지 선택...",
      cart_local: "로컬 파일 선택",
      cart_remote: "원격 파일 선택",
      cart_prompt: "원격 카트리지 파일 또는 카트리지 목록의 URL을 입력"
    },
    settings: {
      title: "설정",
      tab: { display: "디스플레이", keyboard: "키보드", gamepads: "게임패드", highscores: "하이스코어", advanced: "고급", language: "언어" },
      display: { title: "디스플레이 설정", desc: "다음 설정은 화면 디스플레이를 제어하는 데 사용됩니다.", screenSize: "화면 크기:", screenSizes: { "2x": "2", "2.25x": "2.25", "2.5x": "2.5", "2.75x": "2.75", "3x": "3", "3.25x": "3.25", "3.5x": "3.5", "3.75x": "3.75", "4x": "4" }, aspectRatio: "화면 비율:", ar_pp: "픽셀 퍼펙트 (1:1 PAR)", ar_7800: "Atari 7800 (6:7 PAR)", ar_16x9: "와이드스크린 (16:9)", ar_ultra: "울트라 와이드스크린 (2.37:1)", fullscreen: "전체화면:", fs_fill: "화면 채우기", fs_integer: "정수 스케일링 (높이)", palette: "팔레트:", filter: "필터 적용:" },
      gamepads: { title: "게임패드 호환성", desc1: "이 페이지는 연결된 게임패드의 <b class=\"callout\">호환성을 테스트</b>할 수 있습니다.", gamepad: "게임패드:", mapping: "매핑:", consoleButtons: "콘솔 버튼" },
      keyboard: { title: "키보드 매핑", tip1: "매핑할 컨트롤 근처의 <b class=\"callout\">빨간 상자</b>를 클릭합니다.", tip2: "선택한 후 매핑할 <b class=\"callout\">키</b>를 누릅니다.", controller1: "컨트롤러 1", controller2: "컨트롤러 2" },
      highscores: { title: "하이스코어 설정", desc: "다음 설정은 하이스코어 지속성을 제어합니다.", pending: "변경사항은 다음 게임이 로드될 때까지 적용되지 않습니다.", saveScores: "점수 저장:", saveLocation: "저장 위치:", local: "로컬 (이 장치만)", global: "글로벌 (전 세계 리더보드)", localFallback: "로컬 폴백:", localFallbackLabel: "로컬 폴백" },
      advanced: { title: "고급", desc: "다음 설정은 고급 기능을 구성할 수 있습니다.", xm: "확장 모듈 (XM):", xm_auto: "（자동）", xm_enabled: "활성화", xm_disabled: "비활성화", frameSkip: "프레임 스킵:", none: "（없음）", low: "낮음", medium: "중간 (50%)", high: "높음", vsync: "수직 동기화:", vsyncLabel: "수직 동기화" },
      language: { title: "언어", label: "언어:", en: "English", zhTW: "繁體中文", zhCN: "简体中文", ja: "日本語", ko: "한국어", noteReload: "언어 변경은 페이지를 다시 로드합니다." },
      misc: {
        noneConnect: "없음 (연결하고 버튼 누름)",
        unknown: "（알 수 없음）",
        pause: "일시정지",
        select: "선택",
        reset: "리셋",
        palDefault: "ProSystem 기본값",
        palDark: "다크",
        palCoolDark: "쿨 (다크)",
        palWarmDark: "웜 (다크)",
        palHotDark: "핫 (다크)",
        palLight: "라이트",
        palCoolLight: "쿨 (라이트)",
        palWarmLight: "웜 (라이트)",
        palHotLight: "핫 (라이트)",
        toggleFilter: "필터 토글",
        gamepadTest: "게임패드를 연결하고 매핑이 올바른지 테스트합니다 (버튼, D패드 등)."
      }
    },
    help: { title: "도움말", tabs: { about: "정보", overview: "개요", carts: "카트리지", cbar: "컨트롤 바", settings: "설정 대화상자", highscores: "하이스코어" } }
  },
  "de": {
    common: { ok: "OK", cancel: "Abbrechen", defaults: "Standard", defaultsTitle: "Auf Standard zurücksetzen", close: "Schließen", settings: "Einstellungen", help: "Hilfe", loading: "Laden...", loadedCartList: "Kartuschenliste erfolgreich geladen。" },
    cbar: { pause: "Pause", resume: "Fortsetzen", soundOff: "Ton aus", soundOn: "Ton an", restart: "Neustart", selectText: "SELECT", selectTooltip: "Auswählen", resetText: "RESET", resetTooltip: "Zurücksetzen", leftDiff: "Linker Schwierigkeitsgrad-Schalter", rightDiff: "Rechter Schwierigkeitsgrad-Schalter", leaderboard: "Bestenliste", help: "Hilfe / Info", settings: "Einstellungen", fullscreen: "Vollbild", exitFullscreen: "Vollbild beenden" },
    site: {
      desc_settings: "Klicken Sie auf <IMG/> <SPAN/>, um Tastenzuordnung und Sprache zu ändern。",
      desc_help: "Klicken Sie auf <IMG/> <SPAN/>, um detaillierte Anweisungen zu erhalten。",
      desc_load: "Laden Sie eine Kartusche über das Dropdown-Menü oder die Schaltflächen unten (Sie können auch eine lokale Datei oder einen Remote-Link auf den Emulator ziehen und ablegen)。",
      cart_select: "Atari 7800 Kartusche auswählen...",
      cart_local: "Lokale Datei auswählen",
      cart_remote: "Remote-Datei auswählen",
      cart_prompt: "Geben Sie die URL einer Remote-Kartusche oder -Liste ein"
    },
    settings: {
      title: "Einstellungen",
      tab: { display: "Anzeige", keyboard: "Tastatur", gamepads: "Gamepads", highscores: "Highscores", advanced: "Erweitert", language: "Sprache" },
      display: { title: "Anzeigeeinstellungen", desc: "Die folgenden Einstellungen steuern die Bildschirmanzeige。", screenSize: "Bildschirmgröße:", screenSizes: { "2x": "2", "2.25x": "2.25", "2.5x": "2.5", "2.75x": "2.75", "3x": "3", "3.25x": "3.25", "3.5x": "3.5", "3.75x": "3.75", "4x": "4" }, aspectRatio: "Seitenverhältnis:", ar_pp: "Pixelgenau (1:1 PAR)", ar_7800: "Atari 7800 (6:7 PAR)", ar_16x9: "Breitbild (16:9)", ar_ultra: "Ultra-Breitbild (2.37:1)", fullscreen: "Vollbild:", fs_fill: "Bildschirm füllen", fs_integer: "Ganzzahlige Skalierung (Höhe)", palette: "Palette:", filter: "Filter anwenden:" },
      gamepads: { title: "Gamepad-Kompatibilität", desc1: "Diese Seite bietet die Möglichkeit, die <b class=\"callout\">Kompatibilität</b> mit angeschlossenen Gamepads zu testen。", gamepad: "Gamepad:", mapping: "Zuordnung:", consoleButtons: "Konsolen-Tasten" },
      keyboard: { title: "Tastaturzuordnung", tip1: "Klicken Sie auf das <b class=\"callout\">rote Kästchen</b> neben einer Steuerung, um sie für die Zuordnung auszuwählen。", tip2: "Sobald ausgewählt, drücken Sie die <b class=\"callout\">Taste</b>, die Sie der Steuerung zuordnen möchten。", controller1: "Controller 1", controller2: "Controller 2" },
      highscores: { title: "Highscore-Einstellungen", desc: "Die folgenden Einstellungen steuern die Highscore-Persistenz。", pending: "Änderungen treten erst nach dem Laden des nächsten Spiels in Kraft。", saveScores: "Scores speichern:", saveLocation: "Speicherort:", local: "Lokal (nur dieses Gerät)", global: "Global (weltweite Bestenliste)", localFallback: "Lokales Fallback:", localFallbackLabel: "Lokales Fallback" },
      advanced: { title: "Erweitert", desc: "Die folgenden Einstellungen ermöglichen die Konfiguration erweiterter Funktionen。", xm: "Erweiterungsmodul (XM):", xm_auto: "(Automatisch)", xm_enabled: "Aktiviert", xm_disabled: "Deaktiviert", frameSkip: "Frame-Überspringen:", none: "(Kein)", low: "Niedrig", medium: "Mittel (50%)", high: "Hoch", vsync: "Vertikale Synchronisation:", vsyncLabel: "Vertikale Synchronisation" },
      language: { title: "Sprache", label: "Sprache:", en: "English", zhTW: "繁體中文", zhCN: "简体中文", ja: "日本語", ko: "한국어", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", pt: "Português", ru: "Русский", noteReload: "Sprachänderung lädt die Seite neu。" },
      misc: {
        noneConnect: "Kein (verbinden und Taste drücken)",
        unknown: "(Unbekannt)",
        pause: "PAUSE",
        select: "SELECT",
        reset: "RESET",
        palDefault: "ProSystem Standard",
        palDark: "Dunkel",
        palCoolDark: "Kühl (Dunkel)",
        palWarmDark: "Warm (Dunkel)",
        palHotDark: "Heiß (Dunkel)",
        palLight: "Hell",
        palCoolLight: "Kühl (Hell)",
        palWarmLight: "Warm (Hell)",
        palHotLight: "Heiß (Hell)",
        toggleFilter: "Filter umschalten",
        gamepadTest: "Verbinden Sie Gamepads und testen Sie, ob sie korrekt zugeordnet sind (durch Drücken von Tasten, D-Pad usw)。"
      }
    },
    help: { title: "Hilfe", tabs: { about: "Über", overview: "Übersicht", carts: "Kartuschen", cbar: "Steuerleiste", settings: "Einstellungsdialog", highscores: "Highscores" } }
  },
  "es": {
    common: { ok: "OK", cancel: "Cancelar", defaults: "Predeterminado", defaultsTitle: "Restablecer a predeterminado", close: "Cerrar", settings: "Configuración", help: "Ayuda", loading: "Cargando...", loadedCartList: "Lista de cartuchos cargada exitosamente。" },
    cbar: { pause: "Pausa", resume: "Reanudar", soundOff: "Sonido apagado", soundOn: "Sonido encendido", restart: "Reiniciar", selectText: "SELECT", selectTooltip: "Seleccionar", resetText: "RESET", resetTooltip: "Restablecer", leftDiff: "Interruptor de dificultad izquierda", rightDiff: "Interruptor de dificultad derecha", leaderboard: "Tabla de líderes", help: "Ayuda / Info", settings: "Configuración", fullscreen: "Pantalla completa", exitFullscreen: "Salir de pantalla completa" },
    site: {
      desc_settings: "Haga clic en <IMG/> <SPAN/> para cambiar asignaciones de teclado e idiomas。",
      desc_help: "Haga clic en <IMG/> <SPAN/> para instrucciones detalladas de uso。",
      desc_load: "Cargue un cartucho usando el menú desplegable o los botones a continuación (también puede arrastrar y soltar un archivo local o enlace remoto en el emulador)。",
      cart_select: "Seleccionar cartucho Atari 7800...",
      cart_local: "Seleccionar archivo local",
      cart_remote: "Seleccionar archivo remoto",
      cart_prompt: "Ingrese la URL de un archivo de cartucho remoto o lista de cartuchos"
    },
    settings: {
      title: "Configuración",
      tab: { display: "Pantalla", keyboard: "Teclado", gamepads: "Gamepads", highscores: "Puntuaciones altas", advanced: "Avanzado", language: "Idioma" },
      display: { title: "Configuración de pantalla", desc: "Las siguientes configuraciones controlan la pantalla。", screenSize: "Tamaño de pantalla:", screenSizes: { "2x": "2", "2.25x": "2.25", "2.5x": "2.5", "2.75x": "2.75", "3x": "3", "3.25x": "3.25", "3.5x": "3.5", "3.75x": "3.75", "4x": "4" }, aspectRatio: "Relación de aspecto:", ar_pp: "Pixel perfecto (1:1 PAR)", ar_7800: "Atari 7800 (6:7 PAR)", ar_16x9: "Pantalla ancha (16:9)", ar_ultra: "Pantalla ultra ancha (2.37:1)", fullscreen: "Pantalla completa:", fs_fill: "Llenar pantalla", fs_integer: "Escalado entero (altura)", palette: "Paleta:", filter: "Aplicar filtro:" },
      gamepads: { title: "Compatibilidad de gamepads", desc1: "Esta página proporciona la capacidad de <b class=\"callout\">probar compatibilidad</b> con gamepads conectados。", gamepad: "Gamepad:", mapping: "Asignación:", consoleButtons: "Botones de consola" },
      keyboard: { title: "Asignaciones de teclado", tip1: "Haga clic en el <b class=\"callout\">cuadro rojo</b> cerca de un control para seleccionarlo para asignación。", tip2: "Una vez seleccionado, presione la <b class=\"callout\">tecla</b> que desea asignar al control。", controller1: "Controlador 1", controller2: "Controlador 2" },
      highscores: { title: "Configuración de puntuaciones altas", desc: "Las siguientes configuraciones controlan la persistencia de puntuaciones altas。", pending: "Los cambios no surtirán efecto hasta que se cargue el siguiente juego。", saveScores: "Guardar puntuaciones:", saveLocation: "Ubicación de guardado:", local: "Local (solo este dispositivo)", global: "Global (tabla de líderes mundial)", localFallback: "Fallback local:", localFallbackLabel: "Fallback local" },
      advanced: { title: "Avanzado", desc: "Las siguientes configuraciones permiten configurar funciones avanzadas。", xm: "Módulo de expansión (XM):", xm_auto: "(Automático)", xm_enabled: "Habilitado", xm_disabled: "Deshabilitado", frameSkip: "Saltar frames:", none: "(Ninguno)", low: "Bajo", medium: "Medio (50%)", high: "Alto", vsync: "Sincronización vertical:", vsyncLabel: "Sincronización vertical" },
      language: { title: "Idioma", label: "Idioma:", en: "English", zhTW: "繁體中文", zhCN: "简体中文", ja: "日本語", ko: "한국어", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", pt: "Português", ru: "Русский", noteReload: "El cambio de idioma recargará la página。" },
      misc: {
        noneConnect: "Ninguno (conectar y presionar botón)",
        unknown: "(Desconocido)",
        pause: "PAUSA",
        select: "SELECT",
        reset: "RESET",
        palDefault: "Predeterminado ProSystem",
        palDark: "Oscuro",
        palCoolDark: "Frío (Oscuro)",
        palWarmDark: "Cálido (Oscuro)",
        palHotDark: "Caliente (Oscuro)",
        palLight: "Claro",
        palCoolLight: "Frío (Claro)",
        palWarmLight: "Cálido (Claro)",
        palHotLight: "Caliente (Claro)",
        toggleFilter: "Alternar filtro",
        gamepadTest: "Conecte gamepads y pruebe si están asignados correctamente (presionando botones, D-pad, etc)。"
      }
    },
    help: { title: "Ayuda", tabs: { about: "Acerca de", overview: "Resumen", carts: "Cartuchos", cbar: "Barra de controles", settings: "Diálogo de configuración", highscores: "Puntuaciones altas" } }
  },
  "fr": {
    common: { ok: "OK", cancel: "Annuler", defaults: "Par défaut", defaultsTitle: "Réinitialiser aux paramètres par défaut", close: "Fermer", settings: "Paramètres", help: "Aide", loading: "Chargement...", loadedCartList: "Liste de cartouches chargée avec succès。" },
    cbar: { pause: "Pause", resume: "Reprendre", soundOff: "Son désactivé", soundOn: "Son activé", restart: "Redémarrer", selectText: "SELECT", selectTooltip: "Sélectionner", resetText: "RESET", resetTooltip: "Réinitialiser", leftDiff: "Interrupteur de difficulté gauche", rightDiff: "Interrupteur de difficulté droite", leaderboard: "Classement", help: "Aide / Info", settings: "Paramètres", fullscreen: "Plein écran", exitFullscreen: "Quitter le plein écran" },
    site: {
      desc_settings: "Cliquez sur <IMG/> <SPAN/> pour changer les mappages clavier et langues。",
      desc_help: "Cliquez sur <IMG/> <SPAN/> pour des instructions d'utilisation détaillées。",
      desc_load: "Chargez une cartouche en utilisant le menu déroulant ou les boutons ci-dessous (vous pouvez aussi glisser-déposer un fichier local ou un lien distant sur l'émulateur)。",
      cart_select: "Sélectionner cartouche Atari 7800...",
      cart_local: "Sélectionner fichier local",
      cart_remote: "Sélectionner fichier distant",
      cart_prompt: "Entrez l'URL d'un fichier de cartouche distant ou d'une liste de cartouches"
    },
    settings: {
      title: "Paramètres",
      tab: { display: "Affichage", keyboard: "Clavier", gamepads: "Gamepads", highscores: "Scores élevés", advanced: "Avancé", language: "Langue" },
      display: { title: "Paramètres d'affichage", desc: "Les paramètres suivants contrôlent l'affichage de l'écran。", screenSize: "Taille d'écran:", screenSizes: { "2x": "2", "2.25x": "2.25", "2.5x": "2.5", "2.75x": "2.75", "3x": "3", "3.25x": "3.25", "3.5x": "3.5", "3.75x": "3.75", "4x": "4" }, aspectRatio: "Rapport d'aspect:", ar_pp: "Pixel parfait (1:1 PAR)", ar_7800: "Atari 7800 (6:7 PAR)", ar_16x9: "Écran large (16:9)", ar_ultra: "Écran ultra large (2.37:1)", fullscreen: "Plein écran:", fs_fill: "Remplir l'écran", fs_integer: "Mise à l'échelle entière (hauteur)", palette: "Palette:", filter: "Appliquer filtre:" },
      gamepads: { title: "Compatibilité gamepads", desc1: "Cette page fournit la possibilité de <b class=\"callout\">tester la compatibilité</b> avec les gamepads connectés。", gamepad: "Gamepad:", mapping: "Mappage:", consoleButtons: "Boutons de console" },
      keyboard: { title: "Mappages clavier", tip1: "Cliquez sur la <b class=\"callout\">case rouge</b> près d'un contrôle pour le sélectionner pour le mappage。", tip2: "Une fois sélectionné, appuyez sur la <b class=\"callout\">touche</b> que vous souhaitez mapper au contrôle。", controller1: "Contrôleur 1", controller2: "Contrôleur 2" },
      highscores: { title: "Paramètres de scores élevés", desc: "Les paramètres suivants contrôlent la persistance des scores élevés。", pending: "Les changements ne prendront effet qu'après le chargement du prochain jeu。", saveScores: "Sauvegarder scores:", saveLocation: "Emplacement de sauvegarde:", local: "Local (ce périphérique seulement)", global: "Global (classement mondial)", localFallback: "Fallback local:", localFallbackLabel: "Fallback local" },
      advanced: { title: "Avancé", desc: "Les paramètres suivants permettent de configurer des fonctionnalités avancées。", xm: "Module d'extension (XM):", xm_auto: "(Automatique)", xm_enabled: "Activé", xm_disabled: "Désactivé", frameSkip: "Sauter des images:", none: "(Aucun)", low: "Bas", medium: "Moyen (50%)", high: "Élevé", vsync: "Synchronisation verticale:", vsyncLabel: "Synchronisation verticale" },
      language: { title: "Langue", label: "Langue:", en: "English", zhTW: "繁體中文", zhCN: "简体中文", ja: "日本語", ko: "한국어", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", pt: "Português", ru: "Русский", noteReload: "Le changement de langue rechargera la page。" },
      misc: {
        noneConnect: "Aucun (connecter et appuyer sur un bouton)",
        unknown: "(Inconnu)",
        pause: "PAUSE",
        select: "SELECT",
        reset: "RESET",
        palDefault: "Par défaut ProSystem",
        palDark: "Sombre",
        palCoolDark: "Froid (Sombre)",
        palWarmDark: "Chaud (Sombre)",
        palHotDark: "Chaud (Sombre)",
        palLight: "Clair",
        palCoolLight: "Froid (Clair)",
        palWarmLight: "Chaud (Clair)",
        palHotLight: "Chaud (Clair)",
        toggleFilter: "Basculer filtre",
        gamepadTest: "Connectez des gamepads et testez s'ils sont mappés correctement (en appuyant sur des boutons, D-pad, etc)。"
      }
    },
    help: { title: "Aide", tabs: { about: "À propos", overview: "Aperçu", carts: "Cartouches", cbar: "Barre de contrôles", settings: "Dialogue paramètres", highscores: "Scores élevés" } }
  },
  "it": {
    common: { ok: "OK", cancel: "Annulla", defaults: "Predefinito", defaultsTitle: "Ripristina predefinito", close: "Chiudi", settings: "Impostazioni", help: "Aiuto", loading: "Caricamento...", loadedCartList: "Elenco cartucce caricato con successo。" },
    cbar: { pause: "Pausa", resume: "Riprendi", soundOff: "Suono spento", soundOn: "Suono acceso", restart: "Riavvia", selectText: "SELECT", selectTooltip: "Seleziona", resetText: "RESET", resetTooltip: "Ripristina", leftDiff: "Interruttore difficoltà sinistra", rightDiff: "Interruttore difficoltà destra", leaderboard: "Classifica", help: "Aiuto / Info", settings: "Impostazioni", fullscreen: "Schermo intero", exitFullscreen: "Esci da schermo intero" },
    site: {
      desc_settings: "Fare clic su <IMG/> <SPAN/> per cambiare mappature tastiera e lingue。",
      desc_help: "Fare clic su <IMG/> <SPAN/> per istruzioni d'uso dettagliate。",
      desc_load: "Carica una cartuccia usando il menu a discesa o i pulsanti qui sotto (puoi anche trascinare e rilasciare un file locale o un link remoto sull'emulatore)。",
      cart_select: "Seleziona cartuccia Atari 7800...",
      cart_local: "Seleziona file locale",
      cart_remote: "Seleziona file remoto",
      cart_prompt: "Inserisci l'URL di un file cartuccia remoto o elenco cartucce"
    },
    settings: {
      title: "Impostazioni",
      tab: { display: "Schermo", keyboard: "Tastiera", gamepads: "Gamepads", highscores: "Punteggi alti", advanced: "Avanzato", language: "Lingua" },
      display: { title: "Impostazioni schermo", desc: "Le seguenti impostazioni controllano lo schermo。", screenSize: "Dimensione schermo:", screenSizes: { "2x": "2", "2.25x": "2.25", "2.5x": "2.5", "2.75x": "2.75", "3x": "3", "3.25x": "3.25", "3.5x": "3.5", "3.75x": "3.75", "4x": "4" }, aspectRatio: "Rapporto aspetto:", ar_pp: "Pixel perfetto (1:1 PAR)", ar_7800: "Atari 7800 (6:7 PAR)", ar_16x9: "Schermo largo (16:9)", ar_ultra: "Schermo ultra largo (2.37:1)", fullscreen: "Schermo intero:", fs_fill: "Riempi schermo", fs_integer: "Scalatura intera (altezza)", palette: "Tavolozza:", filter: "Applica filtro:" },
      gamepads: { title: "Compatibilità gamepads", desc1: "Questa pagina fornisce la capacità di <b class=\"callout\">testare compatibilità</b> con gamepads connessi。", gamepad: "Gamepad:", mapping: "Mappatura:", consoleButtons: "Pulsanti console" },
      keyboard: { title: "Mappature tastiera", tip1: "Fare clic sulla <b class=\"callout\">casella rossa</b> vicino a un controllo per selezionarlo per la mappatura。", tip2: "Una volta selezionato, premere il <b class=\"callout\">tasto</b> che si desidera mappare al controllo。", controller1: "Controller 1", controller2: "Controller 2" },
      highscores: { title: "Impostazioni punteggi alti", desc: "Le seguenti impostazioni controllano la persistenza dei punteggi alti。", pending: "Le modifiche avranno effetto solo dopo il caricamento del prossimo gioco。", saveScores: "Salva punteggi:", saveLocation: "Posizione salvataggio:", local: "Locale (solo questo dispositivo)", global: "Globale (classifica mondiale)", localFallback: "Fallback locale:", localFallbackLabel: "Fallback locale" },
      advanced: { title: "Avanzato", desc: "Le seguenti impostazioni permettono di configurare funzionalità avanzate。", xm: "Modulo espansione (XM):", xm_auto: "(Automatico)", xm_enabled: "Abilitato", xm_disabled: "Disabilitato", frameSkip: "Salta frame:", none: "(Nessuno)", low: "Basso", medium: "Medio (50%)", high: "Alto", vsync: "Sincronizzazione verticale:", vsyncLabel: "Sincronizzazione verticale" },
      language: { title: "Lingua", label: "Lingua:", en: "English", zhTW: "繁體中文", zhCN: "简体中文", ja: "日本語", ko: "한국어", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", pt: "Português", ru: "Русский", noteReload: "Il cambio lingua ricaricherà la pagina。" },
      misc: {
        noneConnect: "Nessuno (connetti e premi pulsante)",
        unknown: "(Sconosciuto)",
        pause: "PAUSA",
        select: "SELECT",
        reset: "RESET",
        palDefault: "Predefinito ProSystem",
        palDark: "Scuro",
        palCoolDark: "Freddo (Scuro)",
        palWarmDark: "Caldo (Scuro)",
        palHotDark: "Caldo (Scuro)",
        palLight: "Chiaro",
        palCoolLight: "Freddo (Chiaro)",
        palWarmLight: "Caldo (Chiaro)",
        palHotLight: "Caldo (Chiaro)",
        toggleFilter: "Alterna filtro",
        gamepadTest: "Connetti gamepads e testa se sono mappati correttamente (premendo pulsanti, D-pad, ecc)。"
      }
    },
    help: { title: "Aiuto", tabs: { about: "Informazioni", overview: "Panoramica", carts: "Cartucce", cbar: "Barra controlli", settings: "Dialogo impostazioni", highscores: "Punteggi alti" } }
  },
  "pt": {
    common: { ok: "OK", cancel: "Cancelar", defaults: "Padrão", defaultsTitle: "Redefinir para padrão", close: "Fechar", settings: "Configurações", help: "Ajuda", loading: "Carregando...", loadedCartList: "Lista de cartuchos carregada com sucesso。" },
    cbar: { pause: "Pausa", resume: "Retomar", soundOff: "Som desligado", soundOn: "Som ligado", restart: "Reiniciar", selectText: "SELECT", selectTooltip: "Selecionar", resetText: "RESET", resetTooltip: "Redefinir", leftDiff: "Interruptor de dificuldade esquerda", rightDiff: "Interruptor de dificuldade direita", leaderboard: "Tabela de líderes", help: "Ajuda / Info", settings: "Configurações", fullscreen: "Tela cheia", exitFullscreen: "Sair da tela cheia" },
    site: {
      desc_settings: "Clique em <IMG/> <SPAN/> para alterar mapeamentos de teclado e idiomas。",
      desc_help: "Clique em <IMG/> <SPAN/> para instruções detalhadas de uso。",
      desc_load: "Carregue um cartucho usando o menu suspenso ou os botões abaixo (você também pode arrastar e soltar um arquivo local ou link remoto no emulador)。",
      cart_select: "Selecionar cartucho Atari 7800...",
      cart_local: "Selecionar arquivo local",
      cart_remote: "Selecionar arquivo remoto",
      cart_prompt: "Digite a URL de um arquivo de cartucho remoto ou lista de cartuchos"
    },
    settings: {
      title: "Configurações",
      tab: { display: "Tela", keyboard: "Teclado", gamepads: "Gamepads", highscores: "Pontuações altas", advanced: "Avançado", language: "Idioma" },
      display: { title: "Configurações de tela", desc: "As seguintes configurações controlam a tela。", screenSize: "Tamanho da tela:", screenSizes: { "2x": "2", "2.25x": "2.25", "2.5x": "2.5", "2.75x": "2.75", "3x": "3", "3.25x": "3.25", "3.5x": "3.5", "3.75x": "3.75", "4x": "4" }, aspectRatio: "Proporção de aspecto:", ar_pp: "Pixel perfeito (1:1 PAR)", ar_7800: "Atari 7800 (6:7 PAR)", ar_16x9: "Tela larga (16:9)", ar_ultra: "Tela ultra larga (2.37:1)", fullscreen: "Tela cheia:", fs_fill: "Preencher tela", fs_integer: "Escalagem inteira (altura)", palette: "Paleta:", filter: "Aplicar filtro:" },
      gamepads: { title: "Compatibilidade de gamepads", desc1: "Esta página fornece a capacidade de <b class=\"callout\">testar compatibilidade</b> com gamepads conectados。", gamepad: "Gamepad:", mapping: "Mapeamento:", consoleButtons: "Botões do console" },
      keyboard: { title: "Mapeamentos de teclado", tip1: "Clique na <b class=\"callout\">caixa vermelha</b> perto de um controle para selecioná-lo para mapeamento。", tip2: "Uma vez selecionado, pressione a <b class=\"callout\">tecla</b> que você deseja mapear para o controle。", controller1: "Controlador 1", controller2: "Controlador 2" },
      highscores: { title: "Configurações de pontuações altas", desc: "As seguintes configurações controlam a persistência de pontuações altas。", pending: "As mudanças só entrarão em vigor após o carregamento do próximo jogo。", saveScores: "Salvar pontuações:", saveLocation: "Local de salvamento:", local: "Local (apenas este dispositivo)", global: "Global (tabela de líderes mundial)", localFallback: "Fallback local:", localFallbackLabel: "Fallback local" },
      advanced: { title: "Avançado", desc: "As seguintes configurações permitem configurar recursos avançados。", xm: "Módulo de expansão (XM):", xm_auto: "(Automático)", xm_enabled: "Habilitado", xm_disabled: "Desabilitado", frameSkip: "Pular frames:", none: "(Nenhum)", low: "Baixo", medium: "Médio (50%)", high: "Alto", vsync: "Sincronização vertical:", vsyncLabel: "Sincronização vertical" },
      language: { title: "Idioma", label: "Idioma:", en: "English", zhTW: "繁體中文", zhCN: "简体中文", ja: "日本語", ko: "한국어", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", pt: "Português", ru: "Русский", noteReload: "A mudança de idioma recarregará a página。" },
      misc: {
        noneConnect: "Nenhum (conectar e pressionar botão)",
        unknown: "(Desconhecido)",
        pause: "PAUSA",
        select: "SELECT",
        reset: "RESET",
        palDefault: "Padrão ProSystem",
        palDark: "Escuro",
        palCoolDark: "Frio (Escuro)",
        palWarmDark: "Quente (Escuro)",
        palHotDark: "Quente (Escuro)",
        palLight: "Claro",
        palCoolLight: "Frio (Claro)",
        palWarmLight: "Quente (Claro)",
        palHotLight: "Quente (Claro)",
        toggleFilter: "Alternar filtro",
        gamepadTest: "Conecte gamepads e teste se eles estão mapeados corretamente (pressionando botões, D-pad, etc)。"
      }
    },
    help: { title: "Ajuda", tabs: { about: "Sobre", overview: "Visão geral", carts: "Cartuchos", cbar: "Barra de controles", settings: "Diálogo de configurações", highscores: "Pontuações altas" } }
  },
  "ru": {
    common: { ok: "OK", cancel: "Отмена", defaults: "По умолчанию", defaultsTitle: "Сбросить к умолчанию", close: "Закрыть", settings: "Настройки", help: "Помощь", loading: "Загрузка...", loadedCartList: "Список картриджей успешно загружен。" },
    cbar: { pause: "Пауза", resume: "Возобновить", soundOff: "Звук выключен", soundOn: "Звук включен", restart: "Перезапустить", selectText: "SELECT", selectTooltip: "Выбрать", resetText: "RESET", resetTooltip: "Сбросить", leftDiff: "Левый переключатель сложности", rightDiff: "Правый переключатель сложности", leaderboard: "Таблица лидеров", help: "Помощь / Инфо", settings: "Настройки", fullscreen: "Полноэкранный", exitFullscreen: "Выйти из полноэкранного" },
    site: {
      desc_settings: "Нажмите <IMG/> <SPAN/>, чтобы изменить сопоставления клавиш и языки。",
      desc_help: "Нажмите <IMG/> <SPAN/>, чтобы получить подробные инструкции по использованию。",
      desc_load: "Загрузите картридж, используя раскрывающееся меню или кнопки ниже (вы также можете перетащить локальный файл или удаленную ссылку на эмулятор)。",
      cart_select: "Выбрать картридж Atari 7800...",
      cart_local: "Выбрать локальный файл",
      cart_remote: "Выбрать удаленный файл",
      cart_prompt: "Введите URL удаленного файла картриджа или списка картриджей"
    },
    settings: {
      title: "Настройки",
      tab: { display: "Экран", keyboard: "Клавиатура", gamepads: "Геймпады", highscores: "Высокие очки", advanced: "Расширенный", language: "Язык" },
      display: { title: "Настройки экрана", desc: "Следующие настройки контролируют экран。", screenSize: "Размер экрана:", screenSizes: { "2x": "2", "2.25x": "2.25", "2.5x": "2.5", "2.75x": "2.75", "3x": "3", "3.25x": "3.25", "3.5x": "3.5", "3.75x": "3.75", "4x": "4" }, aspectRatio: "Соотношение сторон:", ar_pp: "Идеальный пиксель (1:1 PAR)", ar_7800: "Atari 7800 (6:7 PAR)", ar_16x9: "Широкоэкранный (16:9)", ar_ultra: "Ультраширокоэкранный (2.37:1)", fullscreen: "Полноэкранный:", fs_fill: "Заполнить экран", fs_integer: "Целочисленное масштабирование (высота)", palette: "Палетка:", filter: "Применить фильтр:" },
      gamepads: { title: "Совместимость геймпадов", desc1: "Эта страница предоставляет возможность <b class=\"callout\">протестировать совместимость</b> с подключенными геймпадами。", gamepad: "Геймпад:", mapping: "Сопоставление:", consoleButtons: "Кнопки консоли" },
      keyboard: { title: "Сопоставления клавиатуры", tip1: "Нажмите на <b class=\"callout\">красный квадрат</b> рядом с элементом управления, чтобы выбрать его для сопоставления。", tip2: "После выбора нажмите <b class=\"callout\">клавишу</b>, которую вы хотите сопоставить с элементом управления。", controller1: "Контроллер 1", controller2: "Контроллер 2" },
      highscores: { title: "Настройки высоких очков", desc: "Следующие настройки контролируют сохранение высоких очков。", pending: "Изменения вступят в силу только после загрузки следующей игры。", saveScores: "Сохранить очки:", saveLocation: "Местоположение сохранения:", local: "Локально (только это устройство)", global: "Глобально (мировая таблица лидеров)", localFallback: "Локальный резерв:", localFallbackLabel: "Локальный резерв" },
      advanced: { title: "Расширенный", desc: "Следующие настройки позволяют настроить расширенные функции。", xm: "Модуль расширения (XM):", xm_auto: "(Автоматически)", xm_enabled: "Включен", xm_disabled: "Отключен", frameSkip: "Пропуск кадров:", none: "(Нет)", low: "Низкий", medium: "Средний (50%)", high: "Высокий", vsync: "Вертикальная синхронизация:", vsyncLabel: "Вертикальная синхронизация" },
      language: { title: "Язык", label: "Язык:", en: "English", zhTW: "繁體中文", zhCN: "简体中文", ja: "日本語", ko: "한국어", de: "Deutsch", es: "Español", fr: "Français", it: "Italiano", pt: "Português", ru: "Русский", noteReload: "Изменение языка перезагрузит страницу。" },
      misc: {
        noneConnect: "Нет (подключить и нажать кнопку)",
        unknown: "(Неизвестно)",
        pause: "ПАУЗА",
        select: "SELECT",
        reset: "RESET",
        palDefault: "По умолчанию ProSystem",
        palDark: "Темный",
        palCoolDark: "Холодный (Темный)",
        palWarmDark: "Теплый (Темный)",
        palHotDark: "Горячий (Темный)",
        palLight: "Светлый",
        palCoolLight: "Холодный (Светлый)",
        palWarmLight: "Теплый (Светлый)",
        palHotLight: "Горячий (Светлый)",
        toggleFilter: "Переключить фильтр",
        gamepadTest: "Подключите геймпады и протестируйте, правильно ли они сопоставлены (нажимая кнопки, D-pad и т.д)。"
      }
    },
    help: { title: "Помощь", tabs: { about: "О программе", overview: "Обзор", carts: "Картриджи", cbar: "Панель управления", settings: "Диалог настроек", highscores: "Высокие очки" } }
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
  try { window.localStorage.setItem(LOCALE_KEY, locale); } catch (e) { }
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
  } catch (e) { }

  // 2. If no saved setting, detect from browser language.
  const lang = navigator.language.toLowerCase();
  if (lang === 'zh-tw' || lang === 'zh-hant') {
    current = 'zh-TW';
  } else if (lang.startsWith('zh')) {
    current = 'zh-CN';
  } else if (lang === 'ja') {
    current = 'ja';
  } else if (lang === 'ko') {
    current = 'ko';
  } else if (lang === 'de') {
    current = 'de';
  } else if (lang.startsWith('es')) {
    current = 'es';
  } else if (lang.startsWith('fr')) {
    current = 'fr';
  } else if (lang.startsWith('it')) {
    current = 'it';
  } else if (lang.startsWith('pt')) {
    current = 'pt';
  } else if (lang.startsWith('ru')) {
    current = 'ru';
  } else {
    current = 'en'; // Default for everything else
  }
}

// auto-init so early bundles (e.g., cbar) pick up stored locale
init();

export { t, init, setLocale, getLocale, needsReload }
