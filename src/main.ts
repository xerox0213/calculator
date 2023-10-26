const calculatorBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll("button");
const calculationResult: HTMLInputElement = document.querySelector("#result") as HTMLInputElement

calculatorBtns.forEach((btn: HTMLButtonElement) => {
    btn.addEventListener("click", handleClickCalculatorBtn)
})

function handleClickCalculatorBtn(e: MouseEvent) {
    const calculatorBtn: HTMLButtonElement = e.target as HTMLButtonElement
    const btnValue: string = calculatorBtn.value
    const operators = ["+", "-", "/", "*"]
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    if (operators.includes(btnValue)) {
        displayOperator(btnValue)
    } else if (numbers.includes(btnValue)) {
        displayNumber(btnValue)
    } else if (btnValue === "CE") {
        clearEntry();
    }
    return;
}

function displayOperator(o: string) {
    const currentValue = calculationResult.value
    const lastCharacter: string = getLastCharacter(currentValue)
    if (lastCharacter === "+" || lastCharacter === "-" || lastCharacter === "/" || lastCharacter === "*") {
        calculationResult.value = calculationResult.value.substring(0, currentValue.length - 1) + o
        return;
    }
    calculationResult.value += o
}

function displayNumber(n: string) {
    const currentValue = calculationResult.value
    const lastCharacter: string = getLastCharacter(currentValue)
    if (n === "0" && lastCharacter === "0") {
        return;
    }
    if (lastCharacter === "0" && currentValue.length === 1) {
        calculationResult.value = n
        return;
    }
    calculationResult.value += n
}

function getLastCharacter(str: string): string {
    return str.charAt(str.length - 1)
}

function clearEntry() {
    calculationResult.value = "0"
}