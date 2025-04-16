# Trading Journal

A comprehensive web application for traders to log, analyze, and reflect on their stock market transactions, track portfolio performance, and share trading strategies.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: JavaScript/React
- **Database**: PostgreSQL (using [Prisma ORM](https://www.prisma.io/))
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (with Prisma Adapter)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charting**: [Chart.js](https://www.chartjs.org/) / [react-chartjs-2](https://react-chartjs-2.js.org/), [Recharts](https://recharts.org/)
- **Password Hashing**: [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Environment Variables**: [dotenv](https://github.com/motdotla/dotenv)
- **API Fetching (Backend/Scripts)**: [node-fetch](https://github.com/node-fetch/node-fetch)

## Core Features

### User Management
- Secure user registration and authentication (Email/Password via NextAuth.js)

### Transaction Management
- Record BUY/SELL transactions (ticker, quantity, price, date)
- Track fees and taxes per transaction
- Optional notes field for transactions
- Calculated Profit/Loss field (calculation logic TBD)

### Portfolio Tracking
- Overview of current positions (derived from transactions)
- Visualization of portfolio data (using charting libraries)

### Trading Journal
- Attach detailed journal entries to specific transactions
- Record emotions (entry/exit), strategy used for the trade, and post-trade reviews
- Personal tag system for categorizing journal entries (Many-to-Many)

### Strategy Sharing
- Create and share general trading strategies (not tied to specific transactions)

### Data Handling
- Filtering and searching capabilities for transactions (likely implemented in frontend/API)
- Pagination for lists

## API Endpoints (Based on File Structure)

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication routes
- `POST /api/auth/register` - User registration

### Transactions
- `GET /api/transactions` - List transactions (likely with filtering/pagination)
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/:id` - Get a specific transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

### Journal Entries & Tags
- `POST /api/journal` - Create a journal entry (likely requires `transactionId` in body)
- `GET /api/journal` - List journal entries (likely for the logged-in user)
- `GET /api/journal/tags` - List user's tags
- `POST /api/journal/tags` - Create a new tag
- `DELETE /api/journal/tags/:id` - Delete a specific tag
*Note: Specific journal entry updates/deletes might be handled via transaction-specific routes or within the main journal routes.*

### Strategies
- `GET /api/strategies` - List public strategies
- `POST /api/strategies` - Create a new strategy
- `GET /api/strategies/me` - List strategies created by the logged-in user
- `GET /api/strategies/:id` - Get a specific strategy
- `PUT /api/strategies/:id` - Update a strategy
- `DELETE /api/strategies/:id` - Delete a strategy

### Portfolio
- `GET /api/portfolio` - Get current portfolio data for the user

### Other
- `GET /api/analysis` - Endpoint for analysis (details TBD)
- `GET /api/market-data` - Endpoint for market data (details TBD)

## Database Schema (Prisma Models)

- **User**: Stores user credentials and links to related data.
- **Transaction**: Records details of individual stock trades.
- **JournalEntry**: Contains personal reflections and details linked one-to-one with a Transaction.
- **Tag**: User-defined tags for categorizing Journal Entries.
- **JournalEntryTag**: Join table for the many-to-many relationship between JournalEntry and Tag.
- **Strategy**: Stores user-authored trading strategies.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd trading-journal
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up PostgreSQL:**
    - Install PostgreSQL on your local machine or use a cloud service
    - Create a new database:
      ```sql
      CREATE DATABASE trading_journal;
      ```
    - Create a database user (optional, you can use the postgres default user):
      ```sql
      CREATE USER tjuser WITH PASSWORD 'your_password';
      GRANT ALL PRIVILEGES ON DATABASE trading_journal TO tjuser;
      ```

4.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following variables (adjust values as needed):
    ```dotenv
    # PostgreSQL connection string
    DATABASE_URL="postgresql://username:password@localhost:5432/trading_journal"

    # Generate a strong secret: https://generate-secret.vercel.app/32
    NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
    NEXTAUTH_URL="http://localhost:3000" # Or your deployment URL

    # Add any other required environment variables for external APIs (e.g., TCBS, Market Data)
    ```

5.  **Set up the database:**
    Apply migrations to create the database schema:
    ```bash
    npx prisma migrate dev
    ```
    Generate the Prisma Client:
    ```bash
    npx prisma generate
    ```

6.  **Run the development server:**
    ```bash
    npm run dev
    ```

7.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

ISC (Based on package.json - Please verify and update if necessary)

## Acknowledgements

- Built for traders seeking to improve through journaling and analysis.
- Thanks to the communities behind Next.js, Prisma, Tailwind CSS, NextAuth.js, and other libraries used.
