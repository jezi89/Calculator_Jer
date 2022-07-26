// Opdracht 1 LOI (10 punten)

// Ik heb een retro stijl voor de calcculator gebruikt die ik nog wil upgraden naar een light/dark switchable theme. Ook wil ik er klik geluiden aan  toevoegen. In de generieke bootstrap icons wil ik de memory en statistieken bij gaan houden. De ruitjesachtergrond zou ik live overschrijfbaar maken voor notities.

// Instructies:

// 1. De gebruikte getallen slaat u op in let en const, geen var.

// 2. U past alle bewerkingen toe (de operators +, -, * en /).

// 3. U gebruikt conditionals om de juiste sommen te kunnen maken.

// 4. U gebruikt de invoer zowel om op te tellen als samen te voegen tot string (concatenation).

// 5. U schrijft eigen functies waar nodig. > Op meerdere plaatsen gedaan

// 6. U zet waarden van variabelen om van data type (casting) waar nodig.

// 7. U laat zien hoe u met globale en lokale variabelen werkt.

// 8. U gebruikt Event handlers voor user events.

// 9. Uw script werkt foutloos. > Edge cases geprobeerd uit te sluiten. Er is alleen een probleem als je op de min knop drukt na een berekening en vervolgens door wilt rekenen met het negatief gemaakte resultaat. Dit wil ik in een Patch.

// 10. U hebt oplossingen gevonden voor alle uitdagingen. > Inlcusief extra functies Exponent en +/- knop

// I want to build a Memory function in a later version, but already created the toggle menu to open the memory buttons.
// Hereby I chose to keep the Memory button slightly brightened for as long as the memory menu is not hidden.
// The css pseudo-class ::active was limited in that I could not have it prevent the Memory menu button from staying lid when it was clicked but when you dragged the mouse outside without opening the actual menu. Therefore I used the mousedown event for the pre-selection and listen to a mouseout to reset the styles. These are wrapped by a click event that should trigger if the click is made. This needs further testing on mobile and is likely not a responsive solution.
const btnmem = document.getElementById('usemem');
const toggleHide = document.getElementById('memrow');
btnmem.style.filter = 'brightness(100%)';
btnmem.addEventListener('mousedown', function mouseDown(event) {
  this.style.filter = 'brightness(1.5)';
});

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

//  1. De gebruikte getallen slaat u op in let en const, geen var. > De button variabele zorgt voor
// 7. U laat zien hoe u met globale en lokale variabelen werkt.
let button = document.getElementsByName('button');

// Setting data-attributes in Jer's JavaScript file allows
// more control, versatility, and usability over the data attributes.
button.forEach((button) => {
  let btnVal = button.innerText;

  // 1st Long Option:
  // if loop with conditional statement including (btnVal == '*' || btnVal == '/' || btnVal == '-' || btnVal == '+') {
  //   button.setAttribute('data-operation', '');
  // 2nd MORE ADVANCED OPTION(faster):
  // Use of a Set...
  // 3rd chosen option:
  // Like first option if else if loop with use of .includes and .isFinite OR .

  // 3. U gebruikt conditionals om de juiste sommen te kunnen maken >  De data attribute operation wordt vervolgens gebruikt in de compute functie bij this.operation.
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
  }

  // If everything needs to be cleared with AC, we need to reset all properties
  // Operands can be set to an empty string to remove values
  // Operations can be set to undefined (means: no operation 'selected' if we clear things)
  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
  }

  // The delete function
  delete() {
    // 6. U zet waarden van variabelen om van data type (casting) waar nodig.
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  // I created a plus minus button that also checks for an empty string first ans sets this.plusminusNoDigit = true, to just show a minus symbol when pressed without a preceeding value. The subsequent pressed number is then converted to a negative number.
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

  // In order to be able to keep on typing a new calculation after result, I created this function that clears the current result when equals button is pressed (this.equalsCheck = true;) an previous operand is false (this.newCalc = true;). I got this to work to put calcCheck after the invokation of  calculator.compute(); &
  // calculator.updateDisplay(). It seems to trigger the clear only once after the number button that is pressed after equals, but since newCalc and EqualsCheck and afterwards trigger the compute and updatedisplay function.
  calcCheck() {
    if (this.newCalc == true && this.equalsCheck == true) {
      this.clear();
      this.newCalc = false;
      this.equalsCheck = false;
    }
  }

  // Here we check if the pressed Numberbutton is a dot and if a dot is already in the CurrentOperand
  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (this.currentOperandTextElement.innerText == '-') {
      this.currentOperand = number * -1;
      this.currentOperand = this.currentOperand.toString();
      return;
    }
    // Cleaner solution would maybe be to use .toFixed(0)
    if (this.currentOperand.length <= 14) {
      // 4. U gebruikt de invoer zowel om op te tellen als samen te voegen tot string (concatenation).
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

  // 2. U past alle bewerkingen toe (de operators +, -, * en /).
  compute() {
    let computation;
    // 7. U laat zien hoe u met globale en lokale variabelen werkt.
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    // 3. U gebruikt conditionals om de juiste sommen te kunnen maken.
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
    //Needs Revision and cleaner solution for correct big numbers (ie. https://github.com/MikeMcl/bignumber.js/)
    // if (computation >= 2 ** 53) {
    //   getDisplayNumber() = "Error";
    // }
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  // Helper function to make the numbers more definitive
  getDisplayNumber(number) {
    // 1. De gebruikte getallen slaat u op in let en const, geen var.
    const stringNumber = number.toString();
    // 6. U zet waarden van variabelen om van data type (casting) waar nodig.
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

// 4. U gebruikt de invoer zowel om op te tellen als samen te voegen tot string (concatenation). > Indirect wordt de invoer gebruikt
// 8. U gebruikt Event handlers voor user events.
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

// Here we are setting the keyboard shortcuts for operationButtons.entriesAll are logical and for the +/- button I chose \
// 8. U gebruikt Event handlers voor user events.
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
