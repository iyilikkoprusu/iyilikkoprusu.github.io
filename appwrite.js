import { Client, Databases, ID } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Ekrandaki Endpoint
    .setProject('iyilikkoprusu'); // Senin Project ID'n

const databases = new Databases(client);

export { client, databases, ID };
