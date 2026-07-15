import React from "react";
import AnimatedDiagram from "./AnimatedDiagram";

const CAPTIONS: Record<string, string> = {
  d0: "The three tiers differ in lifecycle, not interface. No TTL ever extends itself — the refill shown is the contract calling extend_ttl(), a pattern used on persistent entries too. These colors mean the same thing in every diagram on this page.",
};

const SVGS: Record<string, React.ReactNode> = {
  d0: (
    <svg
      viewBox="0 0 660 210"
      role="img"
      aria-label="Animation: the contract explicitly extends the instance entry's TTL on each call; persistent entries archive and can be restored; temporary entries are deleted forever."
    >
      <text
        x="95"
        y="20"
        textAnchor="middle"
        className="lbl"
        fill="var(--amber)"
      >
        instance()
      </text>
      <rect
        className="cell cell-inst"
        x="35"
        y="34"
        width="120"
        height="64"
        rx="6"
      />
      <text x="95" y="60" textAnchor="middle" className="lbl-s">
        contract instance
      </text>
      <text x="95" y="76" textAnchor="middle" className="lbl-s mono">
        Admin, Config…
      </text>
      <circle
        className="dot call anim"
        cx="0"
        cy="66"
        r="4"
        fill="var(--amber)"
      />
      <rect className="ttl-track" x="35" y="112" width="120" height="6" />
      <rect
        className="ttl-fill-inst bar b-inst anim"
        x="35"
        y="112"
        width="120"
        height="6"
      />
      <rect
        className="ttl-fill-inst bar b-inst-refill anim"
        x="35"
        y="112"
        width="120"
        height="6"
      />
      <text x="118" y="140" textAnchor="middle" className="lbl-s">
        contract calls extend_ttl() — never automatic
      </text>
      <text
        x="95"
        y="168"
        textAnchor="middle"
        className="lbl-s"
        fill="var(--amber)"
      >
        one entry, loaded each call
      </text>

      <text
        x="330"
        y="20"
        textAnchor="middle"
        className="lbl"
        fill="var(--teal)"
      >
        persistent()
      </text>
      <g className="pers-dim anim">
        <rect
          className="cell cell-pers"
          x="270"
          y="34"
          width="120"
          height="64"
          rx="6"
        />
        <text x="330" y="60" textAnchor="middle" className="lbl-s mono">
          Balance(alice)
        </text>
        <text x="330" y="76" textAnchor="middle" className="lbl-s mono">
          → 1_000_000
        </text>
      </g>
      <g className="archived anim">
        <line className="hatch" x1="276" y1="92" x2="330" y2="38" />
        <line className="hatch" x1="296" y1="94" x2="352" y2="38" />
        <line className="hatch" x1="318" y1="94" x2="374" y2="38" />
        <line className="hatch" x1="340" y1="94" x2="386" y2="48" />
        <text
          x="330"
          y="168"
          textAnchor="middle"
          className="lbl-s"
          fill="var(--teal)"
        >
          archived — auto-restored on next use (rent re-paid)
        </text>
      </g>
      <rect className="ttl-track" x="270" y="112" width="120" height="6" />
      <rect
        className="ttl-fill-pers bar b-pers anim"
        x="270"
        y="112"
        width="120"
        height="6"
      />
      <text x="330" y="140" textAnchor="middle" className="lbl-s">
        TTL runs out…
      </text>

      <text
        x="565"
        y="20"
        textAnchor="middle"
        className="lbl"
        fill="var(--rose)"
      >
        temporary()
      </text>
      <g className="temp-cell anim">
        <rect
          className="cell cell-temp"
          x="505"
          y="34"
          width="120"
          height="64"
          rx="6"
        />
        <text x="565" y="60" textAnchor="middle" className="lbl-s mono">
          Allowance(a,b)
        </text>
        <text x="565" y="76" textAnchor="middle" className="lbl-s mono">
          → 500
        </text>
      </g>
      <rect className="ttl-track" x="505" y="112" width="120" height="6" />
      <rect
        className="ttl-fill-temp bar b-temp anim"
        x="505"
        y="112"
        width="120"
        height="6"
      />
      <text x="565" y="140" textAnchor="middle" className="lbl-s">
        TTL runs out…
      </text>
      <text
        x="565"
        y="168"
        textAnchor="middle"
        className="lbl-s deleted anim"
        fill="var(--rose)"
      >
        deleted forever · half rent
      </text>
    </svg>
  ),
  d1: (
    <svg
      viewBox="0 0 660 170"
      role="img"
      aria-label="Animation: every invocation loads the contract instance entry, and the config inside it comes along for free."
    >
      <text x="120" y="52" textAnchor="middle" className="lbl">
        invocations
      </text>
      <circle className="inv anim" cx="60" cy="86" r="5" fill="var(--ink)" />
      <circle
        className="inv inv2 anim"
        cx="60"
        cy="86"
        r="5"
        fill="var(--ink)"
      />
      <circle
        className="inv inv3 anim"
        cx="60"
        cy="86"
        r="5"
        fill="var(--ink)"
      />
      <line className="wire" x1="52" y1="86" x2="196" y2="86" />
      <rect
        className="cell cell-inst box anim"
        x="210"
        y="30"
        width="240"
        height="112"
        rx="10"
      />
      <text
        x="330"
        y="54"
        textAnchor="middle"
        className="lbl"
        fill="var(--amber)"
      >
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
        loaded on every call anyway → config rides along for free
      </text>
    </svg>
  ),
  d2: (
    <svg
      viewBox="0 0 660 190"
      role="img"
      aria-label="Animation: one shared map entry swells toward the 64-kibibyte cap, while one-entry-per-user stays small and parallel."
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
        className="lbl warn anim"
        fill="var(--danger)"
      >
        → 64 KiB cap · rewrites · contention
      </text>

      <line
        className="wire"
        x1="330"
        y1="30"
        x2="330"
        y2="160"
        strokeDasharray="3 4"
      />

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
          …one independent entry per user,
        </text>
        <text x="495" y="162" textAnchor="middle" className="lbl-s">
          touched only by that user's transactions
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
      aria-label="Animation: a temporary allowance entry is deleted exactly when its TTL runs out, and a timestamp-keyed price history prunes itself."
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
        TTL set to the deadline itself
      </text>
      <text
        x="135"
        y="70"
        textAnchor="middle"
        className="lbl gonelbl anim"
        fill="var(--rose)"
      >
        deleted — zero cleanup cost
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
        TTL = retention window → oldest rounds expire on their own
      </text>
      <text x="330" y="180" textAnchor="middle" className="lbl-s">
        the TTL <tspan fontStyle="italic">is</tspan> the business logic — expiry
        does the cleanup for free, at half rent
      </text>
    </svg>
  ),
  d5: (
    <svg
      viewBox="0 0 660 170"
      role="img"
      aria-label="Animation: extend_ttl is a no-op while plenty of TTL remains, and refills the TTL to the bump amount once it drops below the threshold."
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
        x="60"
        y="70"
        width="324"
        height="14"
        rx="3"
        fill="var(--danger)"
        opacity=".14"
      />
      <text
        x="222"
        y="110"
        textAnchor="middle"
        className="lbl-s"
        fill="var(--danger)"
      >
        in this zone, access extends the TTL
      </text>
      <rect
        className="ttl-fill-pers bar p1 anim"
        x="60"
        y="70"
        width="540"
        height="14"
        rx="3"
      />
      <rect
        className="ttl-fill-pers bar p2 anim"
        x="60"
        y="70"
        width="540"
        height="14"
        rx="3"
      />
      <rect
        className="ttl-fill-pers bar p3 anim"
        x="60"
        y="70"
        width="540"
        height="14"
        rx="3"
      />
      <line
        x1="384"
        y1="58"
        x2="384"
        y2="96"
        stroke="var(--danger)"
        strokeWidth="1.6"
        strokeDasharray="4 3"
      />
      <text
        x="384"
        y="52"
        textAnchor="middle"
        className="lbl-s"
        fill="var(--danger)"
      >
        THRESHOLD (BUMP − 1 day)
      </text>
      <text x="60" y="110" className="lbl-s">
        0
      </text>
      <text x="600" y="110" textAnchor="end" className="lbl-s">
        BUMP (e.g. 30 days)
      </text>
      <g className="bolt1 anim">
        <text
          x="470"
          y="46"
          textAnchor="middle"
          className="lbl"
          fill="var(--ink)"
        >
          ⚡ access
        </text>
      </g>
      <text x="470" y="132" textAnchor="middle" className="lbl-s noop anim">
        above threshold → extend_ttl is a no-op
      </text>
      <g className="bolt2 anim">
        <text
          x="270"
          y="46"
          textAnchor="middle"
          className="lbl"
          fill="var(--ink)"
        >
          ⚡ access
        </text>
      </g>
      <text
        x="270"
        y="132"
        textAnchor="middle"
        className="lbl-s bump anim"
        fill="var(--teal)"
      >
        below threshold → refilled to BUMP · rent paid by the user who touched
        it
      </text>
      <text x="330" y="160" textAnchor="middle" className="lbl-s">
        applied on every read and write → at most one small extension per day
        per active entry
      </text>
    </svg>
  ),
  d6: (
    <svg
      viewBox="0 0 660 160"
      role="img"
      aria-label="Animation: a list inside one entry fills up to its hard cap; the next insert is rejected with a panic."
    >
      <rect
        className="cell cell-pers"
        x="60"
        y="40"
        width="400"
        height="60"
        rx="8"
      />
      <text
        x="260"
        y="30"
        textAnchor="middle"
        className="lbl"
        fill="var(--teal)"
      >
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
          className="cell"
          x="530"
          y="54"
          width="56"
          height="32"
          rx="4"
          stroke="var(--danger)"
        />
        <text
          x="558"
          y="75"
          textAnchor="middle"
          className="lbl-s mono"
          fill="var(--danger)"
        >
          #31
        </text>
      </g>
      <text
        x="558"
        y="120"
        textAnchor="middle"
        className="lbl-s panic anim"
        fill="var(--danger)"
      >
        panic! cap reached
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
      <text
        x="165"
        y="58"
        textAnchor="middle"
        className="lbl-s mono"
        fill="var(--ink)"
      >
        Positions(user)
      </text>
      <text
        x="165"
        y="78"
        textAnchor="middle"
        className="lbl-s mono"
        fill="var(--ink)"
      >
        liabilities · collateral · supply
      </text>
      <text
        x="165"
        y="98"
        textAnchor="middle"
        className="lbl-s"
        fill="var(--ink)"
      >
        health check = 1 read
      </text>
      <text x="165" y="150" textAnchor="middle" className="lbl-s u1 anim">
        any update rewrites the whole blob
      </text>

      <line
        className="wire"
        x1="330"
        y1="30"
        x2="330"
        y2="170"
        strokeDasharray="3 4"
      />

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
      <text
        x="495"
        y="52"
        textAnchor="middle"
        className="lbl-s mono"
        fill="var(--ink)"
      >
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
        ResConfig(asset) — cold, admin
      </text>
      <text x="495" y="150" textAnchor="middle" className="lbl-s u2 anim">
        hot data updates without rewriting cold config
      </text>
      <text x="330" y="188" textAnchor="middle" className="lbl-s">
        rule: what a transaction reads and writes together belongs together
      </text>
    </svg>
  ),
  d8: (
    <svg
      viewBox="0 0 660 190"
      role="img"
      aria-label="Animation: swap-and-pop removal — the last item moves into the removed slot and the tail is deleted, all in constant time."
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
      <text
        x="93"
        y="87"
        textAnchor="middle"
        className="lbl mono"
        fill="var(--ink)"
      >
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
      <text
        x="225"
        y="87"
        textAnchor="middle"
        className="lbl mono"
        fill="var(--ink)"
      >
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
        <text
          x="357"
          y="87"
          textAnchor="middle"
          className="lbl mono"
          fill="var(--ink)"
        >
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
      <text
        x="489"
        y="87"
        textAnchor="middle"
        className="lbl mono"
        fill="var(--ink)"
      >
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
        <text
          x="621"
          y="87"
          textAnchor="middle"
          className="lbl mono"
          fill="var(--ink)"
        >
          E
        </text>
      </g>
      <rect
        className="cell tail anim"
        x="573"
        y="62"
        width="96"
        height="40"
        rx="5"
        fill="none"
        strokeDasharray="4 3"
      />
      <text
        x="357"
        y="130"
        textAnchor="middle"
        className="lbl-s note1 anim"
        fill="var(--rose)"
      >
        1 · delete C
      </text>
      <text
        x="489"
        y="150"
        textAnchor="middle"
        className="lbl-s note2 anim"
        fill="var(--teal)"
      >
        2 · move last item into the hole · 3 · fix its reverse pointer · 4 · pop
        the tail
      </text>
      <text x="330" y="178" textAnchor="middle" className="lbl-s">
        constant ~3 writes + 1 delete, regardless of set size — order is not
        preserved
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
        index: 1.0842… ↑ (advanced lazily, on first touch per block)
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
        className="wire dline anim"
        x1="220"
        y1="66"
        x2="185"
        y2="116"
        stroke="var(--teal)"
      />
      <text
        x="170"
        y="188"
        textAnchor="middle"
        className="lbl-s delta anim"
        fill="var(--teal)"
      >
        accrued += shares × Δindex — settles when alice shows up
      </text>

      <g className="ghost anim" opacity=".45">
        <rect
          className="cell"
          x="330"
          y="118"
          width="130"
          height="48"
          rx="6"
          strokeDasharray="4 3"
        />
        <text x="395" y="138" textAnchor="middle" className="lbl-s mono">
          UserEmis(bob)
        </text>
        <text x="395" y="155" textAnchor="middle" className="lbl-s">
          untouched
        </text>
        <rect
          className="cell"
          x="474"
          y="118"
          width="130"
          height="48"
          rx="6"
          strokeDasharray="4 3"
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
      aria-label="Animation: a whole airdrop list collapses to a single 32-byte Merkle root on-chain; claimers bring the data plus a proof."
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
        className="cell root anim"
        x="230"
        y="26"
        width="120"
        height="28"
        rx="5"
        stroke="var(--ink)"
      />
      <text
        x="290"
        y="45"
        textAnchor="middle"
        className="lbl-s mono"
        fill="var(--ink)"
      >
        RootHash
      </text>
      <text x="440" y="40" className="lbl-s onchain anim" fill="var(--ink)">
        ← the ONLY entry on-chain: 32 bytes
      </text>
      <text x="440" y="60" className="lbl-s claim anim">
        + one tiny <tspan className="mono">Claimed(i)</tspan> flag per claimer
      </text>
    </svg>
  ),
  d11: (
    <svg
      viewBox="0 0 660 210"
      role="img"
      aria-label="Animation: a factory contract deploys one contract per trading pair and keeps only a registry; each deployed contract gets its own storage domain."
    >
      <rect
        className="cell"
        x="40"
        y="46"
        width="150"
        height="120"
        rx="10"
        stroke="var(--ink)"
      />
      <text
        x="115"
        y="72"
        textAnchor="middle"
        className="lbl"
        fill="var(--ink)"
      >
        factory
      </text>
      <text x="115" y="94" textAnchor="middle" className="lbl-s">
        keeps only the registry:
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

      <line
        className="wire"
        x1="190"
        y1="80"
        x2="268"
        y2="60"
        strokeDasharray="3 3"
      />
      <line
        className="wire"
        x1="190"
        y1="106"
        x2="268"
        y2="106"
        strokeDasharray="3 3"
      />
      <line
        className="wire"
        x1="190"
        y1="132"
        x2="268"
        y2="152"
        strokeDasharray="3 3"
      />

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
        <text
          x="545"
          y="100"
          textAnchor="middle"
          className="lbl-s"
          fill="var(--teal)"
        >
          independent storage domains:
        </text>
        <text
          x="545"
          y="118"
          textAnchor="middle"
          className="lbl-s"
          fill="var(--teal)"
        >
          pair A never contends with pair B
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
