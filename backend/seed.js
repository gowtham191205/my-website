// ─────────────────────────────────────────────────
//  NexusHR — Database Seed Script
//  Usage: node seed.js
// ─────────────────────────────────────────────────
require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./models/Employee');
const Project  = require('./models/Project');
const Leave    = require('./models/Leave');
const User     = require('./models/User');

const EMPLOYEES = [
  { name:'Aditya Sharma',  email:'aditya@nexus.io',  role:'Full Stack Developer', department:'Engineering',  experience:5,  salary:95000,  skills:['React','Node.js','MongoDB','Docker'],          status:'active', location:'Bangalore, IN', phone:'+91 98765 43210', joinDate:'2022-03-15', performance:92 },
  { name:'Priya Mehta',    email:'priya@nexus.io',    role:'QA Engineer',          department:'QA',           experience:3,  salary:72000,  skills:['Selenium','Cypress','Jest','Postman'],          status:'active', location:'Mumbai, IN',    phone:'+91 87654 32109', joinDate:'2023-01-10', performance:87 },
  { name:'Rahul Nair',     email:'rahul@nexus.io',    role:'DevOps Engineer',      department:'DevOps',       experience:6,  salary:105000, skills:['Kubernetes','AWS','Terraform','CI/CD'],         status:'active', location:'Chennai, IN',   phone:'+91 76543 21098', joinDate:'2021-07-01', performance:95 },
  { name:'Sneha Iyer',     email:'sneha@nexus.io',    role:'UI/UX Designer',       department:'Design',       experience:4,  salary:82000,  skills:['Figma','Adobe XD','Sketch','Prototyping'],     status:'bench',  location:'Pune, IN',      phone:'+91 65432 10987', joinDate:'2022-11-20', performance:89 },
  { name:'Vikram Gupta',   email:'vikram@nexus.io',   role:'Engineering Manager',  department:'Management',   experience:10, salary:145000, skills:['Leadership','Agile','Scrum','System Design'], status:'active', location:'Delhi, IN',     phone:'+91 54321 09876', joinDate:'2020-05-15', performance:94 },
  { name:'Ananya Das',     email:'ananya@nexus.io',   role:'Data Scientist',       department:'Data Science', experience:4,  salary:98000,  skills:['Python','TensorFlow','Spark','SQL'],           status:'active', location:'Hyderabad, IN', phone:'+91 43210 98765', joinDate:'2022-08-01', performance:91 },
  { name:'Karthik Reddy',  email:'karthik@nexus.io',  role:'Backend Developer',    department:'Engineering',  experience:7,  salary:110000, skills:['Java','Spring Boot','Kafka','Redis'],          status:'active', location:'Bangalore, IN', phone:'+91 32109 87654', joinDate:'2021-02-10', performance:88 },
  { name:'Meera Pillai',   email:'meera@nexus.io',    role:'ML Engineer',          department:'Data Science', experience:3,  salary:96000,  skills:['PyTorch','Hugging Face','FastAPI','Docker'],   status:'leave',  location:'Trivandrum, IN',phone:'+91 21098 76543', joinDate:'2023-04-05', performance:85 },
];

const PROJECTS = [
  { name:'NexusERP v2.0',          description:'Enterprise resource planning overhaul',       stack:'React, Node.js, MongoDB',      status:'Active',    progress:68, teamSize:8, startDate:'2024-01-15', endDate:'2024-12-31' },
  { name:'AI Analytics Platform',  description:'Real-time analytics with ML-powered insights',stack:'Python, TensorFlow, Spark',    status:'Active',    progress:45, teamSize:5, startDate:'2024-03-01', endDate:'2025-03-01' },
  { name:'DevSecOps Pipeline',      description:'Automated CI/CD with security scanning',      stack:'Jenkins, Docker, Terraform',   status:'Active',    progress:82, teamSize:4, startDate:'2024-02-10', endDate:'2024-09-30' },
  { name:'Mobile App Redesign',     description:'Complete UX overhaul of flagship mobile app', stack:'React Native, Figma',          status:'Planning',  progress:15, teamSize:3, startDate:'2024-06-01', endDate:'2024-11-30' },
  { name:'Data Warehouse Migration',description:'Migrate legacy DWH to cloud-native solution', stack:'AWS Redshift, dbt, Airflow',   status:'On Hold',   progress:30, teamSize:4, startDate:'2024-01-01', endDate:'2025-01-01' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nexushr');
  console.log('✅ Connected to MongoDB');

  // Clear collections
  await Promise.all([Employee.deleteMany(), Project.deleteMany(), Leave.deleteMany(), User.deleteMany()]);
  console.log('🗑  Cleared existing data');

  // Seed employees
  const employees = await Employee.insertMany(EMPLOYEES);
  console.log(`👥 Seeded ${employees.length} employees`);

  // Seed projects
  await Project.insertMany(PROJECTS);
  console.log(`🚀 Seeded ${PROJECTS.length} projects`);

  // Seed leaves
  await Leave.insertMany([
    { employee: employees[7]._id, empName: employees[7].name, type:'Sick Leave',    fromDate:'2024-07-01', toDate:'2024-07-07', reason:'Medical procedure', status:'approved' },
    { employee: employees[3]._id, empName: employees[3].name, type:'Annual Leave',  fromDate:'2024-07-15', toDate:'2024-07-22', reason:'Family vacation',   status:'pending'  },
    { employee: employees[1]._id, empName: employees[1].name, type:'Comp Off',      fromDate:'2024-07-10', toDate:'2024-07-11', reason:'Weekend support',   status:'approved' },
    { employee: employees[6]._id, empName: employees[6].name, type:'Annual Leave',  fromDate:'2024-08-05', toDate:'2024-08-12', reason:'Personal travel',   status:'pending'  },
  ]);
  console.log('📅 Seeded 4 leave requests');

  // Seed admin user
  await User.create({ name:'Admin User', email:'admin@nexushr.com', password:'Admin@123', role:'Admin', org:'NexusHR' });
  console.log('🔐 Seeded admin user: admin@nexushr.com / Admin@123');

  console.log('\n✨ Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed error:', err); process.exit(1); });
