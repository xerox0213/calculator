const operators = ["+", "-", "/", "*"]
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
const calculatorBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll("button");
const calculationResult: HTMLInputElement = document.querySelector("#result") as HTMLInputElement
const errorMsg = document.getElementById("error-message") as HTMLParagraphElement
let calculation: string = calculationResult.value;
let timeoutRef: number;
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
    } else if (btnValue === "=") {
        try {
            if (!isExpressionValid(calculation)) throw new Error("Expression isn't valid!")
            const tokens: string[] = getTokens(calculation);
            const result: string = getExpressionResult(tokens);
            displayResult(result)
        } catch (e) {
            if (e instanceof Error) {
                timeoutRef = displayError(e.message)
            }
        }
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

function displayResult(result: string): void {
    calculation = result
    calculationResult.value = calculation;
}

function displayError(msg: string): number {
    if (timeoutRef) clearTimeout(timeoutRef);
    errorMsg.textContent = msg;
    errorMsg.classList.add("active");
    return setTimeout(() => {
        errorMsg.classList.remove("active")
        timeoutRef = 0;
    }, 3000);
}

function isExpressionValid(expression: string): boolean {
    return /[^\-\+\/\*\.]$/.test(expression)
}

function getExpressionResult(tokens: string[]): string {
    // First we check if there is * or / in the expression
    let indexOp: number = tokens.findIndex((token: string) => token === "*" || token === "/")

    // If there is not * or / we can check + and -
    if (indexOp === -1) {
        indexOp = tokens.findIndex((token: string) => token === "+" || token === "-")
    }

    if (indexOp !== -1) {
        const a: number = +tokens[indexOp - 1]
        const op: string = tokens[indexOp]
        const b: number = +tokens[indexOp + 1]
        const result: number = makeOperation(a, b, op);
        tokens.splice(indexOp - 1, 3, result.toString())
        return getExpressionResult(tokens);
    }

    return tokens[0]
}

function makeOperation(a: number, b: number, operator: string): number {
    switch (operator) {
        case "+":
            return a + b
        case "-":
            return a - b
        case "/":
            if (b === 0) throw new Error("Division by zero is prohibited!")
            return a / b
        case "*":
            return a * b
        default:
            throw new Error("The operator doesn't exist!")
    }
}