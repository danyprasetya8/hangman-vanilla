const gameEl = document.querySelector('.game')
const answerEl = document.querySelector('#answer')
const wrongEl = document.querySelector('#wrong-list')
const parts = document.querySelectorAll('.figure-part')
const duplicateEl = document.querySelector('.show-duplicate')
const modalEl = document.querySelector('.modal')
const playAgainBtn = document.querySelector('#play-again')
const transparentLayer = document.querySelector('.transparent-layer')
const difficultyModalEl = document.querySelector('.difficulty-modal')
const difficultyBtn = document.querySelectorAll('.difficulty-btn')
const descEl = document.querySelector('#desc')

const wordList = {
  EASY: [
    {
      key: 'chair',
      desc: 'Object that always used to sit'
    },
    {
      key: 'table',
      desc: 'A Chair bestfriends'
    },
    {
      key: 'summer',
      desc: 'Season'
    },
    {
      key: 'dany',
      desc: 'Born in 3 February 1998'
    }
  ],
  MEDIUM: [
    {
      key: 'jesslyn',
      desc: 'Most beautiful girl in the world'
    },
    {
      key: 'jesslyn',
      desc: 'Most beautiful girl in the world'
    },
    {
      key: 'jesslyn',
      desc: 'Most beautiful girl in the world'
    },
    {
      key: 'transparent',
      desc: 'Colors of water'
    }
  ],
  HARD: [
    {
      key: 'approximately',
      desc: 'Not less but not too much'
    },
    {
      key: 'experience',
      desc: '. . . is the best teacher'
    }
  ]
}

let DIFFICULTY = ''
let currWord = []
let wrongAnswer = []
let correctAnswer = []
let existingAnswer = new Set()
let isDuplicateWord = false
let CHANCES = 0
let GAME_END = false

function playAgain () {
  modalEl.classList.remove('show-modal')
  transparentLayer.classList.remove('show-modal')
  answerEl.innerHTML = ''
  wrongEl.innerHTML = ''
  currWord = []
  wrongAnswer = []
  correctAnswer = []
  existingAnswer = new Set()
  CHANCES = 0
  GAME_END = false
  generateRandomWord()
}

function generateRandomWord () {
  const list = wordList[DIFFICULTY]
  const len = list.length
  const randomInt = Math.floor(Math.random() * (len - 0))
  const { key, desc } = list[randomInt]
  currWord = key.split('')
  createInputAndDescEl(desc)
}

function createInputAndDescEl (desc) {
  for (let i=0 ; i<currWord.length ; i++) {
    const span = document.createElement('span')
    answerEl.appendChild(span)
  }
  descEl.innerHTML = desc
}

function showModal (msg) {
  modalEl.children[0].innerHTML = msg
  setTimeout(() => {
    modalEl.classList.add('show-modal')
    transparentLayer.classList.add('show-modal')
  }, 200)
}

function isWin (spanList) {
  let flag = []
  spanList.forEach(span => {
    if (span.innerHTML === '') {
      flag.push(true)
    }
  })
  return !flag.includes(true)
}

function printCorrectAnswer (idx, key) {
  const spanList = document.querySelectorAll('#answer span')
  correctAnswer.push(key)
  idx.forEach(i => spanList[i].innerHTML = key.toUpperCase())
  if (isWin(spanList)) {
    GAME_END = true
    showModal('You Have Win!')
    return
  }
}

function printWrongAnswer () {
  wrongEl.innerHTML = ''
  const span = document.createElement('span')
  span.innerHTML = wrongAnswer.join(', ')
  wrongEl.appendChild(span)
}

function decreaseLife () {
  parts[CHANCES].classList.add('show')
  if (CHANCES >= 5) {
    printWrongAnswer()
    showModal('You Have Lost!')
    GAME_END = true
    return
  }
  printWrongAnswer()
  CHANCES++
}

function validateDuplicate (key) {
  if (
    [...existingAnswer].includes(key) &&
    (correctAnswer.includes(key) ||
    wrongAnswer.includes(key))
  ) {
    return true
  }
  return false
}

function getAllIndexInCurrentWord (key) {
  let arr = []
  currWord.forEach((i, idx) => i === key ? arr.push(idx) : '')
  return arr
}

function getCurrKey ({ key, keyCode }) {
  if (keyCode >= 65 && keyCode <= 90 && !GAME_END) {
    existingAnswer.add(key)
    isDuplicateWord = validateDuplicate(key)
    if (!isDuplicateWord) {
      const idx = getAllIndexInCurrentWord(key)
      if (idx.length) {
        printCorrectAnswer(idx, key)
      } else {
        wrongAnswer.push(key)
        decreaseLife()
      }
    } else {
      duplicateEl.classList.add('show')
      setTimeout(() => duplicateEl.classList.remove('show'), 800)
    }
  }
}

function startGame () {
  playAgainBtn.addEventListener('click', playAgain)
  window.addEventListener('keydown', getCurrKey)
  generateRandomWord()
}

difficultyBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    DIFFICULTY = btn.value
    difficultyModalEl.style.display = 'none'
    gameEl.style.display = 'flex'
    startGame()
  })
})