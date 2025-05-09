# Email Builder

Email Builder is a web application built with Next.js that allows users to create and manage email templates. The application provides a user-friendly interface for designing emails, managing user authentication, and storing email templates.

## ⚡️ Try it
[Demo](https://email-builder-bice-pi.vercel.app/)

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

3. **Set up Firebase**:
    1. Go to the Firebase Console:
        - Open your web browser and go to the [Firebase Console](https://console.firebase.google.com/).

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

4. **Environment Setup**:
    1. Create a `.env.local` file in the root directory of the project
    2. Add the Firebase configuration values to the environment variables:
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
    NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
    ```

5. **Run the development server**:
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

### Authentication
- **Sign Up**: Create a new account using your email and password.
- **Login**: Log in to your account using your email and password.
- **Protected Routes**: Access protected routes only after authentication.

### Email Template Builder
- **Create Template**: Use the drag-and-drop interface to create email templates.
- **Edit Template**: Modify existing templates and see real-time updates.
- **Save Template**: Save your email templates for future use.

## Infrastructure

This project uses Terraform to provision and manage cloud infrastructure:
- S3 bucket for storing email template assets
- Properly configured CORS and access permissions
- Scalable and reproducible infrastructure setup

See the `/terraform` directory for the infrastructure code.

## Deployment

This application is deployed on Vercel. To deploy your own instance:

1. **Create a Vercel Account** (if you don't have one already).
2. **Install the Vercel CLI**:
```bash
npm install -g vercel
```

3. **Deploy to Vercel**:
```bash
vercel
```

4. Follow the prompts to link your project and deploy.

5. **Set Environment Variables**:
   - Add all Firebase environment variables from your `.env.local` file to your Vercel project settings.


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!