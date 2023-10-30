import {getTokens, isExpressionValid} from "../src/utils";
import {describe, expect, test} from "vitest";

describe("isExpressionValid()", () => {
    test("should return true if a given expression is valid", () => {
        const expression = "5+3-4*2/8"
        const result = isExpressionValid(expression)
        expect(result).toBeTruthy()
    })

    describe("should return false", () => {
        test("if a given expression ends with a mathematical sign", () => {
            const expression = "5+3-4*2/8+"
            const result = isExpressionValid(expression)
            expect(result).toBeFalsy()
        })
    })
});

describe("getTokens()", () => {
    test("should return the different tokens of a given expression", () => {
        const expression = "5+3-4*2/8"
        const result = getTokens(expression)
        expect(result).toEqual(["5", "+", "3", "-", "4", "*", "2", "/", "8"])
    })
});