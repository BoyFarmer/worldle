import {CountryCode, countryCodesWithImage} from "./country";
import {countries, Country} from "./countries";

export function randomCountry(): Country {
  const length = countryCodesWithImage.length;
  let country = getCountryByCode(countryCodesWithImage[Math.floor(Math.random() * length)]);
  while (country == undefined) {
    country = getCountryByCode(countryCodesWithImage[Math.floor(Math.random() * length)]);
  }
  return country;
}

export function country(countryName: string): Country | undefined {
  return countries.find(c => c.name === countryName);
}

export function getCountryByCode(code: CountryCode): Country | undefined {
  return countries.find(c => c.code === code);
}
