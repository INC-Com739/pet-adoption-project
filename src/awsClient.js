import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: import.meta.env.VITE_APP_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

export async function scanPets() {
  const { Items } = await docClient.send(new ScanCommand({ TableName: "PETS" }));
  return Items || [];
}

export async function addPet(pet) {
  await docClient.send(new PutCommand({
    TableName: "PETS",
    Item: pet,
  }));
  return pet;
}

export async function deletePet(adoptId) {
  await docClient.send(new DeleteCommand({
    TableName: "PETS",
    Key: { Adopt: adoptId },
  }));
}
