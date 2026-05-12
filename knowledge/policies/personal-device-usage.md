# Pronto — Personal Device & Laptop Usage Policy

**Document ID:** PRONTO-IT-POL-2024-007  
**Effective Date:** January 15, 2024  
**Last Revised:** March 1, 2025  
**Owner:** Pronto IT Security & Compliance  
**Classification:** Internal Use Only  
**Approval Authority:** Chief Information Security Officer (CISO)

---

## 1. Purpose

This Standard Operating Procedure defines the acceptable use of personal devices (including laptops, tablets, smartphones, and other computing equipment) for accessing Pronto systems, data, and networks. This policy exists to protect organizational assets while enabling workforce flexibility.

## 2. Scope

This policy applies to all full-time employees, part-time employees, contractors, temporary workers, and interns who access Pronto resources using personally-owned devices. It covers all personal computing devices capable of storing, processing, or transmitting Pronto data.

## 3. Definitions

- **Personal Device:** Any computing device not purchased or owned by Pronto, including personal laptops, smartphones, tablets, and home desktops.
- **Company-Issued Device:** Hardware procured, configured, and managed by the IT department and assigned to an employee.
- **MDM (Mobile Device Management):** Software deployed to manage, monitor, and secure employee devices that access corporate resources.
- **BYOD (Bring Your Own Device):** The practice of employees using personal devices for work purposes.

## 4. General Policy Statement

Employees are permitted to use personal devices for work purposes only after completing the BYOD enrollment process and receiving explicit written approval from their direct manager and the IT Security team. Use of personal devices without enrollment is strictly prohibited and may result in disciplinary action.

Company-issued devices remain the primary and preferred method for accessing all internal systems. Personal devices are considered supplementary and are subject to additional restrictions.

## 5. Eligibility and Enrollment

### 5.1 Eligibility
All full-time employees in good standing are eligible to enroll personal devices. Contractors and temporary workers require VP-level approval and are limited to email and messaging access only.

### 5.2 Enrollment Process
1. Submit a BYOD enrollment request via the IT Service Portal (ServiceNow).
2. Receive manager approval within the ticketing system.
3. Schedule a device assessment with IT Security (typically 24-48 hours).
4. Install the Pronto MDM agent (currently Microsoft Intune).
5. Complete the BYOD Security Awareness training module (approximately 20 minutes).
6. Receive confirmation of enrollment and permitted access levels.

### 5.3 Device Requirements
Personal devices must meet the following minimum standards:
- Operating system must be within two major versions of the current release (e.g., macOS 14+, Windows 11, iOS 17+, Android 14+).
- Device must support full-disk encryption and have it enabled.
- Device must have a passcode or biometric lock enabled with auto-lock after 5 minutes of inactivity.
- Device must not be jailbroken, rooted, or running unofficial firmware.
- Antivirus/endpoint protection must be installed and current (provided free by IT upon enrollment).

## 6. Permitted Activities on Personal Devices

Enrolled personal devices may be used for:
- Accessing Pronto email via the approved Outlook mobile app or web client.
- Using approved collaboration tools (Slack, Zoom, Google Workspace).
- Viewing and editing documents in cloud-based applications (Google Drive, Confluence).
- Accessing non-sensitive internal portals and knowledge bases.
- Two-factor authentication via authenticator apps.

## 7. Prohibited Activities on Personal Devices

The following activities are strictly prohibited on personal devices:
- Downloading or storing classified, restricted, or PII data locally on the device.
- Accessing production databases, infrastructure consoles (AWS, GCP), or CI/CD pipelines.
- Processing payment card information or financial records.
- Storing credentials, API keys, or secrets outside of the approved password manager.
- Connecting to the corporate VPN without MDM enrollment active.
- Using personal devices as the sole device for on-call or incident response duties.
- Sharing the device with family members or third parties while Pronto accounts are active.
- Disabling, circumventing, or uninstalling the MDM agent while enrolled.

## 8. Security Requirements

### 8.1 Network Access
Personal devices must connect through the Zero Trust Network Access (ZTNA) gateway. Direct VPN access is not available for personal devices. All traffic from personal devices is routed through the security inspection layer.

### 8.2 Data Handling
Company data accessed on personal devices must remain within managed applications. Copy/paste between managed and unmanaged applications is restricted by MDM policy. Employees must not take screenshots of sensitive data or forward Pronto information to personal email accounts.

### 8.3 Remote Wipe
By enrolling in the BYOD program, employees consent to selective remote wipe of Pronto data and managed applications in the event of device loss, theft, employee termination, or policy violation. Personal files and applications will not be affected by a selective wipe. Full device wipe will only be performed if a selective wipe fails and sensitive data exposure is confirmed.

### 8.4 Monitoring
The MDM agent monitors compliance status, application inventory within the managed container, and device security posture. Pronto does not monitor personal browsing, personal applications, or personal files outside the managed workspace.

## 9. Incident Reporting

Employees must report the following within 1 hour of discovery:
- Loss or theft of an enrolled personal device.
- Suspected unauthorized access to Pronto data on the device.
- Malware detection or unusual device behavior.
- Damage rendering the device inoperable while Pronto data may be at risk.

Reports should be submitted via the IT Security Hotline (Slack: #it-security-urgent) or by emailing security-incidents@pronto.com.

## 10. Non-Compliance

Violations of this policy may result in:
- Immediate revocation of BYOD privileges.
- Remote wipe of managed applications and data.
- Formal written warning documented in HR file.
- Termination of employment for severe or repeated violations.
- Legal action if data breach results from negligence.

## 11. Exceptions

Exceptions to this policy require written approval from the CISO and the employee's VP. Exception requests must include a business justification, risk assessment, and proposed compensating controls. Exceptions are reviewed quarterly and may be revoked at any time.

## 12. Policy Review

This policy is reviewed annually by the IT Security & Compliance team, or more frequently if regulatory changes, security incidents, or organizational changes necessitate updates. Employees will be notified of material changes via email and are required to re-acknowledge the policy within 14 days.

---

**Contact:** IT Security & Compliance — #it-security on Slack | it-security@pronto.com  
**Related Policies:** IT-POL-2024-003 (Acceptable Use Policy), IT-POL-2024-005 (Data Classification Standard), HR-POL-2023-012 (Remote Work Policy)
