import { MongoClient, type Db } from "mongodb";

/**
 * MongoDB Atlas connection.
 *
 * The client is cached on the global object so a warm serverless instance
 * reuses one pool instead of opening a new one per request. Set MONGODB_URI
 * (see .env.example) — without it the enquiry form still works, it just falls
 * back to email only.
 */
const uri = process.env.MONGODB_URI;

declare global {
  var _enquiryMongoClient: Promise<MongoClient> | undefined;
}

export function isStorageConfigured() {
  return Boolean(uri);
}

function connect() {
  if (!uri) throw new Error("MONGODB_URI is not set");
  globalThis._enquiryMongoClient ??= new MongoClient(uri, { maxPoolSize: 5 }).connect();
  return globalThis._enquiryMongoClient;
}

/** The database named in the connection string. */
export async function getDb(): Promise<Db> {
  const client = await connect();
  return client.db();
}
