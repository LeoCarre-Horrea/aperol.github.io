console.log("🧪 TEST - JavaScript fonctionne !");

if (typeof console === "undefined" || typeof console.log === "undefined") {
  console = {};
  console.log = function () {};
}

const scriptBypassURL = new URL(document.currentScript.src);
var lang = document.documentElement.lang;
var globalConfig;
var AgeGateByPass;
if (!AgeGateByPass) {
  AgeGateByPass = new Object();
  AgeGateByPass.isToBypass = false;
}

var sanitizer = function (str) {
  return str.replace(/[^\w.^-]/gi, function (c) {
    return "&#" + c.charCodeAt(0) + ";";
  });
};

const globalDomain = document
  .getElementById("ageGateBypass")
  .getAttribute("data-domain-path");
const reqUrl = window.location.search;
const urlParams = new URLSearchParams(reqUrl);
var hostName = window.location.hostname;
var protocol = window.location.protocol;

// Fonction pour vérifier si l'utilisateur vient d'un domaine Aperol
function isFromAperolDomain() {
  const referrer = document.referrer;
  const aperolDomains = [
    "aperol.com",
    "shop.aperol.com",
    "us-shop.aperol.com",
    "www.aperol.com",
    "www.shop.aperol.com",
    "www.us-shop.aperol.com",
  ];

  console.log("🔍 DEBUG - Referrer:", referrer);
  console.log("🔍 DEBUG - Current hostname:", window.location.hostname);

  if (!referrer) {
    console.log("❌ DEBUG - No referrer found");
    return false;
  }

  try {
    const referrerUrl = new URL(referrer);
    const referrerHostname = referrerUrl.hostname.toLowerCase();

    console.log("🔍 DEBUG - Referrer hostname:", referrerHostname);
    console.log("🔍 DEBUG - Aperol domains to check:", aperolDomains);

    // Vérifier si le referrer est un domaine Aperol
    const isAperolDomain = aperolDomains.some(
      (domain) =>
        referrerHostname === domain || referrerHostname.endsWith("." + domain)
    );

    console.log("✅ DEBUG - Is Aperol domain:", isAperolDomain);
    return isAperolDomain;
  } catch (e) {
    console.log("❌ DEBUG - Error parsing referrer:", e);
    return false;
  }
}
var env =
  window.location.toString().indexOf("/dev/") > -1
    ? "/dev"
    : window.location.toString().indexOf("/stg/") > -1
    ? "/stg"
    : "";
//env = "";
var configUrl =
  scriptBypassURL.protocol +
  "//" +
  scriptBypassURL.hostname +
  "/wdf-common/age-gate-bypass/" +
  sanitizer(globalDomain) +
  "/campaigns.json";
console.log(configUrl);
// if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
//   configUrl = "./campaigns.json";
// }

// Set a Cookie
function setCookieBypass(cName, cValue, expDays) {
  let date = new Date();
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
  const expires = 0;
  if (expDays != 0) {
    expires = "expires=" + date.toUTCString();
  }
  document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

function setLocalStorage(cName, cValue) {
  localStorage.setItem(cName, JSON.stringify(cValue));
}

function setSessionStorage(cName, cValue) {
  sessionStorage.setItem(cName, JSON.stringify(cValue));
}

function getCookieBypass(cName) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split("; ");
  let res;
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
}

function bypass(config) {
  const addCSS = (css) =>
    (document.head.appendChild(document.createElement("style")).innerHTML =
      css);
  if (config.elementsToHide) {
    addCSS(`${config.elementsToHide}{ display:none!important;}`);

    if (config.elementsToHide == ".sn_age_gate") {
      //BB
      document.querySelector("body").classList.remove("overflow-hidden");
      document.querySelector(".sn_site_wrapper").classList.remove("_blur");
    }
  }

  if (typeof config.agegateCookieValue == "string") {
    if (config.agegateCookieValue.startsWith("#UTIL:")) {
      let util = config.agegateCookieValue.replace("#UTIL:", "");

      switch (util) {
        case "TIMESTAMP":
          config.agegateCookieValue = Date.now();
          setLocalStorage(config.agegateCookieName, config.agegateCookieValue);
          break;
        default:
          break;
      }
    }
  }

  setLocalStorage(config.agegateCookieName, config.agegateCookieValue);
  setSessionStorage(config.agegateCookieName, config.agegateCookieValue);
  setCookieBypass(config.agegateCookieName, config.agegateCookieValue, 0);
  document.body.classList.remove("overflowHidden");
  document.body.classList.remove("notScrollable");

  window.dispatchEvent(new CustomEvent("sn:gtma:age-gate-bypass:ok"));
  window.dispatchEvent(new CustomEvent("sn:gtma:age-gate:ok"));

  if (config.refreshPage) {
    location.reload();
  }
}

function hideDivAgeGate(config) {
  const addCSS = (css) =>
    (document.head.appendChild(document.createElement("style")).innerHTML =
      css);
  if (config.elementsToHide) {
    addCSS(`${config.elementsToHide}{ display:none!important;}`);

    if (config.elementsToHide == ".sn_age_gate") {
      //BB
      document.querySelector("body").classList.remove("overflow-hidden");
      document.querySelector(".sn_site_wrapper").classList.remove("_blur");
    }
  }
}

function getConfig(configUrl) {
  return fetch(configUrl).then((response) => response.json());
}

function manageDisappearingBypassDiv_old(bypassCloseElementId) {
  let bypassCloseElement = document.getElementById(bypassCloseElementId);
  if (bypassCloseElement) {
    bypassCloseElement.click();
  }
}

function manageDisappearingBypassDiv(div) {
  if (div) {
    div.click();
  }
}

function verifyReOpenMessageDiv(config) {
  reopenDivConf = config.reopenMessageDiv;
  let cookie = getCookieBypass("ageGateBypassMessage");
  if (cookie && cookie === "closed") {
    let div = document.getElementById(reopenDivConf.id);

    if (div !== null) {
      // console.log('qui');
      div.remove();
    }
    div = document.createElement("div");

    if (reopenDivConf.style && reopenDivConf.style.length > 0) {
      div.style = reopenDivConf.style;
    }
    div.class = reopenDivConf.class;
    div.id = reopenDivConf.id;

    let p = document.createElement("p");
    p.style = "margin:0;padding:0";
    p.innerHTML = config.translations[lang]
      ? config.translations[lang].reopenMessageDivText
      : reopenDivConf.text;

    // span that close the div
    let span = document.createElement("span");
    span.id = reopenDivConf.closeSpanId;
    if (
      reopenDivConf.closeSpanStyle &&
      reopenDivConf.closeSpanStyle.length > 0
    ) {
      span.style = reopenDivConf.closeSpanStyle;
    }
    span.innerHTML = config.translations[lang]
      ? config.translations[lang].reopenMessageCloseText
      : reopenDivConf.closeSpanText;
    span.onclick = () => openMessageDiv(div, config);
    p.appendChild(span);
    div.appendChild(p);

    if (
      reopenDivConf.containerClass &&
      reopenDivConf.containerClass != "" &&
      typeof reopenDivConf.containerClass != "undefined"
    ) {
      document.querySelector(reopenDivConf.containerClass).appendChild(div);
    } else {
      document.body.appendChild(div);
    }
  }
}

function openMessageDiv(div, config) {
  div.style = "display: none";

  let messageDiv = document.getElementById(config.bypassedDiv.id);
  if (messageDiv) {
    messageDiv.style = config.bypassedDiv.style;
  } else createMessageDiv(config, true);
}

function verifyIsToCreateMessageDiv(config) {
  bypassDivConfig = config.bypassedDiv;
  let cookie = getCookieBypass("ageGateBypassMessage");
  let div = document.getElementById(bypassDivConfig.id);
  if (cookie === "created" && !div) {
    createMessageDiv(config, true);
  }
}

function createMessageDiv(config, forceRecreate) {
  bypassDivConfig = config.bypassedDiv;
  let cookie = getCookieBypass("ageGateBypassMessage");
  if (!cookie || forceRecreate) {
    if (cookie !== "created") {
      setCookieBypass("ageGateBypassMessage", "created", 0);
    }

    let div = document.createElement("div");
    if (bypassDivConfig.style && bypassDivConfig.style.length > 0) {
      div.style = bypassDivConfig.style;
    }
    div.class = bypassDivConfig.class;
    div.id = bypassDivConfig.id;

    let p = document.createElement("p");
    p.style =
      "margin:0;padding:0;margin:0 auto;max-width: calc(100% - 5px);font-size: 0.8rem;";
    p.innerHTML = config.translations[lang]
      ? config.translations[lang].bypassedDivText
      : bypassDivConfig.text;
    // span that close the div
    let span = document.createElement("span");
    span.id = bypassDivConfig.closeSpanId;
    if (
      bypassDivConfig.closeSpanStyle &&
      bypassDivConfig.closeSpanStyle.length > 0
    ) {
      span.style = bypassDivConfig.closeSpanStyle;
    }
    span.innerHTML = config.translations[lang]
      ? config.translations[lang].bypassedCloseTest
      : bypassDivConfig.closeSpanText;
    div.onclick = () => closeMessageDiv(div, config);
    p.appendChild(span);
    div.appendChild(p);

    if (
      bypassDivConfig.containerClass &&
      bypassDivConfig.containerClass != "" &&
      typeof bypassDivConfig.containerClass != "undefined"
    ) {
      document.querySelector(bypassDivConfig.containerClass).appendChild(div);
    } else {
      document.body.appendChild(div);
    }
    setTimeout(
      () => manageDisappearingBypassDiv(div),
      bypassDivConfig.disappearingSecs * 1000
    );
  }
}

function closeMessageDiv(div, config) {
  div.style = "display: none";
  setCookieBypass("ageGateBypassMessage", "closed", 0);
  verifyReOpenMessageDiv(config);
}

function checkResponse(res) {
  if (res.status == "fulfilled") {
    if (typeof res == "string") {
      res = JSON.parse(res);
    }
    return res.value;
  } else if (res.status == "rejected") {
    return null;
  }
}

function getCommonCampaigns(callback) {
  var commonCampaignsUrl =
    scriptBypassURL.protocol +
    "//" +
    scriptBypassURL.hostname +
    "/wdf-common/age-gate-bypass/commoncampaigns.json";
  let commonCampaigns = getConfig(commonCampaignsUrl);
  let commonCampaignsObj = {};

  Promise.allSettled([commonCampaigns]).then(function (res) {
    let [commonCampaigns] = res;

    commonCampaigns = checkResponse(commonCampaigns);

    if (commonCampaigns != null) {
      commonCampaignsObj = commonCampaigns;
    }

    callback(commonCampaignsObj);
  });
}

function mergeCampaigns(commonCampaigns, websiteCampaigns) {
  for (let k in commonCampaigns) {
    if (typeof websiteCampaigns[k] == "undefined") {
      websiteCampaigns[k] = commonCampaigns[k];
    } else {
      for (let j in commonCampaigns[k]) {
        if (typeof websiteCampaigns[k][j] == "undefined") {
          websiteCampaigns[k][j] = commonCampaigns[k][j];
        }
      }
    }
  }

  return websiteCampaigns;
}

function bypassGeo(callback) {
  let countryPath =
    "https://test.df-controltower.mycampari.com/pp/wp-json/api/v1/geolocation";
  let countryData = getConfig(countryPath);
  let countryDataObj = {
    result: false,
    data: [],
    message: "",
  };

  Promise.allSettled([countryData]).then(function (res) {
    let [countryData] = res;

    countryData = checkResponse(countryData);

    if (countryData != null) {
      countryDataObj = countryData;
    }

    callback(countryDataObj);
  });
}

// Vérification simple : si l'utilisateur vient d'un domaine Aperol, bypass automatique
console.log("🚀 DEBUG - Starting Aperol domain check...");
const isFromAperol = isFromAperolDomain();
console.log("🚀 DEBUG - isFromAperolDomain result:", isFromAperol);

if (isFromAperol) {
  console.log("✅ User coming from Aperol domain, bypassing age gate");

  // Configuration par défaut pour le bypass
  const defaultConfig = {
    agegateCookieName: "age-gate-ok",
    agegateCookieValue: true,
    refreshPage: false,
    elementsToHide: "#age-gate-otp",
  };

  console.log("🔧 DEBUG - Applying bypass with config:", defaultConfig);

  // Bypass immédiat
  AgeGateByPass.isToBypass = true;
  bypass(defaultConfig);

  console.log("✅ AgeGateBypass exit with ", AgeGateByPass.isToBypass);
  return;
} else {
  console.log(
    "❌ User NOT coming from Aperol domain, continuing with normal flow"
  );
}

// Logique existante pour les autres cas (campagnes UTM, etc.)
bypassGeo(function (geolocationObj) {
  if (geolocationObj["result"]) {
    let forbiddenCountry = ["FR"];

    if (forbiddenCountry.includes(geolocationObj["data"])) {
      return;
    }
  }

  getConfig(configUrl)
    .then((data) => {
      globalConfig = data;

      getCommonCampaigns(function (commonCampaigns) {
        data.campaigns = mergeCampaigns(commonCampaigns, data.campaigns);
        verifyReOpenMessageDiv(globalConfig);
        verifyIsToCreateMessageDiv(globalConfig);

        if (getCookieBypass(globalConfig.agegateCookieName)) {
          AgeGateByPass.isToBypass = true;

          //start: fix problem with glengrant custom agegate
          setSessionStorage(
            globalConfig.agegateCookieName,
            globalConfig.agegateCookieValue
          );
          //end: fix problem with glengrant custom agegate

          let campaigns = data.campaigns;
          let campaignConfig;
          let result;
          for (let k in campaigns) {
            bypass_id = urlParams.get(k);
            if (bypass_id) {
              result = campaigns[k].hasOwnProperty(bypass_id);
            } else {
              result = false;
              // break;
            }

            if (!result) {
              break;
            }
          }

          hideDivAgeGate(globalConfig);

          if (result) {
            AgeGateByPass.comboCountryId = globalConfig.comboCountryId;
            createMessageDiv(globalConfig);
          }
        } else {
          if (globalConfig.isBypassActive) {
            let campaigns = data.campaigns;
            let campaignConfig;
            let result;
            for (let k in campaigns) {
              bypass_id = urlParams.get(k);
              if (bypass_id) {
                result = campaigns[k].hasOwnProperty(bypass_id);
              } else {
                result = false;
                // break;
              }

              if (result) {
                break;
              }
            }
            if (result) {
              AgeGateByPass.isToBypass = true;
              bypass(globalConfig);
              AgeGateByPass.comboCountryId = globalConfig.comboCountryId;
            }
            if (AgeGateByPass.isToBypass) {
              createMessageDiv(globalConfig);
            }

            console.log("AgeGateBypass exit with ", AgeGateByPass.isToBypass);
          }
        }
        return null;
      });
    })
    .catch((error) => {
      console.log("Error while fetching file : ", error);
    });
});

