# AIONOS Mountain AI Control Tower for Resorts World Genting

A complete front-end-only executive demo showing how AIONOS AI agents can transform procurement, supply chain, warehousing and retail operations across Resorts World Genting.

The demo is designed to feel like a live control tower rather than a static dashboard: animated route maps, simulated alerts, scenario buttons, AI recommendations, KPI changes, action feeds, truck scanning, PO approvals, inventory transfers and a GenBI-style conversational agent that answers business questions from local JSON data.

## Core message

> RWG does not need another dashboard. It needs AI agents that act across the mountain.

## Tech stack

- React + Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React
- Local JSON data only
- No backend
- No database
- No external API calls

## App modules

1. Landing / Executive Control Tower
2. Demand Shock Simulator
3. F&B Procurement Agent
4. AI Receiving Gate / IntelliWarehouse
5. Mountain Inventory Balancing Agent
6. Retail Merchandise Intelligence Agent
7. Supplier & Contract Intelligence Agent
8. GenBI Agent / Ask AIONOS
9. Business Case Cockpit
10. Pilot Roadmap

## Data files

All synthetic data lives in `src/data/`:

- `resort_zones.json`
- `events_calendar.json`
- `fnb_inventory.json`
- `suppliers.json`
- `purchase_orders.json`
- `receiving_trucks.json`
- `warehouse_inventory.json`
- `retail_skus.json`
- `contracts.json`
- `agent_actions.json`
- `genbi_knowledge_base.json`
- `business_case.json`

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```bash
http://localhost:5173
```

## Build for production

```bash
npm run build
```

The static site will be generated in:

```bash
dist/
```

## Preview production build

```bash
npm run preview
```

## Deploy to GitHub Pages

### Option 1: GitHub Pages from `/docs`

1. Run:

```bash
npm install
npm run build
```

2. Rename or copy `dist` to `docs`:

```bash
rm -rf docs
cp -r dist docs
```

3. Commit and push to GitHub.
4. In GitHub, go to **Settings → Pages**.
5. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/docs`
6. Save.

### Option 2: GitHub Actions

You can also deploy the `dist/` folder using any standard Vite GitHub Pages workflow. The project uses `base: './'` in `vite.config.js`, so assets resolve correctly on GitHub Pages repository paths.

## Demo storyline for a 20-minute client presentation

### 0–2 min: Open with the executive control tower

Start on the **Executive Control Tower** page.

Say:

“RWG is not a normal enterprise supply chain. It is a single-site mountain operating system: hotels, F&B, retail, theme parks, maintenance, receiving gate and supplier network all coupled together. One event or rain pattern can trigger multiple operating impacts.”

Click **Run Live Demo Scenario**.

### 2–5 min: Show demand shock

Go to **Demand Shock Simulator**.

Move occupancy to 96–100%, choose **Concert** and **Rain**, then click **Simulate Demand Shock**.

Say:

“The value is not predicting one number. It is orchestrating what every AI agent should do next: PO recommendations, receiving prioritisation, inventory movement and retail replenishment.”

### 5–8 min: Show F&B procurement automation

Go to **F&B Procurement Agent**.

Click **Frozen fries** or **Bottled water**. Show the forecast, supplier comparison and PO quantity. Click **Approve AI PO**.

Say:

“The agent is not just alerting. It converts demand, contract price, SLA and days of cover into an executable PO recommendation.”

### 8–11 min: Create the wow moment at the receiving gate

Go to **AI Receiving Gate**.

Click **Scan Incoming Truck**.

Say:

“This is where the client sees operations changing in front of them. The truck is scanned, manifest is matched, cold chain is validated, damaged cartons are captured and GRN is created with an exception note.”

Click **Create GRN**, **Route to Cold Storage**, or **Escalate Damage Claim**.

### 11–14 min: Show inventory movement across the mountain

Go to **Inventory Balancing Agent**.

Click **Approve Transfer** on bottled water or plush SKU.

Say:

“This is where RWG becomes one connected inventory network instead of separate verticals holding separate stock.”

### 14–16 min: Show retail intelligence

Go to **Retail Merchandise Intelligence Agent**.

Click **Trigger Viral SKU Surge** and then **Approve Transfer**.

Say:

“The agent detects SKU velocity, predicts stockout time and recommends the transfer before the revenue is lost.”

### 16–18 min: Show GenBI

Go to **Ask AIONOS**.

Ask:

- Which F&B item should we reorder first?
- Which supplier has the worst SLA?
- Which contracts expire in the next 90 days?
- Show me the business case for AI Receiving Gate.

Say:

“This is front-end-only, but it demonstrates the user experience of conversational business intelligence grounded in local operational data.”

### 18–20 min: Close with business case and roadmap

Go to **Business Case Cockpit** and click **Run ROI Calculation**.

Then go to **Pilot Roadmap**.

Say:

“Start with one visible pilot. Prove value in weeks. Scale into one AI nervous system for the mountain.”

## Demo scenarios included

### Scenario 1: Concert Night Surge

- Occupancy rises
- F&B demand spikes
- Bottled water and frozen fries become high risk
- Retail SKU velocity increases
- Gate load increases
- AI recommendations are generated

### Scenario 2: Rain + Road Constraint

- Delivery route risk increases
- Cold-chain deliveries prioritised
- Linen movement delayed
- Receiving gate congestion increases

### Scenario 3: Viral Merchandise Spike

- SkyWorlds Dragon Plush sells 3x faster
- Stock transfer recommended
- Replenishment PO triggered
- Revenue-at-risk calculated

## GenBI implementation

`src/utils/genbiEngine.js` powers the simulated GenBI agent.

It:

- Lowercases and tokenizes the user question
- Matches business keywords against known patterns
- Pulls relevant local JSON data
- Generates deterministic executive answers
- Returns recommended actions, confidence scores, source data and optional chart/table payloads

No external LLM API is required.

## Presentation mode

Use the **Presentation Mode** button in the header to simplify the UI and enlarge the main visuals for a projector or executive demo.

## Important note

All values, scenarios, recommendations and business case numbers are synthetic demo data created for discussion and client storytelling. They are not live RWG operational data.
