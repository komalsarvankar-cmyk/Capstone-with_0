import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from './App';

jest.mock('@/lib/auth', () => ({
  subscribeToAuthState: (callback: (user: null) => void) => {
    callback(null);
    return () => {};
  },
  signUp: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

describe('App', () => {
  it('boots to the Welcome screen when no session is stored (U1)', async () => {
    render(<App />);
    expect(await screen.findByText('With.')).toBeTruthy();
    expect(screen.getByText('Get started')).toBeTruthy();
  });
});
