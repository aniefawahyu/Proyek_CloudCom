# Project Fotocopy Ngagel97
## Table of Contents

- [Overview](#overview)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Features and Usage](#features-and-usage)
- [Default User Accounts](#default-user-accounts)
- [Midtrans Mock Payments Guide](#midtrans-mock-payments-guide)

---

## Overview

**Fotocopy Ngagel97 Web Application** is a platform designed to streamline printing services. It provides functionalities for customers to place orders, admins to manage orders, and masters to oversee reports, managing users, and handling products.

This application is part of the **Software Development Project** coursework, showcasing practical application of software engineering principles in building a real-world web-based solution.

The application is hosted and can be accessed online at: [ngagel97.vercel.app](https://ngagel97.vercel.app)


## Setup and Installation

To run this application, follow these steps:

1. Extract the source code to a directory of your choice.

2. Navigate to the project directory:

   ```bash
   cd ngagel97
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables if required. This step is optional if a `.env.local` file is already included in the source code with valid configurations. (See [Environment Variables](#environment-variables)).

5. Start the application in development mode (**recommended to avoid long build times**):

   ```bash
   npm run dev
   ```

6. Alternatively, for production mode:

   ```bash
   npm run start
   ```

7. If necessary, build the application:

   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
MONGODB_URI=mongodb+srv://joygemilang17:MXqZCvgq7cgB81qn@projectsdp.hhfrd.mongodb.net/ngagel97?retryWrites=true&w=majority&appName=ProjectSDP
JWT_SECRET=NGAGEL97ASLINYAVINDI
NODE_ENV="production"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_MNyziu33qAkbhPjN_ofGuHOMC3bBenQtLSHvI6e0aqGWAo0"
MIDTRANS_SERVER_KEY=SB-Mid-server-yj9lQgWs-AOo9aiYKcLfX6iZ
MIDTRANS_CLIENT_KEY=SB-Mid-client-NgrTXoIsgR5SCKaf
```

## Features and Usage

### General User
- **Features:**
Register an account.
  - Log in to the application.
  - Register an account.
  - Navigate to home page.
  
### Customer
- **Features:**
  - Browse available printing services and add-ons.
  - Place and manage online orders.
  - Manage cart
  - Checkout online by providing shipping address and make online payments. See [Midtrans Mock Payments Guide](#midtrans-mock-payments-guide)
  - Track order status (including transaction history and invoice generation).
  - Manage account profile.

### Admin
- **Features:**
  - Manage online orders (update status).
  - Record offline transactions.
  - View transaction history and generate invoices.

### Master
- **Features:**
  - View sales reports and daily transaction reports.
  - Manage add-ons, services, and items (CRUD operations).
  - Manage user roles and permissions.

## Default User Accounts

To test the application, use the following default user accounts:

### Customer Account:
- **Email:** weny@gmail.com
- **Password:** Password123

### Admin Account:
- **Email:** admin
- **Password:** 123

### Master Account:
- **Email:** master
- **Password:** 123

New accounts can be created via the registration form. By default, all newly registered accounts are assigned the role of **Customer**. If you need to change a customer's role to **Admin** or vice versa, this can be done through the **Manage User Roles** feature, which is accessible by the **Master** role.


## Midtrans Mock Payments Guide
The **Fotocopy Ngagel97 Web Application** integrates with **Midtrans** to provide online payment capabilities. This guide explains how to test payments using **Midtrans Mock Payments**.

### Steps to Test Payment with Midtrans Mock Payments

1. **On the checkout page**, click the **"Proceed to Payment"** button.  
   This will open the **Midtrans Snap** interface to choose a payment method.

2. **Select your preferred payment method** from Snap, then **copy the code** provided.

3. **Open the website** [Midtrans Payment Simulator](https://simulator.sandbox.midtrans.com/).  
   Choose the payment simulator that matches the method you selected in Snap.

4. **Paste the code** from Snap into the Midtrans Payment Simulator, click **Inquire**, and then click **Pay** to complete the simulated payment.

5. **Return to the Snap page** and click the **"Check Status"** button, then click **OK** to update the transaction status.

By following these steps, you can simulate the payment process completely without making real transactions.
