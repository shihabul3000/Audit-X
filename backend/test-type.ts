import { betterAuth } from "better-auth";
const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password: string) => { return "hashed" },
      verify: async (password: string, hash: string) => true
    }
  }
});
