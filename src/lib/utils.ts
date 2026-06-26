import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: 'c', ş: 's', ı: 'i', ö: 'o', ü: 'u', ğ: 'g',
    Ç: 'C', Ş: 'S', İ: 'I', Ö: 'O', Ü: 'U', Ğ: 'G',
  }
  return text
    .split('')
    .map((c) => trMap[c] ?? c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export const CATEGORY_LABELS: Record<string, string> = {
  DILEKCELER: 'Dilekceler',
  TUTANAKLAR: 'Tutanaklar',
  IZIN_FORMLARI: 'Izin Formları',
  ZIMMET: 'Zimmet',
  GOREVLENDIRME: 'Gorevlendirme',
  YAZISMALAR: 'Yazışmalar',
  SOZLESMELER: 'Sozleşmeler',
  RAPORLAR: 'Raporlar',
  DIGER: 'Diğer',
}
