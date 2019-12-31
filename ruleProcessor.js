function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getIntBetween(min, max) {
  let diff = max - min;
  let amount = getRandomInt(diff);
  return max - amount;
}

const generateWords = (minLetters, maxLetters, numWords) => {
  let wordsArr = [];
  let listOfGlyphs = lexiconRules.glyphs.map(g => g.symbol);

  while (wordsArr.length < numWords) {
    let startGlyph = listOfGlyphs[getRandomInt(listOfGlyphs.length)];
    let wordBuilder = [startGlyph];

    let fullStartGlyph = lexiconRules.glyphs.filter(
      g => g.symbol === startGlyph
    )[0];
    let doubleStart = getRandomInt(10) ? false : true;
    let useDouble = doubleStart && fullStartGlyph.double.start;

    if (useDouble) wordBuilder.push(startGlyph);

    let numberOfLetters = getIntBetween(minLetters, maxLetters);
    let prematureExit = false;

    while (wordBuilder.length < numberOfLetters && !prematureExit) {
      let currentGlyph = lexiconRules.glyphs.filter(
        g => g.symbol === wordBuilder[wordBuilder.length - 1]
      )[0];

      let isCurrentStart = wordBuilder.length === 1;
      let isCurrentSecondToLast = wordBuilder.length === numberOfLetters - 1;
      let isCurrentMiddle = !isCurrentStart && !isCurrentSecondToLast;

      let candidateList = currentGlyph.followers.filter(f => {
        let followerGlyph = lexiconRules.glyphs.filter(
          g => g.symbol === f.glyph
        )[0];
        let count = wordBuilder.filter(glyph => glyph === f.glyph).length;
        return (
          ((isCurrentStart && f.start) ||
            (isCurrentMiddle && f.middle) ||
            (isCurrentSecondToLast && f.end)) &&
          count < followerGlyph.maxOccurrences
        );
      });

      if (candidateList.length === 0) prematureExit = true;

      if (!prematureExit) {
        let followerIndex = getRandomInt(candidateList.length);
        let chosenOne = candidateList[followerIndex];
        let chosenGlyph = lexiconRules.glyphs.filter(
          g => g.symbol === chosenOne.glyph
        )[0];
        let symbol = chosenOne.glyph;
        let double = getRandomInt(10) ? false : true;
        wordBuilder.push(symbol);

        let isChosenSecondToLast = wordBuilder.length === numberOfLetters - 1;
        if (
          ((isChosenSecondToLast && chosenGlyph.double.end) ||
            (!isChosenSecondToLast &&
              !wordBuilder.length === numberOfLetters &&
              chosenGlyph.double.middle)) &&
          double
        ) {
          wordBuilder.push(symbol);
        }
      }
    }

    let word = wordBuilder.join('');
    if (
      !prematureExit ||
      (word.length >= minLetters && word.length <= maxLetters)
    )
      wordsArr.push(word);
  }

  return wordsArr;
};
