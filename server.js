import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const REGION = import.meta.env.VITE_APP_AWS_REGION;
const ACCESS_KEY_ID = import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY;

const client = new DynamoDBClient({
  region: REGION,
  endpoint: "http://localhost:8000", // Connect to DynamoDB Local
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

export async function scanPets() {
  const command = new ScanCommand({ TableName: 'PETS' });
  const result = await ddbDocClient.send(command);
  return result.Items || [];
}

export async function createPet(item) {
  // Ensure the key is Adopt (String)
  const newItem = { ...item, Adopt: item.Adopt };
  const command = new PutCommand({ TableName: 'PETS', Item: newItem });
  await ddbDocClient.send(command);
}

export async function updatePet(item) {
  const command = new UpdateCommand({
    TableName: 'PETS',
    Key: { Adopt: item.Adopt },
    UpdateExpression: 'set #name = :name, #type = :type, #age = :age',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#type': 'type',
      '#age': 'age',
    },
    ExpressionAttributeValues: {
      ':name': item.name,
      ':type': item.type,
      ':age': item.age,
    },
  });
  await ddbDocClient.send(command);
}

export async function deletePet(Adopt) {
  const command = new DeleteCommand({
    TableName: 'PETS',
    Key: { Adopt },
  });
  await ddbDocClient.send(command);
}
