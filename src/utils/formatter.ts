export const formatPrice = (price: any): string => {
  // Converter para número se for string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  
  // Verificar se é um número válido
  if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
    return '0,00'
  }
  
  return numPrice.toFixed(2).replace('.', ',')
}

export const formatCurrency = (price: any): string => {
  return `R$ ${formatPrice(price)}`
}