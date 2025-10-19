import * as Util from "./util.js"
import * as DialogModule from "./dialog.js"
import * as Events from "./events.js"
import { AboutTab } from "./about-tab.js"
import * as I18n from "../../../src/js/common/i18n.js"

var TabbedDialog = DialogModule.TabbedDialog;
var TabSet = DialogModule.TabSet;
var Tab = DialogModule.Tab;
var addProps = Util.addProps;
var debug = false;

// 
// Help Tab
//

function HelpTab(title, urlBase) {
  Tab.call(this, title);
  this.urlBase = urlBase;
}
HelpTab.prototype = Object.create(Tab.prototype);
addProps(HelpTab.prototype, {  
  root: null,
  parent: null,
  loaded: false,
  getUrlForLocale: function() {
    var base = this.urlBase; // e.g., help/overview.html
    var idx = base.lastIndexOf('.');
    var prefix = base.substring(0, idx);
    var ext = base.substring(idx);
    var loc = I18n.getLocale();
    if (loc === 'zh-TW' || loc === 'zh-CN') {
      return [prefix + '-' + loc + ext, base]; // try locale first, then fallback
    }
    return [base];
  },
  onTabShow: function() {
    if (!this.loaded) {      
      var that = this;
      var urls = this.getUrlForLocale();
      var i = 0;
      
      var failure = function(msg) {
        if (i + 1 < urls.length) {
          i++;
          tryUrl();
          return;
        }
        var outMsg = "An error occurred attempting to load page: " + urls[i];
        if (msg) {
          outMsg += " (" + msg + ")";
        }
        Events.fireEvent("showError", outMsg);
      }
      
      var tryUrl = function() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', urls[i]);
        xhr.onload = function () {
          if (xhr.status == 200) {
            that.loaded = true; 
            that.parent.classList.remove('loader-container');
            that.parent.style.display = 'none';
            that.parent.innerHTML = xhr.responseText;
            setTimeout(function () { that.parent.style.display = 'block' }, 100);
          } else {
            failure(xhr.status + ": " + xhr.statusText);
          }
        }
        xhr.onerror = function() { failure(); }
        setTimeout(function() { xhr.send(); }, 500);
      }
      tryUrl();
    }
  },  
  createTabContent: function (rootEl) { 
    this.root = rootEl;
    var parent = document.createElement("div");
    this.parent = parent;
    parent.className = "loader-container";    
    var loader = document.createElement("div");
    loader.className = "loader";
    parent.appendChild(loader);
    rootEl.appendChild(parent);
  },
});

var overviewTab = new HelpTab(I18n.t('help.tabs.overview'), "help/overview.html");
var cartsTab = new HelpTab(I18n.t('help.tabs.carts'), "help/carts.html");
var cbarTab = new HelpTab(I18n.t('help.tabs.cbar'), "help/cbar.html");
var settingsTab = new HelpTab(I18n.t('help.tabs.settings'), "help/settings.html");
var highScoresTab = new HelpTab(I18n.t('help.tabs.highscores'), "help/highscores.html");

var tabSet = new TabSet();
tabSet.addTab(new AboutTab(), true);
tabSet.addTab(overviewTab);
tabSet.addTab(cartsTab);
tabSet.addTab(cbarTab);
tabSet.addTab(settingsTab);
tabSet.addTab(highScoresTab);

//
// Help dialog
//

function HelpDialog() {
  TabbedDialog.call(this, I18n.t('help.title'), true);
}
HelpDialog.prototype = Object.create(TabbedDialog.prototype);
addProps(HelpDialog.prototype, {
  cssLoaded: false,
  getTabSet: function () { return tabSet; },
  onShow: function () {
    if (!this.cssLoaded) {
      this.cssLoaded = true;
      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = "help/css/help.css";
      document.head.appendChild(link);
    }
    TabbedDialog.prototype.onShow.call(this);
  },
});

export { HelpDialog }


