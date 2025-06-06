import dotenv from 'dotenv';
dotenv.config(); // Loads .env by default
console.log('REGION:', process.env.VITE_APP_AWS_REGION);
console.log('ACCESS_KEY_ID:', process.env.VITE_APP_AWS_ACCESS_KEY_ID);
console.log('SECRET_ACCESS_KEY:', process.env.VITE_APP_AWS_SECRET_ACCESS_KEY);

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import express from 'express';
import cors from 'cors';

const REGION = process.env.VITE_APP_AWS_REGION;
const ACCESS_KEY_ID = process.env.VITE_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.VITE_APP_AWS_SECRET_ACCESS_KEY;

const client = new DynamoDBClient({
  region: REGION,
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

const app = express();
app.use(cors());
app.use(express.json());

// GET all pets
app.get('/api/pets', async (req, res) => {
  try {
    const pets = await scanPets();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pets', details: err.message });
  }
});

// POST create pet
app.post('/api/pets', async (req, res) => {
  try {
    const pet = req.body;
    await createPet(pet);
    res.status(201).json({ message: 'Pet created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create pet', details: err.message });
  }
});

// PUT update pet
app.put('/api/pets/:adopt', async (req, res) => {
  try {
    const pet = { ...req.body, Adopt: req.params.adopt };
    await updatePet(pet);
    res.json({ message: 'Pet updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update pet', details: err.message });
  }
});

// DELETE pet
app.delete('/api/pets/:adopt', async (req, res) => {
  try {
    await deletePet(req.params.adopt);
    res.json({ message: 'Pet deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete pet', details: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
