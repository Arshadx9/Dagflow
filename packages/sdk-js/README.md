# @dagflo/sdk

Official Node.js SDK for **DagFlo** — a distributed workflow orchestration engine that handles reliable step execution, DAG scheduling, automatic retries, and resilience to server crashes.

## Installation

```bash
npm install @dagflo/sdk
```

Or with yarn:

```bash
yarn add @dagflo/sdk
```

## Quick Start

### 1. Create a Workflow

```typescript
import { DagFloClient } from '@dagflo/sdk'

const client = new DagFloClient({
  apiKey: 'your-api-key',
  baseUrl: 'http://localhost:3000' // Your DagFlo API server
})

// Define a workflow with steps
const workflow = client.workflow('coffee-shop-order')
  .step('charge-card', {
    type: 'http',
    method: 'POST',
    url: 'https://payment-api.com/charge'
  })
  .step('pack-order', {
    type: 'http',
    method: 'POST',
    url: 'https://warehouse-api.com/pack'
  })
  .dependsOn('charge-card')
  .step('send-sms', {
    type: 'http',
    method: 'POST',
    url: 'https://sms-api.com/send'
  })
  .dependsOn('pack-order')

// Register the workflow
await workflow.register()
```

### 2. Trigger a Workflow

```typescript
// Start a workflow run
const result = await client.trigger('coffee-shop-order', {
  input: {
    orderId: '12345',
    customerId: 'cust-789',
    amount: 45.99
  }
})

console.log(`Run started: ${result.runId}`)
console.log(result.message) // "Run triggered successfully"
```

### 3. Check Run Status

```typescript
// Get the status of a running workflow
const status = await client.getRunStatus(result.runId)

console.log(status)
// {
//   jobid: '...',
//   status: 'RUNNING',
//   steps: [
//     { stepid: 'charge-card', status: 'FINISHED', output: {...} },
//     { stepid: 'pack-order', status: 'RUNNING', ... },
//     { stepid: 'send-sms', status: 'PENDING', ... }
//   ]
// }
```

---

## API Reference

### `DagFloClient`

Main entry point for interacting with DagFlo.

#### Constructor

```typescript
new DagFloClient(options: DagFloClientOptions)
```

**Options:**
- `apiKey` (string, required): Authentication token for your DagFlo server
- `baseUrl` (string, required): Base URL of your DagFlo API (e.g., `http://localhost:3000`)

**Throws:**
- Error if `apiKey` or `baseUrl` is missing

#### Methods

##### `trigger(workflowId: string, options?: TriggerOptions): Promise<TriggerResult>`

Start a new workflow execution.

**Parameters:**
- `workflowId` (string): ID or name of the registered workflow
- `options.input` (any, optional): Input data passed to the workflow steps

**Returns:**
```typescript
{
  runId: string        // Unique identifier for this run
  message: string      // Status message
}
```

**Example:**
```typescript
const result = await client.trigger('my-workflow', {
  input: { userId: 123, action: 'process' }
})
```

##### `workflow(name: string): WorkflowBuilder`

Create a new workflow definition.

**Parameters:**
- `name` (string): Name of the workflow

**Returns:** `WorkflowBuilder` instance for chaining step definitions

**Example:**
```typescript
const builder = client.workflow('email-campaign')
```

##### `getRunStatus(runId: string): Promise<RunStatus>`

Fetch the current execution status of a workflow run.

**Parameters:**
- `runId` (string): The run ID returned from `trigger()`

**Returns:**
```typescript
{
  jobid: string
  status: 'PENDING' | 'RUNNING' | 'FINISHED' | 'FAILED'
  steps: StepRun[]
  startTime?: Date
  endTime?: Date
  // ... other metadata
}
```

**Example:**
```typescript
const status = await client.getRunStatus('run-abc-123')
if (status.status === 'FINISHED') {
  console.log('Workflow completed successfully')
}
```

---

### `WorkflowBuilder`

Fluent builder for defining workflow DAGs.

#### Methods

##### `step(id: string, config: any): WorkflowBuilder`

Add a step to the workflow.

**Parameters:**
- `id` (string): Unique identifier for this step
- `config` (object): Step configuration (e.g., HTTP endpoint, timeout, retry policy)

**Returns:** `this` (for method chaining)

**Example:**
```typescript
builder
  .step('validate-email', {
    url: 'https://api.example.com/validate',
    method: 'POST',
    timeout: 5000
  })
  .step('send-confirmation', {
    url: 'https://api.example.com/send-email',
    method: 'POST'
  })
```

##### `dependsOn(...stepIds: string[]): WorkflowBuilder`

Set dependencies for the most recently added step.

**Parameters:**
- `stepIds` (string[]): IDs of steps that must complete before this step runs

**Returns:** `this` (for method chaining)

**Important:** Call immediately after `.step()` to set dependencies for that step.

**Example:**
```typescript
builder
  .step('step-1', { url: '...' })
  .step('step-2', { url: '...' })
  .dependsOn('step-1')      // step-2 waits for step-1
  .step('step-3', { url: '...' })
  .dependsOn('step-1', 'step-2')  // step-3 waits for both
```

##### `async register(): Promise<void>`

Register the workflow definition with the DagFlo server.

**Throws:**
- Error if registration fails (network error, auth error, etc.)

**Example:**
```typescript
try {
  await builder.register()
  console.log('Workflow registered successfully')
} catch (error) {
  console.error('Failed to register workflow:', error.message)
}
```

---

### `TriggerClient`

Low-level client for triggering workflow runs. (Usually not needed; use `DagFloClient.trigger()` instead.)

#### Constructor

```typescript
new TriggerClient(options: DagFloClientOptions)
```

#### Methods

##### `async trigger(workflowId: string, options?: TriggerOptions): Promise<TriggerResult>`

Same as `DagFloClient.trigger()`, but includes built-in circuit breaker for fault tolerance.

---

### `CircuitBreaker`

Fault-tolerance pattern implementation that automatically halts requests to failing services.

#### Constructor

```typescript
new CircuitBreaker(maxFailure?: number, timeout?: number)
```

**Parameters:**
- `maxFailure` (number, default: 3): Number of consecutive failures before opening the circuit
- `timeout` (number, default: 30000): Milliseconds to wait in OPEN state before attempting HALF_OPEN

#### States

- **CLOSED**: Normal operation, requests pass through
- **OPEN**: Failures exceeded; requests are blocked with an error
- **HALF_OPEN**: Testing if the service recovered; first request is allowed

#### Methods

##### `async execute<T>(operation: () => Promise<T> | T): Promise<T>`

Execute an async operation with circuit breaker protection.

**Parameters:**
- `operation` (function): Async function to execute

**Returns:** Result of the operation

**Throws:**
- Original error if operation fails and failures are below threshold
- `"Circuit is Open"` error if circuit is open

**Example:**
```typescript
const breaker = new CircuitBreaker(3, 30000)

try {
  const result = await breaker.execute(() =>
    axios.post('https://external-api.com/data', payload)
  )
} catch (error) {
  if (error.message === 'Circuit is Open, Request blocked') {
    console.log('Service is down, circuit breaker is protecting us')
  }
}
```

---

## Complete Example: Full Workflow Lifecycle

```typescript
import { DagFloClient } from '@dagflo/sdk'

async function coffeeShopWorkflow() {
  const client = new DagFloClient({
    apiKey: 'sk_test_abc123xyz789',
    baseUrl: 'http://localhost:3000'
  })

  // Step 1: Define workflow
  const workflow = client.workflow('process-order')
    .step('charge-card', {
      url: 'https://payment.example.com/charge',
      method: 'POST',
      timeout: 10000
    })
    .step('warehouse-pack', {
      url: 'https://warehouse.example.com/pack',
      method: 'POST'
    })
    .dependsOn('charge-card')
    .step('send-notification', {
      url: 'https://notify.example.com/sms',
      method: 'POST'
    })
    .dependsOn('warehouse-pack')
    .step('add-loyalty-points', {
      url: 'https://loyalty.example.com/points',
      method: 'POST'
    })
    .dependsOn('send-notification')

  // Step 2: Register workflow (one-time setup)
  try {
    await workflow.register()
    console.log('✓ Workflow registered')
  } catch (error) {
    console.error('Failed to register workflow:', error)
    return
  }

  // Step 3: Trigger a run
  const order = {
    orderId: 'ord-2024-001',
    customerId: 'cust-123',
    items: ['coffee', 'pastry'],
    total: 12.99
  }

  const { runId, message } = await client.trigger('process-order', {
    input: order
  })

  console.log(`✓ Run started: ${runId}`)
  console.log(`  Message: ${message}`)

  // Step 4: Poll for completion
  let status = await client.getRunStatus(runId)
  
  while (status.status === 'RUNNING' || status.status === 'PENDING') {
    console.log(`Current status: ${status.status}`)
    
    // Wait 2 seconds before polling again
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    status = await client.getRunStatus(runId)
  }

  if (status.status === 'FINISHED') {
    console.log('✓ Workflow completed successfully!')
    console.log(JSON.stringify(status, null, 2))
  } else if (status.status === 'FAILED') {
    console.error('✗ Workflow failed')
    console.error(JSON.stringify(status, null, 2))
  }
}

// Run it
coffeeShopWorkflow().catch(console.error)
```

---

## Error Handling

The SDK throws errors in these cases:

| Error | Cause | Solution |
|-------|-------|----------|
| `"apiKey is required"` | Missing API key in constructor | Pass `apiKey` in options |
| `"baseUrl is required"` | Missing base URL in constructor | Pass `baseUrl` in options |
| `"workflowid required"` | Trigger called without workflow ID | Provide workflow ID as first parameter |
| `"Circuit is Open, Request blocked"` | Service is failing (circuit breaker) | Wait for timeout, service will recover |
| Network errors (axios) | Connection to DagFlo failed | Check baseUrl and network connectivity |
| HTTP 401 | Invalid or expired API key | Verify your API key |
| HTTP 404 | Workflow not found | Register workflow first with `.register()` |

---

## How DagFlo Protects Your Workflows

### Problem: Server Crashes Mid-Workflow

If your DagFlo server crashes after Step 1 finishes but before Step 2 enqueues:

```
Step 1: Charge card ✓ (persisted to database)
Server crashes
→ Step 2 is NOT lost
→ When server restarts, it re-checks the DAG
→ Finds Step 1 is finished, Step 2 dependencies satisfied
→ Automatically enqueues Step 2
→ No double charge, no lost steps
```

### Problem: API Timeouts and Retries

Each step has configurable retry logic:

```typescript
.step('flaky-api', {
  url: 'https://sometimes-down-api.com',
  retries: 3,
  backoff: { type: 'exponential', delay: 2000 }
})
```

### Problem: Too Many Concurrent Runs

DagFlo queues jobs in Redis and workers process them in order:

```
500 orders arrive
→ All 500 queued in BullMQ
→ Workers execute steps in order
→ No overwhelming the APIs
→ Each order tracked independently
```

---

## Testing

Example test with mocked API:

```typescript
import { DagFloClient } from '@dagflo/sdk'

test('should trigger a workflow', async () => {
  const client = new DagFloClient({
    apiKey: 'test-key',
    baseUrl: 'http://localhost:3000'
  })

  const result = await client.trigger('test-workflow', {
    input: { testData: 'value' }
  })

  expect(result).toHaveProperty('runId')
  expect(result).toHaveProperty('message')
})
```

---

## Troubleshooting

### "Circuit is Open" errors repeatedly

**Problem:** The circuit breaker keeps blocking requests.

**Solution:**
- Check if the DagFlo server is running and reachable
- Verify `baseUrl` is correct
- Check API key validity
- Look at server logs for issues

### Workflow not triggering

**Problem:** `trigger()` returns an error or hangs.

**Possible causes:**
- Workflow not registered yet (call `.register()` first)
- Workflow ID mismatch (use exact ID/name)
- Invalid API key
- Network connectivity issue

**Debug:**
```typescript
try {
  const status = await client.getRunStatus('known-run-id')
  console.log('Server is reachable:', status)
} catch (error) {
  console.error('Server connection failed:', error.message)
}
```

### Steps not executing in order

**Problem:** Steps execute out of order or in parallel when they shouldn't.

**Solution:**
- Verify dependencies are set with `.dependsOn()` immediately after `.step()`
- Check that step IDs match exactly (case-sensitive)
- Confirm workflow was re-registered after changes

```typescript
// ✓ Correct
.step('step-a', {...})
.step('step-b', {...})
.dependsOn('step-a')

// ✗ Wrong (dependency lost)
.step('step-a', {...})
.step('step-b', {...})
.step('step-c', {...})
.dependsOn('step-a')  // applies to step-c, not step-b
```

---

## Contributing

To contribute improvements to the SDK:

1. Fork the repository
2. Make changes in `packages/sdk-js/src/`
3. Run `npm run build` to compile TypeScript
4. Submit a pull request

---

## License

ISC

---

## Support

For issues, questions, or feature requests:
- Check the [DagFlo main repository](https://github.com/dagflo/dagflo)
- Open an issue on the GitHub repository
- Contact the DagFlo team

---

## Changelog

### v1.0.6
- Initial stable release
- Support for workflow definition, triggering, and status polling
- Built-in circuit breaker for resilience
