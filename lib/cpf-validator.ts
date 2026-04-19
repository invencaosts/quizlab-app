/**
 * Valida um número de CPF baseado no algoritmo do Módulo 11.
 * @param cpf O CPF a ser validado (pode conter pontuação)
 */
export function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/[^\d]+/g, "");

  // Deve ter 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Não pode ser uma sequência de números iguais (ex: 111.111.111-11)
  if (/^(\d)\1+$/.test(cleanCPF)) return false;

  const digits = cleanCPF.split("").map(Number);

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== digits[9]) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== digits[10]) return false;

  return true;
}
