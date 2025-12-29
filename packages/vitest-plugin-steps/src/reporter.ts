import { DefaultReporter } from 'vitest/reporters'
import type { TestCase, Vitest } from 'vitest/node'
import type { Step } from './setup'

export class StepReporter extends DefaultReporter {
    override onInit(ctx: Vitest): void {
        super.onInit(ctx)
        this.renderSucceed = true
    }

    override printTestCase(moduleState: 'pending' | 'passed' | 'failed', testCase: TestCase): void {
        super.printTestCase(moduleState, testCase)

        const meta = testCase.meta()
        const steps = meta.steps as Step[] | undefined

        if (!steps || steps.length === 0) {
            return
        }

        const baseLevel = this.getIndentationLevel(testCase) + 1
        this.printSteps(steps, baseLevel)
    }

    private printSteps(steps: Step[], indentLevel: number): void {
        const indent = '  '.repeat(indentLevel)

        for (const s of steps) {
            const icon = this.getStepIcon(s.status)
            const duration = s.duration !== undefined ? ` \x1b[2m(${s.duration.toFixed(0)}ms)\x1b[0m` : ''

            this.log(` ${indent}${icon} ${s.error ? `\x1b[31m` : ``}${s.name}${s.error ? `\x1b[0m` : ``}${duration}`)

            // if (s.error) {
            //     this.log(` ${indent}  \x1b[31mError: ${s.error.message}\x1b[0m`)
            // }

            if (!s.error && s.children && s.children.length > 0) {
                this.printSteps(s.children, indentLevel + 1)
            }
        }
    }

    private getIndentationLevel(testCase: TestCase): number {
        let level = 1
        let parent = testCase.parent

        while (parent && 'parent' in parent) {
            level++
            parent = (parent as any).parent
        }

        return level
    }

    private getStepIcon(status: Step['status']): string {
        switch (status) {
            case 'passed':
                return '\x1b[32m✓\x1b[0m'
            case 'failed':
                return '\x1b[31m✗\x1b[0m'
            default:
                return '\x1b[33m○\x1b[0m'
        }
    }
}
