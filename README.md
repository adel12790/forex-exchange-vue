# Setup Guide

## Prerequisites

- Node.js 18+ installed
- An API key from Massive.com

## Getting Your API Key

1. Visit [https://massive.com](https://massive.com)
2. Sign up for an account
3. Navigate to your dashboard
4. Copy your API key

## Installation Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure API Key**:
   
   Create a `.env` file in the root directory (or edit the existing one) and add your API key:
   ```
   VITE_MASSIVE_API_KEY=your_actual_api_key_here
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   
   Navigate to `http://localhost:3000`
