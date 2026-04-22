import { auth } from './src/modules/auth/auth.utils';
async function test() {
  try {
    const response = await auth.api.signInEmail({
      body: { email: 'shihabul.marco@gmail.com', password: 'Password123!' },
      asResponse: true
    });
    console.log("Response:", response.status);
    console.log("Headers:", response.headers);
  } catch (err) {
    console.error(err);
  }
}
test().finally(() => process.exit(0));
