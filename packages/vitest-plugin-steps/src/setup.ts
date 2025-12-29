import type {} from 'vitest'
import {getCurrentTest} from 'vitest/suite'

export interface Step {
    name: string
    status: 'passed' | 'failed' | 'running'
    duration?: number
    error?: Error
    children?: Step[]
}

declare module 'vitest' {
    interface TaskMeta {
        steps?: Step[]
        _currentStep?: Step | null
    }
}

// Step function implementation
export async function step<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
    const currentTest = getCurrentTest()

    if (!currentTest) {
        return fn()
    }

    currentTest.meta.steps ??= []

    const stepData: Step = {name, status: 'running'}
    const parentStep = currentTest.meta._currentStep

    if (parentStep) {
        parentStep.children ??= []
        parentStep.children.push(stepData)
    } else {
        currentTest.meta.steps.push(stepData)
    }

    currentTest.meta._currentStep = stepData

    const start = performance.now()

    try {
        const result = await fn()
        stepData.status = 'passed'
        stepData.duration = performance.now() - start
        return result
    } catch (error) {
        stepData.status = 'failed'
        stepData.duration = performance.now() - start
        stepData.error = error as Error
        throw error
    } finally {
        currentTest.meta._currentStep = parentStep
    }
}

