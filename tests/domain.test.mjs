import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateLead, prepareLead } from "../src/lib/lead.ts";
import { money } from "../src/lib/vehicle-format.ts";
import { whatsappUrl } from "../src/lib/dealership.ts";
const { vehicles } = JSON.parse(
  await readFile(
    new URL("../src/data/vehicles.generated.json", import.meta.url),
  ),
);
test("Real inventory has unique stable slugs and provenance", () => {
  assert.equal(new Set(vehicles.map((v) => v.slug)).size, vehicles.length);
  for (const v of vehicles) {
    assert.match(v.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(v.price > 0 && v.mileageKm >= 0);
    assert.equal(v.source.provider, "usadosbr");
    assert.ok(Number.isFinite(Date.parse(v.source.retrievedAt)));
    assert.ok(
      v.source.sourceUrl.includes("usadosbr.com/carros-e-utilitarios/"),
    );
    assert.ok(!v.id.startsWith("demo"));
  }
});
test("BRL and contextual WhatsApp preserve accents safely", () => {
  assert.equal(money(143900).replace(/\s/g, " "), "R$ 143.900");
  const text = "Olá! Honda HR-V EXL 2023 & disponibilidade?";
  const url = new URL(whatsappUrl(text));
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/5511930055771");
  assert.equal(url.searchParams.get("text"), text);
});
const lead = {
  name: "Teste local",
  phone: "(11) 99999-0000",
  type: "contact",
  consent: true,
  createdAt: new Date().toISOString(),
};
test("Lead validation rejects invalid phone, email and missing consent", () => {
  assert.equal(validateLead(lead), null);
  assert.ok(validateLead({ ...lead, phone: "000" }));
  assert.ok(validateLead({ ...lead, email: "invalid" }));
  assert.ok(validateLead({ ...lead, consent: false }));
  assert.ok(validateLead({ ...lead, name: " " }));
});
test("Lead adapter prepares only a draft and rejects honeypot", async () => {
  assert.deepEqual(await prepareLead(lead, "Mensagem local", ""), {
    draft: "Mensagem local",
  });
  await assert.rejects(prepareLead(lead, "Mensagem", "bot"));
});
