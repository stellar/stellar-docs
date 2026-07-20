import React from "react";
import AnimatedDiagram from "./AnimatedDiagram";

const CAPTIONS: Record<string, string> = {};

const SVGS: Record<string, React.ReactNode> = {
  d0: (
    <svg
      viewBox="0 0 660 192"
      role="img"
      aria-label="Interactive comparison of storage expiry outcomes and restoration methods. An expired contract instance entry is archived; contract code is a separate entry with its own TTL. An expired persistent key is archived individually. Either can be restored automatically through an invocation restore list or manually with RestoreFootprintOp. An expired temporary entry is deleted permanently."
    >
      <text x="105" y="16" textAnchor="middle" className="lbl">
        instance()
      </text>
      <g className="d0-entry d0-entry-inst anim">
        <rect
          className="cell cell-inst"
          x="30"
          y="26"
          width="150"
          height="48"
        />
        <text x="105" y="48" textAnchor="middle" className="lbl-s">
          contract instance
        </text>
        <text x="105" y="65" textAnchor="middle" className="lbl-s mono">
          Admin, Config…
        </text>
      </g>
      <g className="d0-hatch d0-hatch-inst anim">
        <line className="hatch" x1="42" y1="72" x2="86" y2="28" />
        <line className="hatch" x1="74" y1="72" x2="118" y2="28" />
        <line className="hatch" x1="106" y1="72" x2="150" y2="28" />
        <line className="hatch" x1="138" y1="72" x2="176" y2="34" />
      </g>
      <rect className="ttl-track" x="30" y="82" width="150" height="6" />
      <rect
        className="ttl-fill-inst bar anim"
        x="30"
        y="82"
        width="150"
        height="6"
      />
      <line className="d0-arrow" x1="105" y1="94" x2="105" y2="110" />
      <path className="d0-arrowhead" d="M101 106 L105 112 L109 106" />
      <text x="105" y="104" textAnchor="middle" className="lbl-s d0-expiry">
        TTL expires
      </text>
      <g className="d0-outcome d0-inst-archived anim">
        <rect
          className="cell d0-result-inst"
          x="25"
          y="119"
          width="160"
          height="68"
        />
        <text
          x="105"
          y="139"
          textAnchor="middle"
          className="lbl d0-result-title"
        >
          ARCHIVED
        </text>
        <text x="105" y="157" textAnchor="middle" className="lbl-s">
          contract instance entry
        </text>
        <text x="105" y="177" textAnchor="middle" className="lbl-s">
          code has its own TTL
        </text>
      </g>
      <g className="d0-inst-restored">
        <rect
          className="cell d0-result-inst"
          x="25"
          y="119"
          width="160"
          height="68"
        />
        <text
          x="105"
          y="141"
          textAnchor="middle"
          className="lbl d0-result-title"
        >
          RESTORED
        </text>
        <text x="105" y="161" textAnchor="middle" className="lbl-s">
          instance entry
          <tspan x="105" dy="15">
            + code, if also archived
          </tspan>
        </text>
      </g>

      <text x="330" y="16" textAnchor="middle" className="lbl">
        persistent()
      </text>
      <g className="d0-entry d0-entry-pers anim">
        <rect
          className="cell cell-pers"
          x="255"
          y="26"
          width="150"
          height="48"
        />
        <text x="330" y="48" textAnchor="middle" className="lbl-s mono">
          Balance(alice)
        </text>
        <text x="330" y="65" textAnchor="middle" className="lbl-s mono">
          → 1_000_000
        </text>
      </g>
      <g className="d0-hatch d0-hatch-pers anim">
        <line className="hatch" x1="267" y1="72" x2="311" y2="28" />
        <line className="hatch" x1="299" y1="72" x2="343" y2="28" />
        <line className="hatch" x1="331" y1="72" x2="375" y2="28" />
        <line className="hatch" x1="363" y1="72" x2="401" y2="34" />
      </g>
      <rect className="ttl-track" x="255" y="82" width="150" height="6" />
      <rect
        className="ttl-fill-pers bar anim"
        x="255"
        y="82"
        width="150"
        height="6"
      />
      <line className="d0-arrow" x1="330" y1="94" x2="330" y2="110" />
      <path className="d0-arrowhead" d="M326 106 L330 112 L334 106" />
      <text x="330" y="104" textAnchor="middle" className="lbl-s d0-expiry">
        TTL expires
      </text>
      <g className="d0-outcome d0-pers-archived anim">
        <rect
          className="cell d0-result-pers"
          x="250"
          y="119"
          width="160"
          height="68"
        />
        <text
          x="330"
          y="139"
          textAnchor="middle"
          className="lbl d0-result-title"
        >
          ARCHIVED
        </text>
        <text x="330" y="157" textAnchor="middle" className="lbl-s">
          one persistent entry
        </text>
        <text x="330" y="177" textAnchor="middle" className="lbl-s">
          independent TTL
        </text>
      </g>
      <g className="d0-pers-restored">
        <rect
          className="cell d0-result-pers"
          x="250"
          y="119"
          width="160"
          height="68"
        />
        <text
          x="330"
          y="141"
          textAnchor="middle"
          className="lbl d0-result-title"
        >
          RESTORED
        </text>
        <text x="330" y="169" textAnchor="middle" className="lbl-s">
          this exact key only
        </text>
      </g>

      <text x="555" y="16" textAnchor="middle" className="lbl">
        temporary()
      </text>
      <g className="d0-entry d0-entry-temp anim">
        <rect
          className="cell cell-temp"
          x="480"
          y="26"
          width="150"
          height="48"
        />
        <text x="555" y="48" textAnchor="middle" className="lbl-s mono">
          Allowance(a,b)
        </text>
        <text x="555" y="65" textAnchor="middle" className="lbl-s mono">
          → 500
        </text>
      </g>
      <rect className="ttl-track" x="480" y="82" width="150" height="6" />
      <rect
        className="ttl-fill-temp bar anim"
        x="480"
        y="82"
        width="150"
        height="6"
      />
      <line className="d0-arrow" x1="555" y1="94" x2="555" y2="110" />
      <path className="d0-arrowhead" d="M551 106 L555 112 L559 106" />
      <text x="555" y="104" textAnchor="middle" className="lbl-s d0-expiry">
        TTL expires
      </text>
      <g className="d0-outcome anim">
        <rect
          className="cell d0-result-temp"
          x="475"
          y="119"
          width="160"
          height="68"
        />
        <text
          x="555"
          y="139"
          textAnchor="middle"
          className="lbl d0-result-title"
        >
          DELETED
        </text>
        <text x="555" y="157" textAnchor="middle" className="lbl-s">
          permanent
        </text>
        <text x="555" y="177" textAnchor="middle" className="lbl-s">
          no restore path
        </text>
      </g>
    </svg>
  ),
  d1: (
    <svg
      viewBox="0 0 660 170"
      role="img"
      aria-label="Animation: every invocation loads the contract instance entry, so its config needs no separate footprint entry."
    >
      <text x="120" y="52" textAnchor="middle" className="lbl">
        invocations
      </text>
      <circle className="inv anim fill-ink" cx="60" cy="86" r="5" />
      <circle className="inv inv2 anim fill-ink" cx="60" cy="86" r="5" />
      <circle className="inv inv3 anim fill-ink" cx="60" cy="86" r="5" />
      <line className="wire" x1="52" y1="86" x2="196" y2="86" />
      <rect
        className="cell cell-inst box anim"
        x="210"
        y="30"
        width="240"
        height="112"
        rx="10"
      />
      <text x="330" y="54" textAnchor="middle" className="lbl fill-amber">
        contract instance — one entry
      </text>
      <rect className="cell" x="232" y="66" width="60" height="26" rx="4" />
      <text x="262" y="83" textAnchor="middle" className="lbl-s mono">
        Admin
      </text>
      <rect className="cell" x="300" y="66" width="60" height="26" rx="4" />
      <text x="330" y="83" textAnchor="middle" className="lbl-s mono">
        Token0
      </text>
      <rect className="cell" x="368" y="66" width="60" height="26" rx="4" />
      <text x="398" y="83" textAnchor="middle" className="lbl-s mono">
        Token1
      </text>
      <rect className="cell" x="232" y="100" width="94" height="26" rx="4" />
      <text x="279" y="117" textAnchor="middle" className="lbl-s mono">
        Reserve0
      </text>
      <rect className="cell" x="334" y="100" width="94" height="26" rx="4" />
      <text x="381" y="117" textAnchor="middle" className="lbl-s mono">
        Reserve1
      </text>
      <text x="330" y="162" textAnchor="middle" className="lbl-s">
        loaded with each invocation → no separate config footprint entry
      </text>
    </svg>
  ),
  d2: (
    <svg
      viewBox="0 0 660 190"
      role="img"
      aria-label="Animation: one shared map entry swells toward the 64-kibibyte entry cap, while one-entry-per-user stays small and supports independent access."
    >
      <g className="badside anim">
        <text x="165" y="22" textAnchor="middle" className="lbl">
          ✗ one shared map
        </text>
        <rect
          className="cell blob anim"
          x="105"
          y="42"
          width="120"
          height="86"
          rx="8"
        />
        <text x="165" y="76" textAnchor="middle" className="lbl-s mono">
          Map&lt;Address,i128&gt;
        </text>
        <text x="165" y="94" textAnchor="middle" className="lbl-s">
          every user, one entry
        </text>
      </g>
      <text
        x="165"
        y="166"
        textAnchor="middle"
        className="lbl warn anim fill-danger"
      >
        → 64 KiB cap · rewrites · contention
      </text>

      <line className="wire dashed" x1="330" y1="30" x2="330" y2="160" />

      <text x="495" y="22" textAnchor="middle" className="lbl">
        ✓ one entry per holder
      </text>
      <g className="u1 anim">
        <rect
          className="cell cell-pers"
          x="390"
          y="40"
          width="210"
          height="24"
          rx="4"
        />
        <text x="495" y="56" textAnchor="middle" className="lbl-s mono">
          Balance(alice) → 120
        </text>
      </g>
      <g className="u2 anim">
        <rect
          className="cell cell-pers"
          x="390"
          y="70"
          width="210"
          height="24"
          rx="4"
        />
        <text x="495" y="86" textAnchor="middle" className="lbl-s mono">
          Balance(bob) → 7_500
        </text>
      </g>
      <g className="u3 anim">
        <rect
          className="cell cell-pers"
          x="390"
          y="100"
          width="210"
          height="24"
          rx="4"
        />
        <text x="495" y="116" textAnchor="middle" className="lbl-s mono">
          Balance(carol) → 41
        </text>
      </g>
      <g className="u4 anim">
        <text x="495" y="146" textAnchor="middle" className="lbl-s">
          …one independently addressed entry per user,
        </text>
        <text x="495" y="162" textAnchor="middle" className="lbl-s">
          transactions touch only the entries they need
        </text>
      </g>
    </svg>
  ),
  d3: (
    <svg
      viewBox="0 0 660 190"
      role="img"
      aria-label="Animation: a two-dimensional key like owner and spender maps to exactly one independent ledger entry."
    >
      <text x="120" y="40" textAnchor="end" className="lbl">
        owners ↓
      </text>
      <text x="255" y="22" textAnchor="middle" className="lbl">
        spenders →
      </text>
      <g>
        <rect className="cell" x="140" y="34" width="70" height="34" rx="4" />
        <rect className="cell" x="218" y="34" width="70" height="34" rx="4" />
        <rect className="cell" x="296" y="34" width="70" height="34" rx="4" />
        <rect className="cell" x="140" y="76" width="70" height="34" rx="4" />
        <rect
          className="cell hit anim"
          x="218"
          y="76"
          width="70"
          height="34"
          rx="4"
        />
        <rect className="cell" x="296" y="76" width="70" height="34" rx="4" />
        <rect className="cell" x="140" y="118" width="70" height="34" rx="4" />
        <rect className="cell" x="218" y="118" width="70" height="34" rx="4" />
        <rect className="cell" x="296" y="118" width="70" height="34" rx="4" />
      </g>
      <g className="keylbl anim">
        <line className="wire" x1="366" y1="93" x2="428" y2="93" />
        <rect
          className="cell cell-pers"
          x="430"
          y="70"
          width="196"
          height="46"
          rx="6"
        />
        <text x="528" y="89" textAnchor="middle" className="lbl-s mono">
          Allowance(alice, bob)
        </text>
        <text x="528" y="105" textAnchor="middle" className="lbl-s">
          one independent entry per pair
        </text>
      </g>
      <text x="330" y="180" textAnchor="middle" className="lbl-s">
        every (owner, spender) combination = its own ledger entry — no nested
        maps
      </text>
    </svg>
  ),
  d4: (
    <svg
      viewBox="0 0 660 200"
      role="img"
      aria-label="Animation: a temporary allowance entry is deleted when its TTL runs out, and timestamp-keyed price-history entries are deleted as their derived TTLs expire."
    >
      <g className="cell1 anim">
        <rect
          className="cell cell-temp"
          x="40"
          y="34"
          width="190"
          height="52"
          rx="6"
        />
        <text x="135" y="56" textAnchor="middle" className="lbl-s mono">
          Allowance(from, spender)
        </text>
        <text x="135" y="72" textAnchor="middle" className="lbl-s mono">
          &#123; amount, expiration_ledger &#125;
        </text>
      </g>
      <rect className="ttl-track" x="40" y="98" width="190" height="6" />
      <rect
        className="ttl-fill-temp bar b1 anim"
        x="40"
        y="98"
        width="190"
        height="6"
      />
      <text x="40" y="122" className="lbl-s">
        TTL aligned to the deadline when possible
      </text>
      <text
        x="135"
        y="70"
        textAnchor="middle"
        className="lbl gonelbl anim fill-rose"
      >
        deleted without a cleanup transaction
      </text>

      <text x="470" y="26" textAnchor="middle" className="lbl">
        self-pruning oracle history
      </text>
      <g className="old anim">
        <rect
          className="cell cell-temp"
          x="330"
          y="40"
          width="56"
          height="34"
          rx="4"
        />
        <text x="358" y="61" textAnchor="middle" className="lbl-s mono">
          t−4
        </text>
      </g>
      <rect
        className="cell cell-temp"
        x="394"
        y="40"
        width="56"
        height="34"
        rx="4"
      />
      <text x="422" y="61" textAnchor="middle" className="lbl-s mono">
        t−3
      </text>
      <rect
        className="cell cell-temp"
        x="458"
        y="40"
        width="56"
        height="34"
        rx="4"
      />
      <text x="486" y="61" textAnchor="middle" className="lbl-s mono">
        t−2
      </text>
      <rect
        className="cell cell-temp"
        x="522"
        y="40"
        width="56"
        height="34"
        rx="4"
      />
      <text x="550" y="61" textAnchor="middle" className="lbl-s mono">
        t−1
      </text>
      <g className="new anim">
        <rect
          className="cell cell-temp"
          x="586"
          y="40"
          width="40"
          height="34"
          rx="4"
        />
        <text x="606" y="61" textAnchor="middle" className="lbl-s mono">
          t
        </text>
      </g>
      <text x="470" y="100" textAnchor="middle" className="lbl-s">
        one entry per price round, keyed by timestamp;
      </text>
      <text x="470" y="116" textAnchor="middle" className="lbl-s">
        TTL derived from retention → old rounds can expire independently
      </text>
      <text x="330" y="180" textAnchor="middle" className="lbl-s">
        temporary entries are deleted on expiry without a cleanup transaction;
        rent is half the persistent rate
      </text>
    </svg>
  ),
  d5: (
    <svg
      viewBox="0 0 660 170"
      role="img"
      aria-label="Animation: extend_ttl is a no-op while plenty of TTL remains, and extends the TTL to the bump amount once it drops below the threshold."
    >
      <text x="60" y="30" className="lbl">
        TTL of <tspan className="mono">Balance(alice)</tspan>
      </text>
      <rect
        className="ttl-track"
        x="60"
        y="70"
        width="540"
        height="14"
        rx="3"
      />
      <rect
        className="extend-zone"
        x="60"
        y="70"
        width="324"
        height="14"
        rx="3"
      />
      <text x="222" y="110" textAnchor="middle" className="lbl-s fill-danger">
        in this zone, an extend_ttl() call extends the TTL
      </text>
      <rect
        className="ttl-fill-pers bar pbar anim"
        x="60"
        y="70"
        width="540"
        height="14"
        rx="3"
      />
      <line className="threshold" x1="384" y1="58" x2="384" y2="96" />
      <text x="384" y="52" textAnchor="middle" className="lbl-s fill-danger">
        THRESHOLD (BUMP − 17,280 ledgers)
      </text>
      <text x="60" y="110" className="lbl-s">
        0
      </text>
      <text x="600" y="110" textAnchor="end" className="lbl-s">
        BUMP (e.g. 518,400 ledgers)
      </text>
      <g className="bolt1 anim">
        <text x="470" y="46" textAnchor="middle" className="lbl fill-ink">
          extend_ttl()
        </text>
      </g>
      <text x="470" y="132" textAnchor="middle" className="lbl-s noop anim">
        above threshold → extend_ttl is a no-op
      </text>
      <g className="bolt2 anim">
        <text x="270" y="46" textAnchor="middle" className="lbl fill-ink">
          extend_ttl()
        </text>
      </g>
      <text
        x="270"
        y="132"
        textAnchor="middle"
        className="lbl-s bump anim fill-teal"
      >
        below threshold → extended to BUMP · rent charged with transaction fees
      </text>
      <text x="330" y="160" textAnchor="middle" className="lbl-s">
        if called on every access → at most one extension per 17,280 ledgers
      </text>
    </svg>
  ),
  d6: (
    <svg
      viewBox="0 0 660 160"
      role="img"
      aria-label="Animation: a list inside one entry fills up to the hard cap the contract chose for itself; the next insert is rejected by contract code, not by a network limit."
    >
      <rect
        className="cell cell-pers"
        x="60"
        y="40"
        width="400"
        height="60"
        rx="8"
      />
      <text x="260" y="30" textAnchor="middle" className="lbl fill-teal">
        ResList — ONE entry, hard cap in code
      </text>
      <rect
        className="cell slot s1 anim"
        x="76"
        y="54"
        width="56"
        height="32"
        rx="4"
      />
      <text x="104" y="75" textAnchor="middle" className="lbl-s mono">
        USDC
      </text>
      <rect
        className="cell slot s2 anim"
        x="140"
        y="54"
        width="56"
        height="32"
        rx="4"
      />
      <text x="168" y="75" textAnchor="middle" className="lbl-s mono">
        XLM
      </text>
      <rect
        className="cell slot s3 anim"
        x="204"
        y="54"
        width="56"
        height="32"
        rx="4"
      />
      <text x="232" y="75" textAnchor="middle" className="lbl-s mono">
        EURC
      </text>
      <rect
        className="cell slot s4 anim"
        x="268"
        y="54"
        width="56"
        height="32"
        rx="4"
      />
      <text x="296" y="75" textAnchor="middle" className="lbl-s mono">
        wBTC
      </text>
      <rect
        className="cell slot s5 anim"
        x="332"
        y="54"
        width="56"
        height="32"
        rx="4"
      />
      <text x="360" y="75" textAnchor="middle" className="lbl-s mono">
        wETH
      </text>
      <rect
        className="cell slot s6 anim"
        x="396"
        y="54"
        width="48"
        height="32"
        rx="4"
      />
      <text x="420" y="75" textAnchor="middle" className="lbl-s mono">
        …30
      </text>
      <g className="reject anim">
        <rect
          className="cell stroke-danger"
          x="530"
          y="54"
          width="56"
          height="32"
          rx="4"
        />
        <text
          x="558"
          y="75"
          textAnchor="middle"
          className="lbl-s mono fill-danger"
        >
          #31
        </text>
      </g>
      <text
        x="558"
        y="114"
        textAnchor="middle"
        className="lbl-s panic anim fill-danger"
      >
        <tspan x="558">rejected: contract&apos;s own cap</tspan>
        <tspan x="558" dy="14">
          — not a network limit
        </tspan>
      </text>
      <text x="260" y="130" textAnchor="middle" className="lbl-s">
        whole list read in 1 footprint entry · iterate in memory
      </text>
    </svg>
  ),
  d7: (
    <svg
      viewBox="0 0 660 200"
      role="img"
      aria-label="Animation: a packed entry rewrites the whole blob on any update, while split entries update one small piece at a time."
    >
      <text x="165" y="24" textAnchor="middle" className="lbl">
        packed — read/written together
      </text>
      <rect
        className="cell cell-pers wholeblob anim"
        x="55"
        y="36"
        width="220"
        height="92"
        rx="8"
      />
      <text x="165" y="58" textAnchor="middle" className="lbl-s mono fill-ink">
        Positions(user)
      </text>
      <text x="165" y="78" textAnchor="middle" className="lbl-s mono fill-ink">
        liabilities · collateral · supply
      </text>
      <text x="165" y="98" textAnchor="middle" className="lbl-s fill-ink">
        all user positions = 1 read
      </text>
      <text x="165" y="150" textAnchor="middle" className="lbl-s u1 anim">
        any update rewrites the whole blob
      </text>

      <line className="wire dashed" x1="330" y1="30" x2="330" y2="170" />

      <text x="495" y="24" textAnchor="middle" className="lbl">
        split — updated independently
      </text>
      <rect
        className="cell cell-pers onefield anim"
        x="390"
        y="36"
        width="210"
        height="24"
        rx="4"
      />
      <text x="495" y="52" textAnchor="middle" className="lbl-s mono fill-ink">
        ResData(asset) — rates, hot
      </text>
      <rect
        className="cell cell-pers"
        x="390"
        y="68"
        width="210"
        height="24"
        rx="4"
      />
      <text x="495" y="84" textAnchor="middle" className="lbl-s mono">
        ResConfig(asset) — admin, cold
      </text>
      <text x="495" y="150" textAnchor="middle" className="lbl-s u2 anim">
        hot data updates without rewriting cold config
      </text>
      <text x="330" y="188" textAnchor="middle" className="lbl-s">
        heuristic: pack data usually read and written together
      </text>
    </svg>
  ),
  d8: (
    <svg
      viewBox="0 0 660 214"
      role="img"
      aria-label="Animation: swap-and-pop removal in four steps — read the last item, move it into the removed slot, fix its reverse pointer, remove the tail — all in constant time."
    >
      <text x="330" y="22" textAnchor="middle" className="lbl">
        remove C from &#123;A B C D E&#125; — swap-and-pop, O(1)
      </text>
      <text x="93" y="52" textAnchor="middle" className="lbl-s mono">
        idx 0
      </text>
      <text x="225" y="52" textAnchor="middle" className="lbl-s mono">
        idx 1
      </text>
      <text x="357" y="52" textAnchor="middle" className="lbl-s mono">
        idx 2
      </text>
      <text x="489" y="52" textAnchor="middle" className="lbl-s mono">
        idx 3
      </text>
      <text x="621" y="52" textAnchor="middle" className="lbl-s mono">
        idx 4
      </text>
      <rect
        className="cell cell-pers"
        x="45"
        y="62"
        width="96"
        height="40"
        rx="5"
      />
      <text x="93" y="87" textAnchor="middle" className="lbl mono fill-ink">
        A
      </text>
      <rect
        className="cell cell-pers"
        x="177"
        y="62"
        width="96"
        height="40"
        rx="5"
      />
      <text x="225" y="87" textAnchor="middle" className="lbl mono fill-ink">
        B
      </text>
      <g className="gone anim">
        <rect
          className="cell cell-pers"
          x="309"
          y="62"
          width="96"
          height="40"
          rx="5"
        />
        <text x="357" y="87" textAnchor="middle" className="lbl mono fill-ink">
          C
        </text>
      </g>
      <rect
        className="cell cell-pers"
        x="441"
        y="62"
        width="96"
        height="40"
        rx="5"
      />
      <text x="489" y="87" textAnchor="middle" className="lbl mono fill-ink">
        D
      </text>
      <g className="mover anim">
        <rect
          className="cell cell-pers"
          x="573"
          y="62"
          width="96"
          height="40"
          rx="5"
        />
        <text x="621" y="87" textAnchor="middle" className="lbl mono fill-ink">
          E
        </text>
      </g>
      <rect
        className="cell tail anim fill-none dashed"
        x="573"
        y="62"
        width="96"
        height="40"
        rx="5"
      />
      <text x="264" y="122" className="lbl-s note1 anim">
        1 · read the last item
      </text>
      <text x="264" y="138" className="lbl-s note2 anim">
        2 · move it into the hole
      </text>
      <text x="264" y="154" className="lbl-s note3 anim">
        3 · fix its reverse pointer
      </text>
      <text x="264" y="170" className="lbl-s note4 anim">
        4 · remove the tail
      </text>
      <text x="330" y="200" textAnchor="middle" className="lbl-s">
        a constant number of entry updates, regardless of set size — order is
        not preserved
      </text>
    </svg>
  ),
  d9: (
    <svg
      viewBox="0 0 660 210"
      role="img"
      aria-label="Animation: a global cumulative index rises over time; a user who shows up settles only their own delta; everyone else's entries are untouched."
    >
      <text x="330" y="22" textAnchor="middle" className="lbl">
        global entry — cumulative rewards-per-share, only ever increases
      </text>
      <rect
        className="cell cell-pers"
        x="130"
        y="32"
        width="400"
        height="34"
        rx="6"
      />
      <rect className="ttl-track" x="146" y="45" width="368" height="8" />
      <rect
        className="bar gidx anim ttl-fill-pers"
        x="146"
        y="45"
        width="368"
        height="8"
      />
      <text x="330" y="86" textAnchor="middle" className="lbl-s mono">
        index: 1.0842… ↑ (advanced lazily when emissions are updated)
      </text>

      <g className="alice anim">
        <rect
          className="cell cell-pers"
          x="80"
          y="118"
          width="180"
          height="48"
          rx="6"
        />
        <text x="170" y="138" textAnchor="middle" className="lbl-s mono">
          UserEmis(alice)
        </text>
        <text x="170" y="155" textAnchor="middle" className="lbl-s mono">
          index: 0.9310 → 1.0842
        </text>
      </g>
      <line
        className="wire dline anim stroke-teal"
        x1="220"
        y1="66"
        x2="185"
        y2="116"
      />
      <text
        x="170"
        y="188"
        textAnchor="middle"
        className="lbl-s delta anim fill-teal"
      >
        accrued += shares × Δindex — settles when alice shows up
      </text>

      <g className="ghost anim">
        <rect
          className="cell dashed"
          x="330"
          y="118"
          width="130"
          height="48"
          rx="6"
        />
        <text x="395" y="138" textAnchor="middle" className="lbl-s mono">
          UserEmis(bob)
        </text>
        <text x="395" y="155" textAnchor="middle" className="lbl-s">
          untouched
        </text>
        <rect
          className="cell dashed"
          x="474"
          y="118"
          width="130"
          height="48"
          rx="6"
        />
        <text x="539" y="138" textAnchor="middle" className="lbl-s mono">
          …× 10,000
        </text>
        <text x="539" y="155" textAnchor="middle" className="lbl-s">
          untouched
        </text>
      </g>
    </svg>
  ),
  d10: (
    <svg
      viewBox="0 0 660 210"
      role="img"
      aria-label="Animation: a whole airdrop list collapses to a 32-byte Merkle root on-chain; claimers bring the data plus a proof, and successful claims add a claimed flag to the same instance entry."
    >
      <g className="leaves anim">
        <rect className="cell" x="60" y="140" width="100" height="30" rx="4" />
        <text x="110" y="159" textAnchor="middle" className="lbl-s mono">
          alice, 500
        </text>
        <rect className="cell" x="180" y="140" width="100" height="30" rx="4" />
        <text x="230" y="159" textAnchor="middle" className="lbl-s mono">
          bob, 1200
        </text>
        <rect className="cell" x="300" y="140" width="100" height="30" rx="4" />
        <text x="350" y="159" textAnchor="middle" className="lbl-s mono">
          carol, 90
        </text>
        <rect className="cell" x="420" y="140" width="100" height="30" rx="4" />
        <text x="470" y="159" textAnchor="middle" className="lbl-s mono">
          …10,000 more
        </text>
        <line className="wire" x1="110" y1="140" x2="170" y2="106" />
        <line className="wire" x1="230" y1="140" x2="170" y2="106" />
        <line className="wire" x1="350" y1="140" x2="410" y2="106" />
        <line className="wire" x1="470" y1="140" x2="410" y2="106" />
        <rect className="cell" x="130" y="82" width="80" height="24" rx="4" />
        <text x="170" y="98" textAnchor="middle" className="lbl-s mono">
          h₀₁
        </text>
        <rect className="cell" x="370" y="82" width="80" height="24" rx="4" />
        <text x="410" y="98" textAnchor="middle" className="lbl-s mono">
          h₂₃
        </text>
        <line className="wire" x1="170" y1="82" x2="290" y2="52" />
        <line className="wire" x1="410" y1="82" x2="290" y2="52" />
        <text x="290" y="196" textAnchor="middle" className="lbl-s">
          the full list lives off-chain
        </text>
      </g>
      <rect
        className="cell root anim stroke-ink"
        x="230"
        y="26"
        width="120"
        height="28"
        rx="5"
      />
      <text x="290" y="45" textAnchor="middle" className="lbl-s mono fill-ink">
        RootHash
      </text>
      <text x="440" y="40" className="lbl-s onchain anim fill-ink">
        ← 32-byte root in instance storage
      </text>
      <text x="440" y="60" className="lbl-s claim anim">
        + each <tspan className="mono">Claimed(i)</tspan> flag grows that same
        entry
      </text>
    </svg>
  ),
  d11: (
    <svg
      viewBox="0 0 660 210"
      role="img"
      aria-label="Animation: a factory contract deploys one contract per trading pair and keeps the pair registry plus factory configuration; each deployed contract gets its own storage domain."
    >
      <rect
        className="cell stroke-ink"
        x="40"
        y="46"
        width="150"
        height="120"
        rx="10"
      />
      <text x="115" y="72" textAnchor="middle" className="lbl fill-ink">
        factory
      </text>
      <text x="115" y="94" textAnchor="middle" className="lbl-s">
        registry + factory config
      </text>
      <g className="reg1 anim">
        <text x="115" y="114" textAnchor="middle" className="lbl-s mono">
          0 → pair XLM/USDC
        </text>
      </g>
      <g className="reg2 anim">
        <text x="115" y="130" textAnchor="middle" className="lbl-s mono">
          1 → pair XLM/EURC
        </text>
      </g>
      <g className="reg3 anim">
        <text x="115" y="146" textAnchor="middle" className="lbl-s mono">
          2 → pair BTC/USDC
        </text>
      </g>

      <line className="wire dashed" x1="190" y1="80" x2="268" y2="60" />
      <line className="wire dashed" x1="190" y1="106" x2="268" y2="106" />
      <line className="wire dashed" x1="190" y1="132" x2="268" y2="152" />

      <g className="pair pr1 anim">
        <rect
          className="cell cell-inst"
          x="270"
          y="36"
          width="170"
          height="46"
          rx="8"
        />
        <text x="355" y="56" textAnchor="middle" className="lbl-s mono">
          pair XLM/USDC
        </text>
        <text x="355" y="72" textAnchor="middle" className="lbl-s">
          own instance · own TTLs
        </text>
      </g>
      <g className="pair pr2 anim">
        <rect
          className="cell cell-inst"
          x="270"
          y="88"
          width="170"
          height="46"
          rx="8"
        />
        <text x="355" y="108" textAnchor="middle" className="lbl-s mono">
          pair XLM/EURC
        </text>
        <text x="355" y="124" textAnchor="middle" className="lbl-s">
          own instance · own TTLs
        </text>
      </g>
      <g className="pair pr3 anim">
        <rect
          className="cell cell-inst"
          x="270"
          y="140"
          width="170"
          height="46"
          rx="8"
        />
        <text x="355" y="160" textAnchor="middle" className="lbl-s mono">
          pair BTC/USDC
        </text>
        <text x="355" y="176" textAnchor="middle" className="lbl-s">
          own instance · own TTLs
        </text>
      </g>
      <g className="iso anim">
        <text x="545" y="100" textAnchor="middle" className="lbl-s fill-teal">
          independent storage domains:
        </text>
        <text x="545" y="118" textAnchor="middle" className="lbl-s fill-teal">
          pair-local entries do not conflict across pairs
        </text>
      </g>
    </svg>
  ),
};

export default function StorageDiagram({ n }: { n: number }) {
  const id = `d${n}`;
  return (
    <AnimatedDiagram id={id} caption={CAPTIONS[id]}>
      {SVGS[id]}
    </AnimatedDiagram>
  );
}
