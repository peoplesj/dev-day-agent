# IT Standard Operating Procedure — VPN Access

**Version:** 2.1
**Owner:** IT Operations
**Last updated:** May 1, 2026

---

## Scope

This SOP covers VPN access provisioning, troubleshooting, and offboarding for all Acme Corp employees.

---

## Approved VPN Client

- Client: Cisco AnyConnect
- Minimum version: v4.10.08
- Server: vpn.acme.corp

---

## Provisioning — New Employees

1. Submit an IT access request via the #help-it channel or IT portal
2. IT provisions credentials within 1 business day
3. Employee installs AnyConnect from Self Service
4. Employee connects to vpn.acme.corp using SSO credentials

---

## Troubleshooting — Common Issues

### 10-minute disconnect loop
- Cause: AnyConnect cache corruption (known issue in v4.10.07)
- Fix: Quit AnyConnect fully, clear cache at ~/Library/Application Support/Cisco, reinstall v4.10.08+

### SSO authentication failure
- Run `kinit` in terminal and retry

### DNS resolution failures after connect
- Flush DNS: `sudo dscacheutil -flushcache`
- If unresolved, open a ticket in #help-it

---

## Offboarding

VPN access is revoked automatically within 24 hours of account deactivation. No manual action required.

---

## Escalation

Unresolved issues after following this SOP → open a ticket in #help-it or contact it-ops@acme.corp.
