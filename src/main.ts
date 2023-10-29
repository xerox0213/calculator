const operators = ["+", "-", "/", "*"]
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
const calculatorBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll("button");
const calculationResult: HTMLInputElement = document.querySelector("#result") as HTMLInputElement
const errorMsg = document.getElementById("error-message") as HTMLParagraphElement
const handleClickCalculatorBtn = getHandleClickCalculatorBtn()

calculatorBtns.forEach((btn: HTMLButtonElement) => {
    btn.addEventListener("click", handleClickCalculatorBtn)
})

function getHandleClickCalculatorBtn() {
    let expression: string = calculationResult.value;
    let timeoutRef: number = 0;
    return (e: MouseEvent): void => {
        const calculatorBtn: HTMLButtonElement = e.target as HTMLButtonElement
        const btnValue: string = calculatorBtn.value
        if (operators.includes(btnValue)) {
            expression = displayOperator(btnValue, expression)
        } else if (numbers.includes(btnValue)) {
            expression = displayNumber(btnValue, expression)
        } else if (btnValue === ".") {
            expression = displayPoint(btnValue, expression);
        } else if (btnValue === "CE") {
            expression = clearEntry(expression);
        } else if (btnValue === "C") {
            expression = clear();
        } else if (btnValue === "=") {
            try {
                if (!isExpressionValid(expression)) {
                    throw new Error("Expression isn't valid!")
                }
                const tokens: string[] = getTokens(expression);
                expression = getExpressionResult(tokens);
                displayResult(expression)
            } catch (e) {
                if (e instanceof Error) {
                    timeoutRef = displayError(e.message, timeoutRef)
                }
            }
        } else {
            timeoutRef = displayError("Invalid character!", timeoutRef)
        }
    }
}

function displayOperator(o: string, expression: string): string {
    const tokens: string[] = getTokens(expression);
    const lastToken: string = tokens[tokens.length - 1];
    if ((operators.includes(lastToken) && tokens.length === 1) || lastToken === ".") {
        return expression;
    } else if ((o === "-" && tokens.length === 1 && lastToken === "0") || operators.includes(lastToken)) {
        expression = expression.slice(0, -1) + o;
    } else expression += o;
    calculationResult.value = expression;
    return expression
}

function displayNumber(n: string, expression: string): string {
    const tokens: string[] = getTokens(expression);
    const lastToken: string = tokens[tokens.length - 1];
    if (lastToken === "0") {
        if (n === "0") return expression
        else expression = expression.slice(0, -1) + n
    } else expression += n
    calculationResult.value = expression;
    return expression
}

function displayPoint(p: string, expression: string): string {
    const tokens: string[] = getTokens(expression);
    const lastToken: string = tokens[tokens.length - 1];
    if (operators.includes(lastToken) || /\./.test(lastToken)) return expression;
    expression += p;
    calculationResult.value = expression;
    return expression
}

function clearEntry(expression: string): string {
    if (expression.length === 1) return "0"
    else expression = expression.slice(0, -1)
    calculationResult.value = expression
    return expression
}

function clear() {
    calculationResult.value = "0"
    return "0"
}

function getTokens(expression: string): string[] {
    return expression.split(/([\-\+\/\*])/).filter((token: string) => token !== "")
}

function displayResult(result: string): void {
    calculationResult.value = result;
}

function displayError(msg: string, timeoutRef: number): number {
    clearTimeout(timeoutRef);
    errorMsg.textContent = msg;
    errorMsg.classList.add("active");
    return setTimeout((): void => {
        errorMsg.classList.remove("active")
    }, 3000);
}

function isExpressionValid(expression: string): boolean {
    return /[^\-\+\/\*\.]$/.test(expression)
}

function getExpressionResult(tokens: string[]): string {
    // First we check if there is * or / in the expression
    let indexOp: number = findOperatorIndex(tokens, "*", "/")

    // If there is not * or / we check + and -
    if (indexOp === -1) {
        indexOp = findOperatorIndex(tokens, "+", "-")
    }

    if (indexOp !== -1) {
        const a: number = +tokens[indexOp - 1]
        const op: string = tokens[indexOp]
        const b: number = +tokens[indexOp + 1]
        const result: number = getOperationResult(a, b, op);
        tokens.splice(indexOp - 1, 3, result.toString())
        return getExpressionResult(tokens);
    }

    return tokens[0]
}

function findOperatorIndex(tokens: string[], ...operators: string[]): number {
    return tokens.findIndex((token: string) => operators.includes(token))
}

function getOperationResult(a: number, b: number, operator: string): number {
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