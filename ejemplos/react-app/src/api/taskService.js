export async function list() {
  const response = await fetch('/tasks.json')
  if (!response.ok) {
    throw new Error('No se pudo leer tasks.json')
  }
  return response.json()
}
