export function getCookie(name) {
  const value = document.cookie.split('; ').find((row) => row.startsWith(name + '='))
  return value ? decodeURIComponent(value.split('=')[1]) : null
}

export function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}`
}

export function deleteCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
}
