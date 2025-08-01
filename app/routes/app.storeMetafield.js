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

    console.log("Enter in metafield query ==>");

    const response = await admin.graphql(
      `#graphql
  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        key
        namespace
        value
        createdAt 
        updatedAt
      }
      userErrors {
        field
        message
        code
      }
    }
  }`,
      {
        variables: {
          metafields: [
            {
              ownerId: shopId,
              namespace: "settings",
              key: "min_order",
              type: "single_line_text_field",
              value: minOrderLimit,
            },
            {
              ownerId: shopId,
              namespace: "settings",
              key: "max_order",
              type: "single_line_text_field",
              value: maxOrderLimit,
            },
            {
              ownerId: shopId,
              namespace: "settings",
              key: "min_quantity",
              type: "single_line_text_field",
              value: minQuantityLimit,
            },
            {
              ownerId: shopId,
              namespace: "settings",
              key: "max_quantity",
              type: "single_line_text_field",
              value: maxQuantityLimit,
            },
          ],
        },
      },
    );
    const responseInJson = await response.json();
    console.log(
      "metafield mutation ==>",
      responseInJson.data.metafieldsSet.metafields,
    );
    return json({
      success: true,
      shopId,
      metafields: responseInJson.data.metafieldsSet,
    });
  } catch (err) {
    console.log("Error in query", err);
  }
};
