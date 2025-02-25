export const appConfig = {
  verificationEmailToken: {
    length: 48,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  resetPasswordToken: {
    length: 48,
    maxAge: 1000 * 60 * 10,
  },
};
