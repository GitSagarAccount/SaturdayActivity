# Missing-data report

Per `PROJECT-SPEC.md` §11: "Never fill missing information with guesses." Everything
below is marked unknown rather than inferred.

- **Naman:** age not given. No blood-count values (hemoglobin, MCV, MCH, RBC,
  ferritin, serum iron, TIBC/transferrin saturation, reticulocyte count) despite
  beta thalassemia minor being tracked. No lipid panel values (LDL/HDL/total
  cholesterol/triglycerides) despite LDL being specifically flagged to track. No
  blood pressure, pulse, fasting glucose, HbA1c, or creatinine numeric values —
  only qualitative descriptors ("low-normal", "slightly low") were supplied.
- **naman2:** no T3/T4 values (only TSH). No blood-count or lipid values. No diet,
  build, or condition detail beyond what overlaps with Naman's description.
- **Nancy / "Lucy":** identity between the two names unconfirmed. No asthma
  severity detail (triggers, wheezing frequency, rescue inhaler use, controller
  medication, exercise tolerance, peak flow). No lab values of any kind.
- **nancy2:** everything beyond "female, distinct from Nancy" is unknown — no age,
  height, weight, diet, build, conditions, or lab values.
- **All subjects:** no actual daily records or lab-result entries exist yet in the
  format defined in `PROJECT-SPEC.md` §8–9 — those templates are in `templates/`,
  ready for real or simulated data to be recorded once collection starts.
- **Simulations A–F:** defined as scenarios only (see `simulations/`) — none have
  actually been run, so there are no projected outputs, best/typical/worst-case
  results, or branch versions yet.

Recommended next data to collect (per spec intent): blood-count and lipid panels
for Naman/naman2, confirmed identity for Nancy vs. "Lucy", and baseline attributes
for nancy2, before any simulation that depends on them is run.
