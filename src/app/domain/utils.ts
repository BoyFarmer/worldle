import {CountryCode, countryCodesWithImage} from "./country";
import {countries, Country} from "./countries";
import {shuffleWithSeed} from "./seeded-random";

export function randomCountry(): Country {
  const length = countryCodesWithImage.length;
  let found = getCountryByCode(countryCodesWithImage[Math.floor(Math.random() * length)]);
  while (found == undefined) {
    found = getCountryByCode(countryCodesWithImage[Math.floor(Math.random() * length)]);
  }
  return found;
}

export function country(countryName: string): Country | undefined {
  return countries.find(c => c.name === countryName);
}

export function getCountryByCode(code: CountryCode): Country | undefined {
  return countries.find(c => c.code === code);
}

export function generateCountrySequence(seed: number, maxCount: number): Country[] {
  return shuffleWithSeed(countryCodesWithImage, seed)
    .map(code => getCountryByCode(code))
    .filter((c): c is Country => c !== undefined)
    .slice(0, maxCount);
}
