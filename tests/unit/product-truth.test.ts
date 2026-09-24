import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { structuredData } from '@/lib/structured-data';

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? sourceFiles(path) : /\.(tsx?|css)$/.test(name) ? [path] : [];
  });
}

const source = sourceFiles(join(__dirname, '../../src'))
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n');

describe('product truth guard', () => {
  it('never publishes structured-data claims the product cannot back up', () => {
    const json = JSON.stringify(structuredData());
    for (const key of ['offers', 'aggregateRating', 'review', 'award', 'price']) {
      expect(json).not.toContain(`"${key}"`);
    }
  });

  it.each([
    /testimonial/i,
    /trusted by/i,
    /\b\d[\d,]*\+?\s+(pharmacies|stores|customers|businesses)\b/i,
    /revolutioni[sz]e/i,
    /seamless/i,
    /robust platform/i,
    /next-generation/i,
    /whatsapp/i,
    /\bAI[- ]powered\b/i,
    /HIPAA|ISO 27001|SOC 2/,
  ])('copy contains no %s', (pattern) => {
    expect(source).not.toMatch(pattern);
  });
});
