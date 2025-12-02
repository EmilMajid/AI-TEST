"use server"

export async function checkWandBConfiguration() {
  const hasKey = process.env.WANDB_API_KEY
  return !!hasKey
}
