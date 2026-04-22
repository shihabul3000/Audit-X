import { auth } from './src/modules/auth/auth.utils';
async function test() {
  try {
    const response = await auth.api.signInEmail({
      body: { email: 'shihabul.marco@gmail.com', password: 'Password123!' },
      asResponse: true
    });
    console.log("Status:", response.status);
    console.log("Set-Cookie:", response.headers.get("set-cookie"));
  } catch (err) {
    console.error("Error signing in:", err);
  }
}
test().finally(() => process.exit(0));
