/* ============================================================
   DESTILL — application shell (DOM layer).
   Classic script; expects window.DestillLogic.
   Real = browser-local only (metadata, preview, seek).
   Synthetic = labelled demonstration data, never implied real.
   Production analysis/rendering = visibly NOT connected.
   ============================================================ */
(function () {
  "use strict";
  var L = window.DestillLogic;

  var app = {
    state: "welcome",
    mode: null,            // "demo" | "real" | null
    source: null,          // {name, seconds, width, height, size, synthetic}
    intent: "",
    segments: [],
    evidence: [],
    playhead: 0,
    reached: { welcome: true },
    videoURL: null
  };

  var stage = document.getElementById("stage");
  var rail = document.getElementById("rail");
  var live = document.getElementById("live");
  var fileInput = null;

  /* ---------- icons ---------- */
  function icon(n, sw) {
    var s = sw || 1.6;
    var p = {
      drop:   '<path d="M12 3.5c3.6 4.3 6 7.4 6 10.4a6 6 0 0 1-12 0c0-3 2.4-6.1 6-10.4Z"/>',
      play:   '<path d="M8.5 5.8v12.4l10-6.2Z"/>',
      pause:  '<path d="M9 6v12M15 6v12"/>',
      film:   '<rect x="4" y="5.5" width="16" height="13" rx="3"/><path d="M8 5.5v13M16 5.5v13M4 10h4M4 14h4M16 10h4M16 14h4"/>',
      arrow:  '<path d="M5 12h13M13 6.5 19 12l-6 5.5"/>',
      back:   '<path d="M19 12H6M11 6.5 5 12l6 5.5"/>',
      x:      '<path d="m7 7 10 10M17 7 7 17"/>',
      check:  '<path d="m5.5 12.5 4.2 4.2L18.5 8"/>',
      warn:   '<path d="M12 4.5 21 19H3Z"/><path d="M12 10v4.2M12 16.8v.2"/>',
      info:   '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.2"/>',
      copy:   '<rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>',
      swap:   '<path d="M7 8h11l-3.2-3.2M17 16H6l3.2 3.2"/>',
      trash:  '<path d="M5 7h14M9.5 7V5.5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5V7M7 7l.8 12h8.4L17 7"/>',
      wand:   '<path d="M6 18 18 6M14.5 5.5l.6-2 .6 2 2 .6-2 .6-.6 2-.6-2-2-.6ZM6.2 9.4l.4-1.4.4 1.4 1.4.4-1.4.4-.4 1.4-.4-1.4-1.4-.4Z"/>',
      lock:   '<rect x="6" y="10.5" width="12" height="9" rx="2.5"/><path d="M9 10.5V8a3 3 0 0 1 6 0v2.5"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + s +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (p[n] || "") + "</svg>";
  }

  /* ---------- helpers ---------- */
  function el(q) { return stage.querySelector(q); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function announce(msg) { live.textContent = msg; }
  function duration() { return app.source ? app.source.seconds : 0; }

  function go(to, opts) {
    if (!L.canGo(app.state, to) && app.state !== to) {
      // step-rail jumps are allowed only along the recorded journey
      if (!(opts && opts.rail)) { return; }
    }
    app.state = to;
    app.reached[to] = true;
    render();
    if (!(opts && opts.silentHash)) {
      history.replaceState(null, "", "#/" + to + (app.mode === "demo" ? "?mode=demo" : ""));
    }
    announce("State: " + to.replace("-", " "));
    var h = stage.querySelector("[data-autofocus]");
    if (h) { h.focus({ preventScroll: false }); }
  }

  /* =========================================================
     STATE VIEWS
     ========================================================= */
  function vWelcome() {
    return '' +
    '<section class="card-hero d-card" data-view="welcome">' +
      '<p class="meta meta--accent">LOCAL-FIRST VIDEO COMPANION</p>' +
      '<h1 data-autofocus tabindex="-1">Understand the footage. Then decide the cut.</h1>' +
      '<p class="lede">Destill reads a video on this device, shows what it found as time-linked evidence, and drafts cuts you accept, change or reject. Nothing is uploaded.</p>' +
      '<div class="well-drop d-well--deep d-well" id="dropzone" role="button" tabindex="0">' +
        '<span class="medallion medallion--lg medallion--tone">' + icon("film") + '</span>' +
        '<p class="drop-title">Drop a video here</p>' +
        '<p class="drop-sub">or</p>' +
        '<span class="btn btn--primary" role="presentation">' + icon("arrow") + ' Choose a video file</span>' +
        '<p class="meta drop-meta">MP4 · MOV · WEBM — stays on this device</p>' +
      '</div>' +
      '<div class="hero-alt">' +
        '<span class="meta">NO FILE AT HAND?</span>' +
        '<button class="btn" id="demo-start">' + icon("wand") + ' Run the synthetic demo</button>' +
      '</div>' +
    '</section>';
  }

  function vSource() {
    var s = app.source;
    var demoBand = s.synthetic
      ? '<div class="demo-band"><span class="dot"></span>SYNTHETIC SOURCE — DEMONSTRATION ONLY</div>' : "";
    var metaLine = s.synthetic
      ? esc(s.name) + " · " + s.width + "×" + s.height + " · " + L.fmtTimePadded(s.seconds)
      : esc(s.name) + " · " + (s.width ? s.width + "×" + s.height + " · " : "") + L.fmtTimePadded(s.seconds) +
        (s.size ? " · " + Math.round(s.size / 1048576 * 10) / 10 + " MB" : "");
    return '' +
    '<section class="card-hero d-card" data-view="source">' +
      demoBand +
      '<h1 data-autofocus tabindex="-1">Source selected.</h1>' +
      '<p class="lede">Tell Destill what the edit should achieve, then analyze. Analysis reads content; it never renders.</p>' +
      '<div class="well-media d-well">' +
        '<div class="media-row">' +
          '<span class="medallion medallion--lg' + (s.synthetic ? ' medallion--tone' : '') + '">' + icon("film") + '</span>' +
          '<div class="media-meta"><strong>' + esc(s.name) + '</strong>' +
          '<span class="meta u-tabular">' + metaLine + '</span></div>' +
          '<div class="media-actions">' +
            '<button class="medallion" id="src-replace" title="Replace file" aria-label="Replace file">' + icon("swap") + '</button>' +
            '<button class="medallion" id="src-remove" title="Remove file" aria-label="Remove file">' + icon("trash") + '</button>' +
          '</div>' +
        '</div>' +
        (s.synthetic ? '' : '<video id="vid" controls preload="metadata" class="vid"></video>') +
      '</div>' +
      '<label class="field"><span class="meta">EDITING INTENT — OPTIONAL</span>' +
        '<input class="input" id="intent" maxlength="140" placeholder="e.g. Keep only the strong claims, about 90 seconds" value="' + esc(app.intent) + '"></label>' +
      '<div class="hero-actions">' +
        '<button class="btn btn--primary btn--lg" id="analyze">' + icon("wand") + ' Analyze</button>' +
        '<button class="btn" id="back-welcome">' + icon("back") + ' Start over</button>' +
      '</div>' +
      '<p class="meta foot-note">ANALYZE UNDERSTANDS · DESTILL EDITS LATER</p>' +
    '</section>';
  }

  function vProcessing() {
    return '' +
    '<section class="card-hero d-card" data-view="processing">' +
      '<div class="demo-band"><span class="dot"></span>SYNTHETIC PROCESSING — NO MODEL IS RUNNING</div>' +
      '<h1 data-autofocus tabindex="-1">Reading the footage…</h1>' +
      '<div class="proc-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="pbar"><div class="proc-fill" id="pfill"></div></div>' +
      '<div id="stages">' + app.stageRows(0) + "</div>" +
      '<div class="hero-actions"><button class="btn" id="cancel">' + icon("x") + " Cancel</button></div>" +
    "</section>";
  }

  function vCancelled() {
    return '' +
    '<section class="notice notice--warn" role="alert" data-view="cancelled">' +
      '<span class="medallion medallion--warn medallion--lg">' + icon("info") + "</span>" +
      "<div><h1 data-autofocus tabindex=\"-1\">Analysis cancelled.</h1>" +
      "<p>Nothing was stored and nothing was inferred. The source is still here when you are ready.</p>" +
      '<div class="actions"><button class="btn btn--primary" id="resume">' + icon("play") + " Resume analysis</button>" +
      '<button class="btn" id="back-source">' + icon("back") + " Back to source</button></div></div>" +
    "</section>";
  }

  function vBlockedAnalyze() {
    return '' +
    '<section class="notice" role="alert" data-view="blocked-analyze">' +
      '<span class="medallion medallion--lg">' + icon("lock") + "</span>" +
      "<div><h1 data-autofocus tabindex=\"-1\">Analysis is not connected in this build.</h1>" +
      "<p>Your file stayed on this device. This design proposal ships without an analysis engine, so nothing was uploaded, transcribed or inferred. The interface you see is the planned experience.</p>" +
      '<div class="actions"><button class="btn btn--primary" id="demo-instead">' + icon("wand") + " See it with the synthetic demo</button>" +
      '<button class="btn" id="back-source">' + icon("back") + " Keep my file</button></div></div>" +
    "</section>";
  }

  function vBlockedRender() {
    return '' +
    '<section class="notice" role="alert" data-view="blocked-render">' +
      '<span class="medallion medallion--lg">' + icon("lock") + "</span>" +
      "<div><h1 data-autofocus tabindex=\"-1\">Rendering is not connected in this build.</h1>" +
      "<p>An edited MP4 needs the production pipeline and your explicit consent to process the file. Neither exists yet, so no video was produced. The result screen shows the planned preview as a concept.</p>" +
      '<div class="actions"><button class="btn btn--primary" id="to-result">' + icon("arrow") + " View the result concept</button>" +
      '<button class="btn" id="back-refine">' + icon("back") + " Back to refine</button></div></div>" +
    "</section>";
  }

  function timelineHTML(interactive) {
    var d = duration();
    var segs = app.segments.map(function (s) {
      var left = (s.start / d * 100).toFixed(3);
      var w = ((s.end - s.start) / d * 100).toFixed(3);
      return '<div class="tl-seg" data-role="' + s.role + '" data-decision="' + (s.decision || "keep") +
        '" style="left:' + left + "%;width:calc(" + w + "% - 4px);margin-left:2px\" title=\"" + esc(s.title) + '"></div>';
    }).join("");
    var pct = d ? (app.playhead / d * 100) : 0;
    return '<div class="tl-wrap">' +
      '<div class="timeline" id="tl" role="slider" tabindex="0" aria-label="Source timeline" ' +
        'aria-valuemin="0" aria-valuemax="' + Math.round(d) + '" aria-valuenow="' + Math.round(app.playhead) + '" ' +
        'aria-valuetext="' + L.fmtTime(app.playhead) + ' of ' + L.fmtTime(d) + '">' +
        segs +
        '<div class="tl-thumb" id="thumb" style="left:' + pct + '%" aria-hidden="true"></div>' +
      "</div>" +
      '<div class="tl-row"><span class="tl-time u-tabular" id="tl-now">' + L.fmtTimePadded(app.playhead) + "</span>" +
      '<button class="medallion" id="pp" aria-label="Play or pause">' + icon(app.playing ? "pause" : "play") + "</button>" +
      '<span class="tl-time u-tabular">' + L.fmtTimePadded(d) + "</span></div></div>";
  }

  function vUnderstanding() {
    var ev = app.evidence.map(function (e) {
      return '<article class="evidence"><span class="medallion">' + icon("info") + "</span><div>" +
        "<h3>" + esc(e.text) + "</h3><p>Linked to " + esc(segTitle(e.seg)) + ".</p></div>" +
        '<button class="chip" data-seek="' + e.t + '"><span class="dot"></span>' + L.fmtTimePadded(e.t) + "</button></article>";
    }).join("");
    return '' +
    '<section class="d-card view-wide" data-view="understanding">' +
      (app.mode === "demo" ? '<div class="demo-band"><span class="dot"></span>SYNTHETIC UNDERSTANDING — DEMONSTRATION ONLY</div>' : "") +
      '<h1 data-autofocus tabindex="-1">What the footage says.</h1>' +
      '<p class="lede">A two-minute studio take argues one claim, shows it twice, and wanders once. The structure below is time-linked: select any moment to jump the source.</p>' +
      '<div class="msg d-well"><span class="meta">MAIN MESSAGE</span><p>Local-first review turns raw footage into decisions a human owns.</p></div>' +
      timelineHTML(true) +
      '<div class="u-cols">' +
        '<div><h2 class="sec">Story structure</h2><ol class="struct">' + app.segments.map(function (s) {
          return '<li><button class="chip" data-seek="' + s.start + '"><span class="dot"></span>' + L.fmtTimePadded(s.start) + "</button>" +
            "<div><strong>" + esc(s.title) + "</strong><span class=\"meta\">" + s.role.toUpperCase() + " · " + L.fmtTime(s.end - s.start) + "</span></div></li>";
        }).join("") + "</ol></div>" +
        '<div><h2 class="sec">Evidence</h2>' + ev + "</div>" +
      "</div>" +
      '<div class="hero-actions"><button class="btn btn--primary btn--lg" id="to-refine">' + icon("arrow") + " Refine the cut</button></div>" +
    "</section>";
  }

  function vRefine() {
    var o = L.computeOutcome(app.segments);
    var rows = app.segments.map(function (s) {
      return '<div class="seg-row" data-seg="' + s.id + '">' +
        '<button class="chip" data-seek="' + s.start + '"><span class="dot"></span>' + L.fmtTimePadded(s.start) + "–" + L.fmtTimePadded(s.end) + "</button>" +
        "<div class=\"seg-info\"><strong>" + esc(s.title) + "</strong><span>" + esc(s.note) + "</span></div>" +
        '<div class="seg seg--decide" role="radiogroup" aria-label="Decision for ' + esc(s.title) + '">' +
          ["keep", "change", "drop"].map(function (v) {
            return '<button role="radio" data-v="' + v + '" data-seg="' + s.id + '" aria-checked="' + (s.decision === v) + '">' + v.toUpperCase() + "</button>";
          }).join("") +
        "</div></div>";
    }).join("");
    return '' +
    '<section class="d-card view-wide" data-view="refine">' +
      (app.mode === "demo" ? '<div class="demo-band"><span class="dot"></span>SYNTHETIC DECISIONS — DEMONSTRATION ONLY</div>' : "") +
      '<h1 data-autofocus tabindex="-1">Decide the cut.</h1>' +
      '<p class="lede">Every segment gets one verdict. The outcome recomputes as you decide; dropped time falls away from the source, changed time stays but carries a rework note.</p>' +
      timelineHTML(true) +
      '<div class="outcome d-well">' +
        '<div><span class="meta">RESULTING RUNTIME</span><strong class="u-tabular" id="out-sec">' + L.fmtTimePadded(o.seconds) + "</strong></div>" +
        '<div><span class="meta">REMOVED</span><strong class="u-tabular">' + L.fmtTimePadded(o.removed) + "</strong></div>" +
        '<div><span class="meta">TARGET</span><strong class="u-tabular">&asymp; ' + L.fmtTimePadded(90) + "</strong></div>" +
        '<div><span class="meta">VERDICTS</span><strong id="out-counts">' + o.keep + " keep &middot; " + o.change + " change &middot; " + o.drop + " drop</strong></div>" +
      "</div>" +
      rows +
      '<div class="hero-actions">' +
        '<button class="btn btn--primary btn--lg" id="to-result">' + icon("wand") + " Destill a cut</button>" +
        '<button class="btn" id="export-mp4">' + icon("film") + " Export MP4 (production)</button>" +
      "</div>" +
    "</section>";
  }

  function vResult() {
    var o = L.computeOutcome(app.segments);
    var prompt = L.buildPrompt({ segments: app.segments, sourceName: app.source.name, intent: app.intent, targetSeconds: 90 });
    var frames = [0, 1, 2, 3, 4, 5].map(function (i) {
      return '<div class="frame f' + i + '"><span>' + L.fmtTimePadded(i * (o.seconds / 6)) + "</span></div>";
    }).join("");
    return '' +
    '<section class="d-card view-wide" data-view="result">' +
      '<div class="demo-band"><span class="dot"></span>RESULT CONCEPT — NO MP4 WAS RENDERED</div>' +
      '<h1 data-autofocus tabindex="-1">The cut, as a concept.</h1>' +
      '<p class="lede">This is the planned preview. In production this surface will hold the rendered ≈90-second MP4; in this build it honestly holds a design concept and the reasoning behind it.</p>' +
      '<div class="well-media d-well"><div class="frames" aria-label="Concept frame strip, illustrative">' + frames + "</div></div>" +
      '<div class="u-cols">' +
        '<div><h2 class="sec">Editing rationale</h2><ul class="why">' + app.segments.filter(function (s) { return s.decision !== "keep"; }).map(function (s) {
          return "<li><span class=\"meta\">" + (s.decision === "drop" ? "REMOVE" : "REWORK") + "</span> " + esc(s.title) + " — " + esc(s.note) + "</li>";
        }).join("") + "<li><span class=\"meta\">KEEP</span> Hook, core claim and first capture carry the argument in order.</li></ul></div>" +
        '<div><h2 class="sec">CapCut EditPilot prompt</h2>' +
          '<pre class="prompt d-well" id="prompt">' + esc(prompt) + "</pre>" +
          '<div class="hero-actions"><button class="btn" id="copy-prompt">' + icon("copy") + " Copy prompt</button></div>" +
        "</div>" +
      "</div>" +
      '<div class="hero-actions"><button class="btn btn--primary btn--lg" id="back-refine">' + icon("back") + " Back to refine</button></div>" +
    "</section>";
  }

  app.stageRows = function (idx) {
    return L.demoStages().map(function (st, i) {
      var cls = i < idx ? "is-done" : i === idx ? "is-now" : "";
      return '<div class="proc-stage ' + cls + '"><span class="p-dot">' + (i < idx ? "✓" : i + 1) + "</span>" + st.label + "</div>";
    }).join("");
  };
  function segTitle(id) {
    var s = app.segments.filter(function (x) { return x.id === id; })[0];
    return s ? s.title : "";
  }

  /* =========================================================
     RENDER
     ========================================================= */
  function render() {
    var views = {
      welcome: vWelcome, source: vSource, processing: vProcessing, cancelled: vCancelled,
      "blocked-analyze": vBlockedAnalyze, understanding: vUnderstanding, refine: vRefine,
      result: vResult, "blocked-render": vBlockedRender
    };
    stage.innerHTML = views[app.state]();
    renderRail();
    var chip = document.getElementById("mode-chip");
    if (chip) {
      chip.className = "mode-chip" + (app.mode === "demo" ? " is-demo" : app.mode === "real" ? " is-real" : "");
      chip.innerHTML = '<span class="dot"></span>' +
        (app.mode === "demo" ? "SYNTHETIC DEMO" : app.mode === "real" ? "LOCAL FILE" : "NO SOURCE");
    }
    wire();
  }

  function renderRail() {
    var steps = ["Source", "Understand", "Refine", "Destill"];
    var cur = L.stepOf(app.state);
    rail.innerHTML =
      '<nav class="rail-steps d-well" aria-label="Journey">' +
      steps.map(function (s, i) {
        var on = i === cur, done = i < cur;
        return '<button class="rail-step' + (on ? " is-on" : done ? " is-done" : "") + '" data-step="' + i + '"' +
          (i > maxStep() ? ' disabled' : '') + ' aria-current="' + (on ? "step" : "false") + '">' +
          '<span class="r-dot">' + (done ? "✓" : i + 1) + "</span>" + s + "</button>";
      }).join("") + "</nav>" +
      '<aside class="rail-card d-card--flat d-card" aria-label="What is real here"><h2 class="sec">What is real here</h2>' +
      '<ul class="truth"><li class="t-real"><strong>Real, on-device</strong><span>File picking, metadata, preview, seeking, decisions, prompt copy.</span></li>' +
      '<li class="t-syn"><strong>Synthetic, labelled</strong><span>Demo source, processing, understanding and outcomes.</span></li>' +
      '<li class="t-no"><strong>Not connected</strong><span>Analysis engine, rendering, uploads. Shown as blocked.</span></li></ul></aside>' +
      (app.state === "refine" || app.state === "result" ? outcomeMini() : "");
  }
  function maxStep() {
    var m = 0;
    Object.keys(app.reached).forEach(function (k) { m = Math.max(m, L.stepOf(k)); });
    return m;
  }
  function outcomeMini() {
    var o = L.computeOutcome(app.segments);
    return '<aside class="rail-card d-card--flat d-card" aria-label="Outcome"><h2 class="sec">Outcome</h2>' +
      '<p class="big-num u-tabular">' + L.fmtTimePadded(o.seconds) + "</p>" +
      '<p class="meta">FROM ' + L.fmtTimePadded(o.total) + " SOURCE · REMOVED " + L.fmtTimePadded(o.removed) + "</p></aside>";
  }

  /* =========================================================
     WIRING
     ========================================================= */
  function wire() {
    bind("#demo-start", "click", startDemo);
    bind("#demo-instead", "click", function () { startDemo(); });
    bind("#analyze", "click", function () {
      if (app.mode === "demo") { go("processing"); startProcessing(); }
      else { go("blocked-analyze"); }
    });
    bind("#back-welcome", "click", function () { go("welcome"); });
    bind("#back-source", "click", function () { go("source"); });
    bind("#resume", "click", function () { go("processing"); startProcessing(); });
    bind("#cancel", "click", function () { stopProcessing(); go("cancelled"); });
    bind("#src-remove", "click", function () { clearSource(); go("welcome"); });
    bind("#src-replace", "click", function () { if (fileInput) fileInput.click(); });
    bind("#to-refine", "click", function () { go("refine"); });
    bind("#to-result", "click", function () { go("result"); });
    bind("#back-refine", "click", function () { go("refine"); });
    bind("#export-mp4", "click", function () { go("blocked-render"); });
    bind("#copy-prompt", "click", copyPrompt);

    var dz = el("#dropzone");
    if (dz) {
      dz.addEventListener("click", function () { if (fileInput) fileInput.click(); });
      dz.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (fileInput) fileInput.click(); }
      });
      ["dragenter", "dragover"].forEach(function (t) {
        dz.addEventListener(t, function (e) { e.preventDefault(); dz.classList.add("is-drag"); });
      });
      ["dragleave", "drop"].forEach(function (t) {
        dz.addEventListener(t, function (e) { e.preventDefault(); dz.classList.remove("is-drag"); });
      });
      dz.addEventListener("drop", function (e) {
        var f = e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) acceptFile(f);
      });
    }

    var intent = el("#intent");
    if (intent) intent.addEventListener("input", function () { app.intent = intent.value; });

    /* decisions */
    stage.querySelectorAll(".seg--decide [role=radio]").forEach(function (b) {
      b.addEventListener("click", function () {
        var seg = app.segments.filter(function (s) { return s.id === b.dataset.seg; })[0];
        if (seg) { seg.decision = b.dataset.v; render(); }
      });
    });

    /* seeking */
    stage.querySelectorAll("[data-seek]").forEach(function (c) {
      c.addEventListener("click", function () { seek(parseFloat(c.dataset.seek)); });
    });

    wireTimeline();
    wirePlayback();
  }

  function bind(q, ev, fn) {
    var n = el(q);
    if (n) n.addEventListener(ev, fn);
  }

  /* ---------- source handling ---------- */
  function acceptFile(f) {
    if (!/^video\//.test(f.type) && !/\.(mp4|mov|webm|m4v)$/i.test(f.name)) {
      showError("That file is not a video. Destill accepted nothing — choose an MP4, MOV or WEBM.");
      return;
    }
    clearURL();
    app.mode = "real";
    app.source = { synthetic: false, name: f.name, size: f.size, seconds: 0, width: 0, height: 0 };
    app.videoURL = URL.createObjectURL(f);
    app.state = "source"; app.reached.source = true;
    render();
    var v = el("#vid");
    if (v) {
      v.src = app.videoURL;
      v.addEventListener("loadedmetadata", function () {
        app.source.seconds = Math.round(v.duration);
        app.source.width = v.videoWidth; app.source.height = v.videoHeight;
        render();
        announce("Source metadata read: " + L.fmtTime(app.source.seconds));
      });
      v.addEventListener("error", function () {
        showError("The file could not be decoded on this device. Nothing was uploaded.");
      });
    }
  }
  function showError(msg) {
    app.state = "welcome";
    render();
    stage.insertAdjacentHTML("afterbegin",
      '<section class="notice notice--danger" role="alert"><span class="medallion medallion--danger medallion--lg">' +
      icon("warn") + '</span><div><h1>Needs a decision.</h1><p>' + esc(msg) + "</p>" +
      '<div class="actions"><button class="btn btn--primary" id="err-ok">Understood</button></div></div></section>');
    var ok = el("#err-ok");
    if (ok) ok.addEventListener("click", function () { ok.closest(".notice").remove(); });
    announce("Error: " + msg);
  }
  function clearSource() { clearURL(); app.source = null; app.mode = null; app.segments = []; app.evidence = []; }
  function clearURL() { if (app.videoURL) { URL.revokeObjectURL(app.videoURL); app.videoURL = null; } }

  function startDemo() {
    clearURL();
    app.mode = "demo";
    app.source = JSON.parse(JSON.stringify(L.DEMO_SOURCE));
    app.segments = L.demoSegments();
    app.evidence = L.demoEvidence();
    app.playhead = 0;
    go("source", { rail: true });
    if (app.state !== "source") app.state = "source", render();
  }

  /* ---------- processing ---------- */
  var procTimer = null;
  function startProcessing() {
    stopProcessing();
    var stages = L.demoStages(), i = 0, p = 0;
    procTimer = setInterval(function () {
      p += 100 / (stages.length * 14);
      if (p >= 100) { p = 100; stopProcessing(); go("understanding"); return; }
      var idx = Math.min(stages.length - 1, Math.floor(p / (100 / stages.length)));
      if (idx !== i) { i = idx; var st = el("#stages"); if (st) st.innerHTML = app.stageRows(idx); }
      var fill = el("#pfill"), bar = el("#pbar");
      if (fill) fill.style.width = p + "%";
      if (bar) bar.setAttribute("aria-valuenow", Math.round(p));
    }, 120);
  }
  function stopProcessing() { if (procTimer) { clearInterval(procTimer); procTimer = null; } }

  /* ---------- timeline & playback ---------- */
  function seek(t) {
    var d = duration();
    app.playhead = Math.max(0, Math.min(d, t));
    var v = el("#vid");
    if (v && app.mode === "real" && d) { v.currentTime = app.playhead; }
    paintPlayhead();
  }
  function paintPlayhead() {
    var d = duration() || 1;
    var th = el("#thumb"), now = el("#tl-now"), tl = el("#tl");
    if (th) th.style.left = (app.playhead / d * 100) + "%";
    if (now) now.textContent = L.fmtTimePadded(app.playhead);
    if (tl) { tl.setAttribute("aria-valuenow", Math.round(app.playhead)); tl.setAttribute("aria-valuetext", L.fmtTime(app.playhead) + " of " + L.fmtTime(d)); }
  }
  function wireTimeline() {
    var tl = el("#tl");
    if (!tl) return;
    function pos(e) {
      var r = tl.getBoundingClientRect();
      return ((e.clientX - r.left) / r.width) * duration();
    }
    var dragging = false;
    tl.addEventListener("pointerdown", function (e) { dragging = true; tl.setPointerCapture(e.pointerId); seek(pos(e)); });
    tl.addEventListener("pointermove", function (e) { if (dragging) seek(pos(e)); });
    tl.addEventListener("pointerup", function () { dragging = false; });
    tl.addEventListener("keydown", function (e) {
      var d = duration();
      if (e.key === "ArrowRight") { seek(app.playhead + 5); e.preventDefault(); }
      if (e.key === "ArrowLeft") { seek(app.playhead - 5); e.preventDefault(); }
      if (e.key === "Home") { seek(0); e.preventDefault(); }
      if (e.key === "End") { seek(d); e.preventDefault(); }
    });
    var v = el("#vid");
    if (v) v.addEventListener("timeupdate", function () { if (!app.playingDrag) { app.playhead = v.currentTime; paintPlayhead(); } });
  }
  var rafId = null;
  function wirePlayback() {
    var pp = el("#pp");
    if (!pp) return;
    pp.addEventListener("click", function () {
      if (app.mode === "real") {
        var v = el("#vid");
        if (!v) return;
        if (v.paused) { v.play(); app.playing = true; } else { v.pause(); app.playing = false; }
        pp.innerHTML = icon(app.playing ? "pause" : "play");
      } else {
        app.playing = !app.playing;
        pp.innerHTML = icon(app.playing ? "pause" : "play");
        if (app.playing) tickDemo(); else if (rafId) cancelAnimationFrame(rafId);
      }
    });
  }
  function tickDemo() {
    var last = performance.now();
    function step(now) {
      if (!app.playing) return;
      app.playhead += (now - last) / 1000; last = now;
      if (app.playhead >= duration()) { app.playhead = 0; app.playing = false; var pp = el("#pp"); if (pp) pp.innerHTML = icon("play"); }
      paintPlayhead();
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
  }

  /* ---------- copy prompt ---------- */
  function copyPrompt() {
    var pre = el("#prompt");
    if (!pre) return;
    var text = pre.textContent;
    function done() {
      var b = el("#copy-prompt");
      if (b) { b.innerHTML = icon("check") + " Copied"; setTimeout(function () { b.innerHTML = icon("copy") + " Copy prompt"; }, 1600); }
      announce("CapCut EditPilot prompt copied to clipboard.");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { legacy(); });
    } else { legacy(); }
    function legacy() {
      var ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta); done();
    }
  }

  /* ---------- rail steps ---------- */
  rail.addEventListener("click", function (e) {
    var b = e.target.closest(".rail-step");
    if (!b || b.disabled) return;
    var i = parseInt(b.dataset.step, 10);
    var target = { 0: "source", 1: "understanding", 2: "refine", 3: "result" }[i];
    if (target && app.reached[target]) { app.state = target; render(); history.replaceState(null, "", "#/" + target + (app.mode === "demo" ? "?mode=demo" : "")); }
  });

  /* ---------- boot ---------- */
  function boot() {
    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "video/*,.mp4,.mov,.webm,.m4v";
    fileInput.hidden = true;
    fileInput.addEventListener("change", function () {
      if (fileInput.files && fileInput.files[0]) acceptFile(fileInput.files[0]);
      fileInput.value = "";
    });
    document.body.appendChild(fileInput);

    applyHash();
    render();
  }

  function applyHash() {
    var m = location.hash.match(/^#\/([a-z-]+)(\?mode=(demo))?/);
    if (!m) { return; }
    var st = m[1];
    if (L.STATES.indexOf(st) === -1) { return; }
    if (m[2] === "?mode=demo") {
      if (app.mode !== "demo" || !app.source) {
        app.mode = "demo";
        app.source = JSON.parse(JSON.stringify(L.DEMO_SOURCE));
        app.segments = L.demoSegments();
        app.evidence = L.demoEvidence();
      }
      app.state = st;
      app.reached[st] = true;
    } else if (st === "welcome") {
      app.state = "welcome";
    }
  }
  window.addEventListener("hashchange", function () { applyHash(); render(); });
  boot();
})();
