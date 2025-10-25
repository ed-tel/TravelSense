import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Users, TrendingUp, Database, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const monthlyDataShares = [
  { month: "Jun", shares: 145 },
  { month: "Jul", shares: 178 },
  { month: "Aug", shares: 203 },
  { month: "Sep", shares: 256 },
  { month: "Oct", shares: 312 },
];

const dataTypeDistribution = [
  { name: "Travel Preferences", value: 35, color: "#3b82f6" },
  { name: "Location History", value: 25, color: "#8b5cf6" },
  { name: "Demographics", value: 20, color: "#10b981" },
  { name: "Spending Patterns", value: 15, color: "#f59e0b" },
  { name: "Other", value: 5, color: "#6b7280" },
];

const engagementData = [
  { week: "Week 1", activeUsers: 245, newConsents: 34 },
  { week: "Week 2", activeUsers: 268, newConsents: 42 },
  { week: "Week 3", activeUsers: 289, newConsents: 38 },
  { week: "Week 4", activeUsers: 312, newConsents: 51 },
];

const topDataSources = [
  { source: "Mobile App", users: 456, percentage: 62, trend: "up" },
  { source: "Web Portal", users: 187, percentage: 25, trend: "up" },
  { source: "Partner Integration", users: 95, percentage: 13, trend: "down" },
];

const recentActivities = [
  { user: "User #2847", action: "Shared Travel Preferences", time: "2 minutes ago", value: "$12.50" },
  { user: "User #1923", action: "Updated Location Consent", time: "15 minutes ago", value: "$8.00" },
  { user: "User #3564", action: "Shared Demographics", time: "1 hour ago", value: "$15.00" },
  { user: "User #4782", action: "Shared Spending Patterns", time: "2 hours ago", value: "$10.00" },
  { user: "User #5291", action: "Revoked Consent", time: "3 hours ago", value: "-" },
];

export function BusinessDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl text-white">Dashboard Overview</h1>
          <p className="text-slate-400">Real-time insights into your data partnerships</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-slate-400">Active Users</CardTitle>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">1,247</div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <ArrowUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">12.5%</span>
                <span className="text-slate-400">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-slate-400">Data Shares</CardTitle>
                <Database className="w-4 h-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">312</div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <ArrowUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">8.3%</span>
                <span className="text-slate-400">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-slate-400">Engagement Rate</CardTitle>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">78.5%</div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <ArrowUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">3.2%</span>
                <span className="text-slate-400">vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-slate-400">Total Investment</CardTitle>
                <DollarSign className="w-4 h-4 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-white">$45,230</div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <ArrowDown className="w-4 h-4 text-red-400" />
                <span className="text-red-400">2.1%</span>
                <span className="text-slate-400">under budget</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Data Shares */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Monthly Data Shares</CardTitle>
              <CardDescription className="text-slate-400">
                Trend over the last 5 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyDataShares}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="shares" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Data Type Distribution */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Data Type Distribution</CardTitle>
              <CardDescription className="text-slate-400">
                Breakdown by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="50%" height={250}>
                  <PieChart>
                    <Pie
                      data={dataTypeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {dataTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 flex-1">
                  {dataTypeDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-300">{item.name}</span>
                      </div>
                      <span className="text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Trends */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Weekly Engagement Trends</CardTitle>
            <CardDescription className="text-slate-400">
              Active users and new consents over the last 4 weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  name="Active Users"
                />
                <Line
                  type="monotone"
                  dataKey="newConsents"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  name="New Consents"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bottom Row - Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Data Sources */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Top Data Sources</CardTitle>
              <CardDescription className="text-slate-400">
                Where users are sharing from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDataSources.map((source) => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{source.source}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white">{source.users} users</span>
                        {source.trend === "up" ? (
                          <ArrowUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Recent Activities</CardTitle>
              <CardDescription className="text-slate-400">
                Latest user data sharing events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableHead className="text-slate-400">User</TableHead>
                    <TableHead className="text-slate-400">Action</TableHead>
                    <TableHead className="text-slate-400">Time</TableHead>
                    <TableHead className="text-right text-slate-400">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity, index) => (
                    <TableRow key={index} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell className="text-slate-300">{activity.user}</TableCell>
                      <TableCell className="text-white">{activity.action}</TableCell>
                      <TableCell className="text-slate-400 text-sm">{activity.time}</TableCell>
                      <TableCell className="text-right">
                        {activity.value !== "-" ? (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                            {activity.value}
                          </Badge>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
