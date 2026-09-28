// Front-end for weather_app.py — plays the role Tkinter played in the desktop version.
(function () {
  "use strict";

  var REFRESH_SECONDS = 30 * 60; // same 30 minute auto-refresh as the original app
  var $ = function (id) { return document.getElementById(id); };
  var searchFn = null;
  var lastCity = null;
  var remaining = REFRESH_SECONDS;
  var timer = null;

  function log(text, kind) {
    var line = document.createElement("span");
    line.className = kind ? "log-" + kind : "";
    line.textContent = text + "\n";
    $("console").appendChild(line);
    $("console").scrollTop = $("console").scrollHeight;
  }

  function setStatus(text, state) {
    $("status").textContent = text;
    $("status-dot").className = "badge__dot badge__dot--" + state;
  }

  // ---- Recent searches (per-visitor convenience only) ----
  function getRecent() {
    try { return JSON.parse(localStorage.getItem("weather-recent") || "[]"); } catch (e) { return []; }
  }
  function saveRecent(city) {
    var list = [city].concat(getRecent().filter(function (c) { return c.toLowerCase() !== city.toLowerCase(); })).slice(0, 5);
    try { localStorage.setItem("weather-recent", JSON.stringify(list)); } catch (e) { /* storage unavailable */ }
    renderRecent();
  }
  function renderRecent() {
    var box = $("recent");
    box.textContent = "";
    getRecent().concat(getRecent().length ? [] : ["Ottawa", "Toronto", "Tokyo", "London, GB"]).forEach(function (city) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = city;
      b.disabled = !searchFn;
      b.addEventListener("click", function () { $("city").value = city; search(city); });
      box.appendChild(b);
    });
  }

  // ---- 30 minute countdown ----
  function pad(n) { return String(n).padStart(2, "0"); }
  function renderTimer() {
    $("t-h").textContent = pad(Math.floor(remaining / 3600));
    $("t-m").textContent = pad(Math.floor((remaining % 3600) / 60));
    $("t-s").textContent = pad(remaining % 60);
  }
  function startTimer() {
    clearInterval(timer);
    remaining = REFRESH_SECONDS;
    renderTimer();
    timer = setInterval(function () {
      remaining -= 1;
      if (remaining <= 0) {
        log("# 30 minutes passed — refreshing like the original app", "comment");
        search(lastCity, true);
        return;
      }
      renderTimer();
    }, 1000);
  }

  // ---- Call into Python ----
  async function search(city, isRefresh) {
    city = (city || "").trim();
    if (!searchFn || !city) return;
    $("search-btn").disabled = true;
    $("error").hidden = true;
    log(">>> await search(" + JSON.stringify(city) + ")", "cmd");
    try {
      var data = JSON.parse(await searchFn(city));
      if (data.error) {
        log(data.error, "err");
        $("error").textContent = data.error;
        $("error").hidden = false;
        return;
      }
      log(data.tuple, "out");
      $("location").textContent = data.location;
      $("temp").textContent = data.temp;
      $("desc").textContent = data.description;
      $("icon").src = "icons/" + data.icon;
      $("icon").alt = data.description;
      $("wind").textContent = data.wind;
      $("humidity").textContent = data.humidity;
      $("result").hidden = false;
      lastCity = city;
      if (!isRefresh) saveRecent(city);
      history.replaceState(null, "", "?city=" + encodeURIComponent(city));
      startTimer();
    } catch (err) {
      log(String(err), "err");
      $("error").textContent = "Something went wrong fetching the weather. Please try again.";
      $("error").hidden = false;
    } finally {
      $("search-btn").disabled = false;
    }
  }

  $("search-form").addEventListener("submit", function (e) {
    e.preventDefault();
    search($("city").value);
  });

  // ---- Boot Pyodide and load the real Python file ----
  async function boot() {
    renderRecent();
    log("# Downloading Python (WebAssembly) — cached after the first visit…", "comment");
    var started = performance.now();
    try {
      var source = await fetch("weather_app.py").then(function (r) { return r.text(); });
      $("source").textContent = source;
      var pyodide = await loadPyodide();
      var version = pyodide.runPython("import sys; sys.version.split()[0]");
      await pyodide.runPythonAsync(source);
      searchFn = pyodide.globals.get("search");
      var secs = ((performance.now() - started) / 1000).toFixed(1);
      log("Python " + version + " ready in " + secs + "s", "ok");
      log(">>> import weather_app  # loaded", "cmd");
      setStatus("Python " + version + " running in your browser", "ok");
      $("city").disabled = false;
      $("search-btn").disabled = false;
      renderRecent();

      var initial = new URLSearchParams(location.search).get("city");
      if (initial) {
        $("city").value = initial.slice(0, 100);
        search(initial);
      } else {
        $("city").focus();
      }
    } catch (err) {
      log(String(err), "err");
      setStatus("Python failed to load", "err");
      $("error").textContent = "Couldn't start Python in this browser. Please refresh, or try a recent version of Chrome, Firefox, Safari or Edge.";
      $("error").hidden = false;
    }
  }

  boot();
})();
