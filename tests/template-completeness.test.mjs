import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const templateCases = [
  { file: "CreativePortfolio.tsx", fields: ["projects", "achievements"] },
  { file: "ModernEngineer.tsx", fields: ["achievements"] },
  { file: "PremiumCorporate.tsx", fields: ["certificates"] },
];

for (const { file, fields } of templateCases) {
  test(`${file} does not cap user-entered resume items`, () => {
    const source = readFileSync(new URL(`../components/resume-templates/${file}`, import.meta.url), "utf8");
    const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const cappedFields = [];

    const visit = (node) => {
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === "slice") {
        const receiver = node.expression.expression.getText(tree);
        for (const field of fields) {
          if (receiver.includes(`data.${field}`)) cappedFields.push(field);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(tree);

    assert.deepEqual(cappedFields, [], `${file} must render every named ${fields.join(" and ")} item`);
  });
}

test("Creative Portfolio renders every project bullet and interest", () => {
  const source = readFileSync(new URL("../components/resume-templates/CreativePortfolio.tsx", import.meta.url), "utf8");
  assert.match(source, /project\.bullets\.filter\(hasText\)\.map\(/);
  assert.doesNotMatch(source, /project\.bullets\.filter\(hasText\)\[0\]/);
  assert.doesNotMatch(source, /\.filter\(Boolean\)\.slice\(0,\s*4\)/);
});

for (const file of [
  "CreativePortfolio.tsx",
  "ModernEngineer.tsx",
  "PremiumImpact.tsx",
  "PremiumCorporate.tsx",
  "ElegantTwoColumn.tsx",
  "UAEProfessional.tsx",
  "CreativeDesigner.tsx",
]) {
  test(`${file} keeps both columns inside the A4 page`, () => {
    const source = readFileSync(new URL(`../components/resume-templates/${file}`, import.meta.url), "utf8");
    assert.match(source, /resume-page grid grid-cols-\[minmax\(0,[\d.]+fr\)_minmax\(0,[\d.]+fr\)\]/);
    assert.match(source, /<aside className="min-w-0 /);
    assert.match(source, /<main className="min-w-0 /);
  });
}
