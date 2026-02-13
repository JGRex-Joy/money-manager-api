# Money Manager Frontend

A modern, responsive personal finance management web application built with React and Vite. Track your income and expenses with beautiful visualizations and an intuitive user interface.

## Features

### 🔐 Authentication & User Management
- User registration with email verification
- Secure JWT-based authentication
- Protected routes with automatic redirects
- User profile display in sidebar

### 💰 Financial Management
- **Income Tracking**: Add, view, and delete income entries with categories
- **Expense Tracking**: Monitor spending with detailed expense records
- **Category Management**: Create custom categories for both income and expenses
- **Visual Analytics**: Interactive charts and graphs using Recharts
    - Line charts for income/expense trends
    - Pie charts for income vs expenses distribution
    - Bar charts for category-based analysis
    - Daily trend visualizations

### 📊 Dashboard
- Comprehensive financial overview
- Key metrics display (balance, income, expenses, savings rate)
- Multiple chart types for data visualization
- Recent transactions list
- Date range filtering with presets (today, this week, this month, custom, etc.)
- Top expense categories analysis

### 🔍 Advanced Filtering
- Search transactions by name
- Filter by date range
- Sort by date, amount, or name
- Toggle between income and expense views
- Ascending/descending order options

### 🎨 UI/UX Features
- Fully responsive design (mobile, tablet, desktop)
- Modern gradient-based color scheme
- Emoji picker for icons
- Toast notifications for user feedback
- Loading states and spinners
- Smooth animations and transitions
- Mobile-friendly navigation with hamburger menu

### 📱 Responsive Design
- Adaptive layouts for all screen sizes
- Mobile-optimized sidebar with overlay
- Touch-friendly buttons and inputs
- Responsive tables and charts

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Emoji**: emoji-picker-react

## Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Running backend API (see backend README)

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/JGRex-Joy/money-manager-api/tree/frontend.git
cd moneymanager-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1.0
```

For production:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api/v1.0
```

### 4. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview production build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── DateRangeFilter.jsx    # Date range selection component
│   ├── Layout.jsx             # Main layout wrapper with auth check
│   ├── Sidebar.jsx            # Navigation sidebar
│   └── Toaster.jsx            # Toast notification system
├── pages/                # Page components
│   ├── Category.jsx           # Category management
│   ├── Expense.jsx            # Expense tracking
│   ├── Filter.jsx             # Advanced filtering
│   ├── Hero.jsx               # Landing page
│   ├── Home.jsx               # Dashboard
│   ├── Income.jsx             # Income tracking
│   ├── Login.jsx              # Login page
│   └── Signup.jsx             # Registration page
├── utils/                # Utility functions
│   ├── api.js                 # Axios configuration & interceptors
│   └── formatters.js          # Currency and date formatters
├── App.jsx               # Main app component with routes
├── main.jsx              # Application entry point
└── index.css             # Global styles and Tailwind imports
```

## Key Components

### Layout Component
Provides authentication guard and consistent layout across protected pages:
- Checks for JWT token
- Redirects to home if not authenticated
- Includes sidebar navigation

### Sidebar Component
Responsive navigation with:
- Desktop: Fixed sidebar (64px width)
- Mobile: Hamburger menu with overlay
- User profile display
- Active route highlighting
- Logout functionality

### Toaster Component
Global notification system with three types:
- Success (green)
- Error (red)
- Info (blue)

Usage:
```javascript
import { toast } from '../components/Toaster';

toast.success('Operation successful!');
toast.error('Something went wrong');
toast.info('Information message');
```

### DateRangeFilter Component
Flexible date filtering with presets:
- Today, Yesterday
- This/Last Week
- This/Last Month
- This Quarter, This/Last Year
- All Time
- Custom Range

## API Integration

### Configuration (`src/utils/api.js`)

The API client is configured with:
- Base URL from environment variables
- Automatic JWT token injection
- Public endpoint detection
- 401 error handling with auto-logout
- Request/response interceptors

### API Endpoints Used

#### Authentication
- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /activate?token={token}` - Account activation

#### Income
- `GET /incomes` - Get current month incomes
- `POST /incomes` - Add new income
- `DELETE /incomes/{id}` - Delete income

#### Expenses
- `GET /expenses` - Get current month expenses
- `POST /expenses` - Add new expense
- `DELETE /expenses/{id}` - Delete expense

#### Categories
- `GET /categories` - Get all categories
- `GET /categories/{type}` - Get categories by type
- `POST /categories` - Create category
- `PUT /categories/{id}` - Update category
- `DELETE /categories/{id}` - Delete category

#### Dashboard
- `GET /dashboard` - Get dashboard data

#### Filtering
- `POST /filter` - Filter transactions with criteria

## Styling

### Tailwind CSS Configuration

The project uses Tailwind CSS v4 with:
- Custom animations (slide-in, scale-in, spin)
- Gradient backgrounds
- Responsive breakpoints
- Custom scrollbar styling

### Color Scheme

- **Primary**: Blue (#3b82f6) to Purple (#8b5cf6) gradients
- **Success/Income**: Green (#10b981)
- **Danger/Expense**: Red (#ef4444)
- **Background**: Light gray (#f9fafb)
- **Text**: Gray scale (#1f2937 to #6b7280)

### Custom CSS

Located in `src/index.css`:
- Custom animations
- Scrollbar styling
- Google Fonts (Outfit) integration
- Global transitions

## Formatters

### Currency Formatter
```javascript
formatCurrency(amount) // → "1 000 KGS"
```
- Uses Russian locale (ru-RU)
- Currency: KGS (Kyrgyzstani Som)
- Adaptive decimal places (0-2)

### Date Formatter
```javascript
formatDate(date) // → "13.02.2026"
```
- Format: DD.MM.YYYY

### DateTime Formatter
```javascript
formatDateTime(date) // → "13.02.2026, 14:30"
```
- Format: DD.MM.YYYY, HH:MM

## Charts and Visualizations

### Chart Types Used

1. **Line Charts**: Income and expense trends over time
2. **Pie Charts**: Income vs expense distribution, category breakdowns
3. **Bar Charts**: Category comparison, expense analysis

### Recharts Configuration

- Responsive containers that adapt to screen size
- Custom tooltips with detailed information
- Color-coded data series
- Interactive legends
- Animated transitions

## Features in Detail

### Dashboard Analytics

The dashboard provides:
- **Total Balance**: Income minus expenses
- **Total Income**: Sum of all income
- **Total Expenses**: Sum of all expenses
- **Savings Rate**: Percentage of income saved

### Date Range Filtering

Users can analyze data for specific periods:
- Preset ranges for quick access
- Custom date range selection
- Automatic data refresh on filter change

### Category Management

- Create custom income/expense categories
- Assign emoji icons
- Edit existing categories
- Delete categories (with cascade warning)
- Visual separation of income vs expense categories

### Transaction Management

- Add transactions with date, amount, category
- Emoji icons for visual identification
- Sort by date, amount, or name
- Delete transactions with confirmation

## Responsive Design Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

### Mobile Optimizations

- Collapsible sidebar menu
- Touch-friendly button sizes
- Responsive tables with horizontal scroll
- Stacked layouts on small screens
- Optimized font sizes

## Error Handling

### API Error Handling
- Automatic token expiration handling
- User-friendly error messages
- Toast notifications for errors
- Redirect to login on 401 errors

### Form Validation
- Required field validation
- Password matching check
- Minimum password length
- Email format validation

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of components (potential)
- Optimized re-renders with proper state management
- Efficient chart rendering
- Debounced search inputs (where applicable)

## Development Workflow

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if configured)
npm run lint
```

### Code Style

- Functional React components with hooks
- Component-based architecture
- Consistent naming conventions
- Modular CSS with Tailwind utilities

## Deployment

### Static Hosting (Netlify, Vercel, etc.)

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

3. Configure environment variables in your hosting dashboard:
    - `VITE_API_BASE_URL`

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
```

Build and run:
```bash
docker build -t moneymanager-frontend .
docker run -p 80:80 moneymanager-frontend
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api/v1.0` |

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Common Issues

**1. API Connection Failed**
- Check if backend server is running
- Verify `VITE_API_BASE_URL` in `.env`
- Check CORS configuration on backend

**2. Charts Not Rendering**
- Ensure Recharts is properly installed
- Check browser console for errors
- Verify data format matches chart requirements

**3. Authentication Issues**
- Clear localStorage and cookies
- Check token expiration
- Verify backend authentication endpoint

**4. Build Errors**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version compatibility

## Credits

- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Font**: [Outfit from Google Fonts](https://fonts.google.com/specimen/Outfit)

## Author

JGRex-Joy

---

**Note**: This application requires the Money Manager backend API to be running. See the backend README for setup instructions.