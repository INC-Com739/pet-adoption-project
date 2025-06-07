import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

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
  const { Items } = await doClient.send(new ScanCommand({ TableName: TABLE }));
  return Items || [];
}
export async function createPet(pet) {
  await doClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: pet,
    })
  );
}

export async function deletePet(petId) {
  await doClient.send(new DeleteCommand({
    TableName: TABLE,
    Key: { id },
  }));
  
}