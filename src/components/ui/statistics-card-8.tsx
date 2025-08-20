import { Badge } from '@/components/ui/badge-2';
import { Card, CardContent } from '@/components/ui/card-2';
import { DollarSign, TrendingUp, Users, Star, BarChart3, Calendar, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCard {
  icon: React.ComponentType<any>;
  iconColor: string;
  title: string;
  badge: {
    color: string;
    icon: React.ComponentType<any>;
    iconColor: string;
    text: string;
  };
  value: number | string;
  dateRange: string;
}

interface StatisticsCardProps {
  cards?: StatCard[];
  className?: string;
}

const defaultCards: StatCard[] = [
  {
    icon: DollarSign,
    iconColor: 'text-forest-green',
    title: 'Total Earnings',
    badge: {
      color: 'bg-forest-green/10 text-forest-green border-forest-green/20',
      icon: TrendingUp,
      iconColor: 'text-forest-green',
      text: '+15.2%',
    },
    value: '₦141,200',
    dateRange: 'From Jan 01 - Dec 30, 2024',
  },
  {
    icon: TrendingUp,
    iconColor: 'text-deep-orange',
    title: 'This Month',
    badge: {
      color: 'bg-deep-orange/10 text-deep-orange border-deep-orange/20',
      icon: TrendingUp,
      iconColor: 'text-deep-orange',
      text: '+8.7%',
    },
    value: '₦51,200',
    dateRange: 'From Dec 01 - Dec 30, 2024',
  },
  {
    icon: Users,
    iconColor: 'text-golden-yellow',
    title: 'Total Students',
    badge: {
      color: 'bg-golden-yellow/10 text-golden-yellow border-golden-yellow/20',
      icon: TrendingUp,
      iconColor: 'text-golden-yellow',
      text: '+12.3%',
    },
    value: 77,
    dateRange: 'All time students taught',
  },
  {
    icon: Star,
    iconColor: 'text-golden-yellow',
    title: 'Avg Rating',
    badge: {
      color: 'bg-golden-yellow/10 text-golden-yellow border-golden-yellow/20',
      icon: TrendingUp,
      iconColor: 'text-golden-yellow',
      text: '+0.2',
    },
    value: 4.85,
    dateRange: 'Based on student feedback',
  },
  {
    icon: BarChart3,
    iconColor: 'text-rich-plum',
    title: 'Total Classes',
    badge: {
      color: 'bg-rich-plum/10 text-rich-plum border-rich-plum/20',
      icon: TrendingUp,
      iconColor: 'text-rich-plum',
      text: '+3',
    },
    value: 12,
    dateRange: 'Classes created and taught',
  },
  {
    icon: Calendar,
    iconColor: 'text-warm-purple',
    title: 'Upcoming',
    badge: {
      color: 'bg-warm-purple/10 text-warm-purple border-warm-purple/20',
      icon: Calendar,
      iconColor: 'text-warm-purple',
      text: 'Soon',
    },
    value: 3,
    dateRange: 'Classes scheduled ahead',
  },
];

export default function StatisticsCard8({ cards = defaultCards, className }: StatisticsCardProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Container */}
      <div className="@container grow w-full">
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Cards */}
          {cards.map((card, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="flex flex-col h-full p-4">
                {/* Title & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <card.icon className={cn('size-5', card.iconColor)} />

                  <Badge className={cn('px-1.5 py-0.5 rounded-full border text-xs', card.badge.color)}>
                    <card.badge.icon className={cn('w-2.5 h-2.5', card.badge.iconColor)} />
                    {card.badge.text}
                  </Badge>
                </div>

                {/* Value & Date Range */}
                <div className="flex-1 flex flex-col justify-between grow">
                  {/* Value */}
                  <div>
                    <div className="text-xl font-bold text-charcoal-black mb-1">
                      {typeof card.value === 'number' && card.title.includes('₦') 
                        ? card.value.toLocaleString() 
                        : card.value}
                    </div>
                    <div className="text-xs text-warm-gray mb-3">{card.title}</div>
                  </div>
                  <div className="pt-2 border-t border-light-sand text-xs text-warm-gray">
                    {card.dateRange}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}