const operators: string[] = ["+", "-", "/", "*"]
const numbers: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
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
                expression = displayResult(expression)
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

function displayResult(expression: string): string {
    const postfixNotation: string[] = convertToPostfixNotation(expression)
    const result: string = getExpressionResult(postfixNotation)
    calculationResult.value = result;
    return result
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

type Precedence = {
    [key: string]: number;
}

const precedence: Precedence = {
    "+": 0,
    "-": 0,
    "/": 1,
    "*": 1
}

function convertToPostfixNotation(expression: string): string[] {
    const tokens: string[] = getTokens(expression)
    const postfix: string[] = []
    const stack: string[] = []

    for (const token of tokens) {
        if (operators.includes(token)) {
            const lastStackedOperator: string | undefined = stack[stack.length - 1]
            if (!lastStackedOperator || precedence[token] > precedence[lastStackedOperator]) {
                stack.push(token)
            } else if (precedence[token] === precedence[lastStackedOperator]) {
                const lastStackedOperator = stack.pop() as string
                postfix.push(lastStackedOperator)
                stack.push(token)
            } else {
                while (stack.length > 0) {
                    const lastStackedOperator: string = stack.pop() as string
                    postfix.push(lastStackedOperator)
                }
                stack.push(token)
            }
        } else {
            postfix.push(token)
        }
    }

    while (stack.length > 0) {
        const lastStackedOperator: string = stack.pop() as string
        postfix.push(lastStackedOperator)
    }

    return postfix
}

function getExpressionResult(postfix: string[]): string {
    const stack: string[] = []
    for (const token of postfix) {
        if (!operators.includes(token)) {
            stack.push(token)
        } else {
            const b: string = stack.pop() as string;
            const a: string = stack[stack.length - 1] ? stack.pop() as string : "0";
            const result: number = getOperationResult(+a, +b, token)
            stack.push(result.toString())
        }
    }
    return stack[stack.length - 1]
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