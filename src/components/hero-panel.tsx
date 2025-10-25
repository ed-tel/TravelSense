import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart3, Building2, Gift } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { StatWithChangeIndicator } from "./stat-with-change-indicator";
import type { DashboardStats, TransactionEntry } from "../App";
import { useMemo } from "react";
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { AnimatedNumber } from "./animated-number";

// Color palette for data types - vibrant pink, purple, blue, and green
const dataTypeColors = [
  "#EC4899", // Vibrant pink
  "#A855F7", // Vibrant purple
  "#3B82F6", // Vibrant blue
  "#10B981", // Vibrant green
  "#F472B6", // Alternative pink
  "#C084FC", // Alternative purple
  "#60A5FA", // Alternative blue
  "#34D399", // Alternative green
];

interface HeroPanelProps {
  userName?: string;
  stats: DashboardStats;
  transactionEntries: TransactionEntry[];
}

export function HeroPanel({ userName = "John", stats, transactionEntries = [] }: HeroPanelProps)
 {
  // Get first name from full name
  const firstName = userName.split(" ")[0];

  // Calculate how many new rewards earned (all time active)
  const newRewardsCount = useMemo(() => {
    return transactionEntries.filter(
      entry => entry.status === "Active"
    ).length;
  }, [transactionEntries]);

  // Calculate change from last month for data shares
  const dataSharesChange = useMemo(() => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    
    const currentMonthShares = transactionEntries.filter(
      entry => entry.timestamp >= currentMonthStart
    ).length;
    
    const lastMonthShares = transactionEntries.filter(
      entry => entry.timestamp >= lastMonthStart && entry.timestamp < currentMonthStart
    ).length;
    
    return lastMonthShares > 0 ? currentMonthShares - lastMonthShares : currentMonthShares;
  }, [transactionEntries]);

  // Calculate monthly chart data from actual transaction entries
  const monthlyData = useMemo(() => {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Generate last 6 months including current month
    const last6Months: {
      month: string;
      monthIndex: number;
      year: number;
      shares: number;
      earnings: number;
    }[] = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      last6Months.push({
        month: months[monthIndex],
        monthIndex,
        year,
        shares: 0,
        earnings: 0,
      });
    }
    
    // Count shares and earnings for each month
    transactionEntries.forEach(entry => {
      const entryDate = new Date(entry.timestamp);
      const entryMonth = entryDate.getMonth();
      const entryYear = entryDate.getFullYear();
      
      // Find matching month in our last6Months array
      const monthData = last6Months.find(
        m => m.monthIndex === entryMonth && m.year === entryYear
      );
      
      if (monthData) {
        monthData.shares += 1;
        
        // Add earnings only for Active entries
        if (entry.status === "Active") {
          const value = parseFloat(entry.value.replace(/[^0-9.]/g, '')) || 0;
          monthData.earnings += value;
        }
      }
    });
    
    // Round earnings to whole numbers
    return last6Months.map(m => ({
      month: m.month,
      shares: m.shares,
      earnings: Math.round(m.earnings),
    }));
  }, [transactionEntries]);

  // Calculate data types from actual transaction entries
  const dataTypes = useMemo(() => {
    const dataTypeCounts = new Map<string, number>();
    
    // Only count active transactions
    const activeTransactions = transactionEntries.filter(
      entry => entry.status === "Active"
    );

    // Parse and count each data type
    activeTransactions.forEach(entry => {
      // Split by comma in case multiple data types are listed
      const types = entry.dataType.split(",").map(type => type.trim());
      types.forEach(type => {
        if (type) {
          dataTypeCounts.set(type, (dataTypeCounts.get(type) || 0) + 1);
        }
      });
    });

    // Convert to array and add colors
    const result = Array.from(dataTypeCounts.entries())
      .map(([name, value], index) => ({
        name,
        value,
        color: dataTypeColors[index % dataTypeColors.length],
      }))
      .sort((a, b) => b.value - a.value); // Sort by count descending

    // If no data, show a placeholder
    if (result.length === 0) {
      return [
        { name: "No Data", value: 1, color: "#e5e7eb" },
      ];
    }

    return result;
  }, [transactionEntries]);

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1589395937920-07cce323acba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjB3b3JsZCUyMG1hcHxlbnwxfHx8fDE3NTg1ODY4MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="World Map"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative">
          <h1 className="text-3xl font-medium mb-2">Welcome back, {firstName}!</h1>
          {newRewardsCount === 0 ? (
            <>
              <p className="text-primary-foreground/90 mb-2">
                Start sharing your data with partners to unlock rewards.
              </p>
              <p className="text-primary-foreground/70 text-sm">
                Here's how your data is performing this month.
              </p>
            </>
          ) : newRewardsCount === 1 ? (
            <p className="text-primary-foreground/90">
              You've earned 1 new reward from your latest data shares.
            </p>
          ) : (
            <p className="text-primary-foreground/90">
              You've earned {newRewardsCount} new rewards from your data shares.
            </p>
          )}
        </div>
      </div>

      {/* Achievement Stats */}
      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Data Shares This Month */}
          <TooltipUI>
            <TooltipTrigger asChild>
              <div>
                <Card className="bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300 cursor-help">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm text-gray-700">Data Shares This Month</CardTitle>
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl">
                      <AnimatedNumber value={stats.monthlyDataShares} decimals={0} duration={600} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {dataSharesChange > 0 ? `+${dataSharesChange}` : dataSharesChange} from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Number of successful data-sharing transactions approved this month.</p>
            </TooltipContent>
          </TooltipUI>

          {/* Active Partners */}
          <TooltipUI>
            <TooltipTrigger asChild>
              <div>
                <Card className="bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300 cursor-help">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm text-gray-700">Active Partnerships</CardTitle>
                    <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl">
                      <AnimatedNumber value={stats.activePartnerships} decimals={0} duration={600} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Includes all ongoing partner connections
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Partners currently using your shared data.</p>
            </TooltipContent>
          </TooltipUI>

          {/* Rewards Available */}
          <TooltipUI>
            <TooltipTrigger asChild>
              <div>
                <Card className="bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300 cursor-help">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm text-gray-700">Rewards Available</CardTitle>
                    <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <Gift className="h-5 w-5 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl">
                      <AnimatedNumber value={stats.totalEarned} decimals={0} duration={600} prefix="$" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Across {stats.activePartnerships} active partner{stats.activePartnerships !== 1 ? 's' : ''}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Total rewards that are active and ready to redeem.</p>
            </TooltipContent>
          </TooltipUI>
        </div>
      </TooltipProvider>

      {/* Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Sharing & Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={monthlyData}
                key={`line-chart-${transactionEntries.length}`}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280' }}
                  tickLine={{ stroke: '#6b7280' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  tickLine={{ stroke: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px' 
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="shares" 
                  stroke="#2563eb" 
                  strokeWidth={2.5}
                  name="Data Shares"
                  dot={{ fill: '#2563eb', r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={600}
                  animationEasing="ease-in-out"
                />
                <Line 
                  type="monotone" 
                  dataKey="earnings" 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  name="Earnings ($)"
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={600}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Types Shared</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={250}>
                <PieChart key={`pie-chart-${transactionEntries.length}`}>
                  <Pie
                    data={dataTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={600}
                    animationEasing="ease-in-out"
                  >
                    {dataTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {dataTypes.map((item, index) => (
                  <div 
                    key={item.name} 
                    className="flex items-center justify-between text-sm animate-in fade-in slide-in-from-left-2"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animationDuration: '400ms',
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full transition-all duration-300"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-foreground">
                      <AnimatedNumber value={item.value} decimals={0} duration={400} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
