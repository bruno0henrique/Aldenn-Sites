import test from "node:test";
import assert from "node:assert/strict";
import { localSuggestions, postalDigits, addressSuggestion } from "../lib/location.ts";

test("suggestions distinguish cities, neighborhoods and developments without duplicates", () => {
  const properties = [{ city: "Jacareí", neighborhood: "Altos de Santanna", development: "Villa de Santanna" }, { city: "Jacareí", neighborhood: "Altos de Santanna", development: "Villa de Santanna" }];
  assert.equal(localSuggestions(properties, "jacarei").length, 3);
  assert.equal(localSuggestions(properties, "villa")[0].kind, "Condomínio");
  assert.equal(localSuggestions(properties, "curitiba").length, 0);
});
test("CEP accepts eight digits and address lookup resolves to region rather than an invented exact property address", () => {
  assert.equal(postalDigits("01001-000"), "01001000");
  assert.equal(postalDigits("01001000"), "01001000");
  assert.equal(postalDigits("01001"), null);
  assert.equal(postalDigits("010010000"), null);
  assert.equal(addressSuggestion({ erro: true }), null);
  const result = addressSuggestion({ cep: "12246-000", logradouro: "Rua de Teste", bairro: "Jardim Aquarius", localidade: "São José dos Campos", uf: "SP" });
  assert.equal(result.label, "Rua de Teste");
  assert.equal(result.location, "Jardim Aquarius São José dos Campos");
});

test("Google reference suggestions stay capped at six and only include registered places", () => {
  const properties = [{ city: "Curitiba", state: "PR", neighborhood: "Batel", development: "Edifício Exemplo" }, { city: "São José dos Campos", neighborhood: "Urbanova", development: "Vivant Urbanova" }, { city: "Jacareí", neighborhood: "Altos de Santanna", development: "Villa de Santanna" }];
  const suggestions = localSuggestions(properties, "");
  assert.equal(suggestions.length, 6);
  assert.equal(suggestions[0].label, "São José dos Campos");
  assert.equal(localSuggestions(properties, "curitiba")[0].detail, "PR");
  assert.equal(localSuggestions(properties, "batel")[0].label, "Batel");
});
