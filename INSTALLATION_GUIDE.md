# Sales Ordering Center Management System
## Installation & Setup Guide

---

## Quick Start (5 Minutes)

### Option 1: Use in Claude.ai
1. Go to claude.ai
2. Create new conversation
3. Share this file: `sales_ordering_system.jsx`
4. System will render as interactive app
5. Start creating orders immediately

### Option 2: Use as React Component
1. Copy `sales_ordering_system.jsx`
2. Place in your React project: `/src/components/`
3. Import in your app:
   ```jsx
   import SalesOrderingSystem from './components/SalesOrderingSystem';
   ```
4. Add to your JSX:
   ```jsx
   <SalesOrderingSystem />
   ```
5. Ensure React version 16.8+ (hooks support)

### Option 3: Standalone HTML
1. Save as HTML file with React CDN
2. Open in browser
3. No additional setup needed

---

## Full Installation Guide

### System Requirements

#### Minimum Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- 50 MB disk space
- No server required
- Works offline

#### Recommended Setup
- **Browser**: Chrome or Firefox (latest)
- **RAM**: 4 GB minimum
- **CPU**: Any modern processor
- **Internet**: Not required

#### Operating Systems
- Windows 7+
- macOS 10.12+
- Linux (all distributions)
- iOS 12+
- Android 5+

### Step 1: Prepare Your Environment

#### For React Project
```bash
# Navigate to your React project
cd /path/to/your/react-app

# Ensure React is installed
npm list react

# If not installed, install React
npm install react react-dom

# Check React version (must be 16.8+)
npm list react
```

#### For Standalone Use
No installation needed - just a modern browser.

### Step 2: Copy Application Files

#### Method A: Copy Component File
```bash
# Copy the React component
cp sales_ordering_system.jsx src/components/

# File structure should be:
# your-app/
# ├── src/
# │   ├── components/
# │   │   └── SalesOrderingSystem.jsx  ← Place here
# │   ├── App.js
# │   └── index.js
# └── package.json
```

#### Method B: Create New App with Create React App
```bash
# Create new React app
npx create-react-app sales-ordering-system

# Navigate to app
cd sales-ordering-system

# Copy component file
cp ../sales_ordering_system.jsx src/components/

# Start development server
npm start
```

### Step 3: Integration

#### For React Component Import
```jsx
// App.js
import React from 'react';
import SalesOrderingSystem from './components/SalesOrderingSystem';

function App() {
  return (
    <div className="App">
      <SalesOrderingSystem />
    </div>
  );
}

export default App;
```

#### For Next.js
```jsx
// pages/orders.js
import dynamic from 'next/dynamic';

const SalesOrderingSystem = dynamic(
  () => import('../components/SalesOrderingSystem'),
  { ssr: false }
);

export default function OrdersPage() {
  return <SalesOrderingSystem />;
}
```

#### For HTML/CDN Usage
```html
<!DOCTYPE html>
<html>
<head>
    <title>Sales Ordering System</title>
</head>
<body>
    <div id="root"></div>
    
    <!-- React from CDN -->
    <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/react.production.min.js"></script>
    <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/react-dom.production.min.js"></script>
    
    <!-- Your App -->
    <script src="sales_ordering_system.js"></script>
</body>
</html>
```

### Step 4: Configure Styling

#### CSS Variables Setup
Add to your main CSS file:

```css
:root {
  /* Text Colors */
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-tertiary: #999999;
  --color-text-info: #378ADD;
  --color-text-danger: #E24B4A;
  --color-text-success: #3B6D11;
  --color-text-warning: #EF9F27;
  
  /* Background Colors */
  --color-background-primary: #ffffff;
  --color-background-secondary: #f8f8f7;
  --color-background-tertiary: #f0f0ee;
  --color-background-info: #E6F1FB;
  --color-background-danger: #FCEBEB;
  --color-background-success: #EAF3DE;
  --color-background-warning: #FAEEDA;
  
  /* Border Colors */
  --color-border-tertiary: rgba(0, 0, 0, 0.1);
  --color-border-secondary: rgba(0, 0, 0, 0.3);
  --color-border-primary: rgba(0, 0, 0, 0.4);
  
  /* Layout */
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  
  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-serif: Georgia, "Times New Roman", Times, serif;
  --font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: #e8e8e8;
    --color-text-secondary: #999999;
    --color-background-primary: #1a1a1a;
    --color-background-secondary: #2a2a2a;
    --color-background-tertiary: #333333;
    --color-border-tertiary: rgba(255, 255, 255, 0.1);
    --color-border-secondary: rgba(255, 255, 255, 0.2);
  }
}

* {
  box-sizing: border-box;
  font-family: var(--font-sans);
}

body {
  margin: 0;
  background: var(--color-background-tertiary);
  color: var(--color-text-primary);
}
```

### Step 5: Verify Installation

#### Check Setup
```javascript
// In browser console
console.log('React version:', React.version);
console.log('Storage available:', !!window.storage);
console.log('CSS variables:', 
  getComputedStyle(document.documentElement)
    .getPropertyValue('--color-text-primary'));
```

#### Test Application
1. Navigate to application URL
2. Check if interface loads
3. Try creating test order
4. Verify data saves
5. Refresh page and check if data persists

### Step 6: Customize (Optional)

#### Change Color Scheme
```css
:root {
  /* Change primary brand color */
  --color-text-info: #your-color;
  
  /* Change accent colors */
  --color-text-success: #your-color;
  --color-text-warning: #your-color;
  --color-text-danger: #your-color;
}
```

#### Change Storage Key
Edit in component:
```javascript
const STORAGE_KEY = 'your-custom-key';

const saveOrders = async (newOrders) => {
  await window.storage.set(STORAGE_KEY, JSON.stringify(newOrders));
};
```

#### Change Date Format
```javascript
// From: 'en-IN'
// Options: 'en-US', 'en-GB', 'de-DE', 'fr-FR'

createdDate: new Date().toLocaleDateString('en-US'),
createdTime: new Date().toLocaleTimeString('en-US'),
```

---

## Environment Setup by OS

### Windows 10/11

#### Using VS Code + Node.js
```bash
# 1. Install Node.js from nodejs.org
# 2. Verify installation
node --version
npm --version

# 3. Create app directory
mkdir sales-ordering-system
cd sales-ordering-system

# 4. Create React app
npx create-react-app .

# 5. Copy component
copy ..\sales_ordering_system.jsx src\components\

# 6. Update App.js (see Integration section)

# 7. Run
npm start

# 8. Open http://localhost:3000
```

### macOS

#### Using Terminal + Homebrew
```bash
# 1. Install Node.js
brew install node

# 2. Verify
node --version

# 3. Create project
mkdir sales-ordering-system
cd sales-ordering-system

# 4. Create React app
npx create-react-app .

# 5. Copy component
cp ../sales_ordering_system.jsx src/components/

# 6. Update App.js

# 7. Run
npm start
```

### Linux (Ubuntu/Debian)

```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Verify
node --version

# 3. Create project
mkdir sales-ordering-system
cd sales-ordering-system

# 4. Create React app
npx create-react-app .

# 5. Copy component
cp ../sales_ordering_system.jsx src/components/

# 6. Update App.js

# 7. Run
npm start
```

---

## Deployment Options

### Option 1: Local/Desktop Use
1. Save as `.html` file
2. Open with browser
3. Use directly from desktop
4. Data stored locally

### Option 2: Internal Network
```bash
# 1. Build React app
npm run build

# 2. Copy 'build' folder to web server
# 3. Configure web server (Apache, Nginx)
# 4. Access via intranet URL
```

### Option 3: Cloud Deployment

#### GitHub Pages
```bash
# 1. Create GitHub repository
# 2. Install gh-pages
npm install --save-dev gh-pages

# 3. Add to package.json
"homepage": "https://yourname.github.io/sales-ordering",
"scripts": {
  "deploy": "npm run build && gh-pages -d build"
}

# 4. Deploy
npm run deploy
```

#### Netlify
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build
npm run build

# 3. Deploy
netlify deploy --prod --dir=build
```

#### Vercel
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod
```

### Option 4: Docker Container
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t sales-ordering .
docker run -p 3000:3000 sales-ordering
```

---

## Configuration File

Create `config.js`:

```javascript
export const config = {
  // Application
  appName: 'Sales Ordering Center',
  version: '1.0.0',
  
  // Storage
  storageKey: 'sales-orders',
  storageBackup: 'sales-orders-backup',
  
  // Dates
  dateFormat: 'en-IN',
  dateFormatOptions: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  },
  
  // Order Status
  orderStatuses: [
    'Sample Collection',
    'In R&D',
    'Product Testing',
    'Order Confirmed',
    'Dispatch',
    'Completed'
  ],
  
  // Status Colors
  statusColors: {
    'Sample Collection': '#EF9F27',
    'In R&D': '#378ADD',
    'Product Testing': '#E24B4A',
    'Order Confirmed': '#3B6D11',
    'Dispatch': '#534AB7',
    'Completed': '#0F6E56'
  },
  
  // Limits
  maxOrdersPerCustomer: 1000,
  maxCustomerNameLength: 100,
  maxSampleDetailsLength: 1000,
  
  // Features
  enableSearch: true,
  enableFilter: true,
  enableExport: false,  // Future
  enableNotifications: false,  // Future
};
```

Import in component:
```javascript
import { config } from './config';

const ORDER_STATUSES = config.orderStatuses;
```

---

## Troubleshooting Installation

### Issue: React not loading
**Solution**:
```bash
# Reinstall React
npm install react react-dom@latest

# Check version
npm list react
```

### Issue: CSS variables not working
**Solution**: Ensure CSS variables defined in global stylesheet
```css
:root {
  --color-text-primary: #1a1a1a;
  /* etc */
}
```

### Issue: Data not persisting
**Solution**: Check browser storage
```javascript
// In browser console
console.log(window.storage);
localStorage.getItem('sales-orders');
```

### Issue: Component not rendering
**Solution**:
1. Check browser console for errors
2. Verify React is imported
3. Check CSS is loaded
4. Try hard refresh (Ctrl+Shift+R)

### Issue: Slow performance
**Solution**:
1. Clear browser cache
2. Check for large datasets
3. Use browser dev tools profiler
4. Consider implementing virtual scrolling

---

## Post-Installation Setup

### 1. Initial Data Entry
```javascript
// Start entering your first orders
// Dashboard → New Order tab → Fill form → Create
```

### 2. User Training
- All team members complete user documentation
- Practice with sample data
- Review workflow processes
- Establish best practices

### 3. Backup Strategy
```javascript
// Export orders periodically
const exportOrders = () => {
  const orders = JSON.parse(
    localStorage.getItem('sales-orders')
  );
  const dataStr = JSON.stringify(orders, null, 2);
  const dataBlob = new Blob([dataStr], 
    { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `orders-${Date.now()}.json`;
  link.click();
};
```

### 4. Regular Maintenance
- Monthly: Export and backup data
- Quarterly: Review and archive old orders
- Annually: Update system and migrate data

---

## System Health Check

Run monthly:

```javascript
// Check 1: Storage usage
const orders = JSON.parse(
  localStorage.getItem('sales-orders') || '[]'
);
const sizeInBytes = 
  new Blob([JSON.stringify(orders)]).size;
console.log(`Storage used: ${(sizeInBytes / 1024).toFixed(2)} KB`);

// Check 2: Data integrity
const hasAllRequiredFields = orders.every(o =>
  o.id && o.customerName && o.status && o.createdDate
);
console.log('Data integrity:', hasAllRequiredFields ? 'OK' : 'ERROR');

// Check 3: Performance
console.time('Filter orders');
const filtered = orders.filter(o => o.status === 'Order Confirmed');
console.timeEnd('Filter orders');

// Check 4: Latest order
const latest = orders[orders.length - 1];
console.log('Latest order:', latest?.id, latest?.createdDate);
```

---

## Support Resources

### Documentation
- `SYSTEM_DOCUMENTATION.md` - User guide
- `TECHNICAL_GUIDE.md` - Developer guide
- This file - Setup guide

### Online Resources
- React Documentation: https://react.dev
- MDN Web Docs: https://developer.mozilla.org
- Browser Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Storage

### Getting Help
1. Check documentation
2. Review system logs (browser console)
3. Test with sample data
4. Clear cache and refresh
5. Contact system administrator

---

## Next Steps

1. ✅ Installation complete
2. ✅ Review user documentation
3. ✅ Create test orders
4. ✅ Set up team access
5. ✅ Begin data entry
6. ✅ Monitor and optimize

---

**Installation Guide Version**: 1.0  
**Last Updated**: May 19, 2026  
**Support**: See documentation files included
