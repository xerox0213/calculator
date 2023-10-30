import {beforeEach, describe, expect, test} from "vitest";
import {convertToPostfixNotation, getPostfixResult, getOperationResult} from "../src/math";

describe("getOperationResult()", () => {
    describe("should return result of", () => {
        type LocalTestContext = {
            a: number
            b: number
        }
        beforeEach<LocalTestContext>((ctx) => {
            ctx.a = 1
            ctx.b = 2
        })
        test<LocalTestContext>("sum", ({a, b}: LocalTestContext) => {
            const operator = "+"
            const result = getOperationResult(a, b, operator)
            expect(result).toEqual(3)
        })

        test<LocalTestContext>("subtraction", ({a, b}: LocalTestContext) => {
            const operator = "-"
            const result = getOperationResult(a, b, operator)
            expect(result).toEqual(-1)
        })

        test<LocalTestContext>("multiplication", ({a, b}: LocalTestContext) => {
            const operator = "*"
            const result = getOperationResult(a, b, operator)
            expect(result).toEqual(2)
        })

        test<LocalTestContext>("division", ({a, b}: LocalTestContext) => {
            const operator = "/"
            const result = getOperationResult(a, b, operator)
            expect(result).toEqual(0.5)
        })
    })

    test("should throw an error if the divisor is equal to 0", () => {
        const a = 3;
        const b = 0;
        const operator = "/"
        const method = () => getOperationResult(a, b, operator)
        expect(method).toThrowError("Division by zero is prohibited!")
    })

    test("should throw an error if the operator doesn't exist", () => {
        const a = 3;
        const b = 4;
        const operator = "d"
        const method = () => getOperationResult(a, b, operator)
        expect(method).toThrowError("The operator doesn't exist!")

    })
})

describe("convertToPostfixNotation()", () => {
    test("should return the postfix notation of a given expression", () => {
        const expression = "5+3-4/2*6-4"
        const result = convertToPostfixNotation(expression)
        expect(result).toEqual(["5", "3", "+", "4", "2", "/", "6", "*", "-", "4", "-"])
    })
})

describe('getExpressionResult()', () => {
    test("should return the result of a given postfix notation", () => {
        const postfixNotation = ["5", "3", "+", "4", "2", "/", "6", "*", "-", "4", "-"];
        const result = getPostfixResult(postfixNotation)
        expect(result).toEqual("-8")
    })

    test("should not return NAN if a given expression begins with subtraction sign", () => {
        const postfixNotation = ["5", "-", "3", "+", "4", "2", "/", "6", "*", "-", "4", "-"];
        const result = getPostfixResult(postfixNotation)
        expect(result).toEqual("-18")
    })
});