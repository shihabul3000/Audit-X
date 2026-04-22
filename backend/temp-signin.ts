import { auth } from './src/modules/auth/auth.utils';
async function run() {
  const result = await auth.api.signInEmail({
    body: { email: "[EMAIL_ADDRESS]", password: "Password123!" }
  });
  console.log(result);
}
run().finally(() => process.exit(0));
