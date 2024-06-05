import { amplifyClient } from "./amplify-utils";

export async function callBedRock(customerInput: string) {
  const response = await amplifyClient.queries.askBedrock({
    prompts: [customerInput?.toString() || ""],
  });

  const res = JSON.parse(response.data?.body!);
  const content = res.content[0].text;
  return content || "";
}

export async function getImage(customerInput: string) {
  const response = await amplifyClient.queries.getImage({
    prompts: [customerInput?.toString() || ""],
  });

  const res = JSON.parse(response.data?.body!);
  const content = res.artifacts[0].base64;
  return content || "";
}
