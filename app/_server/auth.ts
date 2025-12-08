import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dagar
    updateAge: 60 * 60 * 24, // uppdatera varje dag
  },
  user: {
    additionalFields: {
      roll: {
        type: "string",
        required: false,
        defaultValue: "kund",
      },
      foretagsslug: {
        type: "string",
        required: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
