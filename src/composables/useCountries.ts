import { ref, readonly } from 'vue'
import { fetchAllCountries, type RestCountry } from '@/data/countries/restCountriesClient'

const _countries = ref<RestCountry[]>([])
const _byNumeric = ref(new Map<string, RestCountry>())
const _loading = ref(false)
const _error = ref<string | null>(null)
let _initiated = false

export function useCountries() {
  if (!_initiated) {
    _initiated = true
    _loading.value = true
    fetchAllCountries()
      .then((list) => {
        _countries.value = list
        const map = new Map<string, RestCountry>()
        for (const c of list) {
          if (c.ccn3) map.set(c.ccn3, c)
        }
        _byNumeric.value = map
      })
      .catch((e) => { _error.value = String(e) })
      .finally(() => { _loading.value = false })
  }

  return {
    countries: readonly(_countries),
    byNumeric: readonly(_byNumeric),
    loading: readonly(_loading),
    error: readonly(_error),
  }
}
