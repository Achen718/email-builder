# Email Builder

Email Builder is a web application built with Next.js that allows users to create and manage email templates. The application provides a user-friendly interface for designing emails, managing user authentication, and storing email templates.

## ⚡️ Try it
[Demo](https://achen718.github.io/email-builder)

## Features

- **User Authentication**: Secure user authentication using Firebase.
- **Email Template Builder**: Create and manage email templates with a drag-and-drop interface.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Protected Routes**: Ensure that only authenticated users can access certain pages.
- **Real-time Updates**: Automatically update the page as you edit the email templates.
- **Deployment**: Easily deploy the application on Vercel.

## Technologies Used

- **Next.js**: A React framework for server-side rendering and static site generation.
- **React**: A JavaScript library for building user interfaces.
- **Chakra UI**: A simple, modular, and accessible component library for React.
- **Redux Toolkit**: A toolset for efficient Redux development.
- **Firebase**: A platform for building web and mobile applications, used for authentication.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Jest**: A delightful JavaScript testing framework with a focus on simplicity.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

## Installation

To get started with the Email Builder, follow these steps:

1. **Clone the repository**:

```bash
git clone https://github.com/your-username/email-builder.git
cd email-builder
```

2. **Install dependencies**:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Set up firebase**:
    1. Go to the Firebase Console:
        - Open your web browser and go to the Firebase Console.

    2. Create a New Project:
        - Click on the "Add project" button.
        - Enter a project name (e.g., "Email Builder") and click "Continue".
        - (Optional) You can enable Google Analytics for your project. If you choose to enable it, follow the additional steps to set up Google Analytics.
        - Click "Create project" and wait for Firebase to set up your new project.


    3. Add a Web App to Your Project:
        - In the Firebase Console, click on the web icon (</>) to add a new web app.
        - Enter a nickname for your app (e.g., "Email Builder Web") and click "Register app".

    4. Firebase Configuration:
        - After registering your app, Firebase will provide you with a Firebase configuration object. It looks something like this:
        ```ts
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_AUTH_DOMAIN",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_STORAGE_BUCKET",
            messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
            appId: "YOUR_APP_ID",
        };
        ```

4. **Run the development server**:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 with your browser to see the result.

## Usage
- Authentication
    - Sign Up: Create a new account using your email and password.
    - Login: Log in to your account using your email and password.
    - Protected Routes: Access protected routes only after authentication.

- Email Template Builder
    - Create Template: Use the drag-and-drop interface to create email templates.
    - Edit Template: Modify existing templates and see real-time updates.
    - Save Template: Save your email templates for future use.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
