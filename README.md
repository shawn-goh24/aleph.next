# Aleph Technology Take Home Assignment

A web-based dashboard application for visualizing and troubleshooting process flow inefficiencies in business operations.

## Features

### Process Flow Management

- **Interactive Tables**: View, sort, edit, and delete nodes and edges
- **Visual Canvas**: Graphical representation of process flows with nodes and edges
- **Flexible Creation**: Add multiple nodes and edges to build complex process diagrams

### Report Generation

- **JSON Upload**: Import process data via JSON files for instant visualization
- **AI-Powered Analysis**: Generate comprehensive PDF reports using LLM technology
- **Multi-Report Support**: View and compare charts from multiple uploaded JSON files

## Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Data Tables**: [AG-Grid](https://www.ag-grid.com/)
- **Graph Visualization**: [React Sigma](https://sim51.github.io/react-sigma/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Charts**: [Recharts](https://recharts.org/) with Shadcn Chart components
- **PDF Generation**: [@react-pdf/renderer](https://www.npmjs.com/package/@react-pdf/renderer)
- **AI Integration**: [OpenAI API](https://platform.openai.com/docs)

## Getting Started

### Prerequisites

- Node.js and Yarn installed
- OpenAI API key

### Installation

1. **Clone the repository**

```bash
   git clone <repository-url>
   cd <repository-name>
```

2. **Configure environment variables**

   Create a `.env` file in the root directory:

```env
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

3. **Install dependencies and run**

```bash
   yarn install
   yarn dev
```

4. **Access the application**

   Open [http://localhost:3000](http://localhost:3000) in your browser
