import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/editorial-image.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const { editorialImageSource, editorialImageUrl, editorialImageSrcSet, editorialHeroSizes } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const image = 'https://cdn.sanity.io/images/bfjhbpbx/production/example-1500x1000.jpg';

test('full-screen heroes account for cover scaling on portrait screens', () => {
  assert.equal(editorialHeroSizes(image), 'max(100vw, 150.000vh)');
  assert.equal(editorialHeroSizes(`${image}?w=1200&h=800`), 'max(100vw, 150.000vh)');
  assert.equal(editorialHeroSizes(`${image}?rect=100,0,1000,1000`), 'max(100vw, 100.000vh)');
  assert.equal(editorialHeroSizes('/unknown.jpg'), '100vw');
  const largeImage = image.replace('1500x1000', '6000x4000');
  assert.match(editorialImageSrcSet(largeImage, 1920), / 1920w$/);
  assert.match(editorialImageSrcSet(largeImage), / 2560w$/);
});

test('responsive candidates preserve crop, focal point and ratio without claiming upscaled originals', () => {
  const src = `${image}?rect=100,100,1000,800&w=500&h=400&fit=crop&crop=focalpoint&fp-x=0.4`;
  const url = new URL(editorialImageUrl(src, 320));
  assert.equal(url.searchParams.get('rect'), '100,100,1000,800');
  assert.equal(url.searchParams.get('w'), '320');
  assert.equal(url.searchParams.get('h'), '256');
  assert.equal(url.searchParams.get('fit'), 'crop');
  assert.equal(url.searchParams.get('fp-x'), '0.4');
  assert.equal(url.searchParams.get('auto'), 'format');
  assert.equal(url.searchParams.get('q'), '80');
  const widths = editorialImageSrcSet(image).split(', ').map(item => Number(item.match(/ (\d+)w$/)[1]));
  assert.ok(widths.includes(96));
  assert.equal(Math.max(...widths), 1500);
  assert.match(editorialImageSrcSet(src), / 1000w$/);
});

test('every public alias points to the same original file by SHA-1', async () => {
  const aliases = [...source.matchAll(/"(\/uploads\/[^"\n]+)": "(https:[^"\n]+)"/g)];
  assert.ok(aliases.length > 4);
  for (const [, path, url] of aliases) {
    const bytes = await readFile(new URL(`../public${path}`, import.meta.url));
    assert.equal(new URL(url).pathname.split('/').at(-1).split('-')[0], createHash('sha1').update(bytes).digest('hex'), path);
    assert.equal(editorialImageSource(path), url);
  }
});

test('unsupported assets and China retain their original delivery path', () => {
  for (const src of ['/uploads/veganleather/skai.svg', '/unknown.jpg', 'https://example.com/photo.jpg']) {
    assert.equal(editorialImageSource(src), undefined);
    assert.equal(editorialImageSrcSet(src), undefined);
    assert.equal(editorialImageUrl(src, 320), src);
  }
  const original = process.env.NEXT_PUBLIC_SITE_KEY;
  try {
    process.env.NEXT_PUBLIC_SITE_KEY = 'china';
    assert.equal(editorialImageSource(image), undefined);
    assert.equal(editorialImageUrl('/uploads/hero/fabric-hero.jpg', 320), '/uploads/hero/fabric-hero.jpg');
  } finally {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_KEY;
    else process.env.NEXT_PUBLIC_SITE_KEY = original;
  }
});
