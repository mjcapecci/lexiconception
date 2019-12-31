let lexiconRules = {};

const createDefaultLexiconRules = (name, glyphArr) => {
  const rules = {
    name,
    glyphs: []
  };

  glyphArr.forEach(glyph => {
    const glyphObj = {
      symbol: glyph,
      followers: [],
      double: {
        start: false,
        middle: false,
        end: false
      },
      maxOccurrences: 3
    };
    rules.glyphs.push(glyphObj);
  });

  lexiconRules = rules;
};
