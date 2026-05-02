const { execSync } = require('child_process');

const envs = {
  NEXT_PUBLIC_API_URL: "https://backend-weld-theta-88.vercel.app",
  NEXT_PUBLIC_BETTER_AUTH_URL: "https://backend-weld-theta-88.vercel.app"
};

for (const [key, value] of Object.entries(envs)) {
  console.log(`Adding ${key}...`);
  try {
    execSync(`node -e "process.stdout.write('${value}')" | npx vercel env add ${key} production --force`, { stdio: 'inherit' });
    execSync(`node -e "process.stdout.write('${value}')" | npx vercel env add ${key} preview --force`, { stdio: 'inherit' });
    execSync(`node -e "process.stdout.write('${value}')" | npx vercel env add ${key} development --force`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to add ${key}`);
  }
}
