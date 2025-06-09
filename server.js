import 'dotenv/config';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import express from "express";
import cors from "cors";


const TABLE = "PETS";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const doClient = DynamoDBDocumentClient.from(client);

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

export async function deletePet(Adopt) {
  await doClient.send(new DeleteCommand({
    TableName: TABLE,
    Key: { Adopt },
  }));
  
}
export async function getPet(Adopt) {
  const { Item } = await doClient.send(new GetCommand({
    TableName: TABLE,
    Key: { Adopt },
  }));
  return Item;
}
export async function updatePet(pet) {
  await doClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: pet,
    })
  );
}
export async function getPetsByType(type) {
  const { Items } = await doClient.send(new ScanCommand({
    TableName: TABLE,
    FilterExpression: "type = :type",
    ExpressionAttributeValues: {
      ":type": type,
    },
  }));
  return Items || [];
}
export async function getPetsByAge(age) {
  const { Items } = await doClient.send(new ScanCommand({
    TableName: TABLE,
    FilterExpression: "age = :age",
    ExpressionAttributeValues: {
      ":age": age,
    },
  }));
  return Items || [];
}
export async function getPetsByName(name) {
  const { Items } = await doClient.send(new ScanCommand({
    TableName: TABLE,
    FilterExpression: "contains(#name, :name)",
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ExpressionAttributeValues: {
      ":name": name,
    },
  }));
  return Items || [];
}

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());

// GET all pets
app.get("/api/pets", async (req, res) => {
  try {
    const pets = await scanPets();
    res.json(pets);
  } catch (err) {
    console.error("/api/pets error:", err); // Log full error
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Other routes (POST, DELETE, etc.) would go here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


