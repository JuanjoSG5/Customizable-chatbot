// Install with npm install @mendable/firecrawl-js
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({apiKey: 'fc-66a2cd455d7b4ce0a54be0e4e6026b19'});

export async function crawlUrl(url: string, depth: number) {
    return await app.crawlUrl(url, {
        limit: depth,
        scrapeOptions: {
            formats: ["markdown"],
        }
    });
}

