const dictinary = {
	Cat: ['Dog', 'Rat', 'bat'],
	Helo: ['hello', 'Help', 'Hell'],
	heldp: ['help', 'held', 'hello']
}

function findWord(str, pos) {
	let lengthOfStr = str.length;
	let i;
	// стоим не на пробеле ?
	if (str.substring(pos, pos).search(/\s/i) != -1) return false;
	// определяем начало слова
	for (i = pos; i > -1; i--) {
		if (str.substring(i, pos).search(/\s/i) != -1) break;
	}
	let start = 0; if (i) start = i + 1;
	for (i = pos; i < lengthOfStr; i++) {
		if (str.substring(i, pos).search(/\s/i) != -1) break;
	}
	// определяем конец слова
	let end = lengthOfStr - 1; if (i) end = i;

	return {
		word: str.substring(start, end),
		start,
		end
	}
}

function getCaretPosition(editableDiv) {
	let caretPos = 0;
	let range;
	let sel = window.getSelection();

	if (sel.rangeCount) {
		range = sel.getRangeAt(0);
		if (range.commonAncestorContainer.parentNode === editableDiv) {
			caretPos = range.endOffset;
		}
	}

	return caretPos;
}

function setCaretToPos(elem, pos) {
	let range = document.createRange();
	let sel = window.getSelection();

	range.setStart(elem.childNodes[0], pos);
	range.collapse(true);
	sel.removeAllRanges();
	sel.addRange(range);
}


function replaceSelectedWord(event, word, start, end) {
	const currentValue = event.target.value || event.target.innerText;

	if (word && dictinary[word.trim()]) {
		const regExp = new RegExp(word, 'g');
		regExp.lastIndex = start;
		const listOfWords = document.createElement('div');
		listOfWords.classList.add('list-of-words__block');

		dictinary[word.trim()].forEach((value) => {
			const listItem = document.createElement('div');
			listItem.classList.add('list-of-words__item');
			listItem.innerHTML = value;
			listOfWords.appendChild(listItem);
			if (!event.pageX && !event.pageX) {
				listOfWords.style.left = event.target.offsetWidth / 2 + 'px';
			} else {
				listOfWords.style.top = window.event.clientY + 10 + 'px';
				listOfWords.style.left = window.event.clientX - 10 + 'px';
			}
		});
		const hasListOfWords = document.querySelector('.list-of-words__block');
		hasListOfWords && hasListOfWords.remove();

		event.type === 'click' ?
			document.body.insertAdjacentElement('beforeend', listOfWords) :
			event.target.insertAdjacentElement('afterend', listOfWords);


		document.querySelectorAll('.list-of-words__item').forEach((item) => {
			item.addEventListener('click', (innerEvent) => {
				const newStr = currentValue.replace(regExp, (wordToReplace, index) => {
					if (index === start) {
						wordToReplace = innerEvent.target.innerHTML + (currentValue[end] === ' ' ? '' : ' ');
						return wordToReplace;
					} else {
						return wordToReplace;
					}
				});

				event.target.value
					? event.target.value = newStr
					: event.target.innerText = newStr;

				document.querySelector('.list-of-words__block').remove();

				event.target.focus();
				event.target.setSelectionRange
					? event.target.setSelectionRange(end, end)
					: setCaretToPos(event.target, end)
			})
		})
	} else {
		const hasListOfWords = document.querySelector('.list-of-words__block');
		hasListOfWords && hasListOfWords.remove()
	}
};

window.addEventListener('focus', (event) => {
	const inputs = event.target.document.querySelectorAll('input');
	const textArea = event.target.document.querySelectorAll('textarea');
	const editableBloks = event.target.document.querySelectorAll('div[contenteditable="true"]');

	inputs.forEach(element => {
		element.addEventListener('click', (event) => {
			const { word, start, end } = findWord(event.target.value, event.target.selectionStart);
			replaceSelectedWord(event, word, start, end);
		})
		element.style.position = 'relative'
		element.addEventListener('keyup', (event) => {
			const isSpace = event.code === 'Space';
			const { target: { value, selectionStart }, code } = event;

			if (isSpace || code === 'ArrowLeft' || code === 'ArrowRight' || code === 'ArrowUp' || code === 'ArrowDown') {
				const { word, start, end } = findWord(
					value,
					isSpace ? selectionStart - 2 : selectionStart);
				replaceSelectedWord(event, word, start, end);
			} else {
				const listOfWords = document.querySelector('.list-of-words__block');
				listOfWords && listOfWords.remove();
			}
		});
	});

	textArea.forEach(element => {
		element.addEventListener('click', (event) => {
			const { word, start, end } = findWord(event.target.value, event.target.selectionStart);
			replaceSelectedWord(event, word, start, end);
		});

		element.addEventListener('keyup', (event) => {
			const isSpace = event.code === 'Space';
			const { target: { value, selectionStart }, code } = event;

			if (isSpace || code === 'ArrowLeft' || code === 'ArrowRight' || code === 'ArrowUp' || code === 'ArrowDown') {
				const { word, start, end } = findWord(
					value,
					isSpace ? selectionStart - 2 : selectionStart);
				replaceSelectedWord(event, word, start, end);
			} else {
				const listOfWords = document.querySelector('.list-of-words__block');
				listOfWords && listOfWords.remove();
			}
		});
	});

	editableBloks.forEach(element => {
		element.addEventListener('click', (event) => {
			const { word, start, end } = findWord(event.target.innerText, getCaretPosition(element));
			replaceSelectedWord(event, word, start, end);
		});

		element.addEventListener('keyup', (event) => {
			const isSpace = event.code === 'Space';
			const { target, target: { innerText }, code } = event;

			if (isSpace || code === 'ArrowLeft' || code === 'ArrowRight' || code === 'ArrowUp' || code === 'ArrowDown') {
				const { word, start, end } = findWord(
					innerText,
					isSpace ? getCaretPosition(target) - 2 : getCaretPosition(target));
				replaceSelectedWord(event, word, start, end);
			} else {
				const listOfWords = document.querySelector('.list-of-words__block');
				listOfWords && listOfWords.remove();
			}
		});
	});

});
