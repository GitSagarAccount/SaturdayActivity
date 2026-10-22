# NAMAN — Project Intent (source document)

Preserved verbatim as supplied by the project owner on 2026-10-22, for
the future simulator project. This is the authoritative spec other files
in this folder are derived from — if anything here conflicts with
another file in `naman/`, this document wins.

> **Clarification on record (2026-10-22):** the four subjects below
> (Naman, naman2, Nancy, nancy2) are confirmed dummy/synthetic test
> subjects, created to exercise a future simulator that predicts
> physiological health, mental health, and sociological/psychological
> outcomes. They are not real, identifiable people.

---

## 1. Project identity and scope

Project name: NAMAN

Project creation date: 15 March 2026.

Original purpose:
- Maintain a dedicated space for approximately three months or longer.
- Track four human simulation subjects.
- Record health conditions, body measurements, diet, exercise, supplements, medicines, lab values, symptoms, and projected outcomes.
- Run health, nutrition, lifestyle, marriage, pregnancy, and children-related simulations.
- Preserve checkpoints so that simulations can be rolled back when required.
- Keep all original and simulated information separate.

Routing rule:
- "Pull files on NAMAN" refers specifically to this project.
- Do not automatically associate unrelated conversations with NAMAN.
- If the user explicitly says a new subject/experiment/record belongs to NAMAN, add it.
- If uncertain whether information belongs to NAMAN, ask before merging it.

## 2. Subjects

**A. Naman** — Male. 5'5". ~62 kg. Vegetarian. Thin build.
Conditions: hyperthyroidism; beta thalassemia minor; low iron (genetic/long-standing);
low-normal creatinine; slightly low fasting glucose; slightly low HbA1c.
Thyroid values (historical): TSH ~0.001, T3 ~1.17, T4 ~8.1.
LDL cholesterol specifically flagged to track.
Low TSH alone does not establish current severity — all lab values are historical unless a newer record is supplied.

**B. naman2** — Male. Age 32 (as recorded). 5'5". ~62 kg.
Conditions: hyperthyroidism; beta thalassemia minor; low iron.
Thyroid value (historical): TSH ~0.003.
Treated as a separate subject from Naman despite overlapping traits.

**C. Nancy** — Female. A prior record refers to this subject as "Lucy"; Lucy and Nancy
may be the same subject — do not silently merge or rename; ask if identity matters.
Baseline: 5'0". ~49 kg. Vegetarian. Thin build. Condition: asthma.
Any Nancy-specific detail not explicitly given here is unknown.

**D. nancy2** — Female. Separate from Nancy unless stated otherwise.
No other baseline details reliably available — do not infer age, height, weight, diet,
disease, medication, or lab values.

## 3. Data-preservation rules

Every data item is one of: (1) confirmed user-provided fact, (2) historical value,
(3) simulation assumption, (4) AI-generated projection, (5) medical interpretation,
(6) unknown/missing.

Every record should carry: subject, date/date range, data type, value, unit,
source/origin, measured/reported/assumed/simulated, confidence level, notes/limitations.

Never: invent exact lab values, meal quantities, medication doses, supplement
brands/schedules; treat a simulation as a diagnosis; treat a projection as a measured
outcome; replace original values with projected ones; merge Naman with naman2; merge
Nancy with nancy2; assume Lucy is Nancy without verification.

## 4. Health conditions to track

- **Naman & naman2 — hyperthyroidism:** TSH, T3, T4, overactivity symptoms, heart
  rate/palpitations, weight change, appetite, heat intolerance, sweating, sleep,
  anxiety/restlessness, tremor, bowel frequency, medication status, follow-up.
- **Naman & naman2 — beta thalassemia minor:** hemoglobin, MCV, MCH, RBC count,
  ferritin, serum iron, TIBC/transferrin saturation, reticulocyte count where
  available, anemia symptoms, family/genetic background; distinguish thalassemia
  trait from iron-deficiency anemia.
- **Naman only:** low-normal creatinine, fasting glucose, HbA1c, LDL, total
  cholesterol, HDL, triglycerides, blood pressure, pulse, BMI, weight/weight trend.
- **Nancy / "Lucy" — asthma:** triggers, wheezing, shortness of breath, rescue
  inhaler use, controller medication, exercise tolerance, diet, weight/BMI,
  pregnancy-related considerations only when explicitly simulated.
- **All subjects:** height, weight, BMI, diet pattern, protein/iron/B12/folate/
  vitamin D/calcium/magnesium/zinc/fiber/omega-3 intake, water, caffeine, sleep,
  exercise, stress, medication/supplement timing, symptoms, lab values, safety
  warnings.

BMI = weight (kg) / height (m)^2 — a screening measure only, not a complete measure
of health or body composition.

## 5. Simulation scenarios (defined, not yet run)

**A. Fruit-based diet** — ~60–80% fruit diet, optional protein supplement, minimal/no
exercise, 30–60 day duration. Tracks: calories, protein adequacy, weight, muscle/fat
mass, hunger, glucose, triglycerides, LDL/HDL, fiber, potassium, vitamin C, folate,
B12 risk, iron status, dental/GI effects, thyroid symptoms, energy/fatigue, asthma
exercise tolerance where applicable. Not automatically "healthy" — must check total
calories, protein, micronutrients, sugar load, and medical conditions.

**B. Protein supplement** — compares no/moderate/excessive supplementation added to a
vegetarian or fruit-heavy diet. Record product, serving size, protein grams,
calories, ingredients, timing whenever supplied. Tracks: total daily protein,
protein/kg body weight, calories, weight change, muscle retention/gain,
kidney-related markers, digestive symptoms, iron/micronutrient effects, interaction
with existing medicines/supplements. Never recommend a dose without knowing the
product and medical context.

**C. Raw ginger** — raw ginger added to lunch, ~6 days, LDL and related markers
tracked. Record daily amount, timing, form, symptoms, heartburn, GI effects,
bleeding risk if relevant medicines used, LDL before/after, other lipids, whether
change is measured or projected. Six days is too short to confidently attribute a
lipid change to ginger — label conclusions speculative absent lab testing.

**D. Supradyn / medication timing** — timing of Supradyn or comparable multivitamin
relative to medicines, food, coffee, tea, milk, calcium, iron, thyroid treatment.
Record product name/formulation, ingredients, dose, time taken, other medicines,
iron/calcium/magnesium content, coffee/tea timing, thyroid medicine timing,
symptoms, lab follow-up. Do not assume formulation — request the exact label.

**E. Marriage** — models effect of marriage/major lifestyle change. Tracks: subject
pairing, age at marriage if given, health status of each partner, diet, exercise,
sleep, stress, shared household habits, medication adherence, financial/social
assumptions only if explicitly supplied, genetic/reproductive-health
considerations. No deterministic predictions about marriage outcomes.

**F. Children and inheritance** — predicts possible child-health considerations from
parental traits/conditions (beta thalassemia minor, thyroid disease, asthma, iron
status, etc.). Beta thalassemia trait is inherited — carrier testing matters; never
predict a child's exact disease outcome from incomplete information; distinguish
carrier probability, disease probability, and unrelated risk; recommend genetic
counselling and partner testing in real-world contexts; distinguish biological
probability from medical advice. Any future child simulation requires: biological
parent identities, confirmed carrier status, genetic test results if available,
pregnancy status, age, sex if relevant, family history, assumptions used.

## 6. Checkpoints and restoration

Baseline checkpoint: `Mar17_2026_v1.0` — freezes the records so simulations can be
rolled back.

Commands to implement (in the future simulator, not yet built): "Save checkpoint
[name]", "Restore checkpoint [name]", "Compare current state with [checkpoint]",
"Show changes since [checkpoint]", "Run simulation from [checkpoint]", "Discard
simulation", "Keep simulation as a new branch".

Simulation procedure: copy the baseline → new branch → record every assumption →
record simulated duration → record projected daily/weekly changes → never overwrite
the baseline → show the diff vs. baseline → allow rollback.

Version identifiers: `Mar17_2026_v1.0` (baseline); `[date]_simulation_[short-name]_v1.0`
(simulation branch).

## 7. Simulation engine output sections (for the future engine)

1. Subject and baseline. 2. Scenario description. 3. Duration. 4. Assumptions.
5. Daily inputs. 6. Nutritional totals. 7. Medical variables affected. 8. Expected
physiological direction. 9. Best case. 10. Typical case. 11. Worst case.
12. Uncertainty/confidence. 13. Warning signs. 14. Required measurements.
15. Final projected state. 16. Difference from baseline. 17. Safe-to-simulate-only
vs. requires-medical-supervision.

Use ranges, not false precision (e.g. weight as a range; LDL as direction +
uncertainty unless real lab data exists; never infer ferritin from diet alone, TSH
normalization without testing, or asthma control without symptoms/peak
flow/medication data).

## 8. Daily record format

```
Date:
Subject:
Sleep duration:
Morning weight:
Food and beverages:
Approximate calories:
Protein:
Carbohydrates:
Fat:
Fiber:
Iron:
Vitamin B12:
Folate:
Calcium:
Vitamin D:
Water:
Coffee/tea:
Exercise:
Medicines:
Supplements:
Symptoms:
Heart rate:
Blood pressure:
Glucose, if measured:
Peak flow, if relevant:
Notes:
Measured or simulated:
Confidence:
```

## 9. Lab-result format

```
Subject:
Test date:
Test name:
Value:
Unit:
Reference range:
Fasting or non-fasting:
Laboratory source:
Previous value:
Change:
Clinical context:
Measured, reported, or simulated:
Interpretation:
Limitations:
Recommended follow-up:
```

Known historical thyroid values: Naman — TSH ~0.001, T3 ~1.17, T4 ~8.1; naman2 —
TSH ~0.003. Historical only, not current.

## 10. Safety and medical boundaries

Not a substitute for a doctor. Always include a safety note when discussing:
hyperthyroidism, beta thalassemia, iron supplementation, pregnancy/children,
asthma, chest pain, severe breathlessness, fainting, rapid/irregular heartbeat,
severe weakness, significant unexplained weight loss, severe allergic reactions.

Principles: don't assume low iron is diet-caused in a beta-thalassemia-minor
carrier; confirm iron deficiency (ferritin etc.) before long-term supplementation;
don't present iron supplementation as universally safe for thalassemia carriers;
separate thalassemia trait from major/intermedia; don't change thyroid medication
or stop asthma medicine based on a simulation; refer urgent symptoms for immediate
medical assessment; label all projections as estimates.

## 11. Output requirements

**Project summary:** overview, subject registry, baseline health table, historical
lab values, dietary/lifestyle assumptions, simulation list, checkpoints/branches,
known outcomes, unknown/missing records, safety limitations, recommended next data
to collect.

**"All records":** every available historical entry, original wording preserved,
nothing compressed away, facts separated from projections, gaps stated explicitly.

**New simulation:** ask only for missing information that materially changes the
result; if told to proceed with assumptions, list them before calculating; keep the
baseline untouched; save output as a new version.

**Recreating the project:** subject registry → baseline checkpoint → historical
facts → each simulation as a separate branch → discrepancy/missing-data report.
Never fill missing information with guesses.

## 12. Known data inventory

- Project name: NAMAN. Created: 15 March 2026.
- Four tracked subjects: Naman, naman2, Nancy, nancy2.
- Naman: male, 5'5", 62 kg, vegetarian, thin, hyperthyroidism, beta thalassemia
  minor, low iron, low-normal creatinine, slightly low fasting glucose and HbA1c.
- Naman historical thyroid: TSH ~0.001, T3 ~1.17, T4 ~8.1.
- naman2: male, age 32, 5'5", 62 kg, hyperthyroidism, beta thalassemia minor, low
  iron, TSH ~0.003.
- Nancy/"Lucy": 5'0", 49 kg, vegetarian, thin, asthma.
- LDL tracking specifically requested for Naman.
- Simulations defined: fruit-heavy diet, protein supplements, minimal exercise, raw
  ginger with lunch (~6 days), Supradyn/medication timing, marriage, children.
- Baseline checkpoint: `Mar17_2026_v1.0`.
- Some historical details may be missing from this reconstruction — marked unknown
  in `missing-data-report.md` rather than guessed at.
