// import { NextResponse } from "next/server";
// import { MongoClient } from "mongodb";

// export async function POST(request) {
//     let {action, slug, initialQuantity} = await request.json();
  
//     const uri = "mongodb+srv://adityaBasu:xywaSCNbZvDwco6m@fanfunded.iqc35pc.mongodb.net/";
//     const client = new MongoClient(uri);
//     try {
//         const database = client.db("stock");
//         const inventory = database.collection("inventory");
//         const filter = { slug: slug };
       
//         let newQuantity = action=="plus"? (parseInt(initialQuantity) + 1):(parseInt(initialQuantity) - 1)
//         const updateDoc = {
//           $set: {
//             quantity: newQuantity
//           },
//         };
//         // Update the first document that matches the filter
//         const result = await inventory.updateOne(filter, updateDoc, {});
        
//         return NextResponse.json({success: true, message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`})
//       } finally {
//         // Close the connection after the operation completes
//         await client.close();
//       }
// }

import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://adityaBasu:xywaSCNbZvDwco6m@fanfunded.iqc35pc.mongodb.net/";

export async function POST(request) {
  const { action, slug, initialQuantity } = await request.json();

  const client = new MongoClient(uri);
  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    const newQuantity = action === "plus" ? initialQuantity + 1 : initialQuantity - 1;
    const updateDoc = { $set: { quantity: newQuantity } };

    const result = await inventory.updateOne({ slug }, updateDoc, {});

    return NextResponse.json({
      success: true,
      message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
      newQuantity,
    });
  } finally {
    await client.close();
  }
}
