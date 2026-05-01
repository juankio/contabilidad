export function defineSuccess<T = any>(data?: T, message = 'Operación exitosa') {
  return {
    success: true,
    message,
    data
  }
}
