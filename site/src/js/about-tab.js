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
  this.fClick = function(e) {
    that.showv();
    e.preventDefault();
  }
}

AboutTab.prototype = Object.create(Tab.prototype);
addProps(AboutTab.prototype, {
  hidev: function() {
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
  onTabHide: function() {
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

    var by = (function(){
      var loc = I18n.getLocale();
      if (loc === 'zh-TW') return '作者 raz0red';
      if (loc === 'zh-CN') return '作者 raz0red';
      return 'by raz0red';
    })();
    var desc = (function(){
      var loc = I18n.getLocale();
      if (loc === 'zh-TW') return 'JS7800 是以 JavaScript 強化移植的 <a href="https://gstanton.github.io/ProSystem1_3/" target="_blank">ProSystem Atari 7800 模擬器</a> 專案，最初由 Greg Stanton 開發。';
      if (loc === 'zh-CN') return 'JS7800 是以 JavaScript 强化移植的 <a href="https://gstanton.github.io/ProSystem1_3/" target="_blank">ProSystem Atari 7800 模拟器</a> 项目，最初由 Greg Stanton 开发。';
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
    var credits = (function(){
      var loc = I18n.getLocale();
      if (loc === 'zh-TW') return 'Atari 7800 控制器插圖由 Mark Davis（<a href="https://vectogram.us/" target="_blank">Vect-O-Gram</a>）製作<br>MD5 支援由 Joseph Myers（<a href="http://www.myersdaily.org/joseph/javascript/md5-text.html" target="_blank">MD5.js</a>）開發<br>Zip 支援由 Gildas Lormeau（<a href="http://gildas-lormeau.github.io/zip.js" target="_blank">Zip.js</a>）開發<br>YM2151 支援移植自 <a href="http://retropc.net/cisc/sound/" target="_blank">FM Sound Generator</a>（作者 <a href="http://www2.tokai.or.jp/mrnkmzu/" target="_blank">Kuma</a>）';
      if (loc === 'zh-CN') return 'Atari 7800 控制器插图由 Mark Davis（<a href="https://vectogram.us/" target="_blank">Vect-O-Gram</a>）制作<br>MD5 支持由 Joseph Myers（<a href="http://www.myersdaily.org/joseph/javascript/md5-text.html" target="_blank">MD5.js</a>）开发<br>Zip 支持由 Gildas Lormeau（<a href="http://gildas-lormeau.github.io/zip.js" target="_blank">Zip.js</a>）开发<br>YM2151 支持移植自 <a href="http://retropc.net/cisc/sound/" target="_blank">FM Sound Generator</a>（作者 <a href="http://www2.tokai.or.jp/mrnkmzu/" target="_blank">Kuma</a>）';
      return 'Atari 7800 controller illustration was created by Mark Davis (<a href="https://vectogram.us/" target="_blank">Vect-O-Gram</a>)<br>MD5 support was developed by Joseph Myers (<a href="http://www.myersdaily.org/joseph/javascript/md5-text.html" target="_blank">MD5.js</a>)<br>Zip support was developed by Gildas Lormeau (<a href="http://gildas-lormeau.github.io/zip.js" target="_blank">Zip.js</a>)<br>YM2151 support was ported from <a href="http://retropc.net/cisc/sound/" target="_blank">FM Sound Generator</a> by <a href="http://www2.tokai.or.jp/mrnkmzu/" target="_blank">Kuma</a>';
    })();
    footer.innerHTML = '<p class=\"center\">' + credits + '</p>';
  }
});


export { AboutTab }