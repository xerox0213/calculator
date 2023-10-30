import {getTokens} from "./utils.ts";

export const operators: string[] = ["+", "-", "/", "*"]
export const numbers: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
type Precedence = {
    [key: string]: number;
}
const precedence: Precedence = {
    "+": 0,
    "-": 0,
    "/": 1,
    "*": 1
}

export function convertToPostfixNotation(expression: string): string[] {
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
                    const operator: string = stack.pop() as string
                    postfix.push(operator)
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

export function getOperationResult(a: number, b: number, operator: string): number {
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

export function getPostfixResult(postfix: string[]): string {
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
