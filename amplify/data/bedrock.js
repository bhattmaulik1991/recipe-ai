export function request(ctx) {
  const { ingredients } = ctx.args;

  const prompt = `Find person age group, gender, season and the location in the customer input.
  Instructions:
  The age group can be one of the following: 10-20, 20-30, 30-50, 50+
  The gender can be one of the following: Mens, Womens, Other
  The gender can also be derived from the name if not explicitly mentioned
  The season can be one of the following: summer, winter, spring, fall
  The output must be in JSON format inside the tags <attributes></attributes>
  
  If the information of an entity is not available in the input then don't include that entity in the JSON output
  
  Begin!
  
  Customer input: ${ingredients}.`;
  
  return {
    resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `\n\nHuman:${prompt}\n\nAssistant:`,
              },
            ],
          },
        ],
      },
    },
  };
}

export function response(ctx) {
  return {
    body: ctx.result.body,
  };
}
