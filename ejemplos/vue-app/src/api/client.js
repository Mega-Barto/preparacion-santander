export async function fetchTasks() {
  const response = await fetch('/tasks.json')
  if (!response.ok) {
    throw new Error('No se pudo leer tasks.json')
  }
  return response.json()
}
