

// format price to BR currency
function formatPrice(price: number) {
  if (!price) return;
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}

// format number to BR currency
function formatPriceCurrency(price: number) {
  if (!price) return;
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}

// format phone number BR
function formatPhone(value: string) {
  if (!value) return;
  // remover letras
  value = value.replace(/[a-zA-Z]/g, '');
  // remover caracteres especiais
  value = value.replace(/[^0-9]/g, '');
  // adicionar espaço entre numeros
  value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  return value;
}

// normalizeNumber
function normalizeNumber(value: string) {
  if (!value) return;
  // remover letras
  value = value.replace(/[a-zA-Z]/g, '');
  // remover caracteres especiais
  value = value.replace(/[^0-9]/g, '');
  return value;
}

// normalize zipcode
function normalizeZipcode(value: string) {
  if (!value) return;
  // remover letras
  value = value.replace(/[a-zA-Z]/g, '');
  // remover caracteres especiais
  value = value.replace(/[^0-9]/g, '');
  // adicionar espaço entre numeros
  value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
  return value;
}

export { formatPhone, formatPrice, formatPriceCurrency, normalizeNumber, normalizeZipcode };

