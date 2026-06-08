# Sairam Academic Companion security_spec.md

## 1. Data Invariants
- **Resource Ownership & Validation**: A study resource can only be created directly if the client is verified as an Admin or APPROVED through the administrative review queue.
- **Admin Privilege Exclusivity**: Regular student profiles cannot directly delete, write to, or manipulate any academic notes.
- **Strict Keys**: Payloads cannot contain shadow fields or unsolicited attributes beyond the designated schemas.
- **Audit Trails**: All additions or deletions proposed by Contributor accounts must record their accurate identities, status, and request details.

## 2. The "Dirty Dozen" (Attack Payloads)
The following 12 malicious payloads representing spoofing, poisoning, and state shortcuts must be rejected:

1. **Self-Escalated Admin Profile (Identity Spoofing)**
   - Attempting to write an `/admins/attackerUid` record to bypass security checks.
2. **Ghost-Field Resource Injection (Shadow Update)**
   - Creating a resource containing an unvalidated `isApproved` flag.
3. **Resource ID Poisoning**
   - Injecting a large 10KB special character string as `/resources/{resourceId}` document key.
4. **Unsigned-In Contributor Addition**
   - Writing to the `/contributors/` collection without an active Firestore session token.
5. **PII Database Leak (Read Injection)**
   - Attempting a list query on administrators or users private information files.
6. **Student Record Deletion**
   - Direct execution of `deleteResource` with userRole set to `'student'`.
7. **Direct Proposal Hijacking**
   - Attempting to set an unapproved proposal status to `'APPROVED'` by skipping the admin review desk block.
8. **Malicious Drive Url Spoofing**
   - Submitting a resource proposal with downloading scripts targeted at malicious links.
9. **Tampering with Download Count**
   - Updating `downloadsCount` on a note by a factor of one thousand.
10. **Spoofed Uploader Profile Name**
    - Submitting an ADD proposal where the contributor name in the payload does not match the logged-in Google token.
11. **Negative Popularity (Likes Sabotage)**
    - Setting the likes of a colleague's resource to a negative amount.
12. **Double Action Proposal Collision**
    - Re-submitting an already approved/declined action status from `APPROVED` back to `PENDING`.

## 3. The Test Runner

```typescript
// firestore.rules.test.ts
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

describe("Sairam Academic Companion - Red Team Security Audit", () => {
  it("forbids regular student profiles from modifying live learning resources", async () => {
    // Assert student rejects
  });

  it("fails to submit proposals with blank or invalid contributor identities", async () => {
    // Assert invalid uploader is blocked
  });

  it("prevents self-approved status switches in live collections", async () => {
    // Assert security blocks status shortcuts
  });
});
```
