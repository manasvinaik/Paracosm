const UPSTREAM = "https://comick-source-api.notaspider.dev";

export default async (request, context) => {
  const incoming = new URL(request.url);
  const marker = "/.netlify/functions/comick-source-api";
  const publicPrefix = "/api/comick-source";
  let suffix = incoming.pathname.includes(marker)
    ? incoming.pathname.slice(incoming.pathname.indexOf(marker) + marker.length)
    : incoming.pathname.startsWith(publicPrefix)
      ? incoming.pathname.slice(publicPrefix.length)
      : "";

  if (!suffix.startsWith("/")) suffix = `/${suffix}`;
  const upstreamUrl = `${UPSTREAM}/api${suffix}${incoming.search}`;
  const headers = new Headers({ Accept: "application/json" });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  try {
    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.text(),
    });
    const responseHeaders = new Headers();
    const upstreamType = upstream.headers.get("content-type");
    if (upstreamType) responseHeaders.set("content-type", upstreamType);
    responseHeaders.set("cache-control", "no-store");
    return new Response(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return Response.json(
      { error: "Unable to reach the manga catalogue service.", details: error?.message || "Unknown upstream error" },
      { status: 502 }
    );
  }
};
