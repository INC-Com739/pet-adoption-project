import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import express from "express";
import cors from "cors";

const TABLE = "PETS";

const client = new DynamoDBClient({
  region: process.env.VITE_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.VITE_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.VITE_APP_AWS_SECRET_ACCESS_KEY,
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

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET all pets
app.get("/api/pets", async (req, res) => {
  try {
    const pets = await scanPets();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new pet
app.post("/api/pets", async (req, res) => {
  try {
    await createPet(req.body);
    res.status(201).json({ message: "Pet created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update a pet
app.put("/api/pets/:Adopt", async (req, res) => {
  try {
    const pet = { ...req.body, Adopt: req.params.Adopt };
    await updatePet(pet);
    res.json({ message: "Pet updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a pet
app.delete("/api/pets/:Adopt", async (req, res) => {
  try {
    await deletePet(req.params.Adopt);
    res.json({ message: "Pet deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});