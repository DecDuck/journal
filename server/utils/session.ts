import { type } from "arktype";

const runtimeConfig = useRuntimeConfig();

export const GLOBAL_SESSION_CONFIG = {
  name: "journalsession",
  password: runtimeConfig.sessionSecret,
} satisfies Parameters<typeof useSession>[1];

export const JournalSession = type({
  userId: "string",
});

export type JournalSession = Partial<typeof JournalSession.infer>;
