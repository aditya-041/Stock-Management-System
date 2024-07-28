// import { MongoClient } from "mongodb";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//     const query = request.nextUrl.searchParams.get("query");
//     const uri = "mongodb+srv://adityaBasu:xywaSCNbZvDwco6m@fanfunded.iqc35pc.mongodb.net/";
//     const client = new MongoClient(uri);

//     try {
//         await client.connect();
//         const database = client.db('stock');
//         const inventory = database.collection('inventory');
 
//         const products = await inventory.aggregate([
//             {
//                 $match: {
//                     $or: [
//                         { slug: { $regex: query, $options: 'i' } }
//                     ]
//                 }
//             }
//         ]).toArray();

//         return NextResponse.json({ success: true, products });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ success: false, error: error.message });
//     } finally {
//         await client.close();
//     }
// }


// import { MongoClient } from "mongodb";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//     const query = request.nextUrl.searchParams.get("query");
//     const uri = "mongodb+srv://adityaBasu:xywaSCNbZvDwco6m@fanfunded.iqc35pc.mongodb.net/";
//     const client = new MongoClient(uri);

//     try {
//         await client.connect();
//         const database = client.db('stock');
//         const inventory = database.collection('inventory');
        
//         // Handle empty query
//         const searchCriteria = query 
//             ? { slug: { $regex: query, $options: 'i' } }
//             : {};

//         const products = await inventory.find(searchCriteria).toArray();

//         return NextResponse.json({ success: true, products });
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         return NextResponse.json({ success: false, error: error.message });
//     } finally {
//         await client.close();
//     }
// }


import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
    const query = request.nextUrl.searchParams.get("query");
    const uri = "mongodb+srv://adityaBasu:xywaSCNbZvDwco6m@fanfunded.iqc35pc.mongodb.net/";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('stock');
        const inventory = database.collection('inventory');
        
        // Handle empty query
        const searchCriteria = query 
            ? { slug: { $regex: query, $options: 'i' } }
            : {};

        // Log the search criteria
        console.log('Search criteria:', searchCriteria);

        const products = await inventory.find(searchCriteria).toArray();

        // Log the products found
        console.log('Products found:', products);

        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ success: false, error: error.message });
    } finally {
        await client.close();
    }
}
