# Simulation F — Children and inheritance (scenario definition, not yet run)

Predicts possible child-health considerations based on parental traits/conditions
(beta thalassemia minor, thyroid disease, asthma, iron status, and other explicitly
supplied conditions).

**Required logic:**
- Beta thalassemia trait is inherited — parental carrier testing matters.
- Never predict a child's exact disease outcome from incomplete information.
- Distinguish carrier probability, disease probability, and unrelated risk.
- Recommend genetic counselling and appropriate partner testing in real-world
  contexts.
- Distinguish biological probability from medical advice for pregnancy simulations.

**Any future run of this simulation requires:** biological parent identities,
confirmed carrier status, genetic test results if available, pregnancy status, age,
sex if relevant, family history, and assumptions used — all explicitly supplied, not
inferred.

**Guardrail:** these are synthetic test subjects, not real people (see
`PROJECT-SPEC.md` preamble) — this scenario exercises the simulator's genetics/risk
logic, not a prediction about any real person's future children.

No parent pairing or carrier-test data has been supplied yet — this is the scenario
definition only.
