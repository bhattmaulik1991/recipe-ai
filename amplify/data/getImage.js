export function request(ctx) {
  const { prompts } = ctx.args;
  return {
    resourcePath: `/model/stability.stable-diffusion-xl-v1/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        seed: 4000,
        cfg_scale: 9,
        steps: 50,
        style_preset: "photographic",
        text_prompts: [
            {"text": prompts.join(), "weight": 1.0},
            {"text": "poorly rendered", "weight": -1.0}
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
