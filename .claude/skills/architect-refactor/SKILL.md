---
name: architect-refactor
description: >
  Executes a refactoring plan phase by phase, moving files, updating imports, and pausing
  between phases for developer confirmation. Use this skill whenever the user wants to execute
  a refactor, apply an architect plan, move files per their architecture blueprint, or says
  "do the refactor", "execute phase 1", "start refactoring". Trigger even if the user just
  says "let's do it" after a planning session, or "go ahead with the plan".
metadata:
  version: "1.0"
  author-email: "nguyenphuoc4805@gmail.com"
  last-updated: "2026-05-11"
---

# architect-refactor

You are executing a developer's refactoring plan one phase at a time. The goal is safe,
incremental restructuring — the developer controls the pace, you do the work precisely and
explain everything before you touch a file.

## Before you do anything: check for the plan

Look for `.architect/plan.md` in the project root.

If it does not exist, stop immediately and output:

```
❌ No refactoring plan found.

Run `/architect-plan` first to generate a plan, then invoke `/architect-refactor` to execute it.
```

Do not modify any files if the plan is missing.

## Architectural constraints you must follow

The following rules come from the **React Single Page Application** architecture blueprint. Treat them as
hard constraints — they are not suggestions. Every file move you make must end up satisfying
these rules.

- ui_component -> src/components
  Rule: Components render UI from props and delegated hooks instead of embedding network or business logic. A component that calls fetch() or a service directly cannot be rendered in isolation during testing.
  Example:
    // src/components/user-card.tsx — receives data, never fetches it
    import type { User } from '@/types';
    
    export function UserCard({ user }: { user: User }) {
      return (
        <article>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </article>
      );
    }

- state_logic -> src/hooks
  Rule: Reusable stateful behaviour belongs in hooks so pages and components stay declarative. A hook name must start with 'use'. If the same useState/useEffect block appears in two components, extract it into a shared hook.
  Example:
    // src/hooks/use-users.ts — all user-list state in one place
    import { useState, useEffect } from 'react';
    import { listUsers } from '@/services/users';
    import type { User } from '@/types';
    
    export function useUsers() {
      const [users, setUsers] = useState<User[]>([]);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        void listUsers().then((data) => {
          setUsers(data);
          setLoading(false);
        });
      }, []);
    
      return { users, loading };
    }

- api_access -> src/services
  Rule: HTTP calls and third-party integrations belong in services that hooks and components consume. Services are plain async functions — they do not call useState or useEffect. This makes them independently testable with mocked fetch.
  Example:
    // src/services/users.ts — network logic isolated from React
    import type { User } from '@/types';
    
    export async function listUsers(): Promise<User[]> {
      const response = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json() as Promise<User[]>;
    }

If the above block is empty, use your best judgment based on the stack and the plan itself.

## Anti-patterns to avoid

After each step, verify you have not introduced any of the following:

- business_logic_in_components [warning]
  Business logic (validation, data transformation, API calls) is embedded directly in UI components. This makes the component impossible to render in isolation during testing and ties UI to network behaviour.
  Bad example:
    export function SignupForm() {
      const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const payload = validateSignup(new FormData(event.currentTarget));
        await fetch('/api/signup', { method: 'POST', body: JSON.stringify(payload) });
      };
      return <form onSubmit={handleSubmit}>...</form>;
    }
  Good example:
    // Component delegates to a hook; hook delegates to a service
    export function SignupForm() {
      const { submit, error } = useSignupForm();
      return <form onSubmit={submit}>{error && <p>{error}</p>}</form>;
    }

- inline_api_calls_in_render [critical]
  API calls occur directly during render (outside of useEffect or an async event handler). Each re-render triggers another network request, leading to request storms and race conditions.
  Bad example:
    export function UsersPage() {
      // called on every render — network storm
      fetch('/api/users').then(() => undefined);
      return <div>Loading...</div>;
    }
  Good example:
    export function UsersPage() {
      const { users, loading } = useUsers();
      if (loading) return <div>Loading...</div>;
      return <UsersList users={users} />;
    }

- array_index_as_key [warning]
  Using the array index as the React 'key' prop on list items causes silent reconciliation bugs when the list is reordered, filtered, or items are inserted or deleted. React uses the key to match elements between renders — an index-based key can swap component state to the wrong item.
  Bad example:
    // key={index} breaks when items are reordered or deleted
    {users.map((user, index) => (
      <UserCard key={index} user={user} />
    ))}
  Good example:
    // Stable unique id from the data model — safe for any list mutation
    {users.map((user) => (
      <UserCard key={user.id} user={user} />
    ))}

If the above block is empty, at minimum: do not put business logic in route handlers, do not
hardcode secrets, do not create circular imports.

## How to execute the plan

### 1. Read the plan

Read `.architect/plan.md` in full. Identify which phase comes next — look for the first phase
that still has unchecked steps (`- [ ]`). If all steps in a phase are already checked (`- [x]`),
skip to the next phase. This lets you resume after a previous partial run.

### 2. Execute the current phase, step by step

For each unchecked step in the current phase:

**Before touching the file**, state in the chat:
> "Step N.M: Moving `<source>` → `<target>`. Reason: <why from the plan>. Updating imports in: <files>."

Then:
1. Create the target directory if it doesn't exist
2. Move or create the file as specified
3. Update all imports listed in the step's "Imports to update" field, using the exact
   old-path → new-path substitutions specified (not just the file list)
4. If the step has a "Verify:" line, run the grep command it specifies. If it returns results,
   fix the remaining references before proceeding — do not mark the step done with known
   orphaned imports
5. Verify the project still makes sense (no obviously broken imports left behind)
6. Mark the step as done in `.architect/plan.md` by changing `- [ ]` to `- [x]`

If a step would create a circular dependency, skip it, explain why in the chat, and continue
with the next step.

### 3. After completing all steps in the phase, pause

Output exactly this (replacing the placeholders):

```
✅ Phase N complete: <phase name>

Steps executed:
- [x] Step N.1: <description>
- [x] Step N.2: <description>
...

Proceed to Phase N+1 (<next phase name>)? **yes / no**
```

Then stop. Wait for the developer to respond before touching Phase N+1.

If there is no next phase, output:

```
✅ All phases complete.

The refactoring is done. Run `architect scan .` to measure the improvement in your health score.
```

### 4. On developer confirmation

If the developer says yes (or "continue", "proceed", "go ahead"), execute the next phase
following the same step-by-step process.

If the developer says no (or "stop", "wait", "pause"), stop and confirm:
> "Paused after Phase N. The plan in `.architect/plan.md` is up to date — all completed steps
> are checked. Run `/architect-refactor` again when you're ready to continue."

## Important: what NOT to do

- Do not skip the pre-flight plan check — refactoring without a plan risks breaking the codebase
- Do not execute more than one phase per invocation unless the developer explicitly asks for all phases
- Do not modify files outside the scope of the current step
- Do not change business logic while moving files — the goal is structural change only
- Do not proceed to Phase N+1 automatically — always wait for the developer's yes/no
