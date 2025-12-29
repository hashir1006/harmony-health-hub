import React from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Bed, DollarSign, Activity } from 'lucide-react';
import { mockAnalytics } from '@/data/mockData';

export default function AnalyticsPage() {
  const COLORS = ['hsl(174, 72%, 40%)', 'hsl(152, 69%, 40%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)'];

  return (
    <div className="min-h-screen">
      <Header title="Analytics Dashboard" subtitle="Hospital performance metrics" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Patients', value: '1,247', icon: Users, change: '+12%', color: 'primary' },
            { label: 'Bed Occupancy', value: '78%', icon: Bed, change: '+3%', color: 'warning' },
            { label: 'Revenue', value: '$525K', icon: DollarSign, change: '+8%', color: 'success' },
            { label: 'Avg Wait Time', value: '18 min', icon: Activity, change: '-15%', color: 'critical' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-${stat.color}/10`}>
                      <Icon className={`h-6 w-6 text-${stat.color}`} />
                    </div>
                    <span className={`text-sm ${stat.change.startsWith('+') ? 'text-success' : 'text-critical'}`}>{stat.change}</span>
                  </div>
                  <p className="text-3xl font-bold mt-4">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Daily Patient Volume</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockAnalytics.dailyPatients}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tickFormatter={(d) => d.slice(-2)} className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="hsl(174, 72%, 40%)" fill="hsl(174, 72%, 40%)" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Bed Occupancy by Department</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockAnalytics.bedOccupancy} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" />
                  <YAxis dataKey="department" type="category" width={80} className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="occupied" fill="hsl(174, 72%, 40%)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Emergency Case Trends</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockAnalytics.emergencyTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tickFormatter={(d) => d.slice(-2)} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="critical" stroke="hsl(0, 84%, 60%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="medium" stroke="hsl(38, 92%, 50%)" strokeWidth={2} />
                  <Line type="monotone" dataKey="normal" stroke="hsl(152, 69%, 40%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Revenue vs Expenses</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockAnalytics.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
                  <Bar dataKey="revenue" fill="hsl(152, 69%, 40%)" radius={4} />
                  <Bar dataKey="expenses" fill="hsl(0, 84%, 60%)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
