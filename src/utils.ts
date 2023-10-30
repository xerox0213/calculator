export function getTokens(expression: string): string[] {
    return expression.split(/([\-\+\/\*])/).filter((token: string) => token !== "")
}

export function isExpressionValid(expression: string): boolean {
    return /[^\-\+\/\*\.]$/.test(expression)
}
