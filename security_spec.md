# Security Specification — Ittala Dias Corretora Firestore Rules

## 1. Data Invariants
- `developments`: Public read access for published real estate developments. Only authenticated admins may create, update, or delete developments.
- `landingPages`: Public read access for active landing pages. Only authenticated admins may create, update, or delete landing pages.
- `settings`: Public read access for broker identity and institutional info. Only authenticated admins may update settings.
- `leads`: Strictly private PII. Public write (create only) for lead capture with strict validation (required name, whatsapp, lgpdConsent). Reading, updating status, notes, or deleting leads is restricted exclusively to authenticated admins.
- `analyticsEvents`: Public create only for telemetry (page views, clicks). Read restricted to admins.

## 2. Dirty Dozen Attack Payloads Mitigated
1. **Unauthenticated Lead Scraping**: Blocked by `allow read, list: if isSignedIn()`.
2. **Visitor Modifying Real Estate Price**: Blocked by restricting `update` to `isSignedIn()`.
3. **Visitor Deleting Development**: Blocked by restricting `delete` to `isSignedIn()`.
4. **Lead Injection without Consent**: Blocked by checking `request.resource.data.lgpdConsent == true`.
5. **Payload Oversizing Attack**: Blocked by `size() <= max` string length limits.
6. **Admin Settings Tampering**: Blocked by restricting write on `/settings/{id}` to `isSignedIn()`.
7. **Lead Status Modification by Outsider**: Blocked by restricting `update` on `/leads/{id}` to `isSignedIn()`.
8. **Malicious Extra Fields Injection**: Enforced with key checks.
9. **Junk ID Path Poisoning**: Validated with ID constraints.
10. **Cross-Tenant Mutation**: Verified authenticated users.
11. **Landing Page Hijack**: Only authenticated users can mutate landing pages.
12. **Analytics Deletion**: Delete blocked for non-admins.
