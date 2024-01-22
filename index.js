import './index.css';
import createWordPuzzle from 'create-word-puzzle';

(function () {
  const puzzle = createWordPuzzle({
    wordlist: [
      'apple',
      'banana',
      'cherry',
      'tomato',
      'blueberry',
      'lime',
      'kiwi',
      'pomegranate',
      'starfruit',
    ],
    width: 11,
    height: 11,
  });
  console.log(puzzle);
  App(puzzle);
  function App(puzzle) {
    const wordPoints = {};
    puzzle.wordlist.forEach((w) => {
      const start = w.start;
      const end = w.end;
      const steps = w.value.length;
      let xfac = end[0] - start[0];
      let yfac = end[1] - start[1];
      xfac = xfac && xfac / Math.abs(xfac);
      yfac = yfac && yfac / Math.abs(yfac);

      for (let i = 0; i < steps; i++) {
        wordPoints[[start[0] + i * xfac, start[1] + i * yfac].join(',')] = 1;
      }
    });
    const game = document.querySelector('#grid');
    game.innerHTML = `
    <div class="flex-column flex-wrap align-center">
      <div style="padding: 1rem;">
        <table>
          <tbody>
        ${puzzle.grid
        .map((row, x) => {
          return `
          <tr>
          ${row
              .map((cell, y) => {
                if (wordPoints[[x, y].join(',')]) {
                  return `<td class="word-point">${cell}</td>`;
                }
                return `<td>${cell}</td>`;
              })
              .join('')}
            </tr>
            `;
        })
        .join('')}
          </tbody>
        </table>
      </div>
      <div class="flex-row justify-center flex-wrap" style="max-width: 100%;">
      ${puzzle.wordlist
        .map((w) => {
          return `<p style="margin: 0">${w.value.toUpperCase()}</p>`;
        })
        .join('')}
      </div>
    </div>
  `;
  }

  const wordlist = document.getElementById('wordlist');
  const width = document.getElementById('width');
  const height = document.getElementById('height');
  const listSize = document.getElementById('listSize');
  const minWordLength = document.getElementById('minWordLength');
  const margin = document.getElementById('margin');
  const reverseWordRatio = document.getElementById('reverseWordRatio');
  const allowReverseWords = document.getElementById('allowReverseWords');
  const shareLetters = document.getElementById('shareLetters');
  const showWords = document.getElementById('showWords');

  const generateBtn = document.getElementById('generate');

  generateBtn.addEventListener('click', () => {
    const puzzle = createWordPuzzle({
      wordlist: wordlist.value.split(','),
      width: width.value,
      height: height.value,
      listSize: listSize.value,
      minWordLength: minWordLength.value,
      margin: margin.value,
      allowReverseWords: allowReverseWords.checked,
      reverseWordRatio: reverseWordRatio.value,
      shareLetters: shareLetters.checked,
    });
    console.log(puzzle);
    App(puzzle);
    genarateNestedObjectElement(puzzle, document.getElementById('puzzle').querySelector('ul'));
  });

  showWords.addEventListener('change', (e) => {
    if (e.target.checked == true) {
      document.getElementById('grid').classList.add('show-words');
    } else {
      document.getElementById('grid').classList.remove('show-words');
    }
  });

  let idIndex = 0;
  function genarateNestedObjectElement(object, appendTo) {
    const keys = (object && Object.keys(object)) || [];
    keys.forEach((key) => {
      const value = object[key];
      const type = typeof value;
      if (type === 'object') {
        const id = `__${key}-${++idIndex}`;
        const ul = document.createElement('ul');
        ul.classList.add('nested');
        ul.innerHTML = `<input class="nested-checkbox" id="${id}" type="checkbox" /><label class="key" for="${id}">${key}: </label><label for="${id}">(${(Array.isArray(value) && value.length.toString()) || ''
          }) ${JSON.stringify(value)}</label>`;
        appendTo.appendChild(ul);
        genarateNestedObjectElement(value, ul);
      } else {
        const li = document.createElement('li');
        const valueType = typeof value;
        const valueHtml =
          valueType === 'string'
            ? `<span class="string-value">"${value}"</span>`
            : valueType === 'number'
              ? `<span class="number-value">${value}</span>`
              : valueType === 'boolean'
                ? `<span class="boolean-value">${value}</span>`
                : `<span>${value}</span>`;
        li.innerHTML = `<span class="key">${key}: </span>${valueHtml}`;
        appendTo.appendChild(li);
      }
    });
  }

  genarateNestedObjectElement(puzzle, document.getElementById('puzzle').querySelector('ul'));
})();
