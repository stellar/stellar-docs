# Stellar Development Meeting Notes Compilation

This document compiles available meeting notes from the Stellar Developers Google Group, formatted in Markdown with full hyperlinks to CAPs where available.

---

## 07/25/19 – Protocol Meeting Notes

### Agenda

- **[CAP-0024](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0024.md)** — Path Payment w/Fixed Amount  
  - Jon to follow up with Morley to get perspective on how this feels from a wallet implementation’s perspective, particularly between the two operations.

- **[CAP-0015](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0015.md)**  
  - Implementation question around removal of one-time signers, which currently does not take place.  
  - Consensus: preserve existing behavior for now and discuss behavior changes separately.  
  - Jon to follow up with Nico when he returns to better understand existing behavior.

- **[CAP-0021](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0021.md)**,  
  **[CAP-0022](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0022.md)**,  
  **[CAP-0025](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0025.md)** — Preconditions, Invalid Transaction Effects, Shadow Bucket Removal  
  - **CAP-0025** moves to Final Comment Period (FCP): Acceptance.  
  - **CAP-0021** is dependent on **CAP-0022**.  
  - **CAP-0022** must address additional feedback from Nico.  
  - David to own follow-up on CAP-0021/0022 dependency resolution.

---

## 01/24/19 – Protocol Meeting Notes

### Agenda

- **[CAP-0005](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0005.md)** &  
  **[CAP-0006](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0006.md)** — moving to approval.
- **[Cosigned Assets Draft](https://github.com/stellar/stellar-protocol/issues/146)** — in draft since September; current approach considered viable.
- **[CAP-0007 Revised Proposal](https://github.com/stellar/stellar-protocol/blob/master/drafts/draft-detacct.md)**.
- **[CAP-0015](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0015.md)** — Bump Fee Transactions update.
- **CAP-0013 vs SEP-0013 (CAP-0007 + CAP-0008)** — Change Trustlines to Balances.

### Meeting Notes

- **CAP-0006** progressing with specific messaging for a targeted use case.
- **CAP-0005** still lacks replace-by-fee and remains problematic.
- **Deterministic accounts & creatorTxID** (David):
  - Vastly simplified since prior iteration.
  - Salt mechanism needed; likely a full hash to prevent protocol rewind attacks.
- **Cosigned Assets**:
  - Related to **[SEP-8 (Regulated Assets)](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0008.md)**.
  - NFT discussions considered orthogonal; may warrant a separate CAP.
  - Catalog of no-op operations discussed:
    - Payment to oneself
    - Bump op 0
    - SetOptions with no fields

### Follow-up Actions

- Johnny: coordinate CAP-0006 community and API updates.
- David: expand deterministic accounts draft and address CAP-0010/CAP-0015 implications.
- Orbit: consolidate NFT discussions and assess need for a separate CAP.
- Jeremy: review SEP-13A comments and address shortcomings in SEP-13.

---

*This file will be incrementally expanded as additional meeting notes are added.*


---

## 06/27/2019 – Protocol Meeting Notes

### Announcements

- **[CAP-0015](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0015.md)** and **CAP-0021** move to *Accepted* today (after this meeting), barring no new concerns.
- **CAP-0021** moves back to *Draft* in order to resolve **[CAP-0022](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0022.md)** prior to acceptance.

### Agenda

- **[CAP-0023](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0023.md)** — *Two‑Part Payments with BalanceEntry*
  - Focused on temporal separation between initiating a payment and receiving a payment.
  - Explicitly **does not** replace existing payment operations.
  - **David’s initial framing:** ~10% additional complexity yields significantly more utility.

#### CAP‑0023 Design Discussion

- **AuthorizeBalance**
  - Should include an optional `AccountID *revocableBy`.
  - Small increase in complexity but worth it for added control.
- **Threshold semantics**
  - `CreateBalance` should use the *medium* threshold.
  - Authorization should mirror AllowTrust.
  - Claiming at a *low* threshold may be acceptable, since low‑threshold keys cannot otherwise act.
- **Operation naming**
  - Consider appending `Op` to operation names (XDR style / consistency).
- **NATIVE asset semantics**
  - AuthorizeBalance behavior for `NATIVE` assets is unspecified (invalid vs no‑op).
  - Might be better to factor shared data structures out of both AuthorizeBalance and AllowTrustOp.
  - AuthorizeBalance operates by ID and is unaware of the asset of the BalanceEntry; this structure may still be useful for AllowTrust.
- **Why AuthorizeBalance exists**
  - Needed to authorize *both* the account and the payment itself.
  - Necessary for deauthorization when assets are sent to bad actors.
  - Important for payment channels to ensure all parties are authorized before payout.
- **ACCOUNT_MERGE interaction**
  - BalanceEntries resemble hyper‑specialized deterministic accounts.
  - They do **not** participate in merges and may be abandoned (with their own reserve).
  - This behavior should be explicitly documented in the CAP.
- **Global revoke scenarios**
  - In cases where assets must be returned for replacement, funds locked in BalanceEntries pose challenges.
  - AuthorizeBalance enables trustline authorization prior to account creation.
  - Even if authorization is revoked, reclaiming balances should still be possible.
- **Extensibility**
  - Consider extending `claimBy` using a union to allow future claim‑by‑signer functionality.
- **UX considerations**
  - Some concern that less‑knowledgeable users may struggle with the flow.
  - Others believe wallet UX and the existing payment operation mitigate this risk.

### CAP‑0021 / CAP‑0022 & Payment Channel Implementation

- **[CAP-0021](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0021.md)** — *Generalized transaction preconditions*
  - Moved out of Final Comment Period back to Draft due to concerns raised by CAP‑0022.
  - May be implemented separately (branch or protocol version) for payment channels.
  - Preference is to resolve outstanding issues before acceptance.
- **[CAP-0022](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0022.md)** — *Invalid transactions must have no effects*
  - Open question: adopt CAP‑0022 as written, or pursue a stronger invariant (only fully executing transactions succeed).

### Follow‑Up Actions

- **CAP‑0023 (Jon)**
  - Add explicit behavior details regarding `ACCOUNT_MERGE`.
  - Evaluate low‑threshold usage for `ClaimBalance`.
  - Append `Op` to operation names in XDR.
  - Extend BalanceEntry claimer via a union to support future signer‑based claims or wildcard claimBy.



---

## 01/24/2019 – Protocol Meeting Notes

### Agenda

- **[CAP-0005](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0005.md)** &
  **[CAP-0006](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0006.md)** — moving to approval as of today.
- **[Cosigned Assets Draft](https://github.com/stellar/stellar-protocol/issues/146)** — in draft since September; both Jon and David feel the current approach works well.
- **[CAP-0007 Revised Proposal](https://github.com/stellar/stellar-protocol/blob/master/drafts/draft-detacct.md)**.
- **[CAP-0015](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0015.md)** — Bump Fee Transactions update (Orbit Lens to advise).
- **CAP-0013 vs SEP-0013 (CAP-0007 + CAP-0008)** — Change Trustlines to Balances.
  - Does the progression for CAP-0007 advance this discussion further?
  - Tom added error handling to Jeremy’s request in the CAP-0013 approach (SEP-0013a). Are further actions needed?

### Meeting Notes

- **CAP-0006**
  - Moving forward with specific messaging to fix a targeted use case.
  - Several follow-ups required to finalize.
- **CAP-0005**
  - Does not include replace-by-fee and remains problematic.
  - Consensus is to continue pushing toward finalization.
- **Deterministic accounts & creatorTxID** (David)
  - Updated since last week; significantly simplified.
  - Need to decide on a salt mechanism (to be discussed offline; Jeremy has several points).
- **Cosigned Assets**
  - **Tomer**: little concern either way on no-op, but clarity needed as **[SEP-8 (Regulated Assets)](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0008.md)** is actively being implemented.
  - **Orbit**: worth discussing in the context of NFTs.
  - **David**: NFT considerations are largely orthogonal to cosigned fungible assets; may warrant a separate CAP.
  - Worth cataloging existing no-ops:
    - Payment to oneself
    - Bump op 0
    - SetOptions with no fields
  - Participants encouraged to bring use cases and simple alternatives to answer:
    > “Is there anything people really want that’s simple that would solve this problem, or any concerns that would block progress?”

### Follow-Up Actions

- **Johnny**
  - Follow up with the CAP-0006 community to improve the DEX.
  - Coordinate with Jon on updating the API in the CAP-0006 implementation.
- **David**
  - Add examples to the deterministic accounts draft for testing and additional cases.
  - Add a salt mechanism (likely a full hash) to prevent protocol rewind attacks.
  - Explicitly address whether deterministic accounts eliminate the need for CAP-0010 / CAP-0015.
- **Orbit**
  - Consolidate discussions on NFTs and Asset-object extensions.
  - Determine whether a separate CAP is warranted and clarify the community’s stance on NFTs.
- **Jeremy**
  - Review Tom’s latest comments in SEP-13A.
  - Address gaps in the current SEP-13 approach.



---

## 03/07/2019 – Protocol Meeting Notes

### Announcements

- **[Merging in CAP/SEP Process](https://github.com/stellar/stellar-protocol/pull/247)**
  - Another round of edits completed; further feedback requested on the PR.
  - Intent to merge immediately, formalizing the previously ad-hoc CAP/SEP process.
  - All CAPs will be numbered upon acceptance as drafts; competing proposals will be explicitly rejected.
  - Post-merge cleanup planned for stale PRs and issues, with authors notified of next steps.
- **Establishing focus given limited developer resources**
  - Fee structure
  - Payment channels
  - Payment network (**Starlight**)

### Final Comment Period – Acceptance

- **[CAP-0017](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0017.md)** — Update `LastModifiedLedgerSeq` If and Only If LedgerEntry Is Modified (Jonathan Jove)
- **[CAP-0018](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0018.md)** — Fine-Grained Control of Authorization (Jonathan Jove)
- Address offer mutability (Jon)
- **CAP-0016** to be rejected contingent on CAP-0018 approval

### Priorities

1. **Replace Min Fee Mechanism**
2. **Trustline (& other) Usability**
   - Explicit intent to revive **[CAP-0013 Change Trustlines to Balances](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0013.md)** (Dan Robinson).
3. **Payment Channels**
   - Focus on core components required for a basic payment channel design.
4. **Starlight**
   - Deferred pending availability of dedicated development resources.

### Deferred Items

- **[CAP-0007](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0007.md)** — Deterministic Account Creation (Jeremy Rubin)
- **[CAP-0008](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0008.md)** — Self-Identified Pre-Auth Transaction (Jeremy Rubin)
- **[CAP-0009](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0009.md)** — Linear / Exterior Immutable Accounts (Jeremy Rubin)
- **[CAP-0011](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0011.md)** — Relative Account Freeze (Jeremy Rubin)
- **Draft: Deterministic accounts and creatorTxID** (David Mazières)
- **[CAP-0014](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0014.md)** — Adversarial Transaction Set Ordering (Jeremy Rubin)

### Agenda

- Final Comment proposals — new unresolved concerns (30 min max)
- CAP-0017, CAP-0018
- Address offer mutability
- Replace Min Fee (60 min max)

### Replace Min Fee Discussion

- Diverging views:
  - David and Nico prefer a mechanism *before* raising the min fee.
  - Jed favors pushing fee increases forward immediately.
- Current proposals:
  - **[CAP-0010](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0010.md)** — Fee Bump Account (Jeremy Rubin)
  - **[CAP-0015](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0015.md)** — Bump Fee Transactions (OrbitLens)
  - **Pre-draft**: feeSource and feeMultiplier (David Mazières)
- Reference spreadsheet (OrbitLens):
  - https://docs.google.com/spreadsheets/d/1_u0LE61V-jkXUcNBZW5xhXZEmIz5rQSgZEr8VsVl47o/edit
- Outcomes:
  - David to draft a new CAP superseding CAP-0015, including Transaction versioning.
  - Johnny to follow up with David regarding feeSource draft status.

### Trustline Usability

- Discussion on next steps for **CAP-0013 Change Trustlines to Balances**
- Open questions:
  - What changes would improve group consensus?
  - Are there unpresented fundamental ideas?
  - Who should own the proposal going forward?
- Related discussion: **Sender Pays** (sending assets without trustlines).
- Consensus points:
  - CAP-0013 enables adding balances to others and simplifies token distribution.
  - SEP-0013 approach explicitly rejected.
  - Hard requirements need definition; **Tom Q.** designated owner.
  - Developer-friendliness and Account ID semantics must be addressed.

### Meeting Notes

- Inline notes (highlighted in blue in original thread) captured above.

### Follow-Up Actions

- **Jon** to update CAPs based on email list feedback.
- **Tom Q.** to revise and present hard requirements for trustline usability.
- **David** to submit a new proposal for TransactionEnvelope versioning to enable changes like CAP-0015.


## Protocol Meeting — 2019-03-14

Reference: Google Group discussion
https://groups.google.com/g/stellar-dev/c/uxmo4LM5FWY/m/psazVteTBgAJ

### Announcements
- Jon made additional changes to **[CAP-0018](https://github.com/stellar/stellar-protocol/pull/263)**; with no further comments, it will move out of FCP next week.
- **CAP-0017** moved to **Approved**.

### Agenda

#### Trustline Usability
- Restated requirements document up for discussion:
  - https://docs.google.com/document/d/1_3KcBTbF7Diu_wu-ArvajYhEcPoDp9SgK5-dNruOK3c/edit#heading=h.8j5x6v50ft4p
- **[SEP-0017](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0017.md)**:
  - Deposit & transfer of assets using **[CAP-0013](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0013.md)**
- **[SEP-0016](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0016.md)**:
  - Deposit & transfer of assets using deterministic accounts
- It is not possible to satisfy all requirements in the protocol’s current form.

#### Issues with CAP-0013
- If base reserve increases, malicious actors could add large numbers of trustlines to an account.
- Accounts can be DoS’d via the subentry limit.
- The proposal has very large scope, affecting most operations and assumptions in the protocol.

#### Alternatives Discussed
- Use deterministic accounts and merge them if the receiver already has an account.
- Introduce a **SentBalance** ledger entry claimable by the receiver.
- Introduce a **remove trustline** operation that returns assets to the sender.

#### Fee Mechanisms
- David proposed **[CAP-0019](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0019.md)**:
  - Enables future-upgradability of `TransactionEnvelope`
  - Allows a simpler implementation of **[CAP-0015](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0015.md)**

### Follow‑up Actions
- **David**: Write a short proposal on “embryonic accounts”.
- **Jeremy**: Clarify SEP‑0016 workflow with deterministic accounts.
- **Jon**: Provide analysis of attack surfaces and issues in CAP‑0013.


## Protocol Meeting — 2019-03-21

Reference: Google Group discussion
https://groups.google.com/g/stellar-dev/c/KzgQc58510o/m/1qRSxo7GCAAJ

### Announcements
- [CAP-0016](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0016.md) rejected in favor of [CAP-0018](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0018.md) (now Accepted). CAP-0016 will only be revived if CAP-0018 encounters implementation issues.
- [CAP-0018](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0018.md) moved to Accepted.
- [CAP-0019](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0019.md) moved to FCP: Acceptance.
- Jed was in Singapore this week; trustline discussions were postponed until his return.

### Agenda

#### Fee Follow-ups
- Topics: [CAP-0019](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0019.md), [CAP-0015](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0015.md), and other fee-related suggestions.
- Decision: Push CAP-0019 to FCP: Acceptance and reframe CAP-0015 in the context of CAP-0019.

#### Future of the Order Book — Ideation
- Broad discussion of possible directions for the order book.
- No commitments were made.
- Goal: Produce an exhaustive list of ideas, followed by prioritization and requirements definition in future sessions.


## 2019-03-28 Protocol Meeting

Reference: Google Group discussion
https://groups.google.com/g/stellar-dev/c/t162rVxLYB4/m/XB4_9st1BgAJ

_Reference: [Google Groups discussion](https://groups.google.com/g/stellar-dev/c/t162rVxLYB4/m/XB4_9st1BgAJ)_


### Announcements

- [CAP-0019](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0019.md) (Future-upgradable TransactionEnvelope type) is moving to Accepted.
- “Implementation Review” stage added for CAPs (see https://github.com/stellar/stellar-protocol/pull/279); keep in mind for future CAP process.
- Jed out this week; trustline discussion pushed again.
- CAP-0020 implementation is mostly there.

### Agenda

- [CAP-0015](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0015.md) (Bump Fee Extension): Modified to utilize CAP-0019. Goal is to bring it to a vote, or enumerate what is needed to make it pass.
  - David: Two transaction IDs (inner and outer) as a result of the change.
  - Nico: Original feedback was that this relies on CAP-0005 logic that no longer exists in the CAP-0005 implementation.
  - Nico and David to discuss offline; David to submit additional edits and document constraints and issues from the meeting.
- [SEP-0019](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0019.md) (Bootstrapping Multisig Transaction Submission):
  - Significant discussion with contributions from Paul Selden, Antoine (MrTicot), Orbit, Johan, and others.
  - Focus should remain on SEP-0019 and direction for any related SEPs.
  - Can pull in Paul and others for the next meeting; it is likely the most active SEP currently.
  - SEP-0019 is largely focused on the StellarGuard protocol and currently only describes basic flow properties and API endpoints; substantial work remains.
  - Open questions:
    - Metadata (storage and off-chain handling)
    - Coordinator (no core changes required)
    - Possible use of an IPFS home domain
  - Orbit to send a document outlining design considerations for multisig transaction coordination.


## 2019-04-04 — Protocol Meeting

Reference: Google Group discussion
https://groups.google.com/g/stellar-dev/c/QSR2wf207ow/m/stluewnDCQAJ

Announcements
- Pushing fee work out to next week given David and Orbit’s absence (Tomer is also out).

Agenda
- Discussing next steps for trustlines work.
- David personally doesn’t feel good about pushing forward Sponsored Trustlines, despite multiple people who think it’s mostly there (Tom, Orbit).
- There was initial discussion of going back to [SEP-0016 (atp3 account transfer)](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0016.md).
- Goal today is to discuss alternative solutions (as opposed to criticism of existing solutions), given the requirements that are extensively listed [here](https://docs.google.com/document/d/1_3KcBTbF7Diu_wu-ArvajYhEcPoDp9SgK5-dNruOK3c/edit?usp=sharing).

Jon proposal
- Trying to solve the add balance problem, and the merge problem related to trustlines.
- We add a concept called a mergeable trustline.
- Can send them to anyone; only the account owner can merge it into a “classic” trustline.
- “CAP-XXXX (Pending Trustlines)” that doesn’t break merge.
- Carries its own reserve, uses union-find to merge accounts. Would give O(log n) performance for merging accounts (not the most efficient version of union-find, but still performant).

Summary of mergeable trustline details
- Mergeable trustlines are associated with accounts via a variant of a union-find data structure (see https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-046j-design-and-analysis-of-algorithms-spring-2012/lecture-notes/MIT6_046JS12_lec16.pdf) that does not include the path-compression optimization.
- Mergeable trustlines are immutable, except that the balance can be transferred in its entirety to the “real” trustline for the corresponding asset on the same account (noted in the meeting that this might be relaxable).
- Each mergeable trustline carries an amount of native asset equal to the base reserve at the time it was created, and this is the entire reserve requirement of the mergeable trustline.
- An account can have an arbitrary number of mergeable trustlines associated with it, even multiple mergeable trustlines for the same asset.
- Sending a mergeable trustline never fails if the receiving account exists.
- Merging accounts never fails due to the presence of mergeable trustlines.
- Open questions included what happens if the sender owns the trustline, or if the sender merges their account, creating issues around locking accounts and outstanding trustlines.
- Revocability should not be done on-ledger; it should be handled via pre-authorized transactions or other multi-phase protocols. If it is on-ledger, it should be irrevocable.

Nico’s caveats
- Similar complexities arise as with SEP-0016: clients must track incoming mergeable trustlines, decide whether they matter, query them from Horizon, and take actions.
- This puts significant burden on clients to download and reason about many mergeable trustlines.
- Union-find might help reduce what needs to be downloaded, potentially in tandem with SEP-0016.
- David, Nico, and Jon’s proposals all rely on some form of “incoming trustline” at the core layer, which does not appear substantially simpler than ecosystem-level approaches.

SEP-0016 thoughts
- Defining the last step is difficult given current protocol constraints and would require “shrink to fit” and other small core changes.
- SEP-0016 should likely remain a living document that evolves alongside core capabilities.

Follow-up actions
- David to put together a list of constraints and concerns blocking [CAP-0015](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0015.md) from moving forward with Nico.


## 2019-06-13 Protocol Meeting

Reference: Google Group discussion
https://groups.google.com/g/stellar-dev/c/I1GAjjcfDA0/m/CIzRMI-FBAAJ

_Reference: [Google Groups discussion](https://groups.google.com/g/stellar-dev/c/I1GAjjcfDA0/m/CIzRMI-FBAAJ)_


### Announcements

- [CAP-0021](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0021.md) and [CAP-0015](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0015.md) moved to FCP: Acceptance.

### Agenda

- David’s Pre-Condition proposal: [CAP-0021](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0021.md)
  - After several iterations with the Channels working group, CAP-0021 was presented for decision.
  - Following discussion on its importance for payment channels and its fit within the current framework, the group agreed to move CAP-0021 to FCP: Acceptance.
- Clarifying final aspects of fee bump ([CAP-0015](https://github.com/stellar/stellar-protocol/blob/master/core/cap-0015.md)), including questions raised in Nico’s latest pull request:
  - https://github.com/stellar/stellar-protocol/pull/323
  - CAP-0015 will move to FCP: Acceptance after a final round of wording changes.
- If time permits, Jon to give an update from the trustlines/balances work.
  - Decision made not to discuss this fully until the draft is finalized, particularly around rationale and alternative ideas.
