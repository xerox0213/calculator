const calculatorBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll("button");
const calculationResult: HTMLInputElement = document.querySelector("#result") as HTMLInputElement
const operators = ["+", "-", "/", "*"]
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
calculatorBtns.forEach((btn: HTMLButtonElement) => {
    btn.addEventListener("click", handleClickCalculatorBtn)
})

function handleClickCalculatorBtn(e: MouseEvent) {
    const calculatorBtn: HTMLButtonElement = e.target as HTMLButtonElement
    const btnValue: string = calculatorBtn.value
    if (operators.includes(btnValue)) {
        displayOperator(btnValue)
    } else if (numbers.includes(btnValue)) {
        displayNumber(btnValue)
    } else if (btnValue === "CE") {
        clearEntry();
    } else {
        return;
    }
}

function displayOperator(o: string) {
    const lastCharacter: string = getLastCharacter(calculationResult.value)
    const operands: string[] = extractOperands(calculationResult.value)
    const lastOperand: string = operands[operands.length - 1]
    if (operators.includes(lastCharacter) || (o === "-" && operands.length === 1 && lastOperand === "0")) {
        calculationResult.value = calculationResult.value.slice(0,-1) + o
        return;
    }
    calculationResult.value += o
}

function displayNumber(n: string) {
    const operands: string[] = extractOperands(calculationResult.value)
    const lastOperand: string = operands[operands.length - 1]
    if (n === "0" && lastOperand.length === 1 && lastOperand === "0") {
        return;
    }
    if (n !== "0" && lastOperand.length === 1 && lastOperand === "0") {
        calculationResult.value = calculationResult.value.slice(0,-1) + n;
        return;
    }
    calculationResult.value += n;
}

function getLastCharacter(str: string): string {
    return str.charAt(str.length - 1)
}

function clearEntry() {
    calculationResult.value = "0"
}

function extractOperands(c: string) {
    return c.split(/[\-\+\/\*]/)
}
