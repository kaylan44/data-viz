import { ref, readonly } from 'vue'
import { getAllCountries, type RestCountry } from '@/data/countries/restCountriesClient'

let _initiated = false
const _countries = ref<RestCountry[]>([])
const _byNumeric = ref(new Map<string, RestCountry>())

function init() {
  if (_initiated) return
  _initiated = true
  const list = getAllCountries()
  _countries.value = list
  const map = new Map<string, RestCountry>()
  for (const c of list) {
    if (c.ccn3) map.set(c.ccn3, c)
  }
  _byNumeric.value = map
}

export function useCountries() {
  init()
  return {
    countries: readonly(_countries),
    byNumeric: readonly(_byNumeric),
  }
}
