const container = document.querySelector('.container');
const name = document.querySelector('#name');
const glyphs = document.querySelector('#glyphs');
const submit = document.querySelector('#submit');

submit.addEventListener('click', function(e) {
  e.preventDefault();

  let nameValue = name.value;
  if (!nameValue) {
    alert('Must enter a name');
    return;
  }
  let glyphArr = glyphs.value.split(',');

  createDefaultLexiconRules(nameValue, glyphArr);

  createGlyphDiv();

  let generateButton = document.createElement('button');
  generateButton.setAttribute('id', 'generate');
  generateButton.textContent = 'Generate JSON';
  generateButton.addEventListener('click', e => {
    e.preventDefault();
    for (glyph of lexiconRules.glyphs) {
      let sym = glyph.symbol;
      let doubleStart = document.querySelector(`#doubleStart-${sym}`);
      let doubleMiddle = document.querySelector(`#doubleMiddle-${sym}`);
      let doubleEnd = document.querySelector(`#doubleEnd-${sym}`);

      let maxOccurrences = document.querySelector(`#maxOccurrences-${sym}`);

      glyph.double.start = doubleStart.checked;
      glyph.double.middle = doubleMiddle.checked;
      glyph.double.end = doubleEnd.checked;

      if (parseInt(maxOccurrences.value))
        glyph.maxOccurrences = maxOccurrences.value;

      for (follower of glyph.followers) {
        let start = document.querySelector(
          `#followerStart-${sym}-${follower.glyph}`
        );
        let middle = document.querySelector(
          `#followerMiddle-${sym}-${follower.glyph}`
        );
        let end = document.querySelector(
          `#followerEnd-${sym}-${follower.glyph}`
        );

        follower.start = start.checked;
        follower.middle = middle.checked;
        follower.end = end.checked;
      }
    }

    let jsonFormattedString = JSON.stringify(lexiconRules, null, 2);

    console.log(jsonFormattedString);

    let words = generateWords(4, 10, 1000);
    let lines = words.join('<br>');

    let newdiv = document.createElement('div');
    newdiv.innerHTML = `<pre>${lines}</pre>`;
    container.appendChild(newdiv);
  });

  container.appendChild(generateButton);
});

function createGlyphDiv() {
  for (glyph of lexiconRules.glyphs) {
    let sym = glyph.symbol;
    let elem = document.createElement('div');
    elem.setAttribute('class', 'glyph');
    elem.setAttribute('id', `glyph-${sym}`);

    let optionArr = [];
    lexiconRules.glyphs.forEach(
      g =>
        g !== glyph &&
        optionArr.push(
          `<option id='option-${sym}-${g.symbol}' value='${g.symbol}'>${g.symbol}</option>`
        )
    );
    let optionString = optionArr.join('');

    elem.innerHTML = `
    <h1>${sym}</h1>
    <div class='doubleOptions' id='doubleOptions-${sym}'>
      <h3>Double Allowed?</h3>
      <input type='checkbox' name='start' value='Start' id='doubleStart-${sym}' />
      Start
      <br />
      <input type='checkbox' name='middle' value='Middle' id='doubleMiddle-${sym}' />
      Middle
      <br />
      <input type='checkbox' name='end' value='End' id='doubleEnd-${sym}' />
      End
      <br />
    </div>
    <label for='maxOccurrences'>Maximum Occurrences</label>
    <input type='number' id='maxOccurrences-${sym}' />
    <br />
    <br />
    <label for='select'>Followers</label>
    <select id='select-${sym}'>
    ${optionString}
    </select>`;

    let addButton = document.createElement('button');
    addButton.setAttribute('id', `addFollower-${sym}`);
    addButton.textContent = 'Add Selected Follower';
    addButton.addEventListener('click', e => {
      e.preventDefault();
      let followers = document.querySelector(`#followers-${sym}`);
      let select = document.querySelector(`#select-${sym}`);
      let selectedOption = select.value;

      let followerObj = {
        glyph: selectedOption,
        start: false,
        middle: false,
        end: false
      };

      let currentGlyph = lexiconRules.glyphs.filter(g => g.symbol === sym)[0];
      currentGlyph.followers.push(followerObj);

      let newDiv = document.createElement('div');
      newDiv.setAttribute('class', 'followerOptions');
      newDiv.setAttribute('id', `followerOptions-${sym}-${selectedOption}`);

      newDiv.innerHTML = `
      <div class='followerOptions' id='followerOptions-${sym}-${selectedOption}'>
      <h3>Follower: ${selectedOption}</h3>
      <input type='checkbox' name='start' value='Start' id='followerStart-${sym}-${selectedOption}' /> Start
      <br />
      <input type='checkbox' name='middle' value='Middle' id='followerMiddle-${sym}-${selectedOption}' /> Middle
      <br />
      <input type='checkbox' name='end' value='End' id='followerEnd-${sym}-${selectedOption}' /> End
      <br />
    </div>`;

      followers.appendChild(newDiv);

      select.remove(select.selectedIndex);
    });

    let followerDiv = document.createElement('div');
    followerDiv.setAttribute('class', 'followers');
    followerDiv.setAttribute('id', `followers-${sym}`);

    elem.appendChild(addButton);
    elem.appendChild(followerDiv);
    container.appendChild(elem);
  }
}
