/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  B: Fetcher;

  // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
  // MY_QUEUE: Queue;
}

// e.g. `curl --data-binary @hello_world.eml https://service_a.spence.workers.dev/parse_mail_1`
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    let url = new URL(request.url)
    switch (url.pathname) {
      // Fails
      case "/parse_mail_1": return env.B.fetch("https://foo.com", { method: "POST", body: request.body })
      // Fails
      case "/parse_mail_2": return env.B.fetch(new Request("https://foo.com", { method: "POST", body: request.body }))
      // Succeeds
      case "/parse_mail_3": return env.B.fetch("https://foo.com", request)
      // Succeeds
      case "/parse_mail_4": return env.B.fetch(new Request("https://foo.com", request))
      default: return new Response()
    }
  },
  async email(email: ForwardableEmailMessage, env: Env, ctx: ExecutionContext) {

    return env.B.fetch("https://foo.com", { method: "POST", body: email.raw })
      .then(response => response.text())
      .then(text => { console.log(text); return new Response() })
  }
};
