// import React from 'react';
// import '@testing-library/jest-dom';
// import { renderProviders } from '@/utils/test.utils';
// import { ChakraProvider } from '@chakra-ui/react';
// import { AuthProvider } from '@/context/userContext';
// import { render, screen, fireEvent } from '@testing-library/react';
// import Login from '@/components/forms/Login';
// import { useRouter } from 'next/navigation';
// import { mockLogin } from '../../mocks/authMocks';

// jest.mock('next/navigation', () => ({
//   useRouter: jest.fn(),
// }));

// jest.mock('../../mocks/authMocks', () => ({
//   mockLogin: jest.fn(),
// }));

// describe('Login Component', () => {
//   const mockPush = jest.fn();

//   beforeEach(() => {
//     (useRouter as jest.Mock).mockReturnValue({
//       push: mockPush,
//     });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('renders the login form', () => {
//     render(
//       <AuthProvider>
//         <ChakraProvider>
//           <Login />
//         </ChakraProvider>
//       </AuthProvider>
//     );

//     expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
//   });

//   it('mock login', async () => {
//     mockLogin('email@example.com', 'password');

//     expect(mockLogin).toHaveBeenCalledTimes(1);
//     expect(mockLogin).toHaveBeenCalledWith('email@example.com', 'password');
//   });
// });
