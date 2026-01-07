import { PricingTier, Project, License, User } from '../types';

const LONG_DESC_1 = "Experience the power of advanced GANs right in your browser. PhotoFix AI automatically detects subjects, removes backgrounds with pixel-perfect precision, and upscales low-resolution images up to 4x without losing quality. Ideal for e-commerce owners, graphic designers, and social media managers who need professional results in seconds, not hours.";
const LONG_DESC_2 = "Stop writing boilerplate code. CodeWhisperer Lite integrates directly into VS Code to analyze your functions and generate comprehensive unit tests (Jest, Mocha, PyTest) automatically. It handles edge cases, mocks external dependencies, and ensures your code coverage stays high. A must-have for TDD enthusiasts.";
const LONG_DESC_3 = "Transform your messy CSV and Excel files into interactive, beautiful dashboards using simple natural language prompts. DataSense Pro uses LLMs to understand your data structure and suggest the most impactful visualizations. Export to PDF, HTML, or embed in your Notion pages. Enterprise-grade encryption ensures your data stays private.";

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'PhotoFix AI',
    description: LONG_DESC_1,
    images: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=11',
      'https://picsum.photos/800/600?random=12'
    ],
    pricingTier: PricingTier.Standard,
    interval: 'lifetime',
    categories: ['Design', 'AI', 'Productivity'],
    developerName: 'PixelLabs',
    projectSecret: 'sk_live_dh_photo_123',
    sales: 1240,
    revenue: 12276.00,
    status: 'active',
    ranking: 1,
    appType: 'web',
    appUrl: 'https://photofix.ai/app',
    features: [
      {
        title: "Get insights to rank high on Google",
        description: "Research articles in your niche quickly, so you can get an edge over your competition. Analyze SERPs and extract content for each keyword and query from the highest-ranking pages.",
        imageUrl: "https://picsum.photos/800/500?random=101",
        mediaType: 'image'
      },
      {
        title: "Generate content and drafts with AI",
        description: "Create facts-based and entity-rich content that gets high-ranking results in search engines. Start from scratch or scrape Google searches and competitor sites for content ideas.",
        imageUrl: "https://picsum.photos/800/500?random=102",
        mediaType: 'image'
      },
      {
        title: "Optimize your content for high rankings",
        description: "Auto-optimize content and add internal links to improve content score and rankings. Access NLP and SERP-driven recommendations and an overall content score to see how you rank against competitors.",
        imageUrl: "https://picsum.photos/800/500?random=103",
        mediaType: 'image'
      }
    ]
  },
  {
    id: '2',
    name: 'CodeWhisperer Lite',
    description: LONG_DESC_2,
    images: [
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=21'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    pricingTier: PricingTier.Free,
    interval: 'lifetime',
    categories: ['DevTools', 'Coding'],
    developerName: 'DevTools Inc',
    projectSecret: 'sk_live_dh_code_456',
    sales: 5000,
    revenue: 0,
    status: 'active',
    ranking: 2,
    appType: 'desktop',
    appUrl: 'https://codewhisperer.com/download',
    features: []
  },
  {
    id: '3',
    name: 'DataSense Pro',
    description: LONG_DESC_3,
    images: [
      'https://picsum.photos/800/600?random=3'
    ],
    pricingTier: PricingTier.Premium,
    interval: 'lifetime',
    categories: ['Business', 'Analytics'],
    developerName: 'Analytica',
    projectSecret: 'sk_live_dh_data_789',
    sales: 85,
    revenue: 1691.50,
    status: 'active',
    ranking: 5,
    appType: 'web',
    appUrl: 'https://datasense.io/dashboard',
    features: []
  },
  {
    id: '4',
    name: 'VoiceClone',
    description: 'Create realistic text-to-speech models of your own voice for content creation. Upload a 30-second sample and generate hours of audio in any language.',
    images: [
      'https://picsum.photos/800/600?random=4',
      'https://picsum.photos/800/600?random=41',
      'https://picsum.photos/800/600?random=42',
      'https://picsum.photos/800/600?random=43'
    ],
    pricingTier: PricingTier.Premium,
    interval: 'lifetime',
    categories: ['Audio', 'AI', 'Content Creation'],
    developerName: 'AudioGen',
    sales: 342,
    revenue: 6805.80,
    status: 'active',
    ranking: 3,
    appType: 'desktop',
    appUrl: 'https://voiceclone.ai/setup.exe',
    features: []
  },
  {
    id: '5',
    name: 'LogoMoji',
    description: 'Generate cute SVG logos for your side projects in seconds. Just type a keyword and get a unique, vector-ready logo style perfect for startups.',
    images: [
      'https://picsum.photos/800/600?random=5',
      'https://picsum.photos/800/600?random=51'
    ],
    pricingTier: PricingTier.Standard,
    interval: 'lifetime',
    categories: ['Design', 'Marketing'],
    developerName: 'CreativeBit',
    sales: 890,
    revenue: 8811.00,
    status: 'review',
    ranking: 4,
    appType: 'web',
    appUrl: 'https://logomoji.com/create',
    features: []
  },
  {
    id: '6',
    name: 'NotionFlow',
    description: 'Sync your Google Calendar, Todoist, and Slack directly into Notion databases with 2-way sync. Never miss a meeting or task again.',
    images: ['https://picsum.photos/800/600?random=6'],
    pricingTier: PricingTier.Standard,
    interval: 'lifetime',
    categories: ['Productivity', 'Business'],
    developerName: 'FlowState',
    sales: 120,
    revenue: 1188.00,
    status: 'active',
    ranking: 6,
    appType: 'desktop',
    appUrl: 'https://notionflow.app/download',
    features: []
  },
  {
    id: '7',
    name: 'SeoMatic',
    description: 'Automated SEO audits for Next.js and React applications. Checks meta tags, OG images, and performance metrics in your CI/CD pipeline.',
    images: ['https://picsum.photos/800/600?random=7'],
    pricingTier: PricingTier.Premium,
    interval: 'lifetime',
    categories: ['DevTools', 'Marketing'],
    developerName: 'GrowthHacker',
    sales: 45,
    revenue: 895.50,
    status: 'active',
    ranking: 7,
    appType: 'web',
    appUrl: 'https://seomatic.dev',
    features: []
  },
  {
    id: '8',
    name: 'ZenWriter',
    description: 'A distraction-free writing environment with AI auto-complete that mimics your personal tone of voice. Supports markdown and direct publishing.',
    images: ['https://picsum.photos/800/600?random=8'],
    pricingTier: PricingTier.Standard,
    interval: 'lifetime',
    categories: ['Writing', 'Productivity', 'AI'],
    developerName: 'ZenSoft',
    sales: 230,
    revenue: 2277.00,
    status: 'active',
    ranking: 8,
    appType: 'desktop',
    appUrl: 'https://zenwriter.io/download',
    features: []
  }
];

export const REVENUE_DATA = [
  { name: 'Jan', revenue: 400 },
  { name: 'Feb', revenue: 1200 },
  { name: 'Mar', revenue: 3500 },
  { name: 'Apr', revenue: 3100 },
  { name: 'May', revenue: 4800 },
  { name: 'Jun', revenue: 6200 },
];

// Helper to generate mock licenses with date logic
const generateLicenses = (): License[] => {
  const licenses: License[] = [];
  const today = new Date();
  
  MOCK_PROJECTS.forEach(project => {
    // Generate 5-10 licenses per project
    const count = Math.floor(Math.random() * 5) + 5;
    for (let i = 0; i < count; i++) {
      const isRecent = Math.random() > 0.5;
      
      // Calculate random purchase date in the past
      const purchaseDateObj = new Date(today);
      purchaseDateObj.setDate(today.getDate() - Math.floor(Math.random() * 120)); // Last 120 days
      const paymentDate = purchaseDateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
      
      // Calculate Expected Payout Date (60 days after)
      const payoutDateObj = new Date(purchaseDateObj);
      payoutDateObj.setDate(payoutDateObj.getDate() + 60);
      const expectedPayoutDate = payoutDateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });

      // Determine Status
      const isRefunded = Math.random() > 0.95;
      
      let payoutStatus: License['payoutStatus'] = 'pending';
      if (isRefunded) {
          payoutStatus = 'cancelled';
      } else if (payoutDateObj < today) {
          payoutStatus = 'ready'; // older than 60 days
      }

      licenses.push({
        id: `lic_${Math.random().toString(36).substr(2, 9)}`,
        key: `DH-${Math.floor(Math.random() * 10000)}-${project.name.substring(0,3).toUpperCase()}`,
        projectId: project.id,
        projectName: project.name,
        paymentDate: paymentDate, // Confirmed date
        expectedPayoutDate: expectedPayoutDate,
        amount: project.pricingTier === PricingTier.Standard ? 9.90 : project.pricingTier === PricingTier.Premium ? 19.90 : 0,
        customerEmail: `user${Math.floor(Math.random() * 1000)}@example.com`,
        status: isRefunded ? 'refunded' : 'active',
        payoutStatus: payoutStatus
      });
    }
  });
  // Sort by date desc initially
  return licenses.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
};

export const MOCK_LICENSES = generateLicenses();

// Mock Users Data
export const MOCK_USERS: User[] = [
    { 
      id: 'u1', 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'buyer', 
      status: 'active', 
      joined: '2023-10-10', 
      lastLogin: new Date().toLocaleDateString('en-US'), 
      hasPurchases: true, 
      hasUploads: false 
    },
    { 
      id: 'u2', 
      name: 'PixelLabs Inc.', 
      email: 'support@pixellabs.com', 
      role: 'developer', 
      status: 'active', 
      joined: '2023-09-15', 
      lastLogin: new Date().toLocaleDateString('en-US'), 
      hasPurchases: false, 
      hasUploads: true 
    },
    { 
      id: 'u3', 
      name: 'DevTools Inc.', 
      email: 'admin@devtools.com', 
      role: 'developer', 
      status: 'suspended', 
      joined: '2023-11-20', 
      lastLogin: '2023-12-01', 
      hasPurchases: false, 
      hasUploads: true 
    },
    { 
      id: 'u4', 
      name: 'Alice Smith', 
      email: 'alice@test.com', 
      role: 'buyer', 
      status: 'active', 
      joined: '2024-01-05', 
      lastLogin: '2024-02-15', 
      hasPurchases: true, 
      hasUploads: false 
    },
    { 
      id: 'u5', 
      name: 'Ghost User', 
      email: 'ghost@test.com', 
      role: 'buyer', 
      status: 'inactive', 
      joined: '2023-01-01', 
      lastLogin: '2023-05-01', // Very old
      hasPurchases: false, 
      hasUploads: false 
    },
    { 
      id: 'u6', 
      name: 'Inactive But Paid', 
      email: 'paid@test.com', 
      role: 'buyer', 
      status: 'inactive', 
      joined: '2023-02-01', 
      lastLogin: '2023-06-01', 
      hasPurchases: true, 
      hasUploads: false 
    },
];