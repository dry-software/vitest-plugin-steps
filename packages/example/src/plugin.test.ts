// Using normal vitest imports - test.step() is added by the plugin!
import {expect, test} from 'vitest'
import {step} from 'vitest-plugin-steps'

test('user login flow (plugin style)', async () => {
    const user = await step('Create test user', async () => {
        return {id: 1, name: 'Test User', email: 'test@example.com'}
    })

    await step('Validate user data', async () => {
        expect(user.id).toBe(1)
        expect(user.name).toBe('Test User')
        expect(user.email).toBe('test@example.com')
    })

    const token = await step('Perform login', async () => {
        return 'mock-jwt-token-12345'
    })

    await step('Verify authentication token', async () => {
        expect(token).toBeDefined()
        expect(token.length).toBeGreaterThan(0)
    })
})

test('nested steps (plugin style)', async () => {
    await step('Setup database', async () => {
        await step('Create connection', async () => {
            throw new Error('Failed to connect to database')
        })

        await step('Run migrations', async () => {
            await step('Create users table', async () => {
                // simulate migration
            })

            await step('Create posts table', async () => {
                // simulate migration
            })
        })
    })

    await step('Run tests', async () => {
        expect(true).toBe(true)
    })
})
