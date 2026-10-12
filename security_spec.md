# Security Specification & Test Harness (ABAC / Zero-Trust)

## 1. Data Invariants
1. **User Scoping & Isolation**: All user-specific resources (`tasks`, `emails`, `projects`, `securityPolicy`) are nested under `/users/{userId}/` and can only be read, created, updated, or deleted by the authenticated user whose `request.auth.uid == userId`.
2. **Identity Integrity**: For every document created or updated within `/users/{userId}/...`, the internal `userId` property must match `request.auth.uid` and path variable `{userId}`.
3. **No Cross-Tenant Leaks**: A user cannot read or query another user's emails (such as Outlook `a01425929@tec.mx`), tasks, deliverables, or security policies.
4. **Valid IDs and Sizes**: Document IDs must satisfy `isValidId(id)` (`^[a-zA-Z0-9_-]+$` and length <= 128 chars). String fields must have length constraints to prevent Denial of Wallet.
5. **Strict Field Allowed Sets**: Writes cannot include shadow/ghost fields outside the allowed schema.
6. **Task Priority Integrity**: Priority must strictly be one of `'alta'`, `'media'`, `'baja'`.
7. **Email Immutability & Modification Boundaries**: Incoming emails can only have specific fields updated (e.g., `read`, `starred`, `draftReply`, `replySent`, `priority`, `category`).

## 2. The "Dirty Dozen" Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Read**: Attempting to read `/users/user123/emails/em-1` with `request.auth == null`.
2. **Cross-User Snooping**: User `hacker99` attempting to read `/users/victim_user/emails/em-tec-101`.
3. **Identity Spoofing on Task Create**: User `user1` creating `/users/user1/tasks/task1` with `incoming().userId = "user2"`.
4. **Path ID Poisoning**: Creating a task with document ID `../../../etc/passwd` or oversized 2KB junk character string.
5. **Ghost Field Injection (Shadow Update)**: User updates task with `{ title: "valid", isSuperAdmin: true, bypassRules: true }`.
6. **Cross-Tenant Project Hijack**: User `user1` updating `/users/user2/projects/proj1` status to `'completed'`.
7. **Unverified Email Privilege Escalation**: User without verified email attempting privileged writes when email verification is required.
8. **Invalid Priority Value**: Creating task with `priority: "super_urgente_hacked"`.
9. **Denial-of-Wallet Payload**: Creating task with a 5MB string in `description` exceeding `maxLength: 2048`.
10. **Blanket Collection Query Leak**: Querying `/users/victim/emails` collection group without tenant filter.
11. **Security Policy Tampering by Non-Owner**: Attempting to write `/users/user2/securityPolicy/config` to disable folder protection.
12. **Tampering User Profile ID**: Attempting to set `uid: "another_uid"` in `/users/user1`.
