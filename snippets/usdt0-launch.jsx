
export const Usdt0Launch = () => {
  const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400..600&display=swap');
/* Every rule is scoped under .usdt0 so nothing leaks into the Mintlify chrome.
   Dark mode follows Mintlify's html.dark class. --usdt0-top is where the sticky
   section bar parks; 0 because the Mintlify navbar is hidden on this page. */
.usdt0{
  --paper:#FFFFFF; --paper-2:#F9F9F9; --paper-3:#F2F2F2;
  --ink:#0F0F0F; --ink-2:#4A4A4A; --ink-3:#6B6B6B;
  --rule:#D8D8D8; --rule-2:#E6E6E6;
  --accent:#FDDA24; --accent-soft:#FDDA2440;
  --accent-ink:#7A5C00; --on-accent:#0F0F0F;
  --usdt0-top:0px;
}
/* the launch page carries its own header, so the Mintlify navbar is hidden.
   This stylesheet only exists while the component is mounted, so other pages keep theirs. */
#navbar{display:none !important}
html.dark .usdt0{
  --paper:#0F0F0F; --paper-2:#191919; --paper-3:#080808;
  --ink:#F5F5F0; --ink-2:#B8B8B0; --ink-3:#8E8E86;
  --rule:#474747; --rule-2:#333333;
  --accent:#FDDA24; --accent-soft:#FDDA2422;
  --accent-ink:#FDDA24; --on-accent:#0F0F0F;
}
.usdt0,.usdt0 *{box-sizing:border-box}
.usdt0{
  background:var(--paper); color:var(--ink);
  font-family:"Inter","Helvetica Neue",Arial,sans-serif;
  font-size:15px; line-height:1.6; -webkit-font-smoothing:antialiased;
}
.usdt0 a{color:inherit;text-decoration:none;font-weight:inherit}
.usdt0 code::before,.usdt0 code::after{content:none}
.usdt0 .sheet{max-width:1300px;margin:0 auto;padding:22px 24px 64px}
/* ---------- header ---------- */
/* sticky, so the section markers stay useful once you have scrolled past them */
.usdt0 .top{
  position:sticky;top:var(--usdt0-top);z-index:20;background:var(--paper);
  display:flex;align-items:center;justify-content:space-between;gap:20px;
  font-family:"IBM Plex Mono",ui-monospace,monospace;
  font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2);
  border-bottom:1px solid var(--rule);padding:12px 0 10px;
}
.usdt0 .secnav{display:flex;gap:5px;align-items:center}
.usdt0 .top-r{display:flex;align-items:center;gap:18px}
.usdt0 .toplink{color:var(--ink-2);text-decoration:none;border-bottom:1px solid var(--rule);
         letter-spacing:inherit;white-space:nowrap}
.usdt0 .toplink:hover{color:var(--accent-ink);border-bottom-color:var(--accent-ink)}
.usdt0 .toplink:focus-visible{outline:2px solid var(--accent-ink);outline-offset:3px}
@media (max-width:560px){ .usdt0 .toplink{display:none} }
.usdt0 .tick{
  width:11px;height:11px;border:1px solid var(--ink-2);
  background:transparent;display:block;
  transition:background .15s ease,border-color .15s ease;
}
.usdt0 .tick:hover{border-color:var(--accent-ink);background:var(--accent-soft)}
.usdt0 .tick[aria-current="true"]{background:var(--accent);border-color:var(--accent-ink)}
.usdt0 .tick:focus-visible{outline:2px solid var(--accent-ink);outline-offset:3px}
/* the tick stays 11px to look at and gets an invisible target around it. The
   horizontal reach is tied to the gap so neighbours never overlap: 15px wide
   on a mouse, and on touch the gap opens up so the target clears the 24x24
   minimum. Vertical reach is free either way. */
.usdt0 .tick{position:relative}
.usdt0 .tick::after{content:"";position:absolute;inset:-16px -2px}
@media (pointer:coarse){
  .usdt0 .secnav{gap:16px}
  .usdt0 .tick::after{inset:-16px -8px}
}
/* the wider touch gap costs the header its single line at phone widths, so the
   label tightens to compensate rather than wrapping */
@media (max-width:430px){ .usdt0 .top{font-size:10px;letter-spacing:.10em} }
/* anchor jumps must clear the Mintlify navbar and the sticky bar */
.usdt0 figure[id],.usdt0 section[id]{scroll-margin-top:calc(var(--usdt0-top) + 64px)}
/* Inter needs display tuning the condensed face did not: more negative
   tracking, and a little more leading for its taller x-height and longer
   descenders. The accent is a block so the color change lands on the line
   break instead of stranding a word at the end of line one. */
.usdt0 h1{
  font-family:"Inter","Helvetica Neue",Arial,sans-serif;color:var(--ink);
  font-weight:600;font-size:clamp(34px,5.4vw,58px);line-height:1.06;
  letter-spacing:-.03em;margin:26px 0 10px;max-width:24ch;text-wrap:balance;
}
.usdt0 h1 em{display:block;font-style:normal;color:var(--accent-ink)}
.usdt0 .deck{max-width:62ch;color:var(--ink-2);font-size:17px;margin:0 0 8px}
.usdt0 .deck strong{color:var(--ink);font-weight:500}
/* ---------- figure chrome ---------- */
.usdt0 figure{margin:34px 0 0;border:1px solid var(--rule);background:var(--paper-2)}
.usdt0 .fig-head{
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  border-bottom:1px solid var(--rule);padding:9px 14px;
  font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:10.5px;
  letter-spacing:.13em;text-transform:uppercase;color:var(--ink-2);
}
.usdt0 .fig-body{padding:16px 14px;overflow-x:auto}
.usdt0 .fig-body>svg{min-width:620px}
.usdt0 figcaption{
  border-top:1px solid var(--rule);padding:10px 14px;
  font-size:13.5px;color:var(--ink-2);
}
.usdt0 svg{display:block;max-width:100%;height:auto}
.usdt0 .n-box{fill:var(--paper-2);stroke:currentColor;stroke-width:1}
.usdt0 .n-box.alt{fill:var(--paper-3)}
.usdt0 .n-box.hot{stroke:var(--accent-ink);stroke-width:1.6;fill:var(--accent-soft)}
.usdt0 .n-t{font-family:"Inter","Helvetica Neue",Arial,sans-serif;font-weight:600;font-size:14px;fill:currentColor}
.usdt0 .n-t.hot{fill:var(--accent-ink)}
.usdt0 .n-s{font-family:"IBM Plex Mono",monospace;font-size:10px;fill:var(--ink-3);letter-spacing:.04em}
.usdt0 .edge{stroke:currentColor;stroke-width:1;fill:none}
.usdt0 .edge.dash{stroke-dasharray:5 4;stroke:var(--ink-3)}
/* One 12.5s cycle tells the whole story once: a packet leaves Ethereum, splits
   at the fork, both halves land together, the far-chain half climbs into the
   Stellar OFT, and one packet carries on. Every leg runs at the same ~55px/s —
   each duration is that path's measured length over that rate — so the pacing
   is uniform even though the legs are different lengths. Boxes light on arrival. */
.usdt0 .pkt{fill:var(--accent-ink);opacity:0}
.usdt0 .lit{fill:var(--accent-soft);stroke:var(--accent-ink);stroke-width:1.6;opacity:0}
.usdt0 .pkt.pTrunk{offset-path:path("M 184 201 H 232");animation:usdt0-pTrunk 12.5s linear infinite}
@keyframes usdt0-pTrunk{0%,0.00%{offset-distance:0%;opacity:0}0.50%{opacity:1}6.70%{opacity:1}7.20%,100%{offset-distance:100%;opacity:0}}
.usdt0 .pkt.pUp{offset-path:path("M 232 201 V 110 H 286");animation:usdt0-pUp 12.5s linear infinite}
@keyframes usdt0-pUp{0%,7.20%{offset-distance:0%;opacity:0}8.66%{opacity:1}26.54%{opacity:1}28.00%,100%{offset-distance:100%;opacity:0}}
.usdt0 .pkt.pDown{offset-path:path("M 232 201 V 292 H 286");animation:usdt0-pDown 12.5s linear infinite}
@keyframes usdt0-pDown{0%,7.20%{offset-distance:0%;opacity:0}8.66%{opacity:1}26.54%{opacity:1}28.00%,100%{offset-distance:100%;opacity:0}}
.usdt0 .pkt.pClimb{offset-path:path("M 384 254 V 168");animation:usdt0-pClimb 12.5s linear infinite}
@keyframes usdt0-pClimb{0%,32.80%{offset-distance:0%;opacity:0}33.86%{opacity:1}46.94%{opacity:1}48.00%,100%{offset-distance:100%;opacity:0}}
.usdt0 .pkt.pMint{offset-path:path("M 478 110 H 528 V 201 H 574");animation:usdt0-pMint 12.5s linear infinite}
@keyframes usdt0-pMint{0%,52.00%{offset-distance:0%;opacity:0}53.90%{opacity:1}77.30%{opacity:1}79.20%,100%{offset-distance:100%;opacity:0}}
.usdt0 .pkt.pUse1{offset-path:path("M 764 171 H 812");animation:usdt0-pUse 12.5s linear infinite}
.usdt0 .pkt.pUse2{offset-path:path("M 764 201 H 812");animation:usdt0-pUse 12.5s linear infinite}
.usdt0 .pkt.pUse3{offset-path:path("M 764 231 H 812");animation:usdt0-pUse 12.5s linear infinite}
@keyframes usdt0-pUse{0%,82.40%{offset-distance:0%;opacity:0}82.90%{opacity:1}89.10%{opacity:1}89.60%,100%{offset-distance:100%;opacity:0}}
.usdt0 .lit.lEth{animation:usdt0-lEth 12.5s linear infinite}
@keyframes usdt0-lEth{0%{opacity:0}0.00%{opacity:0}1.20%{opacity:1}4.40%{opacity:0}100%{opacity:0}}
.usdt0 .lit.lOft{animation:usdt0-lOft 12.5s linear infinite}
@keyframes usdt0-lOft{0%{opacity:0}28.00%{opacity:0}29.20%{opacity:1}32.40%{opacity:0}48.00%{opacity:0}49.20%{opacity:1}52.40%{opacity:0}100%{opacity:0}}
.usdt0 .lit.lChain{animation:usdt0-lChain 12.5s linear infinite}
@keyframes usdt0-lChain{0%{opacity:0}28.00%{opacity:0}29.20%{opacity:1}32.40%{opacity:0}100%{opacity:0}}
.usdt0 .lit.lHot{animation:usdt0-lHot 12.5s linear infinite}
@keyframes usdt0-lHot{0%{opacity:0}79.20%{opacity:0}80.40%{opacity:1}83.60%{opacity:0}100%{opacity:0}}
.usdt0 .lit.lUse{animation:usdt0-lUse 12.5s linear infinite}
@keyframes usdt0-lUse{0%{opacity:0}89.60%{opacity:0}90.80%{opacity:1}94.00%{opacity:0}100%{opacity:0}}
/* ---------- fig 2: the USDT0 folder ---------- */
/* One folder — USDT0 — with its layers stacked behind its cover, offset
   down-left so every name stays readable. Percentage geometry, so the stack
   scales instead of scrolling. */
.usdt0 .fig-files{padding:0 40px 30px}
.usdt0 .folder-fig{display:flex;gap:34px;align-items:flex-start;justify-content:center;padding:26px 40px 30px}
.usdt0 .desc{flex:1 1 0;min-width:0;max-width:620px;display:flex;flex-direction:column;gap:12px}
.usdt0 .d-eyebrow{
  font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--accent-ink);
}
.usdt0 .d-head{
  font-family:"Inter","Helvetica Neue",Arial,sans-serif;font-weight:600;
  font-size:clamp(24px,2.6vw,36px);line-height:1.1;margin:0;
  letter-spacing:-.022em;text-wrap:balance;color:var(--ink);
}
.usdt0 .d-claim{margin:0;font-size:15.5px;color:var(--ink);max-width:56ch}
.usdt0 dl{margin:2px 0 0;display:flex;flex-direction:column;gap:12px;
   border-top:1px solid var(--rule);padding-top:14px}
.usdt0 dt{
  font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--ink-3);margin-bottom:3px;font-weight:400;
}
.usdt0 dd{margin:0;font-size:14.5px;color:var(--ink-2);max-width:64ch}
.usdt0 dd code{
  font-family:"IBM Plex Mono",monospace;font-size:12.5px;
  background:var(--paper-3);border:1px solid var(--rule-2);padding:.5px 4px;color:var(--ink);
}
/* source links: quiet by default, accent on hover — a claim you can check */
.usdt0 dd a,.usdt0 .id-note a,.usdt0 .dep-note a,.usdt0 .ncopy a,.usdt0 figcaption a{
  color:inherit;text-decoration:none;
  border-bottom:1px solid var(--rule);
}
.usdt0 dd a:hover,.usdt0 .id-note a:hover,.usdt0 .dep-note a:hover,.usdt0 .ncopy a:hover,
.usdt0 figcaption a:hover{
  color:var(--accent-ink);border-bottom-color:var(--accent-ink);
}
.usdt0 dd a:focus-visible,.usdt0 .id-note a:focus-visible,
.usdt0 .dep-note a:focus-visible,.usdt0 .ncopy a:focus-visible,.usdt0 figcaption a:focus-visible{
  outline:2px solid var(--accent-ink);outline-offset:2px;border-bottom-color:transparent;
}
.usdt0 dd a code,.usdt0 .dep-note a code,.usdt0 .ncopy a code{border-bottom:0}
.usdt0 .sources{
  margin-top:26px;border-top:1px solid var(--rule);padding-top:10px;
  display:flex;gap:18px;align-items:baseline;flex-wrap:wrap;
  font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.13em;
  text-transform:uppercase;color:var(--ink-3);
}
.usdt0 .sources b{font-weight:400;color:var(--ink-3);margin-right:4px}
.usdt0 .sources a{color:var(--ink-2);text-decoration:none;border-bottom:1px solid var(--rule)}
.usdt0 .sources a:hover{color:var(--accent-ink);border-bottom-color:var(--accent-ink)}
.usdt0 .sources a:focus-visible{outline:2px solid var(--accent-ink);outline-offset:3px}
/* ---- the stack: folders in a folder ---- */
/* back to front. Each folder's tab sits on the left of its top edge, and the
   down-left offset keeps every tab uncovered. */
.usdt0 .stackwrap{flex:0 0 clamp(250px,42%,520px);min-width:0;
  /* the stack is shorter than the description beside it, so center it
     rather than let the leftover height pool at the bottom of the panel */
  align-self:center}
.usdt0 .stack{position:relative;width:100%;aspect-ratio:var(--ar,1.316);container-type:inline-size}
.usdt0 .file{
  position:absolute;width:var(--fw,70.59%);height:var(--fh,61.29%);
  text-align:left;transition:transform .16s ease;
}
.usdt0 .fo{position:absolute;inset:0;width:100%;height:100%;shape-rendering:geometricPrecision}
/* fill and outline are separate paths: the tab is painted between them, so
   the silhouette's stroke is drawn last and never gets covered. */
.usdt0 .fo-body{fill:var(--paper)}
.usdt0 .fo-tab{fill:none;transition:fill .16s ease}
.usdt0 .fo-edge{
  fill:none;stroke:var(--ink-2);stroke-width:1.5;
  vector-effect:non-scaling-stroke;stroke-linejoin:round;
  transition:stroke .16s ease,stroke-width .16s ease;
}
.usdt0 .fname{
  position:absolute;left:0;top:0;width:40.97%;height:12.63%;
  padding:0 5% 0 5.5%;display:flex;align-items:center;
  font-family:"IBM Plex Mono",monospace;
  font-size:clamp(6.5px,2.37cqw,11px);letter-spacing:.05em;color:var(--ink-2);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  transition:color .16s ease;
}
.usdt0 .file:hover .fo-edge{stroke:var(--accent-ink)}
.usdt0 .file:hover .fname{color:var(--accent-ink)}
/* the cover: the folder these sit in */
.usdt0 .cover .fo-body{fill:var(--paper)}
.usdt0 .cover .fo-edge{stroke:var(--accent-ink);stroke-width:2}
.usdt0 .cover .fo-tint{fill:var(--accent);opacity:.10}
.usdt0 .cover .fname{color:var(--accent-ink)}
.usdt0 .cover-body{position:absolute;left:5.5%;right:8%;top:24%}
.usdt0 .cover-name{
  display:block;font-family:"Inter","Helvetica Neue",Arial,sans-serif;font-weight:600;
  font-size:clamp(15px,6.1cqw,29px);line-height:1.1;color:var(--accent-ink);
  letter-spacing:-.01em;
}
.usdt0 .cover-sub{
  display:block;margin-top:7%;font-family:"IBM Plex Mono",monospace;
  font-size:clamp(7px,2.46cqw,12px);line-height:1.7;color:var(--ink-2);
}
/* ---- narrow: stack above, description below ---- */
@media (max-width:820px){
  .usdt0 .folder-fig{flex-direction:column;gap:22px;padding:20px 14px 24px}
  .usdt0 .stackwrap{flex:0 0 auto;width:100%;max-width:380px;align-self:flex-start}
  .usdt0 .desc{width:100%;max-width:none}
  .usdt0 .d-claim,.usdt0 dd{max-width:none}
}
/* ---- access: the files shown at once, as benefits under the feature ---- */
.usdt0 .files{
  border-top:1px solid var(--rule);
  display:grid; grid-template-columns:repeat(var(--cols,5),minmax(0,1fr));
}
.usdt0 .fcol{padding:18px 20px 4px; border-right:1px solid var(--rule);
  display:flex; flex-direction:column}
.usdt0 .fcol:last-child{border-right:0}
.usdt0 .fcol:first-child{padding-left:0}
.usdt0 .ftag{
  font-family:"IBM Plex Mono",monospace; font-size:9.5px; letter-spacing:.14em;
  text-transform:uppercase; color:var(--accent-ink); margin-bottom:7px;
}
.usdt0 .fhead{
  font-family:"Inter","Helvetica Neue",Arial,sans-serif; font-weight:600;
  font-size:19px; line-height:1.12; letter-spacing:-.01em; color:var(--ink); margin:0 0 9px;
}
.usdt0 .fcopy{margin:0 0 14px; font-size:13.5px; line-height:1.5; color:var(--ink-2)}
@media (max-width:1000px){
  .usdt0 .files{grid-template-columns:repeat(2,minmax(0,1fr))}
  .usdt0 .fcol{border-bottom:1px solid var(--rule); padding-left:20px}
  .usdt0 .fcol:first-child{padding-left:20px}
  .usdt0 .fcol:nth-child(2n){border-right:0}
  .usdt0 .fcol:nth-last-child(-n+2){border-bottom:0}
}
@media (max-width:620px){
  .usdt0 .files{grid-template-columns:minmax(0,1fr)}
  .usdt0 .fcol{border-right:0}
  .usdt0 .fcol:last-child{border-bottom:0}
}
.usdt0 .dep-note b{color:var(--ink);font-weight:500}
.usdt0 .dep-note{
  border-top:1px solid var(--rule); padding:12px 20px;
  font-size:13.5px; line-height:1.55; color:var(--ink-2);
}
.usdt0 .dep-note code{
  font-family:"IBM Plex Mono",monospace;font-size:12.5px;
  background:var(--paper-3);border:1px solid var(--rule-2);padding:.5px 4px;color:var(--ink);
}
.usdt0 .notes-sec{margin:34px 0 0;border:1px solid var(--rule);background:var(--paper-2)}
.usdt0 .notes-body{padding:20px 20px 22px;display:flex;flex-direction:column;gap:18px}
.usdt0 .notes{display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px 40px}
.usdt0 .note{display:flex; gap:12px}
.usdt0 .ntag{
  flex:0 0 82px; font-family:"IBM Plex Mono",monospace; font-size:9.5px;
  letter-spacing:.14em; text-transform:uppercase; color:var(--ink-3); padding-top:3px;
}
.usdt0 .ncopy{margin:0; font-size:13px; line-height:1.55; color:var(--ink-2)}
.usdt0 .ncopy b{color:var(--ink);font-weight:500}
.usdt0 .ncopy code{
  font-family:"IBM Plex Mono",monospace;font-size:12px;
  background:var(--paper-3);border:1px solid var(--rule-2);padding:.5px 4px;color:var(--ink);
}
@media (max-width:820px){ .usdt0 .notes{grid-template-columns:minmax(0,1fr)} }
/* below this the two-column note squeezed its copy to about 25 characters a
   line, so the tag sits above the copy instead of beside it */
@media (max-width:560px){
  .usdt0 .note{flex-direction:column; gap:4px}
  .usdt0 .ntag{flex:0 0 auto; padding-top:0}
}
/* ---------- day one ---------- */
.usdt0 .dayone{margin:34px 0 0;border:1px solid var(--rule);background:var(--paper-2)}
.usdt0 .d1-body{padding:20px 20px 22px;display:flex;flex-direction:column;gap:20px}
.usdt0 .d1-lead{margin:0;font-size:15.5px;color:var(--ink);max-width:64ch}
.usdt0 .venues{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0;
  border:1px solid var(--rule);background:var(--paper)}
.usdt0 .venue{padding:15px 16px;border-right:1px solid var(--rule)}
.usdt0 .venue:last-child{border-right:0}
@media (max-width:720px){
  .usdt0 .venue{border-right:0;border-bottom:1px solid var(--rule)}
  .usdt0 .venue:last-child{border-bottom:0}
}
.usdt0 .venue h3{
  margin:0 0 10px;font-family:"IBM Plex Mono",monospace;font-size:9.5px;line-height:1.6;
  letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3);font-weight:400;
}
.usdt0 .venue ul{margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:6px}
.usdt0 .venue li{
  margin:0;font-family:"IBM Plex Mono",monospace;font-size:11.5px;color:var(--ink);
  border:1px solid var(--rule);background:var(--paper-2);padding:4px 8px;
}
.usdt0 .venue li::marker{content:none}
.usdt0 .venue p{margin:10px 0 0;font-size:12.5px;color:var(--ink-2)}
/* ---------- deploy section ---------- */
.usdt0 .deploy{margin:34px 0 0;border:1px solid var(--rule);background:var(--paper-2)}
.usdt0 .dep-head h2,.usdt0 .fig-head h2{font:inherit;letter-spacing:inherit;color:inherit;margin:0}
.usdt0 .dep-head{
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center;
  border-bottom:1px solid var(--rule);padding:9px 14px;
  font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:10.5px;
  letter-spacing:.13em;text-transform:uppercase;color:var(--ink-2);
}
.usdt0 .live{
  display:inline-flex;align-items:center;gap:6px;
  color:var(--accent-ink);letter-spacing:.13em;
}
.usdt0 .live::before{
  content:"";width:7px;height:7px;border-radius:50%;background:var(--accent-ink);
}
.usdt0 .dep-body{padding:20px 20px 22px;display:flex;flex-direction:column;gap:18px}
.usdt0 .dep-lead{margin:0;font-size:15.5px;color:var(--ink);max-width:62ch}
.usdt0 .dep-lead strong{font-weight:500}
.usdt0 .dep-link{
  align-self:flex-start;font-family:"IBM Plex Mono",monospace;font-size:11px;
  letter-spacing:.06em;color:var(--accent-ink);text-decoration:none;
  border-bottom:1px solid var(--accent-ink);padding-bottom:1px;
}
.usdt0 .dep-link:hover{color:var(--ink)}
.usdt0 .dep-link:focus-visible{outline:2px solid var(--accent-ink);outline-offset:3px}
.usdt0 .ids{display:flex;flex-direction:column;gap:0;border:1px solid var(--rule);background:var(--paper)}
.usdt0 .id-row{
  display:grid;grid-template-columns:minmax(0,240px) minmax(0,1fr);
  gap:6px 20px;padding:14px 16px;border-bottom:1px solid var(--rule);
}
.usdt0 .id-row:last-child{border-bottom:0}
@media (max-width:720px){.usdt0 .id-row{grid-template-columns:1fr}}
.usdt0 .id-label{
  font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--ink-3);
}
.usdt0 .id-note{font-size:13px;color:var(--ink-2);margin:4px 0 0;max-width:44ch}
.usdt0 .id-val{display:flex;align-items:flex-start;gap:10px}
.usdt0 .id-val code{
  flex:1 1 auto;min-width:0;
  font-family:"IBM Plex Mono",monospace;font-size:12.5px;line-height:1.55;
  color:var(--ink);background:var(--paper-3);border:1px solid var(--rule-2);border-radius:0;
  padding:6px 8px;overflow-wrap:anywhere;user-select:all;
}
.usdt0 .copy{
  flex:0 0 auto;appearance:none;background:var(--paper-2);border:1px solid var(--rule);
  color:var(--ink-2);font-family:"IBM Plex Mono",monospace;font-size:9.5px;
  letter-spacing:.1em;text-transform:uppercase;padding:6px 9px;cursor:pointer;
}
.usdt0 .copy:hover{border-color:var(--accent-ink);color:var(--accent-ink)}
.usdt0 .copy:focus-visible{outline:2px solid var(--accent-ink);outline-offset:2px}
/* ---------- spec strip ---------- */
.usdt0 .spec{
  margin-top:34px;border:1px solid var(--rule);background:var(--paper-2);padding:0;
  display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));
}
.usdt0 .spec div{padding:12px 14px;border-right:1px solid var(--rule)}
.usdt0 .spec div:last-child{border-right:0}
.usdt0 .spec dt{margin-bottom:4px}
.usdt0 .spec dd{
  font-family:"IBM Plex Mono",monospace;font-size:14px;color:var(--ink);
  font-variant-numeric:tabular-nums;
}
.usdt0 .spec dd a{color:inherit;text-decoration:none;border-bottom:1px solid var(--rule)}
.usdt0 .spec dd a:hover{color:var(--accent-ink);border-bottom-color:var(--accent-ink)}
.usdt0 .foot{
  margin-top:26px;border-top:1px solid var(--rule);padding-top:10px;
  font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.13em;
  text-transform:uppercase;color:var(--ink-3);
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
}
.usdt0 .xlink{display:inline-flex;align-items:center;color:var(--ink-3)}
.usdt0 .xlink:hover{color:var(--accent-ink)}
.usdt0 .xlink:focus-visible{outline:2px solid var(--accent-ink);outline-offset:3px}
.usdt0 .xlink svg{width:13px;height:13px;display:block}
@media (prefers-reduced-motion: reduce){
  .usdt0 .pkt,.usdt0 .lit{animation:none;opacity:0}
}
/* ---- FAQ questions: collapsed by default, but the answers stay in the DOM ---- */
.usdt0 .faq{border-bottom:1px solid var(--rule)}
.usdt0 .faq:last-child{border-bottom:0}
.usdt0 .faq summary{
  display:flex;gap:14px;align-items:baseline;list-style:none;cursor:pointer;
  padding:11px 28px 11px 0;position:relative;
}
.usdt0 .faq summary::-webkit-details-marker{display:none}
.usdt0 .faq summary::after{
  content:"+";position:absolute;right:8px;top:10px;line-height:1;
  font-family:"IBM Plex Mono",monospace;font-size:13px;color:var(--ink-3);
}
.usdt0 .faq[open] summary::after{content:"−"}
.usdt0 .faq summary:hover .fq{color:var(--accent-ink)}
.usdt0 .faq summary:focus-visible{outline:2px solid var(--accent-ink);outline-offset:-2px}
.usdt0 .fq{font-weight:500}
.usdt0 .fq code,.usdt0 .fa code{font-size:.92em}
.usdt0 .fa{padding:0 28px 16px 0;max-width:78ch}
.usdt0 .fa .ncopy{margin:0}
@media (max-width:720px){ .usdt0 .faq summary{padding-right:26px} }
`;
  const SECTIONS = [
    ["arrival", "Arrival"], ["access", "Access"], ["dayone", "Day one"], ["deploy", "Deploy"], ["build", "Before you build"], ["faq", "FAQ"],
  ];
  const IDS = [
    ["Classic asset", "The asset code and issuer address. A trustline points at this pair.", "USDT0:GATISXX6BZ6NC7IKQBY37CJD4SOZL3CYZJWXEDG6JVIY4WBS6KXJHN6Q"],
    ["Token contract (SAC)", "The Stellar Smart Contract (Soroban) interface. Call this from contracts — lending markets, vaults, AMMs.", "CBSJZEIO5C7KC2SF3MKSNXXJSW5G3VTNBX4ATMKUI3B2MR4JKM4R26YF"],
    ["OFT", "The USDT0-specific OFT contract on Stellar — it burns and mints USDT0 here. Not part of a Stellar-side payment.", "CBOWOLFSDM5PZXNFIVDMP5NZ7U2GSIHED6H6R446QOHF266XINKUMMF6"],
    ["LayerZero endpoint ID", "Stellar's EID. You need it to address Stellar from another chain's OFT.", "30600"],
  ];
  // back to front: [name, left, top]; the cover sits in front at z-index 5
  const FOLDERS = [
    ["DISTRIBUTION", "24.99840625597654%", "0%"],
    ["COLLATERAL", "18.748804691982407%", "8.391684189988943%"],
    ["TREASURY", "12.49920312798827%", "16.783368379977887%"],
    ["PAYMENTS", "6.249601563994135%", "25.17505256996683%"],
  ];
  const FO_BODY = "M 8 0 H 110 A 8 8 0 0 1 118 8 V 24 H 280 A 8 8 0 0 1 288 32 V 182 A 8 8 0 0 1 280 190 H 8 A 8 8 0 0 1 0 182 V 8 A 8 8 0 0 1 8 0 Z";
  const FO_TAB = "M 8 0 H 110 A 8 8 0 0 1 118 8 V 25 H 0 V 8 A 8 8 0 0 1 8 0 Z";
  const topRef = useRef(null);
  const [active, setActive] = useState(0);
  const [copyLabels, setCopyLabels] = useState({});
  // which section is under the sticky bar. Ratio-based spying is biased by
  // section height, so measure position against a fixed line just below the bar.
  useEffect(() => {
    let queued = false;
    const spy = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const bar = topRef.current;
        const line = (bar ? bar.getBoundingClientRect().bottom : 0) + 32;
        let idx = 0;
        SECTIONS.forEach(([id], i) => {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) idx = i;
        });
        setActive(idx);
      });
    };
    window.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", spy);
    spy();
    return () => {
      window.removeEventListener("scroll", spy);
      window.removeEventListener("resize", spy);
    };
  }, []);
  const copy = (i) => {
    const el = document.getElementById(`usdt0-id-${i}`);
    const done = (msg) => {
      setCopyLabels((c) => Object.assign({}, c, { [i]: msg }));
      setTimeout(() => setCopyLabels((c) => Object.assign({}, c, { [i]: undefined })), 1600);
    };
    // clipboard access can be blocked in an embedded frame — select it instead
    const selectIt = () => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      done("Selected");
    };
    if (!navigator.clipboard) return selectIt();
    navigator.clipboard.writeText(el.textContent).then(() => done("Copied"), selectIt);
  };
  const folder = (tint) => (
    <svg className="fo" viewBox="0 0 288 190" preserveAspectRatio="none" aria-hidden="true">
      <path className="fo-body" d={FO_BODY} />
      {tint ? <path className="fo-tint" d={FO_BODY} /> : null}
      <path className="fo-tab" d={FO_TAB} />
      <path className="fo-edge" d={FO_BODY} />
    </svg>
  );
  return (
    <div className="usdt0">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="sheet">
        <div className="top" ref={topRef}>
          <span>USDT0 on Stellar Network</span>
          <span className="top-r">
            <a className="toplink" href="/docs/tokens/usdt0-layerzero">Stellar Docs →</a>
            <nav className="secnav" aria-label="Sections">
              {SECTIONS.map(([id, label], i) => (
                <a key={id} className="tick" href={`#${id}`} aria-label={label} title={label} aria-current={active === i ? "true" : undefined} />
              ))}
            </nav>
          </span>
        </div>
        <h1>The asset with a unified supply <em>arrives on Stellar</em></h1>
        <p className="deck">USDT0 is now available on the Stellar network. USDT0 connects Stellar to{" "}
          <strong>a unified USDT supply</strong>, allowing USDT to move across networks without fragmenting
          supply. USDT0 is a native Stellar asset that works with your existing stack.</p>
        <figure id="arrival">
          <div className="fig-head"><h2>Arrival — how USDT0 gets to Stellar</h2></div>
          <div className="fig-body">
            <svg viewBox="0 0 990 420" role="img" aria-label="The USDT0 supply chain. USDT on Ethereum is locked and unlocked with the USDT0 adapter. From there one flow forks: Ethereum mints USDT0 directly on Stellar through Stellar's own OFT contract, and Ethereum also mints USDT0 on every other USDT0 chain, with an OFT on each USDT0-compatible network. Any of those chains can burn its USDT0 so Stellar's OFT mints instead, which never touches Ethereum. Either way the Stellar OFT is the single entry point, and what it mints is USDT0 on Stellar, a native Stellar asset compatible with existing toolkits, which feeds payment rails, treasury balances, and lending markets. A dashed line shows the routes run the other way.">
              <defs>
                <marker id="usdt0-ar" viewBox="0 0 10 10" refX="9.4" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
                </marker>
                <marker id="usdt0-ar-s" viewBox="0 0 10 10" refX="9.4" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill="var(--ink-3)" />
                </marker>
              </defs>
              <path className="edge dash" d="M 620 247 V 392 H 102 V 245" markerEnd="url(#usdt0-ar-s)" />
              <rect className="n-box" x="20" y="161" width="164" height="80" />
              <rect className="lit lEth" x="20" y="161" width="164" height="80" />
              <text className="n-t" x="34" y="188">USDT on Ethereum</text>
              <text className="n-s" x="34" y="207">Locked / unlocked</text>
              <text className="n-s" x="34" y="222">with USDT0 adapter</text>
              <path className="edge" d="M 184 201 H 232" />
              <path className="edge" d="M 232 201 V 110 H 286" markerEnd="url(#usdt0-ar)" />
              <path className="edge" d="M 232 201 V 292 H 286" markerEnd="url(#usdt0-ar)" />
              <rect className="n-box alt" x="304" y="268" width="188" height="76" />
              <rect className="n-box alt" x="297" y="261" width="188" height="76" />
              <rect className="n-box" x="290" y="254" width="188" height="76" />
              <rect className="lit lChain" x="290" y="254" width="188" height="76" />
              <text className="n-t" x="304" y="282">USDT0 OFTs</text>
              <text className="n-s" x="304" y="301">Each compatible network</text>
              <text className="n-s" x="304" y="316">has its own contract</text>
              <path className="edge" d="M 384 254 V 168" markerEnd="url(#usdt0-ar)" />
              <rect className="n-box" x="290" y="72" width="188" height="92" />
              <rect className="lit lOft" x="290" y="72" width="188" height="92" />
              <text className="n-t" x="304" y="100">Stellar OFT</text>
              <text className="n-s" x="304" y="119">The contract that</text>
              <text className="n-s" x="304" y="134">mints and burns</text>
              <text className="n-s" x="304" y="149">USDT0 on Stellar</text>
              <path className="edge" d="M 478 110 H 528 V 201 H 574" markerEnd="url(#usdt0-ar)" />
              <rect className="n-box hot" x="578" y="155" width="186" height="92" />
              <rect className="lit lHot" x="578" y="155" width="186" height="92" />
              <text className="n-t hot" x="592" y="182">USDT0 on Stellar</text>
              <text className="n-s" x="592" y="202">A native Stellar asset</text>
              <text className="n-s" x="592" y="217">compatible with</text>
              <text className="n-s" x="592" y="232">existing toolkits</text>
              <line className="edge" x1="764" y1="171" x2="812" y2="171" markerEnd="url(#usdt0-ar)" />
              <line className="edge" x1="764" y1="201" x2="812" y2="201" markerEnd="url(#usdt0-ar)" />
              <line className="edge" x1="764" y1="231" x2="812" y2="231" markerEnd="url(#usdt0-ar)" />
              <rect className="n-box" x="816" y="157" width="164" height="28" />
              <rect className="lit lUse" x="816" y="157" width="164" height="28" />
              <text className="n-s" x="828" y="175">Payment rails</text>
              <rect className="n-box" x="816" y="187" width="164" height="28" />
              <rect className="lit lUse" x="816" y="187" width="164" height="28" />
              <text className="n-s" x="828" y="205">Treasury balances</text>
              <rect className="n-box" x="816" y="217" width="164" height="28" />
              <rect className="lit lUse" x="816" y="217" width="164" height="28" />
              <text className="n-s" x="828" y="235">Lending markets</text>
              <circle className="pkt pTrunk" r="3.4" /><circle className="pkt pUp" r="3.4" />
              <circle className="pkt pDown" r="3.4" /><circle className="pkt pClimb" r="3.4" />
              <circle className="pkt pMint" r="3.4" /><circle className="pkt pUse1" r="3.4" />
              <circle className="pkt pUse2" r="3.4" /><circle className="pkt pUse3" r="3.4" />
            </svg>
          </div>
          <figcaption>Stellar’s OFT mints the USDT0, whether Ethereum locked the USDT or another chain
            burned its own. Every chain runs its own OFT; Ethereum alone locks the USDT that backs them all
            (<a href="https://docs.usdt0.to/technical-documentation/developer" target="_blank" rel="noopener noreferrer">USDT0 developer docs</a>).</figcaption>
        </figure>
        <figure id="access">
          <div className="fig-head"><h2>Access — what USDT0 unlocks</h2></div>
          <div className="folder-fig">
            <div className="stackwrap">
              <div className="stack" role="img" aria-label="A USDT0 folder, its cover in front, holding 4 files: payments, treasury, collateral, distribution." style={{ "--ar": 1.3425316828892888, "--fw": "75.00159374402347%", "--fh": "66.43326324004423%" }}>
                {FOLDERS.map(([name, left, top], i) => (
                  <div key={name} className="file" style={{ left, top, zIndex: i + 1 }}>
                    {folder(false)}
                    <span className="fname">{name}</span>
                  </div>
                ))}
                <div className="file cover" style={{ left: 0, top: "33.56673675995577%", zIndex: 5 }}>
                  {folder(true)}
                  <span className="fname">USDT0</span>
                  <span className="cover-body">
                    <span className="cover-name">Access to a new economy</span>
                    <span className="cover-sub">One asset · one supply</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="desc">
              <span className="d-eyebrow">USDT0</span>
              <h3 className="d-head">Access to a new economy</h3>
              <p className="d-claim">The asset that brings access to new corridors, counterparties, and financial use cases on Stellar.</p>
              <dl>
                <div><dt>One asset, unified liquidity</dt><dd>USDT0 maintains a unified supply anchored to USDT on Ethereum, so liquidity isn’t fragmented across separate wrapped versions of the asset.</dd></div>
                <div><dt>Built to move across networks</dt><dd>Operated by <a href="https://everdawn.to/" target="_blank" rel="noopener noreferrer">Everdawn Labs</a>, USDT0 connects Stellar to <a href="https://analytics.usdt0.to/" target="_blank" rel="noopener noreferrer">26+ networks</a> through LayerZero’s OFT standard.</dd></div>
              </dl>
            </div>
          </div>
          <div className="fig-files">
            <div className="files" style={{ "--cols": 4 }}>
              <div className="fcol">
                <div className="ftag">Payments</div>
                <h4 className="fhead">Build with an asset already in use</h4>
                <p className="fcopy">Support cross-border payments, payouts, remittances, and other dollar-denominated flows with USDT0.</p>
              </div>
              <div className="fcol">
                <div className="ftag">Treasury</div>
                <h4 className="fhead">Power treasury and cash management products</h4>
                <p className="fcopy">Give businesses and users a dollar-denominated asset for managing working capital.</p>
              </div>
              <div className="fcol">
                <div className="ftag">Collateral</div>
                <h4 className="fhead">Put USDT0 to work</h4>
                <p className="fcopy">Give lending markets a dollar-denominated asset to use as collateral or borrow against.</p>
              </div>
              <div className="fcol">
                <div className="ftag">Distribution</div>
                <h4 className="fhead">One asset, many doors</h4>
                <p className="fcopy">Every exchange, wallet, and fintech that lists it becomes an entry point to the Stellar network.</p>
              </div>
            </div>
          </div>
        </figure>
        <section className="dayone" id="dayone" aria-labelledby="usdt0-d1-h">
          <div className="dep-head">
            <h2 id="usdt0-d1-h">Day one — what is already integrated</h2>
          </div>
          <div className="d1-body">
            <p className="d1-lead">You can access USDT0 today across these partners on Stellar.<br />
              More to come on a rolling basis.</p>
            <div className="venues">
              <div className="venue">
                <h3>Exchanges, DEXs &amp; Lending Protocols</h3>
                <ul><li>Kraken</li><li>SushiSwap</li><li>BiLira</li><li>Kinetic (K2)</li></ul>
                <p>Buy, sell, swap, and borrow against USDT0 on Stellar.</p>
              </div>
              <div className="venue">
                <h3>Wallets</h3>
                <ul><li>Freighter</li><li>Lobstr</li><li>Meru</li><li>Bitget Wallet</li><li>Exodus</li></ul>
                <p>Hold and send USDT0 on Stellar.</p>
              </div>
              <div className="venue">
                <h3>Custody</h3>
                <ul><li>Fireblocks</li></ul>
                <p>Institutional custody and treasury operations for USDT0 on Stellar.</p>
              </div>
              <div className="venue">
                <h3>Fintechs &amp; ramps</h3>
                <ul><li>Ramp Network</li><li>Kredete</li></ul>
                <p>Ramp services and fintech products using USDT0 in production, including cross-border payments across Africa.</p>
              </div>
            </div>
            <a className="dep-link" href="https://usdt0.to/transfer" target="_blank" rel="noopener noreferrer">Transfer USDT0 to Stellar →</a>
          </div>
          <div className="dep-note">Balances move into and out of Stellar without a custodial bridge or a
            wrapped representation. Transfer time is set by the chain you send from — a couple of minutes
            from some networks, hours from others. The cost is that network's gas plus the LayerZero
            message, <a href="https://docs.usdt0.to/technical-documentation/developer/" target="_blank" rel="noopener noreferrer">quoted per route</a>{" "}
            before you send. USDT0 itself charges no protocol fee on most routes; where one applies it is
            0.03%, set per route. Receiving USDT0 needs a trustline on the destination account —
            see <a href="#build">requirements and limitations</a>.</div>
        </section>
        <section className="deploy" id="deploy" aria-labelledby="usdt0-dep-h">
          <div className="dep-head">
            <h2 id="usdt0-dep-h">Deploy — adding USDT0 to your environment</h2>
            <span className="live">Live on Stellar Mainnet</span>
          </div>
          <div className="dep-body">
            <p className="dep-lead">USDT0 is live on Stellar Mainnet. Add it to your wallet or environment. Test your
              integration by <strong>moving a small amount end to end</strong> before rolling out to your users.</p>
            <a className="dep-link" target="_blank" rel="noopener noreferrer" href="https://stellar.expert/explorer/public/asset/USDT0-GATISXX6BZ6NC7IKQBY37CJD4SOZL3CYZJWXEDG6JVIY4WBS6KXJHN6Q">View the asset on stellar.expert →</a>
            <div className="ids">
              {IDS.map(([label, note, value], i) => (
                <div key={label} className="id-row">
                  <div>
                    <div className="id-label">{label}</div>
                    <p className="id-note">{note}</p>
                  </div>
                  <div className="id-val">
                    <code id={`usdt0-id-${i}`}>{value}</code>
                    <button className="copy" type="button" aria-label={`Copy ${label}`} onClick={() => copy(i)}>{copyLabels[i] || "Copy"}</button>
                  </div>
                </div>
              ))}
            </div>
            <a className="dep-link" target="_blank" rel="noopener noreferrer" href="https://docs.usdt0.to/technical-documentation/deployments?q=stellar">Contract deployments on docs.usdt0.to →</a>
          </div>
          <div className="dep-note"><b><a href="https://stellar.expert/explorer/public/asset/USDT0-GATISXX6BZ6NC7IKQBY37CJD4SOZL3CYZJWXEDG6JVIY4WBS6KXJHN6Q" target="_blank" rel="noopener noreferrer">This asset</a> sets <code>auth_revocable</code> and <code>auth_clawback_enabled</code></b> — the issuer can revoke a trustline or <a href="/docs/build/guides/transactions/clawbacks" target="_blank" rel="noopener noreferrer">clawback a balance</a>. <code>auth_required</code> is not set, so anyone can hold it. 💡 Soroswap maintains an <a href="https://github.com/soroswap/token-list/tree/main/assets" target="_blank" rel="noopener noreferrer">ecosystem token list</a> covering both classic assets and contract tokens (community-maintained rather than an official Stellar registry, and widely used).</div>
        </section>
        <section className="notes-sec" id="build" aria-labelledby="usdt0-bd-h">
          <div className="dep-head"><h2 id="usdt0-bd-h">Before you build — requirements and limitations</h2></div>
          <div className="notes-body">
            <p className="dep-lead">What USDT0 on Stellar requires for integration.</p>
            <div className="notes">
              <div className="note">
                <div className="ntag">Trustlines</div>
                <p className="ncopy"><b>A trustline has to exist before the first payment lands.</b> Sending USDT0 to an account that has no USDT0 trustline fails with <a href="/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/payment" target="_blank" rel="noopener noreferrer"><code>op_no_trust</code></a>. A wallet may create it for you when you swap into USDT0 in-app; a transfer arriving from an exchange or another wallet has no such fallback. If you custody for users, create it during onboarding — <a href="/docs/build/guides/transactions/sponsored-reserves" target="_blank" rel="noopener noreferrer">sponsored reserves</a> can cover the reserve.</p>
              </div>
              <div className="note">
                <div className="ntag">Decimals</div>
                <p className="ncopy"><b>The OFT reconciles a precision gap for you.</b> USDT0 on Stellar carries <a href="/docs/learn/fundamentals/stellar-data-structures/assets" target="_blank" rel="noopener noreferrer">seven decimals</a>; cross-chain transfers normalize to the OFT’s <a href="https://docs.layerzero.network/v2/concepts/technical-reference/oft-reference" target="_blank" rel="noopener noreferrer">six shared decimals</a>. Send 1.2345678 and 1.234567 moves; the remaining 0.0000008 is floored off as dust and refunded to you before the debit. Nothing to convert by hand — but account for it when you calculate or display an amount.</p>
              </div>
              <div className="note">
                <div className="ntag">Route limits</div>
                <p className="ncopy"><b>A route can enforce a minimum.</b> Minimum transfer amounts are set per contract, so call <a href="https://docs.usdt0.to/technical-documentation/developer" target="_blank" rel="noopener noreferrer"><code>quote_oft</code></a> for the route you intend to use rather than assuming any amount will go through.</p>
              </div>
              <div className="note">
                <div className="ntag">Backing</div>
                <p className="ncopy"><b>The backing sits in one contract.</b> USDT0's adapter on Ethereum holds the USDT behind the natively issued supply.</p>
              </div>
              <div className="note">
                <div className="ntag">Yield</div>
                <p className="ncopy"><b>USDT0 doesn't accrue yield.</b> It earns nothing sitting in a balance — any return has to come from the market you supply it to.</p>
              </div>
              <div className="note">
                <div className="ntag">Listings</div>
                <p className="ncopy"><b>Each venue decides which networks it supports.</b> One USDT0 doesn't mean every listing offers every route, so check what a partner actually enables before you send users to it.</p>
              </div>
            </div>
          </div>
        </section>
      <section className="notes-sec" id="faq" aria-labelledby="fq-h">
        <div className="dep-head"><h2 id="fq-h">FAQ</h2></div>
        <div className="notes-body">
          <div className="faqs">
          <details className="faq">
            <summary><span className="fq">Is USDT0 the same as USDT?</span></summary>
            <div className="fa"><p className="ncopy">No &mdash; it is a separate asset with its own contract, worth the same and backed 1:1 by USDT locked
     on Ethereum. The practical difference is deposits: a venue that supports USDT will not necessarily accept
     USDT0 on Stellar. Check your destination lists USDT0 on Stellar specifically before you send.</p></div>
          </details>
          <details className="faq">
            <summary><span className="fq">Which USDT0 on Stellar is the real one?</span></summary>
            <div className="fa"><p className="ncopy">The one issued by <code>GATISXX6BZ6NC7IKQBY37CJD4SOZL3CYZJWXEDG6JVIY4WBS6KXJHN6Q</code> &mdash;
     <a href='https://stellar.expert/explorer/public/asset/USDT0-GATISXX6BZ6NC7IKQBY37CJD4SOZL3CYZJWXEDG6JVIY4WBS6KXJHN6Q' target='_blank' rel='noopener noreferrer'>check it on Stellar Expert</a>.
     Asset codes on Stellar are not unique &mdash; anyone can issue an asset called USDT0 &mdash; so identity is
     the code <b>and</b> the issuer together. Pin that issuer, and confirm the contract you derive from it
     matches <code>CBSJZEIO5C7KC2SF3MKSNXXJSW5G3VTNBX4ATMKUI3B2MR4JKM4R26YF</code>.</p></div>
          </details>
          <details className="faq">
            <summary><span className="fq">Why did my USDT0 payment fail with <code>op_no_trust</code>?</span></summary>
            <div className="fa"><p className="ncopy">The destination account has no USDT0 trustline, and one must exist before the first payment can land.
     A wallet often creates it when a user swaps into USDT0 in-app, but a transfer arriving from an exchange or
     another wallet has no such fallback. If you custody for users, create it during onboarding &mdash;
     <a href='/docs/build/guides/transactions/sponsored-reserves'>sponsored reserves</a>
     can cover the reserve.</p></div>
          </details>
          <details className="faq">
            <summary><span className="fq">How long does a transfer to Stellar take?</span></summary>
            <div className="fa"><p className="ncopy">It depends on the chain you send from, not on Stellar. Stellar finalises in 5&ndash;7 seconds; the wait
     is the source chain confirming and LayerZero verifying the message. From Polygon it is about a minute.
     From Ethereum, Arbitrum, Tron and Solana &mdash; the routes carrying most volume &mdash; expect roughly
     18&ndash;21 minutes. A few low-traffic routes take hours. The
     <a href='https://usdt0.to/transfer' target='_blank' rel='noopener noreferrer'>transfer UI</a>
     quotes an estimate for your route before you send.</p></div>
          </details>
          <details className="faq">
            <summary><span className="fq">Why is my transfer slower than I expected?</span></summary>
            <div className="fa"><p className="ncopy">Usually because the figure you saw was a network-wide best case rather than your route. Nothing on the
     Stellar side is the bottleneck. If a transfer runs well past the estimate you were quoted, look up the message on
     <a href='https://layerzeroscan.com/analytics/networks' target='_blank' rel='noopener noreferrer'>LayerZero Scan</a>,
     which indexes Stellar as a destination, to see which step it is sitting at. USDT0 lists
     <a href='https://docs.usdt0.to/resources/contact' target='_blank' rel='noopener noreferrer'>support contacts</a>
     for transfers that stall.</p></div>
          </details>
          <details className="faq">
            <summary><span className="fq">What does it cost to bring USDT0 to Stellar?</span></summary>
            <div className="fa"><p className="ncopy">Three separate things, and two different calls report them. USDT0's own protocol fee is zero on most
     routes and 0.03% where one applies:
     <a href='https://docs.usdt0.to/technical-documentation/developer/' target='_blank' rel='noopener noreferrer'><code>quote_oft</code></a>
     shows it as the gap between <code>amount_sent_ld</code> and <code>amount_received_ld</code>, so read it
     there rather than trusting a published number. The LayerZero messaging fee is separate and comes back from
     <a href='https://docs.usdt0.to/technical-documentation/developer/' target='_blank' rel='noopener noreferrer'><code>quote_send</code></a>,
     paid in XLM when you send from Stellar &mdash; this is the part that varies most. And on Stellar, ordinary transactions cost a
     <a href='/docs/learn/fundamentals/fees-resource-limits-metering'>minimum of 100 stroops</a>
     per operation, which is unrelated to bridging.</p></div>
          </details>
          <details className="faq">
            <summary><span className="fq">What is the difference between the Open Mesh and the Legacy Mesh?</span></summary>
            <div className="fa"><p className="ncopy">On the Open Mesh each chain runs its own OFT contract, and moving between them burns on one side and
     mints on the other. The
     <a href='https://docs.usdt0.to/overview/the-legacy-mesh' target='_blank' rel='noopener noreferrer'>Legacy Mesh</a>
     connects chains where Tether had already deployed native USDT &mdash; Ethereum, Tron, TON, Arbitrum, Solana
     and Celo &mdash; through a shared non-custodial hub on Arbitrum, so those chains keep their existing USDT
     contracts rather than migrating.</p></div>
          </details>
          <details className="faq">
            <summary><span className="fq">Why did I receive slightly less than I sent?</span></summary>
            <div className="fa"><p className="ncopy">Rounding, in the last decimal places only. USDT0 on Stellar carries seven decimals; cross-chain
     transfers normalise to the OFT's six shared decimals. Send 1.2345678 and 1.234567 moves &mdash; the
     remaining 0.0000008 is floored off as dust and refunded to you before the debit.</p></div>
          </details>
          <details className="faq">
            <summary><span className="fq">Who can freeze or clawback USDT0 on Stellar?</span></summary>
            <div className="fa"><p className="ncopy">The issuer. The asset sets <code>auth_revocable</code> and <code>auth_clawback_enabled</code>, so the
     issuer can revoke a trustline or
     <a href='/docs/build/guides/transactions/clawbacks'>clawback a balance</a>.
     <code>auth_required</code> is not set, so anyone can hold it without approval.</p></div>
          </details>
          </div>
        </div>
      </section>
        <dl className="spec">
          <div><dt>Asset</dt><dd>USDT0</dd></div>
          <div><dt>Transfer</dt><dd><a href="https://usdt0.to/transfer" target="_blank" rel="noopener noreferrer">usdt0.to</a></dd></div>
          <div><dt>Networks</dt><dd><a href="https://analytics.usdt0.to/" target="_blank" rel="noopener noreferrer">26+</a></dd></div>
          <div><dt>USDT in circulation</dt><dd><a href="https://coinmarketcap.com/currencies/tether/" target="_blank" rel="noopener noreferrer">$180B+</a></dd></div>
          <div><dt>Stellar settlement</dt><dd><a href="/docs/learn/fundamentals/stellar-stack" target="_blank" rel="noopener noreferrer">5–7s</a></dd></div>
          <div><dt>Stellar fee</dt><dd><a href="/docs/learn/fundamentals/fees-resource-limits-metering" target="_blank" rel="noopener noreferrer">100 stroops min</a></dd></div>
          <div><dt>Transfer to Stellar</dt><dd><a href="https://usdt0.to/transfer" target="_blank" rel="noopener noreferrer">~20min typical</a></dd></div>
        </dl>
        <div className="sources">
          <b>Sources</b>
          <a href="https://docs.usdt0.to/technical-documentation/developer/" target="_blank" rel="noopener noreferrer">USDT0 Docs</a>
          <a href="https://docs.usdt0.to/technical-documentation/deployments?q=stellar" target="_blank" rel="noopener noreferrer">USDT0 deployments</a>
          <a href="/docs/tokens/usdt0-layerzero" target="_blank" rel="noopener noreferrer">Stellar Docs</a>
          <a href="https://lab.stellar.org/smart-contracts/contract-list?$=network$id=mainnet&label=Mainnet&horizonUrl=https:////horizon.stellar.org&rpcUrl=https:////mainnet.sorobanrpc.com&passphrase=Public%20Global%20Stellar%20Network%20/;%20September%202015;&smartContracts$contractList$activeTab=known-assets;;" target="_blank" rel="noopener noreferrer">Stellar Lab</a>
          <a href="https://docs.layerzero.network/v2/developers/stellar/overview" target="_blank" rel="noopener noreferrer">LayerZero on Stellar</a>
        </div>
        <div className="foot">
          <span>Stellar Development Foundation</span>
          <a className="xlink" href="https://x.com/BuildOnStellar" target="_blank" rel="noopener noreferrer" aria-label="Build on Stellar on X" title="Build on Stellar on X">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};
