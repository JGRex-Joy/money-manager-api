# Money Manager API

A comprehensive personal finance management REST API built with Spring Boot. Track your income and expenses, manage categories, and get insights into your financial activities.

## Features

- **User Management**
    - User registration with email activation
    - JWT-based authentication
    - Secure password encryption with BCrypt

- **Category Management**
    - Create custom income and expense categories
    - Filter categories by type (income/expense)
    - Update and delete categories

- **Income & Expense Tracking**
    - Add, view, and delete income entries
    - Add, view, and delete expense entries
    - Automatic date assignment if not provided
    - Monthly transaction summaries

- **Dashboard**
    - Total balance calculation
    - Total income and expenses overview
    - Recent transactions (last 5 incomes and expenses)
    - Consolidated transaction history

- **Advanced Filtering**
    - Filter transactions by date range
    - Search by keyword
    - Sort by multiple fields (date, amount, etc.)
    - Support for both ascending and descending order

- **Automated Notifications**
    - Daily reminder emails to log transactions (10 PM UTC)
    - Daily expense summary emails (11 PM UTC)

## Tech Stack

- **Framework**: Spring Boot 3.x
- **Security**: Spring Security with JWT
- **Database**: MySQL (development), PostgreSQL (production)
- **ORM**: Hibernate/JPA
- **Email**: JavaMailSender (SMTP)
- **Build Tool**: Maven
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ (for local development)
- SMTP server credentials (Gmail recommended)

## Configuration

### Environment Variables

Set the following environment variables:

```bash
# Email Configuration
GMAIL_USERNAME=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
GMAIL_FROM_EMAIL=your-email@gmail.com

# Application URLs
MONEY_MANAGER_FRONTEND_URL=http://localhost:3000
MONEY_MANAGER_BACKEND_URL=http://localhost:8080
```

### Database Configuration

#### Development (MySQL)
Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/moneymanager
spring.datasource.username=root
spring.datasource.password=your_password
```

#### Production (PostgreSQL)
The application uses `application-prod.properties` for production deployment.

### JWT Secret

The JWT secret is configured in `application.properties`. For production, use a strong, unique secret key:
```properties
jwt.secret=your-super-secret-key-here
```

## Installation & Running

### 1. Clone the repository
```bash
git clone https://github.com/JGRex-Joy/money-manager-api.git
cd moneymanager
```

### 2. Set up environment variables
```bash
export GMAIL_USERNAME=your-email@gmail.com
export GMAIL_PASSWORD=your-app-password
export GMAIL_FROM_EMAIL=your-email@gmail.com
export MONEY_MANAGER_FRONTEND_URL=http://localhost:3000
export MONEY_MANAGER_BACKEND_URL=http://localhost:8080
```

### 3. Build the project
```bash
mvn clean install
```

### 4. Run the application
```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api/v1.0`

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Health Check
```http
GET /api/v1.0/status
GET /api/v1.0/health
```

#### User Registration & Authentication
```http
POST /api/v1.0/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

```http
GET /api/v1.0/activate?token={activation-token}
```

```http
POST /api/v1.0/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Protected Endpoints (Requires JWT Token)

All protected endpoints require an `Authorization` header:
```
Authorization: Bearer {jwt-token}
```

#### Categories
```http
# Create category
POST /api/v1.0/categories
Content-Type: application/json

{
  "name": "Salary",
  "icon": "💰",
  "type": "income"
}

# Get all categories
GET /api/v1.0/categories

# Get categories by type
GET /api/v1.0/categories/{type}

# Update category
PUT /api/v1.0/categories/{categoryId}

# Delete category
DELETE /api/v1.0/categories/{categoryId}
```

#### Income
```http
# Add income
POST /api/v1.0/incomes
Content-Type: application/json

{
  "name": "Monthly Salary",
  "icon": "💰",
  "categoryId": 1,
  "amount": 5000.00,
  "date": "2026-02-13"
}

# Get current month incomes
GET /api/v1.0/incomes

# Delete income
DELETE /api/v1.0/incomes/{id}
```

#### Expenses
```http
# Add expense
POST /api/v1.0/expenses
Content-Type: application/json

{
  "name": "Groceries",
  "icon": "🛒",
  "categoryId": 2,
  "amount": 150.00,
  "date": "2026-02-13"
}

# Get current month expenses
GET /api/v1.0/expenses

# Delete expense
DELETE /api/v1.0/expenses/{id}
```

#### Dashboard
```http
GET /api/v1.0/dashboard
```

Response:
```json
{
  "totalBalance": 4850.00,
  "totalIncome": 5000.00,
  "totalExpense": 150.00,
  "recent5Incomes": [...],
  "recent5Expenses": [...],
  "recentTransactions": [...]
}
```

#### Filter Transactions
```http
POST /api/v1.0/filter
Content-Type: application/json

{
  "type": "expense",
  "startDate": "2026-02-01",
  "endDate": "2026-02-28",
  "keyword": "grocery",
  "sortField": "date",
  "sortOrder": "desc"
}
```

## Security Features

- **Password Encryption**: BCrypt hashing algorithm
- **JWT Authentication**: Stateless authentication with 24-hour token validity
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Email Verification**: Two-step account activation process
- **Authorization Checks**: User-specific data access control

## Scheduled Tasks

The application runs two automated tasks:

1. **Daily Reminder** (10 PM UTC): Sends reminder emails to all users to log their daily transactions
2. **Expense Summary** (11 PM UTC): Sends a summary of daily expenses to users who had transactions

## Database Schema

### Main Entities

- **ProfileEntity**: User accounts and authentication
- **CategoryEntity**: Income/expense categories
- **IncomeEntity**: Income transactions
- **ExpenseEntity**: Expense transactions

### Relationships

- One Profile → Many Categories
- One Profile → Many Incomes
- One Profile → Many Expenses
- One Category → Many Incomes
- One Category → Many Expenses

## Error Handling

The API returns appropriate HTTP status codes:

- `200 OK`: Successful GET/PUT requests
- `201 Created`: Successful POST requests
- `204 No Content`: Successful DELETE requests
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Account not activated
- `404 Not Found`: Resource not found

## Development

### Project Structure
```
src/
├── main/
│   ├── java/
│   │   └── in/amir/moneymanager/
│   │       ├── config/          # Security & configuration
│   │       ├── controller/       # REST endpoints
│   │       ├── dto/             # Data transfer objects
│   │       ├── entity/          # JPA entities
│   │       ├── repository/      # Data access layer
│   │       ├── security/        # JWT filter
│   │       ├── service/         # Business logic
│   │       └── util/            # Utility classes
│   └── resources/
│       ├── application.properties
│       └── application-prod.properties
```

### Running Tests
```bash
mvn test
```

## Production Deployment

The application is configured for deployment on Render (or similar platforms) with PostgreSQL.

1. Set up PostgreSQL database
2. Configure environment variables
3. Update `application-prod.properties` with production credentials
4. Deploy using Maven package:
```bash
mvn clean package -DskipTests
java -jar target/moneymanager-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## Author

JGRex-Joy