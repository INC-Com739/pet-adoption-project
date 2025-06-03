import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, DeleteCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// For local DynamoDB (e.g., running via Docker or AWS LocalStack)
const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localhost:8000", // DynamoDB local endpoint
  credentials: {
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey"
  }
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

async function testDynamoDB() {
  try {
    // Add a pet
    await ddbDocClient.send(new PutCommand({
      TableName: "PETS",
      Item: { id: "123", name: "Fido", type: "Dog", age: 2 }
    }));
    console.log("Pet added!");

    // Get all pets
    const result = await ddbDocClient.send(new ScanCommand({ TableName: "PETS" }));
    console.log("All pets:", result.Items);

    // Delete a pet
    await ddbDocClient.send(new DeleteCommand({
      TableName: "PETS",
      Key: { id: "123" }
    }));
    console.log("Pet deleted!");
  } catch (err) {
    console.error("DynamoDB error:", err);
  }
}

// Add this function to update a pet by id
async function updatePet(pet) {
  // pet should be an object with at least: id, name, type, age
  const command = new UpdateCommand({
    TableName: "PETS",
    Key: { id: pet.id },
    UpdateExpression: "set #name = :name, #type = :type, #age = :age",
    ExpressionAttributeNames: {
      "#name": "name",
      "#type": "type",
      "#age": "age"
    },
    ExpressionAttributeValues: {
      ":name": pet.name,
      ":type": pet.type,
      ":age": pet.age
    }
  });
  await ddbDocClient.send(command);
  console.log("Pet updated!");
}

testDynamoDB();