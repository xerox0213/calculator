const calculatorBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll("button");
const calculationResult: HTMLInputElement = document.querySelector("#result") as HTMLInputElement
const operators = ["+", "-", "/", "*"]
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
let calculation: string = calculationResult.value;

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
    } else if (btnValue === ".") {
        displayPoint(btnValue);
    } else if (btnValue === "CE") {
        clearEntry();
    } else if (btnValue === "C") {
        clear();
    } else {
        return;
    }
}

function displayOperator(o: string) {
    const tokens: string[] = getTokens(calculation);
    const lastToken: string = tokens[tokens.length - 1];
    if ((operators.includes(lastToken) && tokens.length === 1) || lastToken === ".") {
        return;
    } else if ((o === "-" && tokens.length === 1 && lastToken === "0") || operators.includes(lastToken)) {
        calculation = calculation.slice(0, -1) + o;
    } else calculation += o;
    calculationResult.value = calculation;
}

function displayNumber(n: string) {
    const tokens: string[] = getTokens(calculation);
    const lastToken: string = tokens[tokens.length - 1];
    if (lastToken === "0") {
        if (n === "0") return
        else calculation = calculation.slice(0, -1) + n
    } else calculation += n
    calculationResult.value = calculation;
}

function displayPoint(p: string) {
    const tokens: string[] = getTokens(calculation);
    const lastToken: string = tokens[tokens.length - 1];
    if (operators.includes(lastToken) || /\./.test(lastToken)) return;
    calculation += p;
    calculationResult.value = calculation;
}

function clearEntry() {
    if (calculation.length === 1) calculation = "0"
    else calculation = calculation.slice(0, -1)
    calculationResult.value = calculation
}

function clear() {
    calculation = "0";
    calculationResult.value = calculation
}

function getTokens(expression: string): string[] {
    return expression.split(/([\-\+\/\*])/).filter((token: string) => token !== "")
}