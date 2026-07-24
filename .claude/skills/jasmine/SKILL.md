---
name: jasmine
description: Write and run JavaScript/TypeScript unit tests with Jasmine (Angular's default via karma-jasmine, standalone Node/browser projects)
---

# Jasmine

Reference: https://jasmine.github.io/pages/docs_home.html

## Detecting Jasmine in a project

- Angular CLI projects (`angular.json` present) that haven't opted into an alternate test builder — `ng test` runs Karma + Jasmine by default
- `package.json` has `jasmine`, `karma-jasmine`, or `jasmine-core` in `devDependencies`
- A `karma.conf.js` listing `frameworks: ['jasmine']`, or a standalone `spec/support/jasmine.json`

## Setup

Standalone Node project:
```bash
npm install --save-dev jasmine
npx jasmine init
```

Angular (already the default — nothing to install):
```bash
ng test
```

## File naming & location

- Angular: `*.spec.ts`, co-located next to the file it tests (e.g. `user.service.spec.ts` beside `user.service.ts`) — this is generated automatically by `ng generate`
- Standalone Node: files under `spec/` matching `spec/support/jasmine.json`'s `spec_files` glob (default `spec/**/*[sS]pec.js`)

## Basic syntax

```typescript
describe('Sum', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toEqual(3)
  })
})
```

- `describe` groups specs, `it` defines one spec, `expect().<matcher>` asserts
- `xdescribe` / `xit` to temporarily skip; `fdescribe` / `fit` to focus a single suite/spec during local debugging — never commit these

## Common matchers

- `toBe` (===), `toEqual` (deep), `toMatch` (regex/string), `toBeDefined`, `toBeUndefined`, `toBeNull`
- `toBeTruthy` / `toBeFalsy`, `toContain` (array/string), `toBeCloseTo` (floats), `toThrow` / `toThrowError`
- Negate any matcher: `expect(x).not.toBe(y)`

## Spies (Jasmine's mocking)

```typescript
const spy = jasmine.createSpy('callback')

spyOn(service, 'getUser').and.returnValue(of(mockUser))
spyOn(service, 'getUser').and.callThrough()   // call the real implementation, but still track calls
spyOn(service, 'getUser').and.throwError('boom')

expect(spy).toHaveBeenCalled()
expect(spy).toHaveBeenCalledWith('id-123')
```

- `spyOn` replaces an existing method on a real object — the object/method must already exist, unlike `jasmine.createSpy` which fabricates a standalone function
- Angular components/services are typically spied on via `TestBed`-provided instances, not constructed directly

## Async tests

```typescript
it('resolves data', async () => {
  const result = await fetchData()
  expect(result).toEqual({ ok: true })
})

it('calls back eventually', (done) => {
  doSomethingAsync(() => {
    expect(true).toBe(true)
    done()
  })
})
```

- Prefer `async`/`await` for promise-based code; use the `done` callback only for legacy callback-style APIs
- A spec with a `done` parameter that's never called times out rather than failing fast — double-check every code path calls it

## Setup & teardown

- `beforeEach` / `afterEach` per spec, `beforeAll` / `afterAll` once per `describe` block
- Angular: `TestBed.configureTestingModule({...})` inside `beforeEach` is the standard way to set up a component/service under test

## Testing Angular components

```typescript
describe('UserComponent', () => {
  let fixture: ComponentFixture<UserComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UserComponent] }).compileComponents()
    fixture = TestBed.createComponent(UserComponent)
  })

  it('renders the user name', () => {
    fixture.componentInstance.user = mockUser
    fixture.detectChanges()
    expect(fixture.nativeElement.textContent).toContain(mockUser.name)
  })
})
```

- `fixture.detectChanges()` must be called explicitly to flush Angular's change detection after mutating component state
- `HttpClientTestingModule` / `provideHttpClientTesting()` + `HttpTestingController` for mocking HTTP calls instead of spying on the raw client

## Running tests

```bash
ng test                     # Angular: runs Karma + Jasmine, watch mode by default
ng test --watch=false        # single run — use this in CI / scripted verification
ng test --include='**/user.service.spec.ts'   # single file
npx jasmine                  # standalone Node project, full suite
npx jasmine spec/sumSpec.js  # standalone: single file
```
