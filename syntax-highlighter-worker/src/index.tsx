/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import puppeteer from '@cloudflare/puppeteer';
import { Hono } from 'hono';
import { jsx } from 'hono/jsx';

interface Bindings {
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
  //
  // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
  // MY_QUEUE: Queue;

  MYBROWSER: any;
}

const me = 'https://syntax-highlighter-worker.windymelt.workers.dev';
const app = new Hono<{ Bindings: any }>();

app.get('/', async (c) => {
  const browser = await puppeteer.launch(c.env!.MYBROWSER as any);
  let img;
  const page = await browser.newPage();
  await page.goto(me + '/inner.html');
  img = await page.screenshot({ type: 'webp', clip: { height: 630, width: 1200, x: 0, y: 0 }, quality: 95 });
  await browser.close();
  c.header('content-type', 'image/webp');
  return c.body(img);
});

app.get('/inner.html', async (c) => {
	// TODO: Laikaを呼び出す
	const dom = (
    <html>
      <head>
        <link rel="styleSheet" type="text/css" href={`/style.css`} />
      </head>
      <body>
        <h1 id="hello-laika" class="section">
          Hello, Laika!
        </h1>
        <pre>
          <code class="nohighlight">
            <span class="comment">//&gt; using scala 3.3.1 //&gt; using dep &quot;org.typelevel::laika-core::1.0.0&quot;</span>
            <span></span>
            <span class="keyword">import</span>
            <span> </span>
            <span class="identifier">laika</span>
            <span>.</span>
            <span class="identifier">api</span>
            <span>.</span>
            <span class="identifier">_</span>
            <span></span>
            <span class="keyword">import</span>
            <span> </span>
            <span class="identifier">laika</span>
            <span>.</span>
            <span class="identifier">format</span>
            <span>.</span>
            <span class="identifier">_</span>
            <span></span>
            <span class="keyword">val</span>
            <span> </span>
            <span class="identifier">transformer</span>
            <span> = </span>
            <span class="type-name">Transformer</span>
            <span>.</span>
            <span class="identifier">from</span>
            <span>(</span>
            <span class="type-name">Markdown</span>
            <span>) .</span>
            <span class="identifier">to</span>
            <span>(</span>
            <span class="type-name">HTML</span>
            <span>) .</span>
            <span class="identifier">build</span>
          </code>
        </pre>
      </body>
    </html>
  );
	return c.html(dom.toString());
});

app.get('/style.css', async (c) => {
  c.header('content-type', 'text/css');
  return c.body(
		'body { background-color: #3f3f3f; color: #f0dfaf; }' + "\n" +
		 '.keyword { color: #cc9393; }' + "\n" +
		 '.comment { color: #709080; }' + "\n" +
		 '.type-name { color: #dfaf8f; }' + "\n"
		);
});

export default app;
