# vitest-plugin-steps

Playwright-style test steps for Vitest. Organize your tests into logical steps with detailed reporting.

## Installation

```bash
npm install vitest-plugin-steps
# or
pnpm add vitest-plugin-steps
```

## Setup

Add the plugin to your `vite.config.ts` or `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import vitestSteps from 'vitest-plugin-steps'

export default defineConfig({
  plugins: [vitestSteps()]
})
```

## Usage

Import the `step` function and use it to organize your tests:

```ts
import { expect, test } from 'vitest'
import { step } from 'vitest-plugin-steps'

test('user login flow', async () => {
  const user = await step('Create test user', async () => {
    return { id: 1, name: 'Test User', email: 'test@example.com' }
  })

  await step('Validate user data', async () => {
    expect(user.id).toBe(1)
    expect(user.name).toBe('Test User')
  })

  const token = await step('Perform login', async () => {
    return 'mock-jwt-token'
  })

  await step('Verify authentication token', async () => {
    expect(token).toBeDefined()
  })
})
```

### Nested Steps

Steps can be nested to create hierarchical test structures:

```ts
test('database setup', async () => {
  await step('Setup database', async () => {
    await step('Create connection', async () => {
      // connect to db
    })

    await step('Run migrations', async () => {
      await step('Create users table', async () => {
        // migration logic
      })

      await step('Create posts table', async () => {
        // migration logic
      })
    })
  })
})
```

## Configuration

The plugin accepts the following options:

```ts
vitestSteps({
  // Enable/disable the custom step reporter (default: true)
  reporter: true
})
```

## Custom Reporter

The plugin includes a custom reporter that displays step results in the console output. Each step shows:

- Step name
- Pass/fail status
- Duration in milliseconds
- Error messages for failed steps

## License

Apache-2.0
