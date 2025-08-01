import {
  Card,
  Button,
  Page,
  Text,
  BlockStack,
  Toast,
  TextField,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { useState } from "react";

export default function AdditionalPage() {
  const [maxOrderLimit, setMaxOrderLimit] = useState("");
  const [minOrderLimit, setMinOrderLimit] = useState("");
  const [minQuantityLimit, setMinQuantityLimit] = useState("");
  const [maxQuantityLimit, setMaxQuantityLimit] = useState("");

  const apiCallOnPriceSetLimit = async () => {
    console.log("called");
    try {
      const sendRequestToBackend = await fetch("/app/storeMetafield", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          minOrderLimit: minOrderLimit || undefined,
          maxOrderLimit: maxOrderLimit || undefined ,
        }),
      });
      const data = await sendRequestToBackend.json();
      shopify.toast.show("Cart Price Limit saved");
      // console.log("Checking request", data);
    } catch (error) {
      console.log("Error while limiting the order", error);
    }
  };

  const apiCallOnQuantitySetLimit = async () => {
    console.log("called");
    try {
      const sendRequestToBackend = await fetch("/app/storeMetafield", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          minQuantityLimit: minQuantityLimit || undefined,
          maxQuantityLimit: maxQuantityLimit || undefined,
        }),
      });
      const data = await sendRequestToBackend.json();
      shopify.toast.show("Cart Quantity Limit saved");

      // console.log("Checking request", data);
    } catch (error) {
      console.log("Error while limiting the order", error);
    }
  };

  const resetPriceLimits = async () => {
    console.log("Resetting Price Limits...");
    setMaxOrderLimit("");
    setMinOrderLimit("");

    try {
      const response = await fetch("/app/resetMetafields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          minOrderLimit: "",
          maxOrderLimit: "",
        }),
      });
      const result = await response.json();
      shopify.toast.show("Cart Price Limit Reset");
      // console.log("Price limits reset:", result);
    } catch (error) {
      console.error("Error resetting price limits:", error);
    }
  };

  const resetQuantityLimits = async () => {
    console.log("Resetting Quantity Limits...");
    setMaxQuantityLimit("");
    setMinQuantityLimit("");

    try {
      const response = await fetch("/app/resetMetafields", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          minQuantityLimit: "",
          maxQuantityLimit: "",
        }),
      });
      const result = await response.json();
      shopify.toast.show("Cart Price Limit Reset");
    } catch (error) {
      console.error("Error resetting quantity limits:", error);
    }
  };
  return (
    <Page>
      <TitleBar title="Cart Page Order Limits"></TitleBar>

      <BlockStack gap="500">
        <Card>
          <Text variant="headingMd" as="h6">
            Total item limits
          </Text>

          <Text variant="bodyMd">
            Define the minimum and maximum cart subtotal, excluding shipping and
            taxes, and verify that the customer's cart contents are always
            within the set price range.
          </Text>
          <BlockStack gap="200" style={{ padding: "20px" }}>
            <InlineStack gap="200">
              <TextField
                label="Minimum total order amount"
                type="number"
                value={minOrderLimit}
                prefix="$"
                onChange={(value) => setMinOrderLimit(value)}
                autoComplete="off"
              />
              <TextField
                style={{ margin: "0 10%" }}
                label="Maximum total order amount"
                type="number"
                value={maxOrderLimit}
                prefix="$"
                onChange={(value) => setMaxOrderLimit(value)}
                autoComplete="off"
              />
            </InlineStack>
          </BlockStack>
          <InlineStack gap="200">
            <Button
              variant="primary"
              style={{ padding: "0px 10px 0px 10px" }}
              onClick={apiCallOnPriceSetLimit}
            >
              Save
            </Button>
            <Button
              variant="primary"
              style={{ margin: "0px 0px 0px 10px" }}
              onClick={resetPriceLimits}
            >
              Reset
            </Button>
          </InlineStack>
        </Card>

        <Card>
          <Text variant="headingMd" as="h6">
            Quantity Limits
          </Text>
          <Text variant="bodyMd">
            Set minimum and maximum number of items allowed in the cart.
          </Text>
          <BlockStack gap="200" style={{ padding: "20px" }}>
            <InlineStack gap="200">
              <TextField
                label="Minimum item quantity"
                type="number"
                value={minQuantityLimit}
                onChange={(value) => setMinQuantityLimit(value)}
                autoComplete="off"
              />
              <TextField
                label="Maximum item quantity"
                type="number"
                value={maxQuantityLimit}
                onChange={(value) => setMaxQuantityLimit(value)}
                autoComplete="off"
              />
            </InlineStack>
          </BlockStack>
          <InlineStack gap="200">
            <Button
              variant="primary"
              style={{ padding: "0px 10px 0px 10px" }}
              onClick={apiCallOnQuantitySetLimit}
            >
              Save
            </Button>
            <Button
              variant="primary"
              style={{ padding: "0px 10px 0px 10px" }}
              onClick={resetQuantityLimits}
            >
              Reset
            </Button>
          </InlineStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
