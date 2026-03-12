import { describe, it } from 'node:test';
import assert from 'node:assert';
import { convert } from '../src/index.js';

describe('nepali-romanization-converter', () => {
  describe('convert()', () => {
    it('should convert simple words correctly', () => {
      assert.strictEqual(convert('namaste'), 'नमस्ते');
      assert.strictEqual(convert('nepaal'), 'नेपाल');
      assert.strictEqual(convert('dhanyawaad'), 'धन्यवाद');
    });

    it('should convert individual vowels', () => {
      assert.strictEqual(convert('a'), 'अ');
      assert.strictEqual(convert('aa'), 'आ');
      assert.strictEqual(convert('i'), 'इ');
      assert.strictEqual(convert('ii'), 'ई');
      assert.strictEqual(convert('u'), 'उ');
      assert.strictEqual(convert('oo'), 'ऊ');
      assert.strictEqual(convert('e'), 'ए');
      assert.strictEqual(convert('ai'), 'ऐ');
      assert.strictEqual(convert('o'), 'ओ');
      assert.strictEqual(convert('au'), 'औ');
      assert.strictEqual(convert('ang'), 'अं');
    });

    it('should convert individual consonants with halanta', () => {
      assert.strictEqual(convert('k'), 'क्');
      assert.strictEqual(convert('kh'), 'ख्');
      assert.strictEqual(convert('g'), 'ग्');
      assert.strictEqual(convert('gh'), 'घ्');
      assert.strictEqual(convert('ng'), 'ङ्');
    });

    it('should convert consonant with vowels', () => {
      assert.strictEqual(convert('ka'), 'क');
      assert.strictEqual(convert('kaa'), 'का');
      assert.strictEqual(convert('ki'), 'कि');
      assert.strictEqual(convert('kii'), 'की');
      assert.strictEqual(convert('ku'), 'कु');
      assert.strictEqual(convert('koo'), 'कू');
      assert.strictEqual(convert('ke'), 'के');
      assert.strictEqual(convert('kai'), 'कै');
      assert.strictEqual(convert('ko'), 'को');
      assert.strictEqual(convert('kau'), 'कौ');
      assert.strictEqual(convert('kam'), 'कं');
    });

    it('should handle numbers', () => {
      assert.strictEqual(convert('1234567890'), '१२३४५६७८९०');
    });

    it('should handle punctuation', () => {
      assert.strictEqual(convert('purna biraama.'), 'पूर्ण बिराम ।');
    });

    it('should handle complex words', () => {
      assert.strictEqual(convert('kripayaa'), 'कृपया');
      assert.strictEqual(convert('shree'), 'श्री');
      assert.strictEqual(convert('gyaan'), 'ज्ञान');
      assert.strictEqual(convert('ksha'), 'क्ष');
    });

    it('should preserve spaces between words', () => {
      // assert.strictEqual(convert('mero naam'), 'मेरो नाम्');
      assert.strictEqual(convert('mero naam'), 'मेरो नाम');
    });

    describe('smart conversion', () => {
      it('should use smart conversion by default', () => {
        assert.strictEqual(convert('ram'), 'राम्');
        assert.strictEqual(convert('nam'), 'नाम्');
        assert.strictEqual(convert('cha'), 'छ');
        assert.strictEqual(convert('pani'), 'पानी');
        assert.strictEqual(convert('lai'), 'लाई');
        assert.strictEqual(convert('bhai'), 'भाई');
      });

      it('should not use smart conversion when disabled', () => {
        assert.strictEqual(convert('ram', false), 'रम्');
        assert.strictEqual(convert('nam', false), 'नम्');
        assert.strictEqual(convert('cha', false), 'च');
        assert.strictEqual(convert('pani', false), 'पनि');
      });

      it('should handle english words inside curly braces', () => {
        assert.strictEqual(convert('mero {name} kelish ho'), 'मेरो name केलिश हो');
        assert.strictEqual(convert('{english}'), 'english');
      });

      it('should handle non-smart conversion inside square brackets', () => {
        assert.strictEqual(convert('[ram]'), 'रम्');
        assert.strictEqual(convert('[cha]'), 'च');
        assert.strictEqual(convert('yo [ram] ho'), 'यो रम् हो');
      });
    });

    it('should handle sentences', () => {
      assert.strictEqual(convert('mero naama kelish ho.'), 'मेरो नाम केलिश हो ।');
      assert.strictEqual(convert('timro naama k ho?'), 'तिम्रो नाम के हो ?');
    });
  });
});
