import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export const action = async ({ request }) => {
  try {
    console.log("==enter");
    const { admin } = await authenticate.admin(request);
    const { minOrderLimit, maxOrderLimit, minQuantityLimit, maxQuantityLimit } =
      await request.json();

    console.log("admin->", admin);
    console.log("-->", minOrderLimit, maxOrderLimit);

    const shopQuery = `
      query {
        shop {
          id
        }
      }
    `;
    console.log("-=-");
    const shopResp = await admin.graphql(shopQuery);
    console.log("enter shop query");
    const shopData = await shopResp.json();
    // console.log("Shop payload:", shopData);

    const shopId = shopData.data?.shop?.id;
    console.log("shop id", shopId);

    console.log("==>");

     const metafields = [];
    
        if (minOrderLimit !== undefined)
          metafields.push({
            ownerId: shopId,
            namespace: "settings",
            key: "min_order",
          });
    
        if (maxOrderLimit !== undefined)
          metafields.push({
            ownerId: shopId,
            namespace: "settings",
            key: "max_order",
          });
    
        if (minQuantityLimit !== undefined)
          metafields.push({
            ownerId: shopId,
            namespace: "settings",
            key: "min_quantity",
          });
    
        if (maxQuantityLimit !== undefined)
          metafields.push({
            ownerId: shopId,
            namespace: "settings",
            key: "max_quantity",
          });
    
        if (metafields.length === 0) {
          return json({ success: false, message: "No valid fields to update" });
        }
    

    console.log("Enter in metafield query ==>");


    const response = await admin.graphql(
      `#graphql
  mutation MetafieldsDelete($metafields: [MetafieldIdentifierInput!]!) {
    metafieldsDelete(metafields: $metafields) {
      deletedMetafields {
        key
        namespace
        ownerId
      }
      userErrors {
        field
        message
      }
    }
  }`,
      {
        variables: {
          metafields
        },
      },
    );
    const responseInJson = await response.json();
    // console.log("==bi", responseInJson)
    // console.log(
    //   "metafield mutation reset ==>",
    //   responseInJson.data.metafieldsSet.metafields,
    // );
    return json({
      success: true,
      shopId,
      metafields: responseInJson.data.metafieldsDelete,
    });
  } catch (err) {
    console.log("Error in query", err);
  }
};
