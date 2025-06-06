import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";

const TABLE = "PETS";

const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});
// process === import.meta

const doClient = DynamoDBClient.from(client);

export async function scanPets() {
  const {Items} = await doClient.scan({
    TableName: TABLE,
  });
  return Items || [];
}
export async function createPet(pet) {
  await doClient.putItem({
    TableName: TABLE,
    Item: {
      id: { S: pet.id },
      name: { S: pet.name },
      type: { S: pet.type },
      age: { N: String(pet.age) },
    },
  });
}