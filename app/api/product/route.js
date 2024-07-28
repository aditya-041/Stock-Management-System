// import { MongoClient } from "mongodb";
// import { NextResponse } from "next/server";

// export async function GET(request) {


//     // Replace the uri string with your connection string.
//     const uri = "mongodb+srv://adityaBasu:xywaSCNbZvDwco6m@fanfunded.iqc35pc.mongodb.net/";
//     const client = new MongoClient(uri);
//     try {
//         const database = client.db('stock');
//         const inventory = database.collection('inventory');
//         // Query for a movie that has the title 'Back to the Future'
//         const query = {};
//         const allProducts = await inventory.find(query).toArray();
//         return NextResponse.json({ allProducts })
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }


// export async function POST(request) {
//     // Replace the uri string with your connection string.
//     let body = await request.json();
//     const uri = "mongodb+srv://adityaBasu:xywaSCNbZvDwco6m@fanfunded.iqc35pc.mongodb.net/";
//     const client = new MongoClient(uri);
//     try {
//         const database = client.db('stock');
//         const inventory = database.collection('inventory');
//         const product = await inventory.insertOne(body);
//         return NextResponse.json({ product, ok: true })
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }


import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
    const uri = "mongodb+srv://adityaBasu:xywaSCNbZvDwco6m@fanfunded.iqc35pc.mongodb.net/";
    const client = new MongoClient(uri);
    try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');
        const query = {};
        const products = await inventory.find(query).toArray();
        return NextResponse.json({ success: true, products});
    } finally {
        await client.close();
    }
}

export async function POST(request) {
    const body = await request.json();
    const uri = "mongodb+srv://adityaBasu:xywaSCNbZvDwco6m@fanfunded.iqc35pc.mongodb.net/";
    const client = new MongoClient(uri);
    try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');
        
        // Insert the product into the database
        const result = await inventory.insertOne(body);

        // Fetch the inserted product to return it
        const insertedProduct = await inventory.findOne({ _id: result.insertedId });

        return NextResponse.json({ product: insertedProduct, ok: true });
    } catch (error) {
        console.error('Failed to add product:', error);
        return NextResponse.json({ error: 'Failed to add product', ok: false });
    } finally {
        await client.close();
    }
}


