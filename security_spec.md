# Security Specification for ZenTask AI

## Data Invariants
- A Task cannot exist without a `userId` that matches the authenticated user.
- `createdAt` must be set to the server time during creation and remain immutable.
- `userId` must match `request.auth.uid` and remain immutable.
- `status` and `priority` must match allowed enum values.

## The "Dirty Dozen" Payloads (Deny cases)
1. **Unauthenticated create**: Try to create a task without being logged in.
2. **Identity Spoofing**: Logged in as user A, try to create a task with `userId` of user B.
3. **Ghost Field**: Try to create a task with an extra field `isVerified: true`.
4. **Invalid Enum (Priority)**: Create a task with `priority: "super-high"`.
5. **Invalid Enum (Status)**: Create a task with `status: "waiting"`.
6. **Immutable Field Update (userId)**: Try to update the `userId` of an existing task.
7. **Immutable Field Update (createdAt)**: Try to update the `createdAt` of an existing task.
8. **Malicious ID**: Use a 2KB string as a `taskId`.
9. **Large String**: Set `title` to a 2MB string (resource exhaustion).
10. **Unauthorized Read**: Logged in as user A, try to read user B's task.
11. **Client Timestamp**: Try to set `createdAt` manually to a past date.
12. **Sub-task Injection**: Add extra properties to sub-tasks objects.

## Rule Structure
- Primary logic in `isValidTask()`.
- Access controlled by `isOwner()`.
