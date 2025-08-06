# 🏦 Banking API

A robust RESTful API for banking operations built with Node.js, Express, and TypeScript.

## 📋 About the Project

This API simulates basic banking operations such as deposits, withdrawals, transfers, and balance inquiries. It was developed following best development practices with TypeScript, complete Swagger documentation, and well-structured code.

### ✨ Features

- **💰 Deposits**: Make deposits to existing accounts or create new accounts
- **💸 Withdrawals**: Withdraw amounts from accounts with balance verification
- **🔄 Transfers**: Transfer amounts between different accounts
- **📊 Balance Inquiry**: Check the current balance of any account
- **🔄 Reset**: Clear all data to restart the system
- **📚 Documentation**: Swagger interface to test and explore the API

### 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Typed superset of JavaScript
- **Swagger/OpenAPI** - API documentation
- **Biome** - Code linter and formatter
- **CORS** - Cross-Origin Resource Sharing enablement

## 🚀 Installation and Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/souph1s/banking-api.git
cd banking-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the project

#### Development (with hot reload)

```bash
npm run dev
```

#### Production

```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## 📖 API Documentation

### Swagger UI

Access the interactive documentation at: `http://localhost:3000/api-docs`

### Available Endpoints

#### 🔄 Reset
- **POST** `/reset` - Clears all system data

#### 📊 Balance Inquiry
- **GET** `/balance?account_id={id}` - Queries an account's balance

#### 💳 Banking Operations
- **POST** `/event` - Executes banking operations (deposit, withdrawal, transfer)

## 🧪 Usage Examples

### 1. System Reset

```http
POST http://localhost:3000/reset
```

**Response:**
```
Ok
```

### 2. Make a Deposit

```http
POST http://localhost:3000/event
Content-Type: application/json

{
  "type": "deposit",
  "destination": "100",
  "amount": 10
}
```

**Response:**
```json
{
  "destination": {
    "id": "100",
    "balance": 10
  }
}
```

### 3. Check Balance

```http
GET http://localhost:3000/balance?account_id=100
```

**Response:**
```json
{
  "id": "100",
  "balance": 10
}
```

### 4. Make a Withdrawal

```http
POST http://localhost:3000/event
Content-Type: application/json

{
  "type": "withdraw",
  "origin": "100",
  "amount": 5
}
```

**Response:**
```json
{
  "origin": {
    "id": "100",
    "balance": 5
  }
}
```

### 5. Make a Transfer

```http
POST http://localhost:3000/event
Content-Type: application/json

{
  "type": "transfer",
  "origin": "100",
  "destination": "200",
  "amount": 3
}
```

**Response:**
```json
{
  "origin": {
    "id": "100",
    "balance": 2
  },
  "destination": {
    "id": "200",
    "balance": 3
  }
}
```

## 🏗️ Project Structure
```json
banking-api/
├── src/
│   ├── routes/          # API route definitions
│   │   ├── balance.ts   # Balance inquiry route
│   │   ├── event.ts     # Banking operations routes
│   │   └── reset.ts     # System reset route
│   ├── services/        # Business logic
│   │   └── accountService.ts  # Account management
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts     # Interfaces and types
│   ├── server.ts        # Express server configuration
│   └── swagger.ts       # Swagger configuration
├── test.http            # HTTP request examples
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── biome.json           # Biome configuration
└── README.md            # This file
```

## 🧩 Architecture

### Application Layers

1. **Routes**: Responsible for receiving HTTP requests and validating input data
2. **Services**: Contain business logic and data manipulation
3. **Types**: TypeScript interface and type definitions for type safety

### Technical Features

- **Type Safety**: Extensive use of TypeScript to prevent errors
- **Modularity**: Code organized into well-defined modules
- **Documentation**: API completely documented with Swagger
- **Validation**: Robust input data validation
- **Error Handling**: Centralized middleware for error handling

## 🔧 Available Scripts

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `npm run build`  | Compiles the TypeScript project          |
| `npm start`      | Runs the compiled project                |
| `npm run dev`    | Runs in development mode with hot reload |
| `npm run lint`   | Runs code linter                         |
| `npm run format` | Formats code automatically               |
| `npm run check`  | Runs linting and formatting              |

## 🔍 Validations and Business Rules

### Deposit Operations
- If the account doesn't exist, it will be created automatically with the deposit amount
- The deposit amount must be positive

### Withdrawal Operations
- The account must exist
- The account balance must be sufficient for the withdrawal
- Returns 404 error if the account doesn't exist

### Transfer Operations
- The origin account must exist
- The origin account must have sufficient balance
- The destination account will be created automatically if it doesn't exist
- Returns 404 error if the origin account doesn't exist

### Balance Inquiry
- Returns 404 error if the account doesn't exist

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 👩‍💻 Author

**Sophia Muraro**

---

⭐ If this project was useful to you, consider giving it a star on the repository!
