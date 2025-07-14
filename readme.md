# Chatbot API with RAG (Retrieval Augmented Generation)

An API-based chatbot solution that can be incorporated into your website. This project implements a RAG (Retrieval Augmented Generation) system that allows you to create a customizable chatbot with knowledge based on your own content.

## Features

- Web scraping functionality to easily add content to your knowledge base
- RAG-powered chatbot that provides context-aware responses
- Simple UI for interacting with the chatbot
- Built with modern technologies: Next.js, React, TypeScript, and Supabase

## Tech Stack

- Frontend: Next.js, React
- Backend: Next.js API routes
- Database: Supabase
- Embeddings: Xenova Transformers (all-MiniLM-L6-v2)
- LLM: Google Gemini Flash (via OpenRouter)
- Web Scraping: Mendable Firecrawl
- RAG Implementation: LangChain
  
## Getting Started

TODO

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn
- A Supabase account
- An OpenRouter API key

### Installation

1. Clone the repository:

``` bash
git clone <repository-url>
cd Chatbot_API
```

2. Install dependencies:

``` bash
npm install
```

3. Create a .env file based on .env.example:
```bash
NEXT_PUBLIC_OPENROUTER_TOKEN=your_openrouter_api_key
NEXT_PUBLIC_WEB_URL=https://api.openrouter.ai/v1
NEXT_PUBLIC_DATABASE=your_supabase_url
NEXT_PUBLIC_DATABASE_KEY=your_supabase_key
```

4. Set up Supabase tables:
    - Create a table named articles with a markdown text column
    - Create a table named documents with columns id (string), text (text), and embedding (array)

### Usage

1. Use the scraper form to add content to your knowledge base:
    - Enter the URL of a website you want to scrape
    - Set the crawl depth
    - Click "Scrape and Save"
2. Once content is added, the RAG system will process it automatically

3. Use the chatbot interface to ask questions about the content

## License

AFL-3.0

## Author

Juan Jose Sanchez Gonzalez
