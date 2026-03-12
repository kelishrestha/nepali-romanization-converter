const uD = {};
const sW = {};
const iW = {
  cha: "chha",
  chu: "chhu",
  chha: "chha",
  ma: "ma",
  aba: "aba",
  nam: "naam",
  ram: "raam",
  pani: "pani",
  lai: "laaii",
  pai: "paaii",
  dai: "daaii",
  bhai: "bhaaii"
};

const cR = {
  ba: "2348",
  bha: "2349",
  ca: "2325",
  cha: "2330",
  chha: "2331",
  Da: "2337",
  da: "2342",
  dha: "2343",
  Dha: "2338",
  fa: "2347",
  ga: "2327",
  gha: "2328",
  gya: "2332+2381+2334",
  ha: "2361",
  ja: "2332",
  jha: "2333",
  ka: "2325",
  kha: "2326",
  ksha: "2325+2381+2359",
  la: "2354",
  ma: "2350",
  Na: "2339",
  na: "2344",
  Nepala: "2344+2375+2346+2366+2354",
  nga: "2329",
  pa: "2346",
  pha: "2347",
  qa: "2325",
  ra: "2352",
  sa: "2360",
  sha: "2358",
  Sha: "2359",
  ta: "2340",
  Ta: "2335",
  Tha: "2336",
  tha: "2341",
  va: "2357",
  wa: "2357",
  xa: "2325+2381+2360",
  ya: "2351",
  yna: "2334",
  za: "2332"
};

// Populate uD object
Object.entries(cR).forEach(([conso, value]) => {
  uD[conso] = value;
  uD[`${conso}a`] = `${value}+2366`;
  const consoMinusA = conso.slice(0, -1);

  [
    ['i', '2367'], ['ee', '2368'], ['u', '2369'], ['oo', '2370'],
    ['ri', '2371'], ['e', '2375'], ['ai', '2376'], ['o', '2379'],
    ['au', '2380']
  ].forEach(([vowel, unicode]) => {
    uD[`${consoMinusA}${vowel}`] = `${value}+${unicode}`;
  });

  uD[consoMinusA] = `${value}+2381`;
});

// Additional uD entries
Object.assign(uD, {
  "*": "2306",
  "**": "2305",
  ".": "2404",
  "\\": "2381",
  "0": "2406",
  "1": "2407",
  "2": "2408",
  "3": "2409",
  "4": "2410",
  "5": "2411",
  "6": "2412",
  "7": "2413",
  "8": "2414",
  "9": "2415",
  "a": "2309",
  "aa": "2310",
  "ai": "2320",
  "am": "2309+2381",
  "au": "2324",
  "aum": "2384",
  "e": "2319",
  "i": "2311",
  "ii": "2312",
  "o": "2323",
  "om": "2384",
  "oo": "2314",
  "ri^": "2381+2352+2367+",
  "rr": "2352+2381+8205",
  "rree": "2400",
  "rri": "2315",
  "u": "2313"
});

function translateWords(sent) {
  if (sW["smartconverter_on"] === "true") {
    sent = sent.replace(/\s*\./g, " .").replace(/\s*\?/g, " ?");
  }

  return sent.split(/(\s+)/).map(part => {
    if (!part || /^\s+$/.test(part)) {
      return part; // Keep whitespace as is.
    }
    let word = part;
    word = word.replace(/ri\^/g, "ari^");

    if (sW["smartconverter_on"] === "true") {
      if (!hasSW(word)) {
        if (iW[word]) {
          word = iW[word];
        } else if (word.length > 3) {
          word = applySmartRules(word);
        }
      }
    }

    return word.split("/")
      .filter(sub => sub.length !== 0)
      .map(sub => getAllUnicode(sub))
      .join("");
  }).join("");
}

function applySmartRules(word) {
  const lastChars = word.slice(-4).toLowerCase().split('');
  const [ec_3, ec_2, ec_1, ec_0] = lastChars;

  if ((ec_0 === 'a' || ec_0 === 'e' || ec_0 === 'u') && ec_1 === 'h' && ec_2 === 'c') {
    return word.slice(0, -3) + "chh" + ec_0;
  } else if (ec_0 === 'y') {
    return word.slice(0, -1) + "ree";
  } else if (ec_0 === 'a' && !isVowel(ec_1) && !isVowel(ec_3) && ec_1 !== 'y' && ec_2 !== 'e' &&
             !(ec_1 === 'h' && ec_2 === 'h') &&
             !(ec_1 === 'n' && (ec_2 === 'k' || ec_2 === 'h' || ec_2 === 'r')) &&
             !(ec_1 === 'r' && ec_2 === 'd' && ec_3 === 'n') &&
             !(ec_1 === 'r' && ec_2 === 't' && ec_3 === 'n')) {
    return word + "a";
  } else if (ec_0 === 'i' && !isVowel(ec_1)) {
    return word.slice(0, -1) + "ee";
  }

  return word;
}

function hasSW(s) {
  for (let i = s.length - 2; i >= 0; i--) {
    if (sW[s.substring(i)]) return true;
  }
  return false;
}

function getUnicode(t, ll) {
  const ar = t.split("+");
  const stopPos = (ll && ar && ar.length > 1 && sW["smartconverter_on"] === "true" && ar[ar.length - 1] === "2381") ? 1 : 0;
  return ar.slice(0, ar.length - stopPos)
    .filter(code => code.length > 0)
    .map(code => `#¬${code}#`)
    .join("");
}

function getAllUnicode(s) {
  s = s.replace(/T/g, "^^t^^").replace(/D/g, "^^d^^").replace(/N/g, "^^n^^").replace(/SH/g, "^^sh^^").replace(/Sh/g, "^^sh^^");
  s = s.toLowerCase();
  s = s.replace(/\^\^t\^\^/g, "T").replace(/\^\^d\^\^/g, "D").replace(/\^\^n\^\^/g, "N").replace(/\^\^sh\^\^/g, "Sh");

  let allUnicode = "";
  let tryString = s;
  let nextTryString = "";

  while (tryString.length > 0) {
    const u = uD[tryString];
    if (u || tryString.length <= 1) {
      if (u) {
        allUnicode += getUnicode(u, !(nextTryString.replace(/^\s+|\s+|\\$/, '').length > 0));
      } else {
        allUnicode += tryString;
      }
      tryString = nextTryString;
      nextTryString = "";
    } else {
      nextTryString = tryString.slice(-1) + nextTryString;
      tryString = tryString.slice(0, -1);
    }
  }

  return allUnicode.length === 0 ? s : allUnicode;
}

function translate(input, smart) {
  const processTokens = (startChar, endChar, tokenObj) => {
    let beginIndex = 0;
    let endIndex = -1;
    let tokenCount = 1;

    while (beginIndex > -1 && endIndex < input.length - 1) {
      beginIndex = input.indexOf(startChar, endIndex + 1);
      if (beginIndex > -1) {
        endIndex = input.indexOf(endChar, beginIndex + 1);
        if (endIndex === -1) endIndex = input.length - 1;
        const token = input.substring(beginIndex, endIndex + 1);
        const mask = `$-${tokenCount}-$`;
        tokenObj[mask] = token.substring(1, token.length - 1);
        input = input.replace(token, mask);
        endIndex = endIndex - token.length + mask.length;
        tokenCount++;
      }
    }
  };

  const engTokens = {};
  const nonSmartTokens = {};

  processTokens("{", "}", engTokens);

  if (smart) {
    smartConverter(false);
    processTokens("[", "]", nonSmartTokens);
    smartConverter(true);
  }

  let unicode = translateWords(input);

  if (smart) {
    Object.entries(nonSmartTokens).forEach(([mask, value]) => {
      unicode = unicode.replace(translateWords(mask).replace(" ", ""), value.replace(/\s$/, ""));
    });
  }

  Object.entries(engTokens).forEach(([mask, value]) => {
    unicode = unicode.replace(translateWords(mask).replace(" ", ""), value);
  });

  return unicode;
}

function isVowel(c) {
  return ['a', 'e', 'i', 'o', 'u'].includes(c.toLowerCase());
}

function smartConverter(smartflag) {
  if (smartflag) {
    Object.assign(uD, sW);
    sW["smartconverter_on"] = "true";
  } else {
    Object.keys(sW).forEach(specialWord => {
      if (uD[specialWord]) delete uD[specialWord];
    });
    sW["smartconverter_on"] = null;
  }
}

function convert(text, smartConvert = true) {
  const charactersUnicode = translate(text, smartConvert).split("#");
  return charactersUnicode
    .filter(element => element)
    .map(element => String.fromCharCode(element.replace("¬", "")))
    .join("");
}

export { convert };



// Add unicode generator
// Add word count function
// Add machine translation
