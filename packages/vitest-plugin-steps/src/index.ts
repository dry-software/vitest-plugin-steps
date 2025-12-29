import type {Plugin} from 'vite'
import {StepReporter} from "./reporter.js";

export {step, type Step} from './setup.js'

export interface VitestStepsOptions {
    /**
     * Whether to use the custom reporter that displays steps.
     * @default true
     */
    reporter?: boolean
}

/**
 * Vitest plugin that adds Playwright-style test.step() support.
 */
export default function vitestSteps(options: VitestStepsOptions = {}): Plugin {
    const {reporter = true} = options

    return {
        name: 'vitest-plugin-steps',
        config() {
            return {
                test: {
                    setupFiles: ['vitest-plugin-steps/setup'],
                    reporters: reporter ? [new StepReporter()] : undefined
                }
            } as Record<string, unknown>
        }
    }
}

export {StepReporter}
