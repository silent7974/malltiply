import { v4 as uuidv4 } from 'uuid'

let sessionId = uuidv4()

async function getUserId() {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" })
    if (!res.ok) return "guest"
    const data = await res.json()
    return data.user?.id || "guest"
  } catch {
    return "guest"
  }
}

let cachedUserId

export async function logEvent({ page, component, event, payload = {} }) {
  if (!cachedUserId) cachedUserId = await getUserId()

  const log = {
    timestamp: new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" }),
    userId: cachedUserId,
    sessionId,
    page,
    component,
    event,
    payload,
  }

  console.log("ANALYTICS_LOG:", log)

  fetch("/api/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(log),
  }).catch(console.error)
}