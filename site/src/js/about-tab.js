import * as Util from "./util.js"
import * as DialogModule from "./dialog.js"
import * as I18n from "../../../src/js/common/i18n.js"

var Tab = DialogModule.Tab;
var addProps = Util.addProps;
var digest = null;

function AboutTab() {
  Tab.call(this, I18n.t('help.tabs.about'));
  this.top = null;
  this.wrapperEl = null;
  this.logoEl = null;
  this.vEl = null;
  this.iframe = null;
  this.timerId = null;
  this.played = false;

  var that = this;
  this.fClick = function (e) {
    that.showv();
    e.preventDefault();
  }
}

AboutTab.prototype = Object.create(Tab.prototype);
addProps(AboutTab.prototype, {
  hidev: function () {
    this.iframe.setAttribute('src', '');
    this.logoEl.style.display = 'inline-block';
    this.vEl.style.display = 'none';
    this.top.style.opacity = "0";
    this.top.style.display = 'inline-block';
    if (this.timerId != null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  },
  showv: function () {
    this.played = true;
    this.iframe.setAttribute('src', atob(digest));
    this.top.style.cursor = 'auto';
    this.top.style.opacity = ".4";
    this.top.removeEventListener("click", this.fClick);
    var that = this;
    this.timerId = setTimeout(function () {
      that.top.style.display = 'none';
      that.logoEl.style.display = 'none';
      that.vEl.style.display = 'inline-block';
    }, 10 * 1000);
  },

  // autoplay=1&autopause=0&loop=true&background=false&muted=1
  onShow: function () {
    this.hidev();
    this.played = false;
    this.top.style.cursor = 'pointer';
    this.top.addEventListener("click", this.fClick);
    digest = "aHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvLzQxMTg5MTQ1Nz9hdXRvcGxheT0xJmF1dG9wYXVzZT0wJmxvb3A9dHJ1ZSZiYWNrZ3JvdW5kPWZhbHNlJm11dGVkPTE=";
  },
  onHide: function () {
    this.top.removeEventListener("click", this.fClick);
    this.hidev();
  },
  onTabHide: function () {
    if (this.played) {
      this.onHide();
    }
  },
  createTabContent: function (rootEl) {
    var title = document.createElement('div');
    title.className = 'tabcontent__title';
    title.appendChild(document.createTextNode('JS7800: JavaScript Atari 7800 Emulator'));
    rootEl.appendChild(title);

    var about = document.createElement('div');
    about.className = 'about';
    rootEl.appendChild(about)

    var header = document.createElement('div');
    about.appendChild(header);

    var by = (function () {
      var loc = I18n.getLocale();
      if (loc === 'zh-TW') return '作者 raz0red';
      if (loc === 'zh-CN') return '作者 raz0red';
      if (loc === 'ja') return '作者 raz0red';
      if (loc === 'ko') return '작성자 raz0red';
      if (loc === 'de') return 'von raz0red';
      if (loc === 'es') return 'por raz0red';
      if (loc === 'fr') return 'par raz0red';
      if (loc === 'it') return 'di raz0red';
      if (loc === 'pt') return 'por raz0red';
      if (loc === 'ru') return 'от raz0red';
      return 'by raz0red';
    })();
    var desc = (function () {
      var loc = I18n.getLocale();
      if (loc === 'zh-TW') return 'JS7800 是以 JavaScript 強化移植的 <a href="https://gstanton.github.io/ProSystem1_3/" target="_blank">ProSystem Atari 7800 模擬器</a> 專案，最初由 Greg Stanton 開發。';
      if (loc === 'zh-CN') return 'JS7800 是以 JavaScript 强化移植的 <a href="https://gstanton.github.io/ProSystem1_3/" target="_blank">ProSystem Atari 7800 模拟器</a> 项目，最初由 Greg Stanton 开发。';
      if (loc === 'ja') return 'JS7800 は Greg Stanton が開発した <a href="https://gstanton.github.io/ProSystem1_3/" target="_blank">ProSystem Atari 7800 エミュレーター</a> を JavaScript で強化移植したプロジェクトです。';
      if (loc === 'ko') return 'JS7800은 Greg Stanton이 개발한 <a href="https://gstanton.github.io/ProSystem1_3/" target="_blank">ProSystem Atari 7800 에뮬레이터</a>를 JavaScript로 강화 이식한 프로젝트입니다.';
      if (loc === 'de') return 'JS7800 ist eine erweiterte JavaScript-Portierung des <a href="https://gstanton.github.io/ProSystem1_3/" target="_blank">ProSystem Atari 7800 Emulators</a>, der ursprünglich von Greg Stanton entwickelt wurde。';
      if (loc === 'es') return 'JS7800 es un puerto JavaScript mejorado del <a href="https://gstanton.github.io/ProSystem1_3/" target="_blank">emulador ProSystem Atari 7800</a> que fue desarrollado originalmente por Greg Stanton。';
      if (loc === 'fr') return 'JS7800 est un port JavaScript amélioré de l\'<a href="https://gstanton.github.io/ProSystem1_3/" target="_blank">émulateur ProSystem Atari 7800</a> qui a été développé à l\'origine par Greg Stanton。';
      if (loc === 'it') return 'JS7800 è una porta JavaScript migliorata dell\'<a href="https://gstanton.github.io/ProSystem1_3/" target="_blank">emulatore ProSystem Atari 7800</a> che è stato sviluppato originariamente da Greg Stanton。';
      if (loc === 'pt') return 'JS7800 é uma porta JavaScript aprimorada do <a href="https://gstanton.github.io/ProSystem1_3/" target="_blank">emulador ProSystem Atari 7800</a> que foi desenvolvido originalmente por Greg Stanton。';
      if (loc === 'ru') return 'JS7800 является улучшенным JavaScript-портом <a href="https://gstanton.github.io/ProSystem1_3/" target="_blank">эмулятора ProSystem Atari 7800</a>, который был изначально разработан Greg Stanton。';
      return 'JS7800 is an enhanced JavaScript port of the <a href="https://gstanton.github.io/ProSystem1_3/" target="_blank">ProSystem Atari 7800 emulator</a> that was originally developed by Greg Stanton';
    })();

    header.innerHTML =
      '<p class=\"center\">\n' +
      '<span class=\"about-label\">' + by + '</span><a href=\"https://github.com/raz0red/js7800\" target=\"_blank\"><img\n' +
      'class=\"about-logo\" src=\"images/github-logo.svg\" draggable="false" alt=\"GitHub: JS7800 by raz0red\"\n' +
      'title=\"GitHub: JS7800 by raz0red\"></a>\n' +
      '</p>\n' +
      '<p class=\"center\">' + desc + '</p>';
    var outer = document.createElement('div');
    outer.style.textAlign = 'center';
    about.appendChild(outer);
    this.wrapperEl = document.createElement('div');
    this.wrapperEl.className = 'about-atari';

    this.top = document.createElement('div');
    this.top.className = 'about-atari__top';
    this.wrapperEl.appendChild(this.top);

    outer.appendChild(this.wrapperEl);
    this.logoEl = document.createElement('img');
    this.logoEl.setAttribute('draggable', 'false');
    this.logoEl.setAttribute('src', 'images/logo.gif');
    this.wrapperEl.appendChild(this.logoEl);
    this.vEl = document.createElement('div');
    this.vEl.className = 'about-atari__v';
    this.wrapperEl.appendChild(this.vEl);
    var iframe = document.createElement('iframe');
    this.iframe = iframe;
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '100%');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'autoplay');
    this.vEl.appendChild(iframe);

    var footer = document.createElement('div');
    about.appendChild(footer);
    var credits = (function () {
      var loc = I18n.getLocale();
      if (loc === 'zh-TW') return 'Atari 7800 控制器插圖由 Mark Davis（<a href="https://vectogram.us/" target="_blank">Vect-O-Gram</a>）製作<br>MD5 支援由 Joseph Myers（<a href="http://www.myersdaily.org/joseph/javascript/md5-text.html" target="_blank">MD5.js</a>）開發<br>Zip 支援由 Gildas Lormeau（<a href="http://gildas-lormeau.github.io/zip.js" target="_blank">Zip.js</a>）開發<br>YM2151 支援移植自 <a href="http://retropc.net/cisc/sound/" target="_blank">FM Sound Generator</a>（作者 <a href="http://www2.tokai.or.jp/mrnkmzu/" target="_blank">Kuma</a>）';
      if (loc === 'zh-CN') return 'Atari 7800 控制器插图由 Mark Davis（<a href="https://vectogram.us/" target="_blank">Vect-O-Gram</a>）制作<br>MD5 支持由 Joseph Myers（<a href="http://www.myersdaily.org/joseph/javascript/md5-text.html" target="_blank">MD5.js</a>）开发<br>Zip 支持由 Gildas Lormeau（<a href="http://gildas-lormeau.github.io/zip.js" target="_blank">Zip.js</a>）开发<br>YM2151 支持移植自 <a href="http://retropc.net/cisc/sound/" target="_blank">FM Sound Generator</a>（作者 <a href="http://www2.tokai.or.jp/mrnkmzu/" target="_blank">Kuma</a>）';
      if (loc === 'ja') return 'Atari 7800 コントローラーイラストは Mark Davis（<a href="https://vectogram.us/" target="_blank">Vect-O-Gram</a>）が作成<br>MD5 サポートは Joseph Myers（<a href="http://www.myersdaily.org/joseph/javascript/md5-text.html" target="_blank">MD5.js</a>）が開発<br>Zip サポートは Gildas Lormeau（<a href="http://gildas-lormeau.github.io/zip.js" target="_blank">Zip.js</a>）が開発<br>YM2151 サポートは <a href="http://retropc.net/cisc/sound/" target="_blank">FM Sound Generator</a> から移植（作者 <a href="http://www2.tokai.or.jp/mrnkmzu/" target="_blank">Kuma</a>）';
      if (loc === 'ko') return 'Atari 7800 컨트롤러 일러스트레이션은 Mark Davis（<a href="https://vectogram.us/" target="_blank">Vect-O-Gram</a>）가 제작<br>MD5 지원은 Joseph Myers（<a href="http://www.myersdaily.org/joseph/javascript/md5-text.html" target="_blank">MD5.js</a>）가 개발<br>Zip 지원은 Gildas Lormeau（<a href="http://gildas-lormeau.github.io/zip.js" target="_blank">Zip.js</a>）가 개발<br>YM2151 지원은 <a href="http://retropc.net/cisc/sound/" target="_blank">FM Sound Generator</a>에서 이식（작성자 <a href="http://www2.tokai.or.jp/mrnkmzu/" target="_blank">Kuma</a>）';
      if (loc === 'de') return 'Atari 7800 Controller-Illustration wurde erstellt von Mark Davis (<a href="https://vectogram.us/" target="_blank">Vect-O-Gram</a>)<br>MD5-Unterstützung wurde entwickelt von Joseph Myers (<a href="http://www.myersdaily.org/joseph/javascript/md5-text.html" target="_blank">MD5.js</a>)<br>Zip-Unterstützung wurde entwickelt von Gildas Lormeau (<a href="http://gildas-lormeau.github.io/zip.js" target="_blank">Zip.js</a>)<br>YM2151-Unterstützung wurde portiert von <a href="http://retropc.net/cisc/sound/" target="_blank">FM Sound Generator</a> von <a href="http://www2.tokai.or.jp/mrnkmzu/" target="_blank">Kuma</a>';
      if (loc === 'es') return 'La ilustración del controlador Atari 7800 fue creada por Mark Davis (<a href="https://vectogram.us/" target="_blank">Vect-O-Gram</a>)<br>El soporte MD5 fue desarrollado por Joseph Myers (<a href="http://www.myersdaily.org/joseph/javascript/md5-text.html" target="_blank">MD5.js</a>)<br>El soporte Zip fue desarrollado por Gildas Lormeau (<a href="http://gildas-lormeau.github.io/zip.js" target="_blank">Zip.js</a>)<br>El soporte YM2151 fue portado desde <a href="http://retropc.net/cisc/sound/" target="_blank">FM Sound Generator</a> por <a href="http://www2.tokai.or.jp/mrnkmzu/" target="_blank">Kuma</a>';
      if (loc === 'fr') return 'L\'illustration du contrôleur Atari 7800 a été créée par Mark Davis (<a href="https://vectogram.us/" target="_blank">Vect-O-Gram</a>)<br>Le support MD5 a été développé par Joseph Myers (<a href="http://www.myersdaily.org/joseph/javascript/md5-text.html" target="_blank">MD5.js</a>)<br>Le support Zip a été développé par Gildas Lormeau (<a href="http://gildas-lormeau.github.io/zip.js" target="_blank">Zip.js</a>)<br>Le support YM2151 a été porté depuis <a href="http://retropc.net/cisc/sound/" target="_blank">FM Sound Generator</a> par <a href="http://www2.tokai.or.jp/mrnkmzu/" target="_blank">Kuma</a>';
      if (loc === 'it') return 'L\'illustrazione del controller Atari 7800 è stata creata da Mark Davis (<a href="https://vectogram.us/" target="_blank">Vect-O-Gram</a>)<br>Il supporto MD5 è stato sviluppato da Joseph Myers (<a href="http://www.myersdaily.org/joseph/javascript/md5-text.html" target="_blank">MD5.js</a>)<br>Il supporto Zip è stato sviluppato da Gildas Lormeau (<a href="http://gildas-lormeau.github.io/zip.js" target="_blank">Zip.js</a>)<br>Il supporto YM2151 è stato portato da <a href="http://retropc.net/cisc/sound/" target="_blank">FM Sound Generator</a> di <a href="http://www2.tokai.or.jp/mrnkmzu/" target="_blank">Kuma</a>';
      if (loc === 'pt') return 'A ilustração do controle Atari 7800 foi criada por Mark Davis (<a href="https://vectogram.us/" target="_blank">Vect-O-Gram</a>)<br>O suporte MD5 foi desenvolvido por Joseph Myers (<a href="http://www.myersdaily.org/joseph/javascript/md5-text.html" target="_blank">MD5.js</a>)<br>O suporte Zip foi desenvolvido por Gildas Lormeau (<a href="http://gildas-lormeau.github.io/zip.js" target="_blank">Zip.js</a>)<br>O suporte YM2151 foi portado do <a href="http://retropc.net/cisc/sound/" target="_blank">FM Sound Generator</a> por <a href="http://www2.tokai.or.jp/mrnkmzu/" target="_blank">Kuma</a>';
      if (loc === 'ru') return 'Иллюстрация контроллера Atari 7800 была создана Mark Davis (<a href="https://vectogram.us/" target="_blank">Vect-O-Gram</a>)<br>Поддержка MD5 была разработана Joseph Myers (<a href="http://www.myersdaily.org/joseph/javascript/md5-text.html" target="_blank">MD5.js</a>)<br>Поддержка Zip была разработана Gildas Lormeau (<a href="http://gildas-lormeau.github.io/zip.js" target="_blank">Zip.js</a>)<br>Поддержка YM2151 была портирована из <a href="http://retropc.net/cisc/sound/" target="_blank">FM Sound Generator</a> от <a href="http://www2.tokai.or.jp/mrnkmzu/" target="_blank">Kuma</a>';
      return 'Atari 7800 controller illustration was created by Mark Davis (<a href="https://vectogram.us/" target="_blank">Vect-O-Gram</a>)<br>MD5 support was developed by Joseph Myers (<a href="http://www.myersdaily.org/joseph/javascript/md5-text.html" target="_blank">MD5.js</a>)<br>Zip support was developed by Gildas Lormeau (<a href="http://gildas-lormeau.github.io/zip.js" target="_blank">Zip.js</a>)<br>YM2151 support was ported from <a href="http://retropc.net/cisc/sound/" target="_blank">FM Sound Generator</a> by <a href="http://www2.tokai.or.jp/mrnkmzu/" target="_blank">Kuma</a>';
    })();
    footer.innerHTML = '<p class=\"center\">' + credits + '</p>';
  }
});


export { AboutTab }