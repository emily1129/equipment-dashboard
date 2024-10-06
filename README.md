# Equipment Monitoring Dashboard

## Overview

This Equipment Monitoring Dashboard is a web application designed to track and visualize the status and performance of industrial equipment across six different statuses. It provides insights through various charts and data visualizations, enabling efficient monitoring.

## Features

1. **Interactive Dashboard**:

   - Click on chart sections for detailed information
   - Filter data based on equipment status, time range, etc.

2. **Performance Metrics**:

   - Effective Production Ratio
   - Uptime/Downtime Ratio
   - Efficiency Ratio

3. **Responsive Design**:
   - Optimized for both desktop and mobile viewing

## Technology Stack

- Frontend: Vue.js 3 with TypeScript
- UI Framework: Tailwind + Naive UI
- Charting Library: Chart.js with Vue-Chart-3
- Build Tool: Vite

## Getting Started

### Prerequisites

- Node.js (v14.0 or later)
- npm (v6.0 or later)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/emily1129/equipment-dashboard.git
   ```

2. Navigate to the project directory:

   ```
   cd equipment-dashboard
   ```

3. Install dependencies:
   ```
   npm install
   ```

### Running the Project

1. For development mode:

   ```
   npm run dev
   ```

   This will start the development server

2. For production build:
   ```
   npm run build
   ```
   This will generate production-ready files in the `dist` directory.

## Configuration

- Environment variables can be set in `.env` files for different environments.
- Adjust the `vite.config.ts` file for build and development configurations.
