# HR Attendance Dashboard

## 🌐 Live Demo

[http://mindwavex.com/demos/EmployeeAttendanceManagement](http://mindwavex.com/demos/EmployeeAttendanceManagement)

A modern, responsive HR Attendance Dashboard built with React, TypeScript, and Tailwind CSS. This is a demo application with hardcoded data showcasing employee attendance tracking, timesheet management, and reporting features.

## 🚀 Features

- **📊 Overview Dashboard**: Key attendance metrics and statistics
- **👥 Employee Attendance**: Searchable employee list with real-time attendance status
- **📅 Monthly Calendar**: Visual attendance calendar for individual employees
- **⏰ Timesheet Management**: Detailed time tracking with project allocation
- **📈 Department Reports**: Attendance analytics by department
- **🔍 Advanced Filtering**: Search and filter by employee, department, date, and status
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React + Heroicons
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **UI Components**: Headless UI

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd attendance-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── AttendanceTable.tsx
│   ├── DepartmentStats.tsx
│   ├── MonthlyCalendar.tsx
│   ├── StatsCards.tsx
│   └── TimesheetView.tsx
├── data/               # Mock data and generators
│   └── mockData.ts
├── types/              # TypeScript type definitions
│   └── attendance.ts
├── App.tsx            # Main application component
├── main.tsx          # Application entry point
└── index.css         # Global styles with Tailwind

```

## 📊 Demo Data

The application includes realistic demo data:

- **40 Employees** across 7 departments (Engineering, Design, Marketing, Sales, HR, Finance, Operations)
- **Monthly Attendance Records** with realistic patterns (85% present, 7% late, 5% half-day, 3% absent)
- **Timesheet Entries** with project allocation and overtime tracking
- **Department Statistics** with attendance rates
- **Avatar Generation** using DiceBear API

## 🏗 Building for Production

### Build Static Site

```bash
npm run build
```

This creates a `dist` folder with all static assets that can be deployed to any web server or CDN.

### Preview Build

```bash
npm run preview
```

### Deployment Options

Since this is a static site with no server dependencies, you can deploy it to:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Upload `dist` contents to `gh-pages` branch
- **AWS S3**: Upload `dist` contents to S3 bucket with static hosting
- **Any Web Server**: Upload `dist` contents to your web server

### Example Netlify Deployment

1. Run `npm run build`
2. Drag the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Your site will be live with a random URL

### Example Vercel Deployment

1. Push your code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Vercel will automatically detect Vite and deploy

## 🎨 Customization

### Styling

The project uses Tailwind CSS with a custom color scheme. You can modify:

- **Colors**: Update `tailwind.config.js` primary colors
- **Fonts**: Change font family in `index.css`
- **Components**: Modify component styles in individual files

### Data

To customize the demo data:

1. Edit `src/data/mockData.ts`
2. Modify employee count, departments, or attendance patterns
3. Update date ranges or add new projects

### Features

Add new features by:

1. Creating new components in `src/components/`
2. Adding new types in `src/types/attendance.ts`
3. Updating the navigation in `App.tsx`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

This is a demo project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙋‍♂️ Support

For questions or issues:

1. Check the existing issues
2. Create a new issue with detailed description
3. Include browser and system information

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
