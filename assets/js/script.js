const btnmem = document.getElementById('usemem');
const toggleHide = document.getElementById('memrow');
btnmem.style.filter = 'brightness(100%)';
btnmem.addEventListener('mousedown', function mouseDown(event) {
  this.style.filter = 'brightness(1.5)';
});

// This needs to be rewritten to target event
btnmem.addEventListener('click', function onClick(event) {
  if (toggleHide.style.display === 'flex') {
    toggleHide.style.display = 'none';
    btnmem.addEventListener('mouseout', function mouseOut(event) {
      btnmem.style.filter = 'brightness(100%)';
    });
  } else {
    btnmem.style.filter = 'brightness(1.3)';
    toggleHide.style.display = 'flex';
    btnmem.addEventListener('mouseout', function mouseOut(event) {
      btnmem.style.filter = 'brightness(1.3)';
    });
  }
});

let button = document.getElementsByName('button');

// Setting data-attributes in Jer's JavaScript file allows
// more control, versatility, and usability over the data attributes.
button.forEach((button) => {
  let btnVal = button.innerText;

  // LONG OPTION
  // if (btnVal == '*' || btnVal == '/' || btnVal == '-' || btnVal == '+') {
  //   button.setAttribute('data-operation', '');
  // 2nd MORE ADVANCED OPTION FOR NOW (faster)
  // Use of a Set...
  // 3rd OPTION
  if (['*', '/', '-', '+', 'EXP'].includes(btnVal)) {
    button.setAttribute('data-operation', '');
  } else if (btnVal == 'M++') {
    button.setAttribute('data-mem', '');
  } else if (btnVal == 'M--') {
    button.setAttribute('data-mem-minus', '');
  } else if (btnVal == 'MR') {
    button.setAttribute('data-mem-release', '');
  } else if (btnVal == 'MS') {
    button.setAttribute('data-mem-save', '');
  } else if (btnVal == 'MC') {
    button.setAttribute('data-mem-clear', '');
  } else if (btnVal == '+/-') {
    button.setAttribute('data-plus-minus', '');
  } else if (btnVal == 'AC') {
    button.setAttribute('data-all-clear', '');
  } else if (btnVal == 'C') {
    button.setAttribute('data-delete', '');
  } else if (btnVal == '=') {
    button.setAttribute('data-equals', '');
  } else if (Number.isFinite(parseInt(btnVal)) || btnVal == '.') {
    button.setAttribute('data-number', '');
  } else {
    button.setAttribute('data-newbtn', '');
  }
});

// Easiest way to store the calculations
class Calculator {
  // The constructor method is a special method of a class for creating and initializing an object instance of that class,
  // so here it holds the initialization of the previous and current operand, where all the inputs and functions for the calculator are called upon.
  constructor(previousOperandTextElement, currentOperandTextElement) {
    // Here we are setting variables so that we can set the text elements into our calculator class
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    // This clear function lets us set everything to default as as soon as we create a new calculator.
    // After load
    this.clear();
    this.calcCheck();
  }

  // If everything needs to be cleared with AC, we need to reset all properties
  // Operands can be set to an empty string to remove values
  // Operations can be set to undefined (means: no operation 'selected' if we clear things)
  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  plusminus() {
    if (this.currentOperand == '') {
      this.currentOperand = (this.currentOperand * -1).toString();
      this.plusminusNoDigit = true;
      return;
    }
    if (this.currentOperandTextElement.innerText == '-') {
      this.currentOperand = '';
      this.plusminusNoDigit = undefined;
    } else {
      this.currentOperand = (this.currentOperand * -1).toString();
    }
  }

  calcCheck() {
    if (this.newCalc == true && this.equalsCheck == true) {
      console.log('test');
      this.clear();
      this.newCalc = false;
      this.equalsCheck = false;
    }
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (this.currentOperandTextElement.innerText == '-') {
      this.currentOperand = number * -1;
      this.currentOperand = this.currentOperand.toString();
      return;
    }
    if (this.currentOperand.length <= 14) {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    } else return;
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;

    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        computation = prev / current;
        break;
      case '^':
        computation = prev ** current;
        break;
      default:
        return;
    }
    // if (computation >= 2 ** 53) {
    //   getDisplayNumber() = "Error";
    // }
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  // Helper function to make the numbers more definitive
  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.plusminusNoDigit == true) {
      this.currentOperandTextElement.innerText = '-';
      this.plusminusNoDigit = undefined;
    }
    if (this.operation == 'EXP') {
      this.operation = '^';
    }
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
      this.newCalc = true;
    }
  }
}

// Creating variables that are tied to the different buttons in the HTML selected through their data-attribute
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const plusminusButton = document.querySelector('[data-plus-minus]');

let previousOperandTextElement = document.querySelector(
  '[data-previous-operand]'
);

let currentOperandTextElement = document.querySelector(
  '[data-current-operand]'
);

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement
);

numberButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.calcCheck();
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener('click', (button) => {
  calculator.compute();
  calculator.updateDisplay();
  calculator.equalsCheck = true;
});

allClearButton.addEventListener('click', (button) => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', (button) => {
  calculator.delete();
  calculator.updateDisplay();
});

plusminusButton.addEventListener('click', (button) => {
  calculator.plusminus();
  calculator.updateDisplay();
});

document.addEventListener('keydown', function (event) {
  let patternForNumbers = /[0-9]/g;
  let patternForOperators = /[+\-*\/]/g;
  if (event.key.match(patternForNumbers)) {
    event.preventDefault();
    calculator.appendNumber(event.key);
    calculator.updateDisplay();
  }
  if (event.key === '.') {
    event.preventDefault();
    calculator.appendNumber(event.key);
    calculator.updateDisplay();
  }
  if (event.key.match(patternForOperators)) {
    event.preventDefault();
    calculator.chooseOperation(event.key);
    calculator.updateDisplay();
  }
  if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    calculator.compute();
    calculator.updateDisplay();
    calculator.calcCheck();
  }
  if (event.key === 'Backspace') {
    event.preventDefault();
    calculator.delete();
    calculator.updateDisplay();
  }
  if (event.key == 'Delete') {
    event.preventDefault();
    calculator.clear();
    calculator.updateDisplay();
  }
  if (event.key == '\\') {
    event.preventDefault();
    calculator.plusminus();
    calculator.updateDisplay();
  }
});
