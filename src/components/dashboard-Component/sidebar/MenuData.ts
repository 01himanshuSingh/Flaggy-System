import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Briefcase,
  FileText,
  BarChart3,
  CheckSquare,
} from 'lucide-react'

export const menuItems = [
  {
    label: 'Main menu',
    items: [
      
      { icon: CreditCard, label: 'Transactions', href: '/transactions' },
      { icon: TrendingUp, label: 'Spending', href: '/spending' },
      { icon: Briefcase, label: 'Investment', href: '/investment' },
    ],
  },
  {
    label: 'Managements',
    items: [
      { icon: FileText, label: 'Financial Planning', href: '/financial-planning' },
      { icon: BarChart3, label: 'Management', href: '/management', badge: 'NEW' },
      { icon: CheckSquare, label: 'Subscriptions', href: '/subscriptions' },
    ],
  },
]
