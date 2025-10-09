import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, Shield, Gift, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Jan", shared: 12, earned: 45 },
  { month: "Feb", shared: 18, earned: 67 },
  { month: "Mar", shared: 25, earned: 89 },
  { month: "Apr", shared: 22, earned: 78 },
  { month: "May", shared: 30, earned: 112 },
  { month: "Jun", shared: 35, earned: 134 },
];

const dataTypes = [
  { name: "Travel Preferences", value: 35, color: "#8884d8" },
  { name: "Location Data", value: 25, color: "#82ca9d" },
  { name: "Spending Patterns", value: 20, color: "#ffc658" },
  { name: "Demographics", value: 20, color: "#ff7300" },
];

export function HeroPanel() {
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
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-medium mb-2">Welcome back, Sarah!</h1>
            <p className="text-primary-foreground/80 mb-6">
              You're in control of your data. Here's your privacy and earnings overview.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="text-center">
              <div className="text-2xl font-medium">$456</div>
              <div className="text-sm text-primary-foreground/80">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium">142</div>
              <div className="text-sm text-primary-foreground/80">Data Shares</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium">98%</div>
              <div className="text-sm text-primary-foreground/80">Privacy Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Data Shares This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">35</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Partnerships</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">8</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Privacy Controls</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">24</div>
            <p className="text-xs text-muted-foreground">
              active permissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Rewards Earned</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">$134</div>
            <p className="text-xs text-muted-foreground">
              +$32 this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Sharing & Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Line 
                  type="monotone" 
                  dataKey="shared" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Data Shared"
                />
                <Line 
                  type="monotone" 
                  dataKey="earned" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="$ Earned"
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dataTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}