import {getPostfixResult, convertToPostfixNotation, operators, numbers} from "./math.ts";
import {getTokens, isExpressionValid} from "./utils.ts";

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
            expression = addOperator(btnValue, expression)
            displayExpression(expression)
        } else if (numbers.includes(btnValue)) {
            expression = addOperand(btnValue, expression)
            displayExpression(expression)
        } else if (btnValue === ".") {
            expression = addPoint(btnValue, expression);
            displayExpression(expression)
        } else if (btnValue === "CE") {
            expression = removeLastChar(expression);
            displayExpression(expression)
        } else if (btnValue === "C") {
            expression = "0";
            displayExpression(expression)
        } else if (btnValue === "=") {
            try {
                expression = getExpressionResult(expression)
                displayExpression(expression)
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

function displayExpression(expression: string) {
    calculationResult.value = expression
}

function addOperator(o: string, expression: string): string {
    const tokens: string[] = getTokens(expression);
    const lastToken: string = tokens[tokens.length - 1];
    if ((operators.includes(lastToken) && tokens.length === 1) || lastToken === ".") {
        return expression;
    } else if ((o === "-" && tokens.length === 1 && lastToken === "0") || operators.includes(lastToken)) {
        expression = expression.slice(0, -1) + o;
    } else expression += o;
    return expression
}

function addOperand(o: string, expression: string): string {
    const tokens: string[] = getTokens(expression);
    const lastToken: string = tokens[tokens.length - 1];
    if (lastToken === "0") {
        if (o === "0") {
            return expression
        } else {
            expression = expression.slice(0, -1) + o
        }
    } else {
        expression += o
    }
    return expression
}

function addPoint(p: string, expression: string): string {
    const tokens: string[] = getTokens(expression);
    const lastToken: string = tokens[tokens.length - 1];
    if (operators.includes(lastToken) || /\./.test(lastToken)) {
        return expression;
    }
    expression += p;
    return expression
}

function removeLastChar(expression: string): string {
    if (expression.length === 1) {
        return "0"
    } else {
        expression = expression.slice(0, -1)
        return expression
    }
}

function getExpressionResult(expression: string): string {
    if (!isExpressionValid(expression)) {
        throw new Error("Expression isn't valid!")
    }
    const postfixNotation: string[] = convertToPostfixNotation(expression)
    return getPostfixResult(postfixNotation)
}

function displayError(msg: string, timeoutRef: number): number {
    clearTimeout(timeoutRef);
    errorMsg.textContent = msg;
    errorMsg.classList.add("active");
    return setTimeout((): void => {
        errorMsg.classList.remove("active")
    }, 3000);
}