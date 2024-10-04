

# Detailed Specification Document for BasedAgent Phased Access Release

## Table of Contents

1. [Overview](#overview)  
2. [Technical Stack](#technical-stack)  
3. [User Flow and Experience](#user-flow-and-experience)  
   1. [Landing Page Content](#landing-page-content)  
   2. [User Registration and Referral Flow](#user-registration-and-referral-flow)  
   3. [Phased Access and Waitlist Management](#phased-access-and-waitlist-management)  
   4. [Notifications and Messaging](#notifications-and-messaging)  
4. [Referral System Implementation](#referral-system-implementation)  
5. [Security and Compliance Considerations](#security-and-compliance-considerations)  
6. [Appendix: Draft Messages for User Communication](#appendix-draft-messages-for-user-communication)  

## 1. Overview

Develop a phased-access platform for BasedAgent with both testnet and mainnet versions. The platform should:

- **Wallet-Only Participation**: Allow users to participate using only their web3 wallets (e.g. Coinbase Smart Wallet) with the requirement to also confirm their email addresses or authenticate with Github before they are officially added to the waitlist.
- **Referral System**: Implement a referral system with unique referral links to incentivize users to invite others.
- **Phased Access Control**: Control access through a whitelist with phased entry based on referral activity and join order.
- **Non-Financial Incentives**: Focus on non-financial incentives during the testnet phase (e.g. moving up the waitlist, earlier access to mainnet).
- **Whitelist Flexibility**: Provide an option to disable the whitelist requirement after a certain period.
- **Admin Panel**: Include an admin panel for managing users, the waitlist, and other administrative tasks.
- **Notifications**: Use on-platform notifications and optional email or messaging app notifications to inform users about their status and updates.
- **Manual Whitelist Addition**: Allow mods to manually add an address to the whitelist irrespective of the waitlist position.

## 2. Technical Stack

- **Frontend**: React.js  
- **Backend**: Node.js with Express.js  
- **Smart Contracts Platform**: Base (Layer 2 on Ethereum)  
- **Wallet Integration**: Coinbase Smart Wallet SDK  
- **Database**: MongoDB or PostgreSQL (based on preference)  
- **Notifications**: Optional email service (e.g. SendGrid), Discord, and Telegram bot integrations  
- **Hosting**: Scalable cloud services (e.g. AWS, Azure, or GCP)  

## 3. User Flow and Experience

### 3.1 Landing Page Content
- **User Visits the Landing Page**:  
   If arriving via a referral link, the referrer's information is stored using cookies or session storage.

### 3.2 User Registration and Referral Flow

- **Connect Wallet Prompt**: "Connect your web3 wallet to join the BasedAgent waitlist."
   - Wallet options: Coinbase Smart Wallet (and others if applicable).
- **Referral Association**: If referral data exists, associate the new user's wallet address with the referrer's wallet address. If no referral data, proceed without association.
- **Waitlist Confirmation Message**:
   - With Referral: "Welcome to BasedAgent! You were invited by [Referrer's Pseudonym or Wallet Address]. You are now #[Waitlist Position] on the waitlist. Share your referral link to move up and gain earlier access!"
   - Without Referral: "Welcome to BasedAgent! You are now #[Waitlist Position] on the waitlist. Invite friends to move up and gain earlier access!"
- **Display Referral Link**: Provide the user with their unique referral link with options to share via social media or copy the link.
- **Optional Notifications**: Prompt users: "Would you like to receive updates about your waitlist status and platform news?"  

### 3.3 Phased Access and Waitlist Management

- **Waitlist Score (WS)** is calculated using the following weighted formula:

```scss
WS = (W_R * NRef) + (W_J * NJoin)
```

   - **W_R** (Weight for Referrals): e.g. 0.7  
   - **W_J** (Weight for Join Order): e.g. 0.3  

   Example calculation for users based on referral count and join order.

### Phased Access Based on Waitlist Position

- **Phase 1**: First 1000 users.  
- **Phase 2**: Next 5000 users.  
- **Phase 3**: Next 10000 users.  
- Continue in increments as needed.

## 3.5 Notifications and Messaging

- **Email Messages**:  
   - Subject: "Your BasedAgent Waitlist Status Update"  
   - Body: "Hello! You are now #[Waitlist Position] on the waitlist. Refer more friends to gain earlier access."  

## 4. Referral System Implementation

- **Unique Referral Links**:  
   Format: `https://basedagent.com/?ref=[UniqueIdentifier]`  
   - **UniqueIdentifier**: A hashed version of the user's wallet address or a generated unique code.
- **Referral Data Storage**:  
   Use cookies or session storage. Ensure the cookie has an appropriate expiration time (e.g. 7 days).
- **Referral Tracking**:  
   Store referrer and referee wallet addresses and track the number of successful referrals per user.  

## 5. Security and Compliance Considerations

- **Data Privacy**: Minimal data collection (only wallet addresses by default). Optional collection of personal data (emails, messaging handles) with explicit user consent.
- **Compliance with Data Protection Laws**: Ensure compliance with regulations (e.g. GDPR).  
- **Terms and Conditions**: Update the Terms of Service and Privacy Policy to reflect platform operations and data handling practices.  

## 6. Appendix: Draft Messages for User Communication

- **Access Granted Notification**:  
   - Subject: "You've Gained Access to BasedAgent's Testnet!"  
   - Body: "Hello! Good news! You've been granted access to BasedAgent's testnet. Connect your wallet to begin exploring our AI Agents."  
