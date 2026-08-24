# Graph Report - .  (2026-08-05)

## Corpus Check
- Large corpus: 178 files · ~772,681 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 62 nodes · 87 edges · 9 communities (7 shown, 2 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.77)
- Token cost: 0 input · 180,319 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8

## God Nodes (most connected - your core abstractions)
1. `mes-coded.html — Coded Case Study` - 16 edges
2. `ftue-coded.html — Coded Case Study` - 11 edges
3. `lumigo-coded.html — Coded Case Study` - 10 edges
4. `CLAUDE.md — Project Guide` - 9 edges
5. `index.html — Landing Page` - 9 edges
6. `Motion-restriction-VR.html — Image-based Case Study` - 5 edges
7. `Lokesh Kumar ("Loky")` - 5 edges
8. `Image-based case study pattern` - 5 edges
9. `lumigo.html — Image-based Case Study` - 4 edges
10. `mes.html — Image-based Case Study` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Value Analysis Framework (ease/effort/frequency ranking of features)` --semantically_similar_to--> `User Need Classification stair (Core/Basic/Expected/Augmented/Transformational)`  [INFERRED] [semantically similar]
  ftue-coded.html → mes-coded.html
- `Progressive Disclosure principle (FTUE)` --semantically_similar_to--> `Progressive Disclosure principle (MES)`  [INFERRED] [semantically similar]
  ftue-coded.html → mes-coded.html
- `Lumi Go Usability Evaluation Study (IDC, IIT Bombay)` --semantically_similar_to--> `System Usability Scale (SUS) evaluation`  [INFERRED] [semantically similar]
  lumigo-coded.html → mes-coded.html
- `Iterative UI redesign process (3 iterations with user testing)` --semantically_similar_to--> `Iterative wireframe/prototype process with user feedback (MES)`  [INFERRED] [semantically similar]
  lumigo-coded.html → mes-coded.html
- `CLAUDE.md — Project Guide` --references--> `ftue-coded.html — Coded Case Study`  [EXTRACTED]
  CLAUDE.md → ftue-coded.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Image-based scrollytelling case study pages** — lumigo_html, mes_html, ftue_html, infurnia_html, motion_restriction_vr_html [EXTRACTED 1.00]
- **Coded rebuild case study pages sharing case-study.css architecture** — ftue_coded_html, lumigo_coded_html, mes_coded_html [EXTRACTED 1.00]
- **MES case study persona group (production designer, manager, operator)** — mes_coded_persona_sanjay_production_designer, mes_coded_persona_ramesh_production_manager, mes_coded_persona_ajay_operator [EXTRACTED 1.00]

## Communities (9 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.20
Nodes (7): draw(), fadeEls, hamburger, mobileMenu, nav, observer, waveY()

### Community 1 - "Community 1"
Cohesion: 0.40
Nodes (10): CLAUDE.md — Project Guide, Image-based case study pattern, ftue.html — Image-based Case Study, index.html — Landing Page, IEEE Virtual Reality 2021, Lisbon (publication venue), Interactive Space & Surface 2022, Poland (publication venue), infurnia.html — Image-based Case Study, lumigo.html — Image-based Case Study (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.20
Nodes (10): Flow Security Central (product), IDC, IIT Bombay (M.Des), Infurnia (company/product), Instabase, Lokesh Kumar ("Loky"), LTI, Nutanix, Material Tailwind Design System (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.25
Nodes (9): Prof. Anirudha Joshi, Design Thinking process (Empathize/Define/Ideate/Prototype/Test), Csikszentmihalyi's Flow State theory, lumigo-coded.html — Coded Case Study, Iterative UI redesign process (3 iterations with user testing), Lumi Go (game), Lumi Go Usability Evaluation Study (IDC, IIT Bombay), Iterative wireframe/prototype process with user feedback (MES) (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (7): Adris (competitor), Naadi (competitor), mes-coded.html — Coded Case Study, Net Promoter Score evaluation method, Ajay — Board Cutting Operator persona, Ramesh — Production Manager persona, Sanjay — Production Designer persona

### Community 5 - "Community 5"
Cohesion: 0.40
Nodes (6): Coded rebuild pattern, Shared CSS primitives via case-study.css, ftue-coded.html — Coded Case Study, Ideal FTUE Framework (11-point evaluation checklist), Alex — VI/IT Security Admin persona, Sanjay — IT Security Admin persona

### Community 6 - "Community 6"
Cohesion: 0.40
Nodes (4): name, scripts, start, version

## Knowledge Gaps
- **21 isolated node(s):** `name`, `version`, `start`, `nav`, `hamburger` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `mes-coded.html — Coded Case Study` connect `Community 4` to `Community 1`, `Community 2`, `Community 3`, `Community 5`, `Community 7`, `Community 8`?**
  _High betweenness centrality (0.252) - this node is a cross-community bridge._
- **Why does `ftue-coded.html — Coded Case Study` connect `Community 5` to `Community 8`, `Community 1`, `Community 2`, `Community 7`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `lumigo-coded.html — Coded Case Study` connect `Community 3` to `Community 1`, `Community 5`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **What connects `name`, `version`, `start` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._